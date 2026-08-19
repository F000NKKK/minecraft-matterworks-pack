#!/usr/bin/env python3
"""Validate identity and serializer shape of Matterworks `event.custom` recipes.

Custom recipes bypass KubeJS' typed recipe DSL, so malformed serializer names or
anonymous generated IDs are disproportionately likely to survive code review and
fail only during datapack reload. Keep their identity explicit and auditable.
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECIPES_ROOT = ROOT / "kubejs/server_scripts/matterworks/recipes"
CUSTOM_START_RE = re.compile(r"\bevent\.custom\s*\(")
TYPE_RE = re.compile(r"\btype\s*:\s*(['\"])([a-z0-9_.-]+:[a-z0-9_./-]+)\1")
ID_CALL_RE = re.compile(
    r"^\s*\.id\(\s*(?:"
    r"(['\"])(matterworks:[a-z0-9_./-]+)\1"
    r"|`(matterworks:[^`]+)`"
    r")\s*\)",
    re.DOTALL,
)


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


def line_number(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


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
            type_matches = TYPE_RE.findall(body)
            if len(type_matches) != 1:
                errors.append(
                    f"{rel}:{line}: custom recipe must contain exactly one literal namespace-qualified type; "
                    f"found {len(type_matches)}"
                )
            else:
                serializer = type_matches[0][1]
                serializers[serializer] += 1

            suffix = text[close_index + 1:close_index + 300]
            id_match = ID_CALL_RE.match(suffix)
            if id_match is None:
                errors.append(
                    f"{rel}:{line}: custom recipe must chain an explicit .id('matterworks:...')"
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
        f"{custom_count} custom recipes, {len(serializers)} serializer types; {summary}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
