#!/usr/bin/env python3
"""Audit cross-mod chemistry identity and progression boundaries.

The script inspects the actual mod JARs used by a local Matterworks instance.
It intentionally does not mutate the instance. Its job is to make implicit
Forge-tag interoperability visible and to flag places where chemical identity
would erase phase, concentration, isotope or radioactive-state information.

Example:

    python3 tools/audit-chemistry-compatibility.py \
        ~/.local/share/PrismLauncher/instances/Matterworks/minecraft/mods \
        --strict \
        --output chemistry-audit.md
"""

from __future__ import annotations

import argparse
import json
import sys
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


ROLE_PATTERNS: dict[str, tuple[str, ...]] = {
    "chemlib": ("chemlib",),
    "alchemistry": ("alchemistry",),
    "nuclearcraft": ("nuclearcraft",),
    "mekanism": ("mekanism-",),
}

SOLID_FORMS = (
    "dusts",
    "ingots",
    "nuggets",
    "plates",
    "storage_blocks",
)

RADIOACTIVE_PARENT_ELEMENTS = {
    "uranium",
    "thorium",
    "polonium",
    "radium",
}

PROTECTED_FLUID_NAMES = {
    # Radioactive / isotope identity.
    "radon",
    "deuterium",
    "tritium",
    "helium_3",
    "irradiated_boron",
    "irradiated_lithium",
    "irradiated_sodium",
    "heavy_water",
    # Cryogenic / thermal state.
    "liquid_hydrogen",
    "liquid_helium",
    "liquid_nitrogen",
    "liquid_oxygen",
    "hot_helium",
    "steam",
    "high_pressure_steam",
    "low_pressure_steam",
    "low_quality_steam",
    "exhaust_steam",
    # Concentration / solution state.
    "sodium_hydroxide_solution",
    "potassium_hydroxide_solution",
    "boron_nitride_solution",
    "boron_arsenide_solution",
    "calcium_sulfate_solution",
    "sodium_fluoride_solution",
    "potassium_fluoride_solution",
    "borax_solution",
    "irradiated_borax_solution",
    # Nuclear process streams.
    "uranium_oxide",
    "uranium_hexafluoride",
    "nuclear_waste",
    "spent_nuclear_waste",
    "fissile_fuel",
}

PHASE_SENSITIVE_NAMES = {
    "hydrogen_chloride",
    "hydrofluoric_acid",
    "sodium",
    "lithium",
}


@dataclass(frozen=True)
class ModJar:
    role: str
    path: Path

    @property
    def display_name(self) -> str:
        return self.path.name


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Audit Matterworks chemistry compatibility from installed mod JARs."
    )
    parser.add_argument(
        "mods_dir",
        type=Path,
        help="Minecraft mods directory containing ChemLib, Alchemistry, NuclearCraft and Mekanism.",
    )
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Matterworks repository root (default: parent of tools/).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Write the Markdown report to this path instead of stdout.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Return non-zero when required mods or Matterworks policy guards are missing.",
    )
    return parser.parse_args()


def find_mod_jar(mods_dir: Path, role: str) -> ModJar | None:
    patterns = ROLE_PATTERNS[role]
    candidates: list[Path] = []

    for path in mods_dir.glob("*.jar"):
        lower = path.name.lower()
        if not any(lower.startswith(pattern) for pattern in patterns):
            continue

        # Avoid common addon jars when looking for the primary mod.
        if role == "mekanism" and lower.startswith(
            ("mekanismgenerators", "mekanismtools", "mekanismadditions")
        ):
            continue

        candidates.append(path)

    if not candidates:
        return None

    # A mods directory should contain one active version. Choosing the newest
    # file gives a useful result even when a disabled/old copy was left behind.
    candidates.sort(key=lambda p: (p.stat().st_mtime, p.name), reverse=True)
    return ModJar(role=role, path=candidates[0])


def read_json(zf: zipfile.ZipFile, name: str) -> dict[str, Any] | None:
    try:
        with zf.open(name) as stream:
            return json.load(stream)
    except (KeyError, json.JSONDecodeError, UnicodeDecodeError):
        return None


def iter_json_entries(zf: zipfile.ZipFile, prefix: str) -> Iterable[str]:
    for name in zf.namelist():
        if name.startswith(prefix) and name.endswith(".json"):
            yield name


def forge_tag_names(zf: zipfile.ZipFile, registry: str, prefix: str = "") -> set[str]:
    root = f"data/forge/tags/{registry}/"
    result: set[str] = set()

    for name in iter_json_entries(zf, root):
        relative = name[len(root) : -len(".json")]
        if prefix and not relative.startswith(prefix + "/"):
            continue
        result.add(relative)

    return result


