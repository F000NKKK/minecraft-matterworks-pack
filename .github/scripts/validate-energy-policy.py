#!/usr/bin/env python3
"""Validate Matterworks generator progression policy.

0.5.7 removed the complete Mekanism generator family.  0.5.8 intentionally
restores only energy technologies whose manufacturing prerequisites are already
represented by the pack while keeping photovoltaics blocked until a separate
semiconductor/solar-manufacturing programme exists.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
POLICY = ROOT / "kubejs/server_scripts/matterworks/progression/electrical.js"

RESTORED = {
    "heat_generator": {
        "matterworks:energy/heat_generator",
        "createaddition:alternator",
        "kubejs:electromechanical_control_unit",
        "create:copper_sheet",
    },
    "wind_generator": {
        "matterworks:energy/wind_generator",
        "createaddition:alternator",
        "kubejs:electromagnetic_coil",
        "create:propeller",
    },
    "bio_generator": {
        "matterworks:energy/bio_generator",
        "pneumaticcraft:biodiesel_bucket",
        "pneumaticcraft:thermopneumatic_processing_plant",
        "mekanism:pressurized_reaction_chamber",
    },
    "gas_burning_generator": {
        "matterworks:energy/gas_burning_generator",
        "pneumaticcraft:refinery",
        "nuclearcraft:chemical_reactor",
        "mekanism:pressurized_reaction_chamber",
        "mekanism:advanced_chemical_tank",
    },
}

BLOCKED = {
    "mekanismgenerators:solar_generator",
    "mekanismgenerators:advanced_solar_generator",
}


def main() -> int:
    errors: list[str] = []
    if not POLICY.is_file():
        print(f"Missing electrical progression policy: {POLICY.relative_to(ROOT)}", file=sys.stderr)
        return 1

    text = POLICY.read_text(encoding="utf-8")

    all_generators = {
        "mekanismgenerators:heat_generator",
        "mekanismgenerators:wind_generator",
        "mekanismgenerators:solar_generator",
        "mekanismgenerators:advanced_solar_generator",
        "mekanismgenerators:bio_generator",
        "mekanismgenerators:gas_burning_generator",
    }
    for output in sorted(all_generators):
        if output not in text:
            errors.append(f"generator output is missing from stock-removal policy: {output}")

    for key, fragments in sorted(RESTORED.items()):
        output = f"mekanismgenerators:{key}"
        if text.count(f"'{output}'") < 2:
            errors.append(
                f"{output} must appear in both stock-removal inventory and an explicit replacement recipe"
            )
        for fragment in sorted(fragments):
            if fragment not in text:
                errors.append(f"{output} is missing progression dependency/identity: {fragment}")

    for output in sorted(BLOCKED):
        # The output should occur only in the initial removal inventory.  A
        # second occurrence would normally indicate that somebody restored a
        # photovoltaic recipe without adding the missing semiconductor branch.
        occurrences = text.count(f"'{output}'")
        if occurrences != 1:
            errors.append(
                f"photovoltaic output {output} must remain removal-only; literal occurrences={occurrences}"
            )

    forbidden_photovoltaic_ids = {
        "matterworks:energy/solar_generator",
        "matterworks:energy/advanced_solar_generator",
    }
    for recipe_id in sorted(forbidden_photovoltaic_ids):
        if recipe_id in text:
            errors.append(
                f"photovoltaic recipe {recipe_id} exists before semiconductor engineering is implemented"
            )

    if errors:
        print("Matterworks energy-policy validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks energy-policy validation passed: "
        f"{len(RESTORED)} process-gated generators restored, {len(BLOCKED)} photovoltaic generators intentionally blocked."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
