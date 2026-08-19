# Matterworks research and synthesis progression

## Status

Design contract for 0.5.8+.

## Core rule

Matterworks treats material analysis, physical manufacture and generic chemical/nuclear reconstruction as different capabilities.

1. **Analysis / decomposition** answers: "what is this material made of?"
2. **Physical process ownership** answers: "which process gives this material its useful state, grade or provenance?"
3. **Generic reconstruction / transmutation** answers: "may the chemistry system create this identity from chemical or nuclear building blocks?"

A material being chemically understandable MUST NOT imply that it can be manufactured by the Combiner. A material being decomposable MUST NOT imply that its production history is irrelevant.

## What the questbook actually enforces in 0.5.8

FTB Quests is the player-facing progression authority, but the `stage` strings in `research.js` are **not** currently a per-player recipe-gating runtime.

The implemented enforcement model is:

```text
physical recipe / machine boundary
        -> characteristic process output
        -> quest proof
        -> research ownership metadata
```

Hard recipe removals and replacement recipes enforce the physical boundary globally. Quests prove that the process has been exercised. `research.js` records which quest owns which capability/material family, and CI verifies that the owner quest contains the characteristic process proof.

The `stage` fields remain stable identifiers for a future team-scoped runtime research layer. Until such a consumer is implemented, they are metadata and MUST NOT be described as active recipe locks.

This is sufficient for the current chemistry model because Alchemistry 2.3.4 has a finite Combiner recipe set; it does not dynamically synthesize every entry from Matterworks' composition registry.

## Research ownership

A synthesis or capability owner is allowed only when its quest proves the corresponding physical operation.

Examples:

- `graphite_engineering` is owned by the quest that requires actual graphite from the high-temperature graphitization route;
- `refinery_products` is limited to diesel/lubricant because those are the fractions the refinery milestone demonstrates;
- `biodiesel_processing` owns biodiesel only; vegetable-oil extraction and yeast/fermentation are separate process gaps;
- `operational_fission` requires depleted LEU fuel, not a reactor controller;
- `nuclear_fuel_cycle` requires Fuel Reprocessor operation and recovered Pu-239;
- Alchemistry Fusion is `nuclear_transmutation`; Mekanism fusion-reactor startup is the separate `fusion_engineering` capability.

`.github/scripts/validate-process-proof.py` is the static contract connecting these owners to their required quest outputs/hardware.

## Explicit process backlog

A material may be chemically classified while its production route is not yet implemented. Such a material belongs to exactly one explicit backlog family instead of being silently assigned to a nearby broad milestone.

Examples include:

- chlor-alkali products until a process can represent chlorine, hydrogen and sodium hydroxide without fake coproduct chemistry;
- specialist superconducting/refractory alloys until their exact routes are validated;
- pyrolytic/hard carbon until their own processes exist;
- vegetable oil and yeast culture until extraction/bioprocessing exists;
- Zircaloy fabrication until a real structural-alloy route is introduced.

A backlog entry is a deliberate unsupported process state, not permission to obtain the material through generic synthesis.

## Decomposition coverage

For every classified material resource, the audit must be able to answer one of:

- directly decomposable with a defensible stoichiometric model;
- process-owned: composition is known but grade/state/history matters;
- mixture/manufactured state where a fake formula would be misleading;
- provenance-sensitive nuclear state;
- explicitly unresolved in a named process backlog family.

Silent gaps are defects.

## Alloy semantics

A fixed Matterworks ratio for a simple alloy is a **nominal pack grade**, not a claim that an alloy is a molecular compound.

Engineering materials whose identity depends strongly on grade, microstructure or manufacturing history use `PROCESS`, `MIXTURE` or `MANUFACTURED` semantics. Zircaloy and carbon-manganese material must not be flattened into fake `Zr7Sn` / `MnC` direct chemistry merely because convenient gameplay ratios can be written down.

## Nuclear provenance boundary

"Everything can be chemically understood" does not mean every nuclear state can be recreated by ordinary element recombination.

NuclearCraft 1.2.34's authoritative uranium front end is:

```text
uranium dust + oxygen
    -> uranium-oxide fluid
    -> crystallization
    -> yellowcake
    -> isotope separation
    -> U-235 + U-238
    -> LEU fuel fabrication
    -> reactor burnup
    -> depleted fuel
    -> reprocessing
```

Matterworks removes NuclearCraft's alternate direct `uranium dust -> isotopes` separator recipe because it bypasses that conversion history. Matterworks does not invent a UF6 step that NuclearCraft 1.2.34 does not model.

The following remain provenance-sensitive:

- conversion intermediates such as uranium-oxide fluid and yellowcake;
- isotope-specific material identity;
- fabricated reactor fuel;
- irradiated/depleted fuel;
- reprocessing products and waste;
- any material whose identity depends on enrichment, irradiation or burnup history.

## Gate policy

Use the strongest truthful gate available, in this order:

1. physical recipe dependency on already-proven process hardware/materials;
2. removal/replacement of a stock recipe that bypasses the intended process;
3. quest proof based on a characteristic output or operating-state product;
4. acquisition of complete startup infrastructure when runtime observation is unavailable;
5. controller/block acquisition only when the mod exposes no stronger proof;
6. future team-scoped research stages only after an actual runtime consumer exists.

Hard restrictions are enforcement; quests are player-facing proof and explanation.

## Machine milestone semantics

Preferred proof, in order:

1. successful production of the characteristic process output;
2. operating-state product proving the machine ran, e.g. depleted reactor fuel;
3. observation/validation of a correctly built multiblock where supported;
4. acquisition of complete startup infrastructure;
5. acquisition of a controller/block only as a last resort.

Simply possessing a random component is not research completion.

## Current progression model

```text
Create mechanical manufacturing
  -> electromechanical generation
  -> parallel analysis/reconstruction + physical metallurgy
  -> process heat / pressure / electrochemistry
  -> atmospheric separation + Haber-Bosch
  -> refinery / renewable organics / polymer convergence
  -> digital plant supervision
  -> uranium conversion -> yellowcake -> isotope separation
  -> LEU fabrication -> reactor thermal design -> operational fission
  -> depleted-fuel reprocessing
  -> accelerator engineering
  -> Alchemistry atomic transmutation
  -> high-energy transmutation
  -> separate Mekanism fusion-reactor engineering
  -> prestige integration
```

The player should ask "which technological capability is missing from the plant?", not "which mod do I finish next?"

## Acceptance criteria

A release is not progression-complete until:

- all installed-mod material resources are classified by the chemistry/provenance audit;
- every composition entry has exactly one disposition: synthesis-owned, provenance-only or explicit process backlog;
- every claimed synthesis/capability owner proves the characteristic physical process;
- no stock recipe provides a known ungated equivalent route around a process/provenance boundary;
- JEI-visible aliases cannot bypass canonical material rules;
- nuclear states cannot be recreated through ordinary generic chemistry;
- questbook dependencies represent the same physical graph enforced by recipes/scripts;
- any future `stage`-based restriction is not called active until a real runtime consumer and team semantics are implemented.
