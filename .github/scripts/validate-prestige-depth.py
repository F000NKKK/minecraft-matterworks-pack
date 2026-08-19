#!/usr/bin/env python3
"""Pin the intended Matterworks prestige sequenced-assembly depth.

The four late-game components are deliberately throughput tests, not one-pass
crafting tokens. Dependency validation proves what each pass consumes; this
validator separately guarantees the required number of repeated passes so a
future recipe cleanup cannot silently flatten the endgame.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENDGAME = ROOT / "kubejs" / "server_scripts" / "matterworks" / "recipes" / "endgame_equipment.js"

LOOP_ID_RE = re.compile(
    r"\.loops\(\s*(\d+)\s*\)\s*\.id\(\s*['\"]([^'\"]+)['\"]\s*\)",
    re.MULTILINE,
)

EXPECTED_LOOPS = {
    "matterworks:endgame/reactor_grade_frame": 2,
    "matterworks:endgame/particle_confinement_matrix": 3,
    "matterworks:endgame/fusion_field_core": 3,
    "matterworks:endgame/quantum_singularity_core": 4,
}


def main() -> int:
    if not ENDGAME.is_file():
        print(f"Matterworks endgame recipe module is missing: {ENDGAME}", file=sys.stderr)
        return 1

    text = ENDGAME.read_text(encoding="utf-8")
    actual = {recipe_id: int(loops) for loops, recipe_id in LOOP_ID_RE.findall(text)}
    errors: list[str] = []

    for recipe_id, expected_loops in sorted(EXPECTED_LOOPS.items()):
        actual_loops = actual.get(recipe_id)
        if actual_loops != expected_loops:
            errors.append(
                f"prestige recipe {recipe_id!r} must use {expected_loops} sequenced passes; "
                f"actual: {actual_loops!r}"
            )

    unexpected = sorted(
        recipe_id
        for recipe_id in actual
        if recipe_id.startswith("matterworks:endgame/")
        and recipe_id not in EXPECTED_LOOPS
    )
    if unexpected:
        errors.append(
            "unclassified endgame sequenced recipes require an explicit depth policy: "
            + ", ".join(unexpected)
        )

    if errors:
        print("Matterworks prestige-depth validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    depth = "/".join(str(EXPECTED_LOOPS[recipe]) for recipe in EXPECTED_LOOPS)
    print(
        "Matterworks prestige-depth validation passed: "
        f"{len(EXPECTED_LOOPS)} endgame assemblies pinned at {depth} passes."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
