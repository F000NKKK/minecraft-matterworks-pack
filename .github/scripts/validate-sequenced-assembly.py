#!/usr/bin/env python3
"""Validate KubeJS/Create sequenced-assembly item and identity contracts.

Matterworks uses two valid carrier styles:
- pack-owned `kubejs:` transitional items, which must be registered at startup
  with the `create:sequenced_assembly` type and have explicit item models;
- existing mod-owned items, such as `create:copper_sheet`, which are already
  registered by their source mod and therefore only need to resolve to a
  namespace-qualified literal.

Every sequenced process also needs an explicit `matterworks:` recipe ID. Process
recipes are progression boundaries and must not depend on KubeJS-generated IDs
that can drift after formatting or refactoring.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECIPES_ROOT = ROOT / "kubejs" / "server_scripts" / "matterworks" / "recipes"
STARTUP_ITEMS = ROOT / "kubejs" / "startup_scripts" / "matterworks" / "items.js"
MODELS_ROOT = ROOT / "kubejs" / "assets" / "kubejs" / "models" / "item"

CONST_STRING_RE = re.compile(
    r"\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*['\"]([a-z0-9_.-]+:[a-z0-9_./-]+)['\"]"
)
TRANSITIONAL_RE = re.compile(r"\.transitionalItem\(\s*([^\)]+?)\s*\)")
SEQUENCED_START_RE = re.compile(r"event\.recipes\.create\.sequenced_assembly\s*\(")
STARTUP_CREATE_RE = re.compile(
    r"event\.create\(\s*['\"]([a-z0-9_./-]+)['\"]"
    r"(?:\s*,\s*['\"]([^'\"]+)['\"])?\s*\)",
    re.MULTILINE,
)
RESOURCE_LOCATION_RE = re.compile(r"^[a-z0-9_.-]+:[a-z0-9_./-]+$")
ID_RE = re.compile(r"\.id\(\s*['\"](matterworks:[a-z0-9_./-]+)['\"]\s*\)")


def resolve_item(expr: str, constants: dict[str, str]) -> str | None:
    expr = expr.strip()
    if len(expr) >= 2 and expr[0] in {"'", '"'} and expr[-1] == expr[0]:
        value = expr[1:-1]
        return value if RESOURCE_LOCATION_RE.fullmatch(value) else None
    return constants.get(expr)


def model_path(item: str) -> Path:
    namespace, path = item.split(":", 1)
    if namespace != "kubejs":
        raise ValueError(item)
    return MODELS_ROOT / f"{path}.json"


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


def first_argument(body: str) -> str:
    quote: str | None = None
    escaped = False
    nested = 0
    for i, ch in enumerate(body):
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
        if ch in "([{":
            nested += 1
        elif ch in ")]}" and nested:
            nested -= 1
        elif ch == ',' and nested == 0:
            return body[:i].strip()
    return body.strip()


def main() -> int:
    if not RECIPES_ROOT.is_dir():
        print(f"Matterworks recipe directory is missing: {RECIPES_ROOT}", file=sys.stderr)
        return 1
    if not STARTUP_ITEMS.is_file():
        print(f"Matterworks startup item registry is missing: {STARTUP_ITEMS}", file=sys.stderr)
        return 1

    startup_text = STARTUP_ITEMS.read_text(encoding="utf-8")
    startup_types = {
        f"kubejs:{name}": item_type
        for name, item_type in STARTUP_CREATE_RE.findall(startup_text)
    }

    transitional_items: dict[str, set[str]] = {}
    sequenced_outputs: dict[str, set[str]] = {}
    sequenced_ids: dict[str, str] = {}
    unresolved: list[str] = []

    for path in sorted(RECIPES_ROOT.glob("*.js")):
        text = path.read_text(encoding="utf-8")
        constants = dict(CONST_STRING_RE.findall(text))
        rel = path.relative_to(ROOT).as_posix()

        for match in TRANSITIONAL_RE.finditer(text):
            expr = match.group(1).strip()
            item = resolve_item(expr, constants)
            if item is None:
                unresolved.append(f"{rel}: transitionalItem({expr})")
                continue
            transitional_items.setdefault(item, set()).add(rel)

        for match in SEQUENCED_START_RE.finditer(text):
            open_index = text.find('(', match.start())
            close_index = find_matching_paren(text, open_index)
            if close_index is None:
                unresolved.append(f"{rel}: unterminated sequenced_assembly call")
                continue

            output_expr = first_argument(text[open_index + 1:close_index])
            item = resolve_item(output_expr, constants)
            if item is None:
                unresolved.append(f"{rel}: sequenced_assembly output {output_expr}")
                continue
            sequenced_outputs.setdefault(item, set()).add(rel)

            suffix = text[close_index + 1:close_index + 600]
            id_match = ID_RE.search(suffix)
            if id_match is None:
                unresolved.append(f"{rel}: sequenced_assembly {item} has no explicit matterworks recipe id")
            else:
                sequenced_ids[item] = id_match.group(1)

    errors: list[str] = []
    for entry in unresolved:
        errors.append(f"could not resolve sequenced-assembly contract statically: {entry}")

    if len(set(sequenced_ids.values())) != len(sequenced_ids):
        errors.append("sequenced-assembly recipe IDs are not unique")

    kubejs_carriers = 0
    external_carriers = 0
    for item, sources in sorted(transitional_items.items()):
        if not item.startswith("kubejs:"):
            external_carriers += 1
            continue

        kubejs_carriers += 1
        item_type = startup_types.get(item)
        if item_type != "create:sequenced_assembly":
            errors.append(
                f"transitional item {item!r} from {', '.join(sorted(sources))} must be registered "
                f"as create:sequenced_assembly; actual type: {item_type!r}"
            )
        model = model_path(item)
        if not model.is_file():
            errors.append(f"transitional item {item!r} has no explicit model: {model.relative_to(ROOT)}")

    kubejs_outputs = 0
    for item, sources in sorted(sequenced_outputs.items()):
        if not item.startswith("kubejs:"):
            continue

        kubejs_outputs += 1
        if item not in startup_types:
            errors.append(
                f"KubeJS sequenced-assembly output {item!r} from {', '.join(sorted(sources))} "
                "is not registered in startup items"
            )
        model = model_path(item)
        if not model.is_file():
            errors.append(f"sequenced-assembly output {item!r} has no explicit model: {model.relative_to(ROOT)}")

    if errors:
        print("Matterworks sequenced-assembly validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks sequenced-assembly validation passed: "
        f"{len(sequenced_outputs)} outputs / {len(sequenced_ids)} stable recipe IDs "
        f"({kubejs_outputs} KubeJS), {len(transitional_items)} carriers "
        f"({kubejs_carriers} KubeJS / {external_carriers} external); "
        "all pack-owned carriers and outputs are registered and modeled."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
