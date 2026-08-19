#!/usr/bin/env python3
"""Validate Matterworks material composition/research provenance contracts.

The composition registry describes what a material *is* while the research
registry describes who owns its production path. These concepts must not drift:
every composition entry needs exactly one research disposition, and nuclear
state must never accidentally become ordinary generic chemistry.
"""

from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COMPOSITION = ROOT / "kubejs/server_scripts/matterworks/materials/composition.js"
RESEARCH = ROOT / "kubejs/server_scripts/matterworks/progression/research.js"
CHEMISTRY = ROOT / "kubejs/server_scripts/matterworks/recipes/chemistry.js"

COMPOSITION_ENTRY_RE = re.compile(
    r"^\s*([a-z0-9_]+):\s*\{\s*policy:\s*'([A-Z]+)'([^}]*)\}",
    re.MULTILINE,
)
FAMILY_RE = re.compile(
    r"^\s*([a-z0-9_]+):\s*ageOwned\(\{\s*stage:\s*'[^']+',\s*age:\s*'([^']+)',\s*ownerQuest:\s*'(\d{16})',\s*materials:\s*\[([^\]]*)\]",
    re.MULTILINE,
)
STRING_RE = re.compile(r"'([^']+)'")
PROVENANCE_RE = re.compile(r"provenanceOnly:\s*Object\.freeze\(\[([^\]]*)\]\)")
UNRESOLVED_RE = re.compile(r"const MatterworksBacklogFamilies = Object\.freeze\(\{([^}]*)\}\)", re.DOTALL)
NUCLEAR_PARENT_ARRAY_RE = re.compile(
    r"const matterworksNuclearOwnedParentElements = \[([^\]]*)\]",
    re.MULTILINE,
)
NUCLEAR_FORMS_ARRAY_RE = re.compile(
    r"const matterworksNuclearOwnedDissolverForms = \[([^\]]*)\]",
    re.MULTILINE,
)

ALLOWED_POLICIES = {
    "DIRECT",
    "PROCESS",
    "NUCLEAR",
    "MANUFACTURED",
    "MIXTURE",
    "UNKNOWN",
}
EXPECTED_NUCLEAR_PARENT_FORMS = {
    "ores",
    "dusts",
    "ingots",
    "plates",
    "nuggets",
    "storage_blocks",
}


def parse_string_list(raw: str) -> list[str]:
    return STRING_RE.findall(raw)


