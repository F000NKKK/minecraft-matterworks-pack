#!/usr/bin/env python3
"""Validate KubeJS/Create sequenced-assembly item contracts.

Create sequenced assembly has a runtime-sensitive contract: a transitional item
must exist at startup and must be registered with the `create:sequenced_assembly`
item type. Matterworks also keeps explicit item models for these carriers so a
broken chain is visible rather than rendering as a missing-texture item.

This validator resolves the simple const-string style used by Matterworks and
checks every `.transitionalItem(...)` call across recipe modules.
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
    r"\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*['\"](kubejs:[a-z0-9_./-]+)['\"]"
)
TRANSITIONAL_RE = re.compile(r"\.transitionalItem\(\s*([^\)]+?)\s*\)")
SEQUENCED_CALL_RE = re.compile(
    r"event\.recipes\.create\.sequenced_assembly\s*\(\s*([^,\n]+)",
    re.MULTILINE,
)
STARTUP_CREATE_RE = re.compile(
    r"event\.create\(\s*['\"]([a-z0-9_./-]+)['\"]"
    r"(?:\s*,\s*['\"]([^'\"]+)['\"])?\s*\)",
    re.MULTILINE,
)


def resolve_item(expr: str, constants: dict[str, str]) -> str | None:
    expr = expr.strip()
    if len(expr) >= 2 and expr[0] in {"'", '"'} and expr[-1] == expr[0]:
        value = expr[1:-1]
        return value if value.startswith("kubejs:") else None
    return constants.get(expr)


def model_path(item: str) -> Path:
    namespace, path = item.split(":", 1)
    if namespace != "kubejs":
        raise ValueError(item)
    return MODELS_ROOT / f"{path}.json"


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

        for match in SEQUENCED_CALL_RE.finditer(text):
            expr = match.group(1).strip()
            item = resolve_item(expr, constants)
            if item is not None:
                sequenced_outputs.setdefault(item, set()).add(rel)

    errors: list[str] = []
    for entry in unresolved:
        errors.append(f"could not resolve sequenced-assembly expression statically: {entry}")

    for item, sources in sorted(transitional_items.items()):
        item_type = startup_types.get(item)
        if item_type != "create:sequenced_assembly":
            errors.append(
                f"transitional item {item!r} from {', '.join(sorted(sources))} must be registered "
                f"as create:sequenced_assembly; actual type: {item_type!r}"
            )
        model = model_path(item)
        if not model.is_file():
            errors.append(f"transitional item {item!r} has no explicit model: {model.relative_to(ROOT)}")

    for item, sources in sorted(sequenced_outputs.items()):
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
        f"{len(sequenced_outputs)} KubeJS outputs, "
        f"{len(transitional_items)} transitional carriers, all registered and modeled."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
