#!/usr/bin/env python3
"""Validate identity and serializer contracts of Matterworks `event.custom` recipes.

Custom recipes bypass KubeJS' typed recipe DSL, so malformed serializer names or
anonymous generated IDs are disproportionately likely to survive code review and
fail only during datapack reload. Keep their identity explicit and tie each
serializer family to the exact mod artifact whose recipe contract was audited.
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECIPES_ROOT = ROOT / "kubejs/server_scripts/matterworks/recipes"
CUSTOM_START_RE = re.compile(r"\bevent\.custom\s*\(")
TYPE_AT_RE = re.compile(r"type\s*:\s*(['\"])([a-z0-9_.-]+:[a-z0-9_./-]+)\1")
ID_CALL_RE = re.compile(
    r"^\s*\.id\(\s*(?:"
    r"(['\"])(matterworks:[a-z0-9_./-]+)\1"
    r"|`(matterworks:[^`]+)`"
    r")\s*\)",
    re.DOTALL,
)

SERIALIZER_CONTRACTS = {
    "alchemistry:atomizer": (
        "mods/alchemistry.pw.toml",
        "alchemistry-1.20.1-2.3.4.jar",
    ),
    "create:mechanical_crafting": (
        "mods/create.pw.toml",
        "create-1.20.1-6.0.8.jar",
    ),
    "mekanism:enriching": (
        "mods/mekanism.pw.toml",
        "Mekanism-1.20.1-10.4.16.80.jar",
    ),
    "mekanism:reaction": (
        "mods/mekanism.pw.toml",
        "Mekanism-1.20.1-10.4.16.80.jar",
    ),
    "pneumaticcraft:thermo_plant": (
        "mods/pneumaticcraft-repressurized.pw.toml",
        "pneumaticcraft-repressurized-6.0.23+mc1.20.1.jar",
    ),
    "pneumaticcraft:pressure_chamber": (
        "mods/pneumaticcraft-repressurized.pw.toml",
        "pneumaticcraft-repressurized-6.0.23+mc1.20.1.jar",
    ),
}


def strip_js_comments(text: str) -> str:
    """Blank JS comments while preserving strings, offsets and line numbers."""
    chars = list(text)
    i = 0
    quote: str | None = None
    escaped = False

    while i < len(chars):
        ch = chars[i]
        if quote is not None:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue

        if ch in {'"', "'", '`'}:
            quote = ch
            i += 1
            continue

        if ch == '/' and i + 1 < len(chars) and chars[i + 1] == '/':
            chars[i] = chars[i + 1] = ' '
            i += 2
            while i < len(chars) and chars[i] != '\n':
                chars[i] = ' '
                i += 1
            continue

        if ch == '/' and i + 1 < len(chars) and chars[i + 1] == '*':
            chars[i] = chars[i + 1] = ' '
            i += 2
            while i + 1 < len(chars):
                if chars[i] == '*' and chars[i + 1] == '/':
                    chars[i] = chars[i + 1] = ' '
                    i += 2
                    break
                if chars[i] != '\n':
                    chars[i] = ' '
                i += 1
            continue

        i += 1

    return ''.join(chars)


def find_matching_paren(text: str, open_index: int) -> int | None:
    depth = 0
    quote: str | None = None
    escaped = False

    for i in range(open_index, len(text)):
        ch = text[i]
        if quote is not None:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            continue

        if ch in {'"', "'", '`'}:
            quote = ch
            continue
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
            if depth == 0:
                return i
    return None


def find_top_level_recipe_types(body: str) -> list[str]:
    """Return literal `type` values owned by the outer custom-recipe object.

    Recipe payloads may legitimately contain nested discriminator properties,
    e.g. PneumaticCraft fluid ingredients (`type: pneumaticcraft:fluid`) or a
    pressure-chamber stacked ingredient (`type: pneumaticcraft:stacked_item`).
    Those are ingredient serializers, not a second recipe serializer.
    """
    types: list[str] = []
    brace_depth = 0
    bracket_depth = 0
    quote: str | None = None
    escaped = False
    i = 0

    while i < len(body):
        ch = body[i]

        if quote is not None:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue

        if ch in {'"', "'", '`'}:
            quote = ch
            i += 1
            continue

        if ch == '{':
            brace_depth += 1
            i += 1
            continue
        if ch == '}':
            brace_depth -= 1
            i += 1
            continue
        if ch == '[':
            bracket_depth += 1
            i += 1
            continue
        if ch == ']':
            bracket_depth -= 1
            i += 1
            continue

        if brace_depth == 1 and bracket_depth == 0:
            previous = body[i - 1] if i > 0 else ''
            if not (previous.isalnum() or previous in {'_', '$'}):
                match = TYPE_AT_RE.match(body, i)
                if match is not None:
                    types.append(match.group(2))
                    i = match.end()
                    continue

        i += 1

    return types


def line_number(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def read_packwiz_filename(path: Path) -> str | None:
    if not path.is_file():
        return None
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line.startswith("filename = "):
            continue
        value = line[len("filename = "):].strip()
        if len(value) >= 2 and value[0] == value[-1] == '"':
            return value[1:-1]
    return None


def main() -> int:
    if not RECIPES_ROOT.is_dir():
        print(f"Matterworks recipe directory is missing: {RECIPES_ROOT}", file=sys.stderr)
        return 1

    errors: list[str] = []
    serializers: Counter[str] = Counter()
    custom_count = 0

    for path in sorted(RECIPES_ROOT.glob("*.js")):
        original_text = path.read_text(encoding="utf-8")
        text = strip_js_comments(original_text)
        rel = path.relative_to(ROOT).as_posix()

        for match in CUSTOM_START_RE.finditer(text):
            custom_count += 1
            open_index = text.find('(', match.start())
            close_index = find_matching_paren(text, open_index)
            line = line_number(text, match.start())
            if close_index is None:
                errors.append(f"{rel}:{line}: unterminated event.custom(...) call")
                continue

            body = text[open_index + 1:close_index]
            type_matches = find_top_level_recipe_types(body)
            if len(type_matches) != 1:
                errors.append(
                    f"{rel}:{line}: custom recipe must contain exactly one literal namespace-qualified top-level type; "
                    f"found {len(type_matches)}"
                )
            else:
                serializer = type_matches[0]
                serializers[serializer] += 1
                if serializer not in SERIALIZER_CONTRACTS:
                    errors.append(
                        f"{rel}:{line}: unaudited custom recipe serializer {serializer!r}; "
                        "add an exact mod-artifact contract before using it"
                    )

            suffix = text[close_index + 1:close_index + 300]
            id_match = ID_CALL_RE.match(suffix)
            if id_match is None:
                errors.append(
                    f"{rel}:{line}: custom recipe must chain an explicit .id('matterworks:...')"
                )

    used_serializers = set(serializers)
    expected_serializers = set(SERIALIZER_CONTRACTS)
    missing_serializers = expected_serializers - used_serializers
    if missing_serializers:
        errors.append(
            "audited serializer contracts are no longer used; remove or re-audit them explicitly: "
            + ", ".join(sorted(missing_serializers))
        )

    checked_artifacts: set[tuple[str, str]] = set()
    for serializer in sorted(used_serializers & expected_serializers):
        rel, expected_filename = SERIALIZER_CONTRACTS[serializer]
        artifact = (rel, expected_filename)
        if artifact in checked_artifacts:
            continue
        checked_artifacts.add(artifact)
        actual_filename = read_packwiz_filename(ROOT / rel)
        if actual_filename != expected_filename:
            errors.append(
                f"serializer contract for {serializer!r} changed artifact {rel}: "
                f"expected {expected_filename!r}, actual {actual_filename!r}; re-audit serializer schema"
            )

    if errors:
        print("Matterworks custom-recipe validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    summary = ", ".join(
        f"{serializer}={count}" for serializer, count in sorted(serializers.items())
    )
    print(
        "Matterworks custom-recipe validation passed: "
        f"{custom_count} custom recipe call sites, {len(serializers)} audited serializer types / "
        f"{len(checked_artifacts)} exact mod artifacts; {summary}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
