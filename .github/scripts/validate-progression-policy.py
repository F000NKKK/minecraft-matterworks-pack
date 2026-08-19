#!/usr/bin/env python3
"""Enforce Matterworks protected-output progression policy.

Some items remove enough survival friction that merely checking recipe validity
is not sufficient: their owning module and late-game dependencies are part of
the pack's design contract. This validator makes that contract explicit so a
future refactor cannot silently move or simplify MekaSuit, powered flight, or
prestige components while structural recipe checks still pass.

The policy also pins the exact upstream mod artifacts whose registry/source
contracts were audited. Updating one of those artifacts must intentionally fail
this gate until the assumptions below are re-verified against the new version.
"""

from __future__ import annotations

import importlib.util
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECIPES_ROOT = ROOT / "kubejs" / "server_scripts" / "matterworks" / "recipes"
OWNERSHIP_VALIDATOR = ROOT / ".github" / "scripts" / "validate-recipe-ownership.py"
DEPENDENCY_VALIDATOR = ROOT / ".github" / "scripts" / "validate-recipe-dependencies.py"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


ownership = load_module("matterworks_policy_ownership", OWNERSHIP_VALIDATOR)
dependencies = load_module("matterworks_policy_dependencies", DEPENDENCY_VALIDATOR)


def recipe_module(name: str) -> str:
    return f"kubejs/server_scripts/matterworks/recipes/{name}"


EXPECTED_MOD_FILES = {
    "mods/mekanism.pw.toml": "Mekanism-1.20.1-10.4.16.80.jar",
    "mods/mekanism-generators.pw.toml": "MekanismGenerators-1.20.1-10.4.16.80.jar",
    "mods/pneumaticcraft-repressurized.pw.toml": "pneumaticcraft-repressurized-6.0.23+mc1.20.1.jar",
    "mods/nuclearcraft-neoteric.pw.toml": "NuclearCraft-1.20.1-1.2.34.jar",
}

EXPECTED_OWNERS = {
    # Mekanism field equipment.
    "mekanism:free_runners": recipe_module("advantage_equipment.js"),
    "mekanism:scuba_mask": recipe_module("advantage_equipment.js"),
    "mekanism:scuba_tank": recipe_module("advantage_equipment.js"),
    "mekanism:jetpack": recipe_module("advantage_equipment.js"),
    "mekanism:hdpe_elytra": recipe_module("advantage_equipment.js"),
    "mekanism:hazmat_mask": recipe_module("advantage_equipment.js"),
    "mekanism:hazmat_gown": recipe_module("advantage_equipment.js"),
    "mekanism:hazmat_pants": recipe_module("advantage_equipment.js"),
    "mekanism:hazmat_boots": recipe_module("advantage_equipment.js"),
    "mekanism:free_runners_armored": recipe_module("advantage_equipment.js"),
    "mekanism:jetpack_armored": recipe_module("advantage_equipment.js"),

    # PneumaticCraft powered armour and flight upgrades.
    "pneumaticcraft:pneumatic_helmet": recipe_module("pneumatic_advantage_equipment.js"),
    "pneumaticcraft:pneumatic_chestplate": recipe_module("pneumatic_advantage_equipment.js"),
    "pneumaticcraft:pneumatic_leggings": recipe_module("pneumatic_advantage_equipment.js"),
    "pneumaticcraft:pneumatic_boots": recipe_module("pneumatic_advantage_equipment.js"),
    **{
        f"pneumaticcraft:jet_boots_upgrade_{level}": recipe_module("pneumatic_advantage_equipment.js")
        for level in range(1, 6)
    },

    # Near-creative Mekanism prestige outputs.
    "mekanism:mekasuit_helmet": recipe_module("endgame_equipment.js"),
    "mekanism:mekasuit_bodyarmor": recipe_module("endgame_equipment.js"),
    "mekanism:mekasuit_pants": recipe_module("endgame_equipment.js"),
    "mekanism:mekasuit_boots": recipe_module("endgame_equipment.js"),
    "mekanism:meka_tool": recipe_module("endgame_equipment.js"),
    "mekanism:atomic_disassembler": recipe_module("endgame_equipment.js"),
    "mekanism:module_gravitational_modulating_unit": recipe_module("endgame_equipment.js"),
}

REQUIRED_DEPENDENCIES = {
    # Atomic mobility must consume actual nuclear-era structure.
    "mekanism:free_runners_armored": {"nuclearcraft:fission_reactor_casing"},
    "mekanism:jetpack_armored": {
        "nuclearcraft:fission_reactor_casing",
        "nuclearcraft:fission_reactor_port",
    },

    # Highest PneumaticCraft flight tiers cross the particle/fusion boundary.
    "pneumaticcraft:jet_boots_upgrade_4": {
        "kubejs:particle_focusing_coil",
        "kubejs:particle_confinement_matrix",
    },
    "pneumaticcraft:jet_boots_upgrade_5": {
        "kubejs:particle_confinement_matrix",
        "kubejs:fusion_field_core",
        "kubejs:quantum_singularity_core",
        "mekanism:pellet_antimatter",
    },

    # Prestige components prove completion of their engineering programmes.
    "kubejs:reactor_grade_frame": {
        "nuclearcraft:fission_reactor_casing",
        "nuclearcraft:fission_reactor_controller",
        "mekanism:pellet_polonium",
    },
    "kubejs:particle_confinement_matrix": {
        "kubejs:particle_focusing_coil",
        "nuclearcraft:ring_accelerator_controller",
        "mekanism:pellet_antimatter",
    },
    "kubejs:fusion_field_core": {
        "alchemistry:fusion_chamber_controller",
        "mekanismgenerators:fusion_reactor_controller",
        "mekanism:pellet_antimatter",
        "minecraft:nether_star",
    },
    "kubejs:quantum_singularity_core": {
        "kubejs:reactor_grade_frame",
        "kubejs:particle_confinement_matrix",
        "kubejs:fusion_field_core",
    },

    # Every near-creative Mekanism output must consume the final singularity core.
    "mekanism:mekasuit_helmet": {"kubejs:quantum_singularity_core"},
    "mekanism:mekasuit_bodyarmor": {"kubejs:quantum_singularity_core"},
    "mekanism:mekasuit_pants": {"kubejs:quantum_singularity_core"},
    "mekanism:mekasuit_boots": {"kubejs:quantum_singularity_core"},
    "mekanism:meka_tool": {"kubejs:quantum_singularity_core"},
    "mekanism:atomic_disassembler": {"kubejs:quantum_singularity_core"},
    "mekanism:module_gravitational_modulating_unit": {"kubejs:quantum_singularity_core"},
}