def tag_values(zf: zipfile.ZipFile, resource: str) -> list[str]:
    payload = read_json(zf, resource)
    if not payload:
        return []

    values: list[str] = []
    for value in payload.get("values", []):
        if isinstance(value, str):
            values.append(value)
        elif isinstance(value, dict) and isinstance(value.get("id"), str):
            values.append(value["id"])
    return values


def alchemistry_recipe_ids(zf: zipfile.ZipFile, family: str) -> set[str]:
    root = f"data/alchemistry/recipes/{family}/"
    result: set[str] = set()

    for name in iter_json_entries(zf, root):
        relative = name[len("data/alchemistry/recipes/") : -len(".json")]
        result.add("alchemistry:" + relative)

    return result


def atomizer_inputs(zf: zipfile.ZipFile) -> set[str]:
    root = "data/alchemistry/recipes/atomizer/"
    result: set[str] = set()

    for name in iter_json_entries(zf, root):
        payload = read_json(zf, name)
        if not payload:
            continue
        fluid = payload.get("input", {}).get("fluid")
        if isinstance(fluid, str):
            result.add(fluid)

    return result


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except OSError:
        return ""


def format_names(names: Iterable[str]) -> str:
    values = sorted(set(names))
    if not values:
        return "_none_"
    return ", ".join(f"`{value}`" for value in values)


