#!/usr/bin/env python3
"""Validate geometry and connectivity for Matterworks Main Program age chapters.

Coordinates are chapter-local. Cross-chapter dependency edges therefore cannot
be measured in one coordinate system and are deliberately ignored for distance,
but they are retained as valid chapter-entry anchors.

FTB Quests SNBT in this repository uses both compact one-line and expanded
multi-line quest objects. Parse top-level objects inside `quests: [...]` rather
than depending on line formatting so graph validation cannot silently lose
coverage after a formatting/refactoring change.
"""

from __future__ import annotations

import math
import re
import sys
from collections import defaultdict, deque
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CHAPTERS = ROOT / "config" / "ftbquests" / "quests" / "chapters"
ID_RE = re.compile(r'\bid\s*:\s*"(\d{16})"')
X_RE = re.compile(r'\bx\s*:\s*(-?\d+(?:\.\d+)?)d')
Y_RE = re.compile(r'\by\s*:\s*(-?\d+(?:\.\d+)?)d')
DEPS_RE = re.compile(r'\bdependencies\s*:\s*\[([^\]]*)\]')
QUOTED_ID_RE = re.compile(r'"(\d{16})"')
LONG_EDGE_THRESHOLD = 32.0


def find_matching_square(text: str, open_index: int) -> int | None:
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

        if ch in {'"', "'"}:
            quote = ch
            continue
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return i
    return None


def extract_quest_objects(text: str) -> list[str]:
    marker = re.search(r'\bquests\s*:\s*\[', text)
    if marker is None:
        return []

    array_open = text.find('[', marker.start())
    array_close = find_matching_square(text, array_open)
    if array_close is None:
        return []

    body = text[array_open + 1:array_close]
    objects: list[str] = []
    brace_depth = 0
    object_start: int | None = None
    quote: str | None = None
    escaped = False

    for i, ch in enumerate(body):
        if quote is not None:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            continue

        if ch in {'"', "'"}:
            quote = ch
            continue
        if ch == '{':
            if brace_depth == 0:
                object_start = i
            brace_depth += 1
        elif ch == '}':
            brace_depth -= 1
            if brace_depth == 0 and object_start is not None:
                objects.append(body[object_start:i + 1])
                object_start = None

    return objects


def parse(path: Path) -> tuple[dict[str, tuple[float, float]], dict[str, list[str]]]:
    text = path.read_text(encoding="utf-8")
    coords: dict[str, tuple[float, float]] = {}
    deps: dict[str, list[str]] = {}

    for block in extract_quest_objects(text):
        # The first id in a top-level quest object is the quest id; nested task
        # and reward ids occur later in the same object. x/y are quest-only
        # fields in these chapters, so the first occurrences are authoritative.
        id_match = ID_RE.search(block)
        x_match = X_RE.search(block)
        y_match = Y_RE.search(block)
        if id_match is None or x_match is None or y_match is None:
            continue

        qid = id_match.group(1)
        coords[qid] = (float(x_match.group(1)), float(y_match.group(1)))

        deps_match = DEPS_RE.search(block)
        deps[qid] = QUOTED_ID_RE.findall(deps_match.group(1)) if deps_match else []

    return coords, deps


def main() -> int:
    errors: list[str] = []
    checked_edges = 0
    checked_quests = 0
    checked_components = 0

    for path in sorted(CHAPTERS.glob("age_*.snbt")):
        coords, deps = parse(path)
        rel = path.relative_to(ROOT).as_posix()
        checked_quests += len(coords)

        if not coords:
            errors.append(f"{rel}: no quest objects were parsed")
            continue

        positions: dict[tuple[float, float], list[str]] = defaultdict(list)
        for qid, position in coords.items():
            positions[position].append(qid)
        for (x, y), ids in sorted(positions.items()):
            if len(ids) > 1:
                errors.append(f"{rel}: overlapping quests at ({x}, {y}): {', '.join(ids)}")

        children: dict[str, set[str]] = defaultdict(set)
        local_parents: dict[str, set[str]] = {qid: set() for qid in coords}
        entry_quests: set[str] = set()

        for qid in coords:
            parents = deps.get(qid, [])
            external_parents = [parent for parent in parents if parent not in coords]
            if external_parents or not parents:
                entry_quests.add(qid)

            x, y = coords[qid]
            for parent in parents:
                if parent not in coords:
                    continue
                checked_edges += 1
                local_parents[qid].add(parent)
                children[parent].add(qid)
                px, py = coords[parent]
                distance = math.hypot(x - px, y - py)
                if distance > LONG_EDGE_THRESHOLD:
                    errors.append(
                        f"{rel}: suspicious long edge {parent} -> {qid} ({distance:.1f} units)"
                    )

        # Directed reachability from legitimate chapter entries catches quests
        # that are syntactically valid but disconnected after graph refactors.
        reachable: set[str] = set()
        queue = deque(sorted(entry_quests))
        while queue:
            qid = queue.popleft()
            if qid in reachable:
                continue
            reachable.add(qid)
            queue.extend(sorted(children.get(qid, set()) - reachable))

        unreachable = sorted(set(coords) - reachable)
        if unreachable:
            errors.append(
                f"{rel}: quests unreachable from chapter entries: {', '.join(unreachable)}"
            )

        # Count undirected components for diagnostics. Multiple components are
        # allowed only when each has its own explicit external/root entry; the
        # directed reachability check above proves that condition.
        undirected: dict[str, set[str]] = defaultdict(set)
        for child, parents in local_parents.items():
            for parent in parents:
                undirected[child].add(parent)
                undirected[parent].add(child)
        unseen = set(coords)
        while unseen:
            checked_components += 1
            seed = next(iter(unseen))
            component_queue = [seed]
            while component_queue:
                node = component_queue.pop()
                if node not in unseen:
                    continue
                unseen.remove(node)
                component_queue.extend(undirected.get(node, set()) & unseen)

    if errors:
        print("Matterworks quest-layout validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks quest-layout validation passed: "
        f"{checked_quests} quests, {checked_edges} intra-chapter edges, "
        f"{checked_components} rooted graph components checked."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