MIN_PRESTIGE_COMPONENTS = {
    "mekanism:mekasuit_helmet": 3,
    "mekanism:mekasuit_bodyarmor": 4,
    "mekanism:mekasuit_pants": 4,
    "mekanism:mekasuit_boots": 4,
    "mekanism:meka_tool": 4,
    "mekanism:atomic_disassembler": 3,
    "mekanism:module_gravitational_modulating_unit": 3,
}

PRESTIGE_COMPONENTS = {
    "kubejs:reactor_grade_frame",
    "kubejs:particle_confinement_matrix",
    "kubejs:fusion_field_core",
    "kubejs:quantum_singularity_core",
}


def read_packwiz_filename(path: Path) -> str | None:
    if not path.is_file():
        return None
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line.startswith("filename = "):
            continue
        value = line[len("filename = ") :].strip()
        if len(value) >= 2 and value[0] == value[-1] == '"':
            return value[1:-1]
    return None


def collect_replacement_owners(paths: list[Path]) -> dict[str, set[str]]:
    owners: dict[str, set[str]] = defaultdict(set)
    for path in paths:
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT).as_posix()
        for output in ownership.OUTPUT_REMOVE_RE.findall(text):
            owners[output].add(rel)
        grouped, _ = ownership.resolve_grouped_removals(text)
        for output in grouped:
            owners[output].add(rel)
    return owners


def collect_recipe_dependencies(paths: list[Path]) -> tuple[dict[str, set[str]], dict[str, set[str]]]:
    deps: dict[str, set[str]] = defaultdict(set)
    sources: dict[str, set[str]] = defaultdict(set)
    for path in paths:
        for call in dependencies.parse_recipe_calls(path):
            deps[call.output].update(call.dependencies)
            sources[call.output].add(call.source)
    return deps, sources


def main() -> int:
    if not RECIPES_ROOT.is_dir():
        print(f"Matterworks recipe directory is missing: {RECIPES_ROOT}", file=sys.stderr)
        return 1

    paths = sorted(RECIPES_ROOT.glob("*.js"))
    owners = collect_replacement_owners(paths)
    recipe_deps, recipe_sources = collect_recipe_dependencies(paths)
    errors: list[str] = []

    for rel, expected_filename in sorted(EXPECTED_MOD_FILES.items()):
        actual_filename = read_packwiz_filename(ROOT / rel)
        if actual_filename != expected_filename:
            errors.append(
                f"audited mod contract {rel} changed: expected {expected_filename!r}, "
                f"actual {actual_filename!r}; re-audit registry/progression assumptions before updating the pin"
            )

    for output, expected_owner in sorted(EXPECTED_OWNERS.items()):
        actual = owners.get(output, set())
        if actual != {expected_owner}:
            errors.append(
                f"protected output {output!r} must be owned only by {expected_owner}; "
                f"actual owners: {', '.join(sorted(actual)) or 'none'}"
            )

    for output, required in sorted(REQUIRED_DEPENDENCIES.items()):
        actual = recipe_deps.get(output)
        if actual is None:
            errors.append(f"protected output {output!r} has no parsed Matterworks recipe")
            continue
        missing = required - actual
        if missing:
            errors.append(
                f"protected output {output!r} is missing required dependencies: "
                f"{', '.join(sorted(missing))}"
            )

    expected_endgame_source = {recipe_module("endgame_equipment.js")}
    for output in sorted(PRESTIGE_COMPONENTS):
        actual_sources = recipe_sources.get(output, set())
        if actual_sources != expected_endgame_source:
            errors.append(
                f"prestige component {output!r} must be defined only by endgame_equipment.js; "
                f"actual sources: {', '.join(sorted(actual_sources)) or 'none'}"
            )

    for output, minimum in sorted(MIN_PRESTIGE_COMPONENTS.items()):
        actual = recipe_deps.get(output, set()) & PRESTIGE_COMPONENTS
        if len(actual) < minimum:
            errors.append(
                f"near-creative output {output!r} uses only {len(actual)} prestige components; "
                f"minimum is {minimum}"
            )

    if errors:
        print("Matterworks progression policy validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks progression policy validation passed: "
        f"{len(EXPECTED_MOD_FILES)} audited mod contracts, "
        f"{len(EXPECTED_OWNERS)} protected replacements, "
        f"{len(REQUIRED_DEPENDENCIES)} dependency contracts, "
        f"{len(PRESTIGE_COMPONENTS)} prestige components."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
