#!/usr/bin/env python3
"""Validate visual geometry for Matterworks Main Program quest chapters.

Coordinates are chapter-local. Cross-chapter dependency edges therefore cannot
be measured in one coordinate system and are deliberately ignored here.
"""

from __future__ import annotations

import math
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CHAPTERS = ROOT / "config" / "ftbquests" / "quests" / "chapters"
QUEST_RE = re.compile(r'\bid:\s*"(\d{16})".*?\bx:\s*(-?\d+(?:\.\d+)?)d.*?\by:\s*(-?\d+(?:\.\d+)?)d')
DEP_RE = re.compile(r'\bdependencies:\s*\[([^\]]*)\].*?\bid:\s*"(\d{16})"')
ID_RE = re.compile(r'"(\d{16})"')
LONG_EDGE_THRESHOLD = 32.0


def parse(path: Path) -> tuple[dict[str, tuple[float, float]], dict[str, list[str]]]:
    text = path.read_text(encoding="utf-8")
    coords: dict[str, tuple[float, float]] = {}
    deps: dict[str, list[str]] = {}

    # Most quests are intentionally one-line SNBT objects.
    for line in text.splitlines():
        q = QUEST_RE.search(line)
        if q:
            qid, x, y = q.groups()
            coords[qid] = (float(x), float(y))

        d = DEP_RE.search(line)
        if d:
            raw, qid = d.groups()
            deps[qid] = ID_RE.findall(raw)

    # The root quest is formatted across several lines.
    lines = text.splitlines()
    for idx, line in enumerate(lines):
        id_match = re.match(r'^\s*id:\s*"(\d{16})"\s*$', line)
        if not id_match:
            continue
        window = "\n".join(lines[idx:idx + 10])
        x_match = re.search(r'^\s*x:\s*(-?\d+(?:\.\d+)?)d\s*$', window, re.MULTILINE)
        y_match = re.search(r'^\s*y:\s*(-?\d+(?:\.\d+)?)d\s*$', window, re.MULTILINE)
        if x_match and y_match:
            coords[id_match.group(1)] = (float(x_match.group(1)), float(y_match.group(1)))

    return coords, deps


def main() -> int:
    errors: list[str] = []
    checked_edges = 0

    for path in sorted(CHAPTERS.glob("age_*.snbt")):
        coords, deps = parse(path)
        rel = path.relative_to(ROOT).as_posix()

        positions: dict[tuple[float, float], list[str]] = defaultdict(list)
        for qid, position in coords.items():
            positions[position].append(qid)
        for (x, y), ids in sorted(positions.items()):
            if len(ids) > 1:
                errors.append(f"{rel}: overlapping quests at ({x}, {y}): {', '.join(ids)}")

        for qid, parents in deps.items():
            if qid not in coords:
                continue
            x, y = coords[qid]
            for parent in parents:
                # Cross-chapter dependencies intentionally have no coordinate
                # in this chapter and are not geometrically comparable.
                if parent not in coords:
                    continue
                checked_edges += 1
                px, py = coords[parent]
                distance = math.hypot(x - px, y - py)
                if distance > LONG_EDGE_THRESHOLD:
                    errors.append(
                        f"{rel}: suspicious long edge {parent} -> {qid} ({distance:.1f} units)"
                    )

    if errors:
        print("Matterworks quest-layout validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(f"Matterworks quest-layout validation passed: {checked_edges} intra-chapter edges checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
