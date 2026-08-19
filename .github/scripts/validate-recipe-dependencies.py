#!/usr/bin/env python3
"""Detect bootstrap cycles between Matterworks-owned KubeJS recipes.

Expert progression recipes often replace upstream machines with cross-system
requirements. A seemingly reasonable ingredient can accidentally require the
very machine or tier being unlocked, creating a hard bootstrap cycle. This
validator builds a conservative dependency graph for Matterworks shaped,
shapeless and Create sequenced-assembly recipes and rejects cycles between
pack-owned outputs.
"""

from __future__ import annotations

import importlib.util
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECIPES_ROOT = ROOT / "kubejs" / "server_scripts" / "matterworks" / "recipes"
OWNERSHIP_VALIDATOR = ROOT / ".github" / "scripts" / "validate-recipe-ownership.py"

CONST_STRING_RE = re.compile(
    r"\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*['\"]([a-z0-9_.-]+:[a-z0-9_./-]+)['\"]"
)
RESOURCE_STRING_RE = re.compile(
    r"['\"]([a-z0-9_.-]+:[a-z0-9_./-]+)['\"]"
)
IDENTIFIER_RE = re.compile(r"\b[A-Za-z_$][\w$]*\b")
CALL_RE = re.compile(
    r"event\.(?:shaped|shapeless)\s*\(|"
    r"event\.recipes\.create\.sequenced_assembly\s*\("
)


@dataclass(frozen=True)
class RecipeCall:
    output: str
    dependencies: frozenset[str]
    source: str


def load_ownership_module():
    spec = importlib.util.spec_from_file_location(
        "matterworks_recipe_ownership", OWNERSHIP_VALIDATOR
    )
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load recipe ownership validator")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def find_matching_paren(text: str, open_index: int) -> int | None:
    depth = 0
    quote: str | None = None
    escaped = False
    line_comment = False
    block_comment = False
    i = open_index

    while i < len(text):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""

        if line_comment:
            if ch == "\n":
                line_comment = False
            i += 1
            continue

        if block_comment:
            if ch == "*" and nxt == "/":
                block_comment = False
                i += 2
                continue
            i += 1
            continue

        if quote is not None:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue

        if ch == "/" and nxt == "/":
            line_comment = True
            i += 2
            continue
        if ch == "/" and nxt == "*":
            block_comment = True
            i += 2
            continue
        if ch in {"'", '"', "`"}:
            quote = ch
            i += 1
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return i
        i += 1

    return None


def first_argument(call_body: str) -> str:
    stack: list[str] = []
    quote: str | None = None
    escaped = False

    matching = {")": "(", "]": "[", "}": "{"}

    for i, ch in enumerate(call_body):
        if quote is not None:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            continue

        if ch in {"'", '"', "`"}:
            quote = ch
            continue
        if ch in "([{":
            stack.append(ch)
            continue
        if ch in ")]}" and stack and stack[-1] == matching[ch]:
            stack.pop()
            continue
        if ch == "," and not stack:
            return call_body[:i].strip()

    return call_body.strip()


def resolve_output(expr: str, constants: dict[str, str]) -> str | None:
    expr = expr.strip()
    if len(expr) >= 2 and expr[0] in {"'", '"'} and expr[-1] == expr[0]:
        value = expr[1:-1]
        return value if ":" in value else None
    return constants.get(expr)


def parse_recipe_calls(path: Path) -> list[RecipeCall]:
    text = path.read_text(encoding="utf-8")
    constants = dict(CONST_STRING_RE.findall(text))
    rel = path.relative_to(ROOT).as_posix()
    calls: list[RecipeCall] = []

    for match in CALL_RE.finditer(text):
        open_index = match.end() - 1
        close_index = find_matching_paren(text, open_index)
        if close_index is None:
            continue

        body = text[open_index + 1 : close_index]
        output = resolve_output(first_argument(body), constants)
        if output is None:
            continue

        dependencies = set(RESOURCE_STRING_RE.findall(body))
        for identifier in IDENTIFIER_RE.findall(body):
            resolved = constants.get(identifier)
            if resolved is not None:
                dependencies.add(resolved)
        dependencies.discard(output)

        calls.append(
            RecipeCall(
                output=output,
                dependencies=frozenset(dependencies),
                source=rel,
            )
        )

    return calls


def replacement_outputs(paths: list[Path]) -> set[str]:
    ownership = load_ownership_module()
    outputs: set[str] = set()

    for path in paths:
        text = path.read_text(encoding="utf-8")
        outputs.update(ownership.OUTPUT_REMOVE_RE.findall(text))
        grouped, _ = ownership.resolve_grouped_removals(text)
        outputs.update(grouped)

    return outputs


def find_cycles(graph: dict[str, set[str]]) -> list[list[str]]:
    visiting: set[str] = set()
    visited: set[str] = set()
    stack: list[str] = []
    cycles: set[tuple[str, ...]] = set()

    def canonical_cycle(nodes: list[str]) -> tuple[str, ...]:
        core = nodes[:-1]
        rotations = [tuple(core[i:] + core[:i]) for i in range(len(core))]
        best = min(rotations)
        return best + (best[0],)

    def visit(node: str) -> None:
        if node in visited:
            return
        if node in visiting:
            start = stack.index(node)
            cycles.add(canonical_cycle(stack[start:] + [node]))
            return

        visiting.add(node)
        stack.append(node)
        for dependency in sorted(graph.get(node, set())):
            visit(dependency)
        stack.pop()
        visiting.remove(node)
        visited.add(node)

    for node in sorted(graph):
        visit(node)

    return [list(cycle) for cycle in sorted(cycles)]


def main() -> int:
    if not RECIPES_ROOT.is_dir():
        print(f"Matterworks recipe directory is missing: {RECIPES_ROOT}", file=sys.stderr)
        return 1

    paths = sorted(RECIPES_ROOT.glob("*.js"))
    calls = [call for path in paths for call in parse_recipe_calls(path)]
    replacements = replacement_outputs(paths)

    custom_outputs = {call.output for call in calls if call.output.startswith("kubejs:")}
    owned_outputs = replacements | custom_outputs

    graph: dict[str, set[str]] = {output: set() for output in owned_outputs}
    sources: dict[str, set[str]] = {output: set() for output in owned_outputs}

    for call in calls:
        if call.output not in owned_outputs:
            continue
        graph.setdefault(call.output, set()).update(
            dependency
            for dependency in call.dependencies
            if dependency in owned_outputs
        )
        sources.setdefault(call.output, set()).add(call.source)

    cycles = find_cycles(graph)
    if cycles:
        print("Matterworks recipe dependency validation FAILED:", file=sys.stderr)
        for cycle in cycles:
            chain = " -> ".join(cycle)
            involved_sources = sorted(
                {source for node in cycle[:-1] for source in sources.get(node, set())}
            )
            print(f"  - bootstrap cycle: {chain}", file=sys.stderr)
            if involved_sources:
                print(
                    f"    recipe modules: {', '.join(involved_sources)}",
                    file=sys.stderr,
                )
        return 1

    edge_count = sum(len(dependencies) for dependencies in graph.values())
    print(
        f"Matterworks recipe dependency validation passed: {len(calls)} parsed recipes, "
        f"{len(owned_outputs)} owned outputs, {edge_count} owned dependency edges, no bootstrap cycles."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
