#!/usr/bin/env python3
"""Detect KubeJS modules that both claim ownership of the same recipe output.

Matterworks recipe modules commonly replace upstream recipes using
`event.remove({ output: 'namespace:item' })` and then register a replacement.
If two modules remove the same output, registration order decides which policy
wins. That makes progression boundaries accidental and load-order dependent.

Besides literal removals, this validator resolves the simple array/forEach
patterns used by Matterworks for grouped rewrites, including template strings
such as `pneumaticcraft:jet_boots_upgrade_${level}`. Keeping those patterns in
the ownership graph prevents a refactor from hiding conflicts behind a loop.
"""

from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECIPES_ROOT = ROOT / "kubejs" / "server_scripts" / "matterworks" / "recipes"

OUTPUT_REMOVE_RE = re.compile(
    r"event\.remove\(\s*\{\s*output\s*:\s*['\"]([^'\"]+)['\"]\s*\}\s*\)",
    re.MULTILINE,
)

ARRAY_RE = re.compile(
    r"\bconst\s+(?P<name>[A-Za-z_$][\w$]*)\s*=\s*\[(?P<body>.*?)\]",
    re.DOTALL,
)

ARRAY_VALUE_RE = re.compile(
    r"(?P<string>['\"]([^'\"]+)['\"])|(?P<number>\b\d+\b)"
)

FOREACH_REMOVE_RE = re.compile(
    r"(?P<array>[A-Za-z_$][\w$]*)\.forEach\(\s*"
    r"(?P<param>[A-Za-z_$][\w$]*)\s*=>\s*"
    r"event\.remove\(\s*\{\s*output\s*:\s*"
    r"(?P<expr>[A-Za-z_$][\w$]*|`[^`]+`)\s*\}\s*\)\s*\)",
    re.MULTILINE,
)

ANY_OUTPUT_REMOVE_RE = re.compile(
    r"event\.remove\(\s*\{\s*output\s*:\s*(?P<expr>[^}\n]+?)\s*\}\s*\)",
    re.MULTILINE,
)


def parse_simple_arrays(text: str) -> dict[str, list[str]]:
    """Parse const arrays containing only string or integer literals."""
    arrays: dict[str, list[str]] = {}

    for match in ARRAY_RE.finditer(text):
        body = match.group("body")
        values: list[str] = []
        pos = 0
        valid = True

        for value_match in ARRAY_VALUE_RE.finditer(body):
            between = body[pos:value_match.start()]
            if between.strip().strip(","):
                valid = False
                break

            if value_match.group("string") is not None:
                raw = value_match.group("string")
                values.append(raw[1:-1])
            else:
                values.append(value_match.group("number"))
            pos = value_match.end()

        if body[pos:].strip().strip(","):
            valid = False

        if valid and values:
            arrays[match.group("name")] = values

    return arrays


def resolve_grouped_removals(text: str) -> tuple[set[str], set[str]]:
    """Resolve Matterworks array.forEach(...event.remove...) ownership claims."""
    arrays = parse_simple_arrays(text)
    resolved: set[str] = set()
    matched_expressions: set[str] = set()

    for match in FOREACH_REMOVE_RE.finditer(text):
        array_name = match.group("array")
        param = match.group("param")
        expr = match.group("expr").strip()
        matched_expressions.add(expr)

        values = arrays.get(array_name)
        if values is None:
            continue

        if expr == param:
            resolved.update(values)
            continue

        if expr.startswith("`") and expr.endswith("`"):
            template = expr[1:-1]
            marker = "${" + param + "}"
            if marker in template:
                resolved.update(template.replace(marker, value) for value in values)

    return resolved, matched_expressions


def is_literal_expression(expr: str) -> bool:
    expr = expr.strip()
    return (
        len(expr) >= 2
        and expr[0] in {"'", '"'}
        and expr[-1] == expr[0]
    )


def main() -> int:
    owners: dict[str, set[str]] = defaultdict(set)
    unresolved_dynamic: list[tuple[str, str]] = []

    if not RECIPES_ROOT.is_dir():
        print(f"Matterworks recipe directory is missing: {RECIPES_ROOT}", file=sys.stderr)
        return 1

    checked = 0
    literal_count = 0
    grouped_count = 0

    for path in sorted(RECIPES_ROOT.glob("*.js")):
        checked += 1
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT).as_posix()

        literal_outputs = set(OUTPUT_REMOVE_RE.findall(text))
        literal_count += len(literal_outputs)
        for output in literal_outputs:
            owners[output].add(rel)

        grouped_outputs, matched_expressions = resolve_grouped_removals(text)
        grouped_count += len(grouped_outputs)
        for output in grouped_outputs:
            owners[output].add(rel)

        for removal_match in ANY_OUTPUT_REMOVE_RE.finditer(text):
            expr = removal_match.group("expr").strip()
            if is_literal_expression(expr):
                continue
            if expr in matched_expressions:
                continue
            unresolved_dynamic.append((rel, expr))

    conflicts = {
        output: sorted(files)
        for output, files in owners.items()
        if len(files) > 1
    }

    if conflicts or unresolved_dynamic:
        print("Matterworks recipe ownership validation FAILED:", file=sys.stderr)
        for output, files in sorted(conflicts.items()):
            print(
                f"  - output {output!r} is replaced by multiple modules: {', '.join(files)}",
                file=sys.stderr,
            )
        for rel, expr in sorted(unresolved_dynamic):
            print(
                f"  - dynamic output removal in {rel} could not be resolved statically: {expr}",
                file=sys.stderr,
            )
        return 1

    print(
        f"Matterworks recipe ownership validation passed: {checked} modules, "
        f"{len(owners)} replacement outputs with a single owner each "
        f"({literal_count} literal claims, {grouped_count} grouped claims)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