def build_report(mods: dict[str, ModJar | None], repo_root: Path) -> tuple[str, list[str]]:
    failures: list[str] = []
    lines: list[str] = [
        "# Matterworks Chemistry Compatibility Audit",
        "",
        "This report is generated from the installed mod JAR resources, not from a hard-coded material list.",
        "",
        "## Installed inputs",
        "",
    ]

    for role in ROLE_PATTERNS:
        jar = mods.get(role)
        if jar:
            lines.append(f"- **{role}:** `{jar.display_name}`")
        else:
            lines.append(f"- **{role}:** **missing**")
            failures.append(f"required mod JAR not found: {role}")

    if any(jar is None for jar in mods.values()):
        lines.extend(["", "Audit stopped before cross-mod comparison because required inputs are missing."])
        return "\n".join(lines) + "\n", failures

    assert mods["chemlib"] is not None
    assert mods["alchemistry"] is not None
    assert mods["nuclearcraft"] is not None
    assert mods["mekanism"] is not None

    with (
        zipfile.ZipFile(mods["chemlib"].path) as chemlib,
        zipfile.ZipFile(mods["alchemistry"].path) as alchemistry,
        zipfile.ZipFile(mods["nuclearcraft"].path) as nuclearcraft,
        zipfile.ZipFile(mods["mekanism"].path) as mekanism,
    ):
        lines.extend(["", "## Shared solid Forge tags", ""])

        total_solid_overlaps = 0
        for form in SOLID_FORMS:
            chem = forge_tag_names(chemlib, "items", form)
            nc = forge_tag_names(nuclearcraft, "items", form)
            overlap = {
                name.split("/", 1)[1]
                for name in chem & nc
                if "/" in name
            }
            total_solid_overlaps += len(overlap)
            lines.append(f"- **{form}:** {format_names(overlap)}")

        lines.append("")
        lines.append(f"Total exact solid-tag overlaps: **{total_solid_overlaps}**.")
        lines.append(
            "These forms are already interoperable through Forge tags; duplicate conversion recipes are normally unnecessary."
        )

        chem_fluid_tags = forge_tag_names(chemlib, "fluids")
        nc_fluid_tags = forge_tag_names(nuclearcraft, "fluids")
        mek_fluid_tags = forge_tag_names(mekanism, "fluids")

        lines.extend(["", "## Native fluid-tag intersections", ""])
        lines.append(
            "- **NuclearCraft ∩ Mekanism:** " + format_names(nc_fluid_tags & mek_fluid_tags)
        )
        lines.append(
            "- **ChemLib ∩ NuclearCraft (upstream only):** "
            + format_names(chem_fluid_tags & nc_fluid_tags)
        )
        lines.append(
            "- **ChemLib ∩ Mekanism (upstream only):** "
            + format_names(chem_fluid_tags & mek_fluid_tags)
        )

        protected_shared = (
            (nc_fluid_tags & mek_fluid_tags)
            | (chem_fluid_tags & nc_fluid_tags)
            | (chem_fluid_tags & mek_fluid_tags)
        ) & PROTECTED_FLUID_NAMES
        lines.extend(["", "## Protected fluid-state collisions", ""])
        lines.append(format_names(protected_shared))
        if protected_shared:
            lines.append(
                "These names must be reviewed as process-state boundaries rather than automatically normalized."
            )

        phase_sensitive_shared = (
            (nc_fluid_tags & mek_fluid_tags)
            | (chem_fluid_tags & nc_fluid_tags)
            | (chem_fluid_tags & mek_fluid_tags)
        ) & PHASE_SENSITIVE_NAMES
        lines.extend(["", "## Phase-sensitive shared names", ""])
        lines.append(format_names(phase_sensitive_shared))

        water_values = tag_values(chemlib, "data/minecraft/tags/fluids/water.json")
        chemlib_water_values = [value for value in water_values if value.startswith("chemlib:")]
        lines.extend(["", "## ChemLib upstream water tag", ""])
        lines.append(f"ChemLib chemical entries in `minecraft:water`: **{len(chemlib_water_values)}**.")
        if chemlib_water_values:
            lines.append(
                "Matterworks must remove the `chemlib` namespace from the runtime water tag before recipes are evaluated."
            )

        dissolver_ids = alchemistry_recipe_ids(alchemistry, "dissolver")
        protected_dissolver_ids = {
            recipe_id
            for recipe_id in dissolver_ids
            if any(recipe_id.endswith("/" + element) for element in RADIOACTIVE_PARENT_ELEMENTS)
        }
        lines.extend(["", "## Radioactive parent-element Dissolver surface", ""])
        lines.append(format_names(protected_dissolver_ids))
        lines.append(
            f"Detected **{len(protected_dissolver_ids)}** upstream Dissolver routes touching U/Th/Po/Ra."
        )

        atomizer_fluid_inputs = atomizer_inputs(alchemistry)
        lines.extend(["", "## Alchemistry Atomizer upstream fluid inputs", ""])
        lines.append(f"Detected **{len(atomizer_fluid_inputs)}** concrete fluid inputs.")
        lines.append(format_names(atomizer_fluid_inputs))

    tags_script = read_text(repo_root / "kubejs/server_scripts/matterworks/materials/tags.js")
    chemistry_script = read_text(repo_root / "kubejs/server_scripts/matterworks/recipes/chemistry.js")

    policy_checks = {
        "ChemLib namespace removed from minecraft:water": (
            "event.remove('minecraft:water', '@chemlib')" in tags_script
        ),
        "radon absent from ordinary fluid equivalence table": (
            "'radon'" not in tags_script.split("const matterworksExactFluidEquivalents", 1)[-1].split("]", 1)[0]
            if "const matterworksExactFluidEquivalents" in tags_script
            else False
        ),
        "radioactive parent-element Dissolver guard declared": (
            "const matterworksNuclearOwnedParentElements" in chemistry_script
            and all(f"'{name}'" in chemistry_script for name in RADIOACTIVE_PARENT_ELEMENTS)
        ),
        "Alchemistry Fission controller gated by ring accelerator": (
            "alchemistry:fission_chamber_controller" in chemistry_script
            and "nuclearcraft:ring_accelerator_controller" in chemistry_script
        ),
        "Alchemistry Fusion controller gated by ring accelerator": (
            "alchemistry:fusion_chamber_controller" in chemistry_script
            and "nuclearcraft:ring_accelerator_controller" in chemistry_script
        ),
    }

    lines.extend(["", "## Matterworks policy guards", ""])
    for label, passed in policy_checks.items():
        lines.append(f"- [{'x' if passed else ' '}] {label}")
        if not passed:
            failures.append(f"policy guard missing: {label}")

    lines.extend(
        [
            "",
            "## Interpretation",
            "",
            "- Shared ordinary Forge tags are compatibility, not a reason to add duplicate recipes.",
            "- Protected-state collisions require an explicit machine/process boundary.",
            "- Radioactive parent elements and isotopes stay under NuclearCraft ownership until the post-ring transmutation tier.",
            "- New overlaps after a mod update should be classified before being added to Matterworks aliases.",
            "",
        ]
    )

    return "\n".join(lines), failures


def main() -> int:
    args = parse_args()
    mods_dir = args.mods_dir.expanduser().resolve()
    repo_root = args.repo_root.expanduser().resolve()

    if not mods_dir.is_dir():
        print(f"error: mods directory does not exist: {mods_dir}", file=sys.stderr)
        return 2

    mods = {role: find_mod_jar(mods_dir, role) for role in ROLE_PATTERNS}
    report, failures = build_report(mods, repo_root)

    if args.output:
        output = args.output.expanduser()
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(report, encoding="utf-8")
        print(f"Matterworks chemistry audit written to {output}")
    else:
        sys.stdout.write(report)

    if args.strict and failures:
        for failure in failures:
            print(f"audit failure: {failure}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
