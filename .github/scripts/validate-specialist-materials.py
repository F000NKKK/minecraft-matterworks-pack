#!/usr/bin/env python3
"""Validate 0.5.9 specialist-material process semantics.

The specialist-material audit exists specifically to stop convenient stock
recipes or composition metadata from silently redefining engineering materials.
Keep the first audited corrections explicit until those process families are
redesigned deliberately.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROCESS = ROOT / "kubejs/server_scripts/matterworks/recipes/industrial_process_machines.js"
COMPOSITION = ROOT / "kubejs/server_scripts/matterworks/materials/composition.js"

REQUIRED_PROCESS_FRAGMENTS = (
    "event.remove({ id: 'nuclearcraft:alloy_smelter/ingots_iron-ingots_chromium' })",
    "event.remove({ id: 'nuclearcraft:alloy_smelter/dusts_iron-dusts_chromium' })",
    "{ count: 4, tag: 'forge:ingots/nickel' }",
    "{ tag: 'forge:ingots/chromium' }",
    "{ count: 4, tag: 'forge:dusts/nickel' }",
    "{ tag: 'forge:dusts/chromium' }",
    "{ count: 5, item: 'nuclearcraft:nichrome_ingot' }",
    ".id('matterworks:process/high_temperature/nichrome_ingots')",
    ".id('matterworks:process/high_temperature/nichrome_dusts')",
    "event.remove({ id: 'nuclearcraft:alloy_smelter/dusts_carbon_manganese-dusts_titanium' })",
    "event.remove({ id: 'nuclearcraft:alloy_smelter/ingots_carbon_manganese-ingots_titanium' })",
)

REQUIRED_COMPOSITION_FRAGMENTS = (
    "ferroboron: { policy: 'PROCESS', note: 'NuclearCraft process uses boron + steel;",
    "tough_alloy: { policy: 'PROCESS', note: 'NuclearCraft process uses ferroboron + lithium;",
    "thermoconducting_alloy: { policy: 'PROCESS', note: 'NuclearCraft process uses extreme alloy + boron arsenide;",
    "zirconium_molybdenum: { policy: 'PROCESS', formula: { molybdenum: 15, zirconium: 1 }",
    "extreme_alloy: { policy: 'PROCESS', note: 'NuclearCraft process uses tough alloy + hard carbon;",
    "nichrome: { policy: 'PROCESS', formula: { nickel: 4, chromium: 1 }",
    "niobium_tin: { policy: 'PROCESS', formula: { niobium: 2, tin: 1 }",
    "niobium_titanium: { policy: 'PROCESS', formula: { niobium: 1, titanium: 1 }",
    "sic_sic_cmc: { policy: 'MANUFACTURED', formula: { silicon: 1, carbon: 1 }",
)

FORBIDDEN_PROCESS_FRAGMENTS = (
    "{ count: 4, tag: 'forge:ingots/iron' }",
    "{ count: 4, tag: 'forge:dusts/iron' }",
)


def main() -> int:
    errors: list[str] = []

    if not PROCESS.is_file():
        errors.append(f"missing specialist process source: {PROCESS.relative_to(ROOT)}")
        process_text = ""
    else:
        process_text = PROCESS.read_text(encoding="utf-8")

    if not COMPOSITION.is_file():
        errors.append(f"missing composition registry: {COMPOSITION.relative_to(ROOT)}")
        composition_text = ""
    else:
        composition_text = COMPOSITION.read_text(encoding="utf-8")

    for fragment in REQUIRED_PROCESS_FRAGMENTS:
        if fragment not in process_text:
            errors.append(f"specialist process contract is missing: {fragment}")

    for fragment in REQUIRED_COMPOSITION_FRAGMENTS:
        if fragment not in composition_text:
            errors.append(f"specialist composition contract is missing: {fragment}")

    for fragment in FORBIDDEN_PROCESS_FRAGMENTS:
        if fragment in process_text:
            errors.append(f"obsolete Fe/Cr nichrome feed reappeared: {fragment}")

    if errors:
        print("Matterworks specialist-material validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks specialist-material validation passed: corrected Nichrome feeds, "
        "fake SiC-SiC shortcut blocked, 9 audited composition contracts pinned."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
