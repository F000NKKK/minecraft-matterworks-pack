#!/usr/bin/env python3
"""Validate that critical Matterworks research owners prove real processes.

The research registry is intentionally declarative.  This gate prevents a
nearby machine-acquisition quest from silently becoming the owner of a broad
material family or capability that the player never actually demonstrated.

A proof contract binds:
  * the registry key and expected owner quest;
  * the characteristic item outputs/hardware that quest must contain;
  * where useful, the exact material set that the synthesis family may own.

This is deliberately stricter than generic quest-ID validation.  If a process
is redesigned, the contract must be consciously updated with it.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "kubejs/server_scripts/matterworks/progression/research.js"
CHAPTERS = ROOT / "config/ftbquests/quests/chapters"

STRING_RE = re.compile(r"'([^']+)'")
SYNTHESIS_RE = re.compile(
    r"^\s*([a-z0-9_]+):\s*ageOwned\(\{\s*stage:\s*'[^']+',\s*age:\s*'([^']+)',\s*ownerQuest:\s*'(\d{16})',\s*materials:\s*\[([^\]]*)\]",
    re.MULTILINE,
)
CAPABILITY_RE = re.compile(
    r"^\s*([a-z0-9_]+):\s*ageOwned\(\{\s*stage:\s*'matterworks:capability/[^']+',\s*age:\s*'([^']+)',\s*ownerQuest:\s*'(\d{16})'\s*\}\)",
    re.MULTILINE,
)
QUEST_ID_RE = re.compile(r'\bid:\s*"(\d{16})"')
ITEM_RE = re.compile(r'\bitem:\s*"([a-z0-9_.-]+:[a-z0-9_./-]+)"')


@dataclass(frozen=True)
class Proof:
    owner_quest: str
    required_items: frozenset[str]
    exact_materials: frozenset[str] | None = None


SYNTHESIS_PROOFS: dict[str, Proof] = {
    "graphite_engineering": Proof(
        "2130000000000006",
        frozenset({"kubejs:graphite"}),
        frozenset({"graphite"}),
    ),
    "controlled_steelmaking": Proof(
        "2130000000000020",
        frozenset({"nuclearcraft:hsla_steel_ingot", "nuclearcraft:stainless_steel_ingot"}),
        frozenset({"steel", "hsla_steel", "stainless_steel"}),
    ),
    "tough_alloy_processing": Proof(
        "2130000000000020",
        frozenset({"nuclearcraft:tough_alloy_ingot"}),
        frozenset({"tough_alloy"}),
    ),
    "specialty_chemistry": Proof(
        "2130000000000023",
        frozenset({"nuclearcraft:borax_dust", "nuclearcraft:baratol_dust"}),
        frozenset({"borax", "baratol"}),
    ),
    "refinery_products": Proof(
        "2130000000000021",
        frozenset({"pneumaticcraft:diesel_bucket", "pneumaticcraft:lubricant_bucket"}),
        frozenset({"diesel", "lubricant"}),
    ),
    "biodiesel_processing": Proof(
        "2130000000000022",
        frozenset({"pneumaticcraft:biodiesel_bucket"}),
        frozenset({"biodiesel"}),
    ),
    "mekanism_hdpe": Proof(
        "2130000000000011",
        frozenset({"mekanism:hdpe_pellet"}),
        frozenset({"mekanism_hdpe"}),
    ),
}

CAPABILITY_PROOFS: dict[str, Proof] = {
    "atmospheric_separation": Proof(
        "2130000000000012",
        frozenset({"pneumaticcraft:thermopneumatic_processing_plant", "kubejs:molecular_sieve_charge"}),
    ),
    "petrochemical_processing": Proof(
        "2130000000000021",
        frozenset({"pneumaticcraft:refinery", "pneumaticcraft:diesel_bucket"}),
    ),
    "renewable_organic_processing": Proof(
        "2130000000000022",
        frozenset({"pneumaticcraft:biodiesel_bucket"}),
    ),
    "polymer_engineering": Proof(
        "2130000000000011",
        frozenset({"mekanism:hdpe_pellet"}),
    ),
    "operational_fission": Proof(
        "2150000000000009",
        frozenset({"nuclearcraft:depleted_fuel_uranium_leu_235"}),
    ),
    "nuclear_fuel_cycle": Proof(
        "2150000000000010",
        frozenset({"nuclearcraft:fuel_reprocessor", "nuclearcraft:plutonium_239"}),
    ),
    "accelerator_research": Proof(
        "2160000000000005",
        frozenset({"nuclearcraft:ring_accelerator_controller"}),
    ),
    "atomic_fission": Proof(
        "2170000000000003",
        frozenset({"alchemistry:fission_chamber_controller"}),
    ),
    "nuclear_transmutation": Proof(
        "2180000000000003",
        frozenset({"alchemistry:fusion_chamber_controller"}),
    ),
    "fusion_engineering": Proof(
        "2180000000000004",
        frozenset({
            "mekanismgenerators:fusion_reactor_frame",
            "mekanismgenerators:fusion_reactor_port",
            "mekanismgenerators:laser_focus_matrix",
            "mekanismgenerators:fusion_reactor_controller",
            "mekanismgenerators:hohlraum",
        }),
    ),
}

NUCLEAR_FRONT_END_PROOFS: dict[str, frozenset[str]] = {
    "2150000000000006": frozenset({
        "nuclearcraft:fluid_enricher",
        "nuclearcraft:crystallizer",
        "nuclearcraft:yellowcake_dust",
    }),
    "2150000000000002": frozenset({
        "nuclearcraft:isotope_separator",
        "nuclearcraft:uranium_235",
        "nuclearcraft:uranium_238",
    }),
    "2150000000000007": frozenset({"nuclearcraft:fuel_uranium_leu_235"}),
    "2150000000000008": frozenset({"nuclearcraft:copper_heat_sink"}),
}


def _find_matching(text: str, start: int, opening: str, closing: str) -> int | None:
    depth = 0
    quote: str | None = None
    escaped = False
    for i in range(start, len(text)):
        ch = text[i]
        if quote is not None:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            continue
        if ch == '"':
            quote = ch
            continue
        if ch == opening:
            depth += 1
        elif ch == closing:
            depth -= 1
            if depth == 0:
                return i
    return None


def parse_quest_items() -> dict[str, set[str]]:
    quests: dict[str, set[str]] = {}
    duplicate_ids: set[str] = set()

    for path in sorted(CHAPTERS.glob("*.snbt")):
        text = path.read_text(encoding="utf-8")
        marker = text.find("quests:")
        if marker < 0:
            continue
        list_start = text.find("[", marker)
        if list_start < 0:
            continue
        list_end = _find_matching(text, list_start, "[", "]")
        if list_end is None:
            raise ValueError(f"unterminated quests list in {path.relative_to(ROOT)}")

        i = list_start + 1
        while i < list_end:
            if text[i] != "{":
                i += 1
                continue
            end = _find_matching(text, i, "{", "}")
            if end is None or end > list_end:
                raise ValueError(f"unterminated quest object in {path.relative_to(ROOT)}")
            block = text[i : end + 1]
            id_match = QUEST_ID_RE.search(block)
            if id_match:
                quest_id = id_match.group(1)
                if quest_id in quests:
                    duplicate_ids.add(quest_id)
                quests[quest_id] = set(ITEM_RE.findall(block))
            i = end + 1

    if duplicate_ids:
        raise ValueError("duplicate quest IDs: " + ", ".join(sorted(duplicate_ids)))
    return quests


def main() -> int:
    errors: list[str] = []
    if not RESEARCH.is_file():
        print(f"Missing research registry: {RESEARCH.relative_to(ROOT)}", file=sys.stderr)
        return 1

    research = RESEARCH.read_text(encoding="utf-8")
    synthesis = {
        key: (age, owner, frozenset(STRING_RE.findall(raw_materials)))
        for key, age, owner, raw_materials in SYNTHESIS_RE.findall(research)
    }
    capabilities = {
        key: (age, owner)
        for key, age, owner in CAPABILITY_RE.findall(research)
    }

    try:
        quest_items = parse_quest_items()
    except ValueError as exc:
        print(f"Matterworks process-proof validation FAILED:\n  - {exc}", file=sys.stderr)
        return 1

    def check_owner(kind: str, key: str, actual_owner: str | None, proof: Proof) -> None:
        if actual_owner is None:
            errors.append(f"missing {kind} registry entry {key!r}")
            return
        if actual_owner != proof.owner_quest:
            errors.append(
                f"{kind} {key!r} owner drifted: expected {proof.owner_quest}, actual {actual_owner}"
            )
        items = quest_items.get(proof.owner_quest)
        if items is None:
            errors.append(f"{kind} {key!r} owner quest {proof.owner_quest} is missing")
            return
        missing = proof.required_items - items
        if missing:
            errors.append(
                f"{kind} {key!r} owner quest {proof.owner_quest} does not prove: "
                + ", ".join(sorted(missing))
            )

    for key, proof in SYNTHESIS_PROOFS.items():
        entry = synthesis.get(key)
        owner = entry[1] if entry else None
        check_owner("synthesis", key, owner, proof)
        if entry and proof.exact_materials is not None and entry[2] != proof.exact_materials:
            errors.append(
                f"synthesis {key!r} material scope drifted: expected {sorted(proof.exact_materials)}, "
                f"actual {sorted(entry[2])}"
            )

    for key, proof in CAPABILITY_PROOFS.items():
        entry = capabilities.get(key)
        owner = entry[1] if entry else None
        check_owner("capability", key, owner, proof)

    for quest_id, required_items in NUCLEAR_FRONT_END_PROOFS.items():
        items = quest_items.get(quest_id)
        if items is None:
            errors.append(f"nuclear front-end proof quest {quest_id} is missing")
            continue
        missing = required_items - items
        if missing:
            errors.append(
                f"nuclear front-end quest {quest_id} is missing process proof: "
                + ", ".join(sorted(missing))
            )

    nuclear_cycle_script = ROOT / "kubejs/server_scripts/matterworks/recipes/nuclear_fuel_cycle.js"
    if not nuclear_cycle_script.is_file():
        errors.append("nuclear fuel-cycle enforcement module is missing")
    else:
        text = nuclear_cycle_script.read_text(encoding="utf-8")
        required_fragment = "event.remove({ id: 'nuclearcraft:isotope_separator/dusts_uranium' })"
        if required_fragment not in text:
            errors.append("direct uranium-dust isotope-separation bypass is no longer blocked")

    petro_script = ROOT / "kubejs/server_scripts/matterworks/recipes/petrochemistry.js"
    if not petro_script.is_file():
        errors.append("petrochemistry process module is missing")
    else:
        text = petro_script.read_text(encoding="utf-8")
        for fragment in (
            "event.remove({ id: 'mekanism:reaction/substrate/water_hydrogen' })",
            "matterworks:petrochemistry/steam_cracking/lpg_to_ethylene",
        ):
            if fragment not in text:
                errors.append(f"petrochemical process contract is missing: {fragment}")

    if errors:
        print("Matterworks process-proof validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks process-proof validation passed: "
        f"{len(SYNTHESIS_PROOFS)} synthesis owners, {len(CAPABILITY_PROOFS)} capability owners, "
        f"{len(NUCLEAR_FRONT_END_PROOFS)} nuclear front-end proof quests."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
