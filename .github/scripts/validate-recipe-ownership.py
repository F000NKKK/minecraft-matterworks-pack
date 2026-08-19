#!/usr/bin/env python3
"""Detect KubeJS modules that both claim ownership of the same recipe output.

Matterworks recipe modules commonly replace upstream recipes using
`event.remove({ output: 'namespace:item' })` and then register a replacement.
If two modules remove the same output, registration order decides which policy
wins. That makes progression boundaries accidental and load-order dependent.

This validator deliberately checks only literal output removals. Dynamic
removals and ID-specific removals have different semantics and are outside the
scope of this ownership invariant.
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


def main() -> int:
    owners: dict[str, set[str]] = defaultdict(set)

    if not RECIPES_ROOT.is_dir():
        print(f"Matterworks recipe directory is missing: {RECIPES_ROOT}", file=sys.stderr)
        return 1

    checked = 0
    for path in sorted(RECIPES_ROOT.glob("*.js")):
        checked += 1
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT).as_posix()
        for output in OUTPUT_REMOVE_RE.findall(text):
            owners[output].add(rel)

    conflicts = {
        output: sorted(files)
        for output, files in owners.items()
        if len(files) > 1
    }

    if conflicts:
        print("Matterworks recipe ownership validation FAILED:", file=sys.stderr)
        for output, files in sorted(conflicts.items()):
            print(
                f"  - output {output!r} is replaced by multiple modules: {', '.join(files)}",
                file=sys.stderr,
            )
        return 1

    print(
        f"Matterworks recipe ownership validation passed: {checked} modules, "
        f"{len(owners)} literal replacement outputs with a single owner each."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