def main() -> int:
    errors: list[str] = []

    for path in (COMPOSITION, RESEARCH, CHEMISTRY):
        if not path.is_file():
            errors.append(f"required provenance source is missing: {path.relative_to(ROOT)}")
    if errors:
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    composition_text = COMPOSITION.read_text(encoding="utf-8")
    research_text = RESEARCH.read_text(encoding="utf-8")
    chemistry_text = CHEMISTRY.read_text(encoding="utf-8")

    composition: dict[str, tuple[str, str]] = {}
    for name, policy, tail in COMPOSITION_ENTRY_RE.findall(composition_text):
        if name in composition:
            errors.append(f"duplicate composition material: {name}")
        composition[name] = (policy, tail)
        if policy not in ALLOWED_POLICIES:
            errors.append(f"material {name!r} uses unknown composition policy {policy!r}")
        if policy == "DIRECT" and "formula:" not in tail:
            errors.append(f"DIRECT material {name!r} must declare a formula")

    families: dict[str, dict[str, object]] = {}
    material_families: dict[str, list[str]] = defaultdict(list)
    for key, age, owner_quest, raw_materials in FAMILY_RE.findall(research_text):
        materials = parse_string_list(raw_materials)
        families[key] = {
            "age": age,
            "ownerQuest": owner_quest,
            "materials": materials,
        }
        for material in materials:
            material_families[material].append(key)

    provenance_match = PROVENANCE_RE.search(research_text)
    if provenance_match is None:
        provenance: set[str] = set()
        errors.append("research registry has no parseable provenanceOnly list")
    else:
        provenance = set(parse_string_list(provenance_match.group(1)))

    # 0.5.7 intentionally has no unresolved process backlog. Keep this strict so
    # a future backlog addition has to be represented by a real parser/contract
    # rather than silently bypassing disposition checks.
    backlog_match = UNRESOLVED_RE.search(research_text)
    if backlog_match is None:
        errors.append("research registry has no parseable MatterworksBacklogFamilies")
    elif backlog_match.group(1).strip():
        errors.append("material provenance validator requires explicit support before reintroducing unresolved backlog families")

    for material, owners in sorted(material_families.items()):
        if len(owners) != 1:
            errors.append(
                f"material {material!r} belongs to multiple synthesis families: {', '.join(sorted(owners))}"
            )
        if material not in composition:
            errors.append(f"synthesis material {material!r} has no composition entry")

    for material in sorted(provenance):
        if material not in composition:
            errors.append(f"provenance-only material {material!r} has no composition entry")
        if material in material_families:
            errors.append(
                f"material {material!r} is both provenance-only and synthesis-owned by {material_families[material]}"
            )

    for material in sorted(composition):
        dispositions = int(material in material_families) + int(material in provenance)
        if dispositions == 0:
            errors.append(f"composition material {material!r} has no research disposition")
        elif dispositions > 1:
            errors.append(f"composition material {material!r} has multiple research dispositions")

    nuclear_materials = {
        material for material, (policy, _tail) in composition.items() if policy == "NUCLEAR"
    }
    non_nuclear_provenance = provenance - nuclear_materials
    if non_nuclear_provenance:
        errors.append(
            "provenance-only entries must currently be NUCLEAR materials: "
            + ", ".join(sorted(non_nuclear_provenance))
        )

    parent_family = families.get("nuclear_parent_elements")
    parent_materials: set[str] = set()
    if parent_family is None:
        errors.append("missing nuclear_parent_elements synthesis family")
    else:
        parent_materials = set(parent_family["materials"])
        if parent_family["age"] != "fusion_age":
            errors.append("nuclear_parent_elements must remain owned by fusion_age")
        if parent_family["ownerQuest"] != "2180000000000003":
            errors.append("nuclear_parent_elements must remain owned by Controlled Fusion quest 2180000000000003")

    nuclear_outside_contract = nuclear_materials - provenance - parent_materials
    if nuclear_outside_contract:
        errors.append(
            "NUCLEAR materials must be provenance-only or late parent-element synthesis: "
            + ", ".join(sorted(nuclear_outside_contract))
        )

    non_nuclear_parents = parent_materials - nuclear_materials
    if non_nuclear_parents:
        errors.append(
            "nuclear_parent_elements contains non-NUCLEAR materials: "
            + ", ".join(sorted(non_nuclear_parents))
        )

    parent_array_match = NUCLEAR_PARENT_ARRAY_RE.search(chemistry_text)
    if parent_array_match is None:
        errors.append("chemistry.js has no parseable nuclear-owned parent-element block list")
        blocked_parents: set[str] = set()
    else:
        blocked_parents = set(parse_string_list(parent_array_match.group(1)))
        if blocked_parents != parent_materials:
            errors.append(
                "blocked generic Dissolver parent set does not match nuclear_parent_elements: "
                f"blocked={sorted(blocked_parents)}, research={sorted(parent_materials)}"
            )

    forms_match = NUCLEAR_FORMS_ARRAY_RE.search(chemistry_text)
    if forms_match is None:
        errors.append("chemistry.js has no parseable nuclear-owned Dissolver form list")
    else:
        forms = set(parse_string_list(forms_match.group(1)))
        if forms != EXPECTED_NUCLEAR_PARENT_FORMS:
            errors.append(
                "nuclear parent Dissolver form coverage changed: "
                f"expected={sorted(EXPECTED_NUCLEAR_PARENT_FORMS)}, actual={sorted(forms)}"
            )

    required_boundary_fragments = [
        "id: `alchemistry:dissolver/${form}/${element}`",
        "event.remove({ output: 'alchemistry:fission_chamber_controller' })",
        "event.remove({ output: 'alchemistry:fusion_chamber_controller' })",
        "A: 'nuclearcraft:ring_accelerator_controller'",
    ]
    for fragment in required_boundary_fragments:
        if fragment not in chemistry_text:
            errors.append(f"chemistry nuclear/transmutation boundary fragment is missing: {fragment}")

    if errors:
        print("Matterworks material provenance validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks material provenance validation passed: "
        f"{len(composition)} composition materials, {len(material_families)} synthesis-owned, "
        f"{len(provenance)} provenance-only, {len(nuclear_materials)} nuclear-policy materials, "
        f"{len(parent_materials)} late parent elements with generic Dissolver routes blocked."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
