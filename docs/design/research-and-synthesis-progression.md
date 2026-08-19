# Matterworks research and synthesis progression

## Status

Design contract for 0.5.4+.

## Core rule

Matterworks treats material analysis and material synthesis as two different capabilities.

1. **Analysis / decomposition** answers: "what is this material made of?"
2. **Synthesis** answers: "do we know how to manufacture this material from its chemical basis?"

Every material resource exposed by an installed content mod must participate in the chemistry system unless it is explicitly classified as a non-material artifact or a provenance-sensitive nuclear state.

A resource being decomposable MUST NOT imply that it is synthesizable.

## Questbook is the progression authority

FTB Quests is the player-facing source of progression truth.

A synthesis capability is unlocked by completing a quest that proves the corresponding technology or process has actually been established. The quest grants a stage. Runtime scripts and recipe restrictions consume that stage; they do not invent an independent progression tree.

Examples:

- construct the required pressure infrastructure -> unlock synthesis routes that require industrial gas handling;
- obtain/build the relevant reactor/process unit -> unlock the material family produced by that process;
- establish NuclearCraft fuel preparation -> unlock the appropriate nuclear feed material route;
- establish the accelerator -> unlock accelerator-dependent element production;
- complete the Alchemistry fission milestone -> unlock fission-mediated synthesis knowledge;
- complete the Alchemistry fusion milestone -> unlock fusion-mediated synthesis knowledge.

The intended flow is therefore:

`physical capability -> quest completion -> synthesis knowledge stage -> recipe permission`

not:

`obtain arbitrary item -> recipe globally appears`.

## Resource-level synthesis knowledge

Synthesis unlocks are resource-specific or family-specific, never a single global "Combiner unlocked" flag.

Each synthesis entry has at least:

- canonical resource id or canonical material key;
- chemical composition;
- decomposition permission;
- synthesis permission stage;
- prerequisite quest / research milestone;
- required process class;
- provenance policy;
- preferred canonical output item;
- aliases from other mods.

Conceptual registry entry:

```text
material = steel
composition = Fe + C
analysis = available
synthesis_stage = matterworks:synthesis/steel
unlock = establish controlled steelmaking process
process = metallurgy
canonical_output = <pack canonical steel item>
```

Another example:

```text
material = uranium_feed
composition = U
analysis = available for ordinary parent-element feed
synthesis_stage = matterworks:synthesis/uranium
unlock = establish the required nuclear-material process
process = nuclear
provenance = parent-element only
```

## Decomposition coverage

The chemistry compatibility audit must cover material resources from every installed content mod, not only Alchemistry/ChemLib/NuclearCraft.

The audit should enumerate the runtime item registry and classify resource-like items using:

- Forge material tags (`ores`, `raw_materials`, `dusts`, `ingots`, `nuggets`, `gems`, `plates`, `storage_blocks`, etc.);
- known mod-specific resource tags;
- explicit Matterworks material aliases;
- explicit compound/alloy registry entries;
- explicit exceptions.

For every classified material resource, the audit must be able to answer one of:

- decomposable with a known composition;
- intentionally atomic / canonical element;
- intentionally provenance-sensitive and handled by a dedicated process;
- explicitly unsupported with a documented reason.

Silent gaps are defects.

## Synthesis coverage

Every decomposable ordinary material should have a corresponding synthesis definition, but that definition remains locked until its research stage is granted.

The synthesis audit must detect:

- decomposable resource with no synthesis definition;
- synthesis definition with no unlock stage;
- unlock stage with no quest owner;
- quest unlock with no recipe/runtime consumer;
- alias that can bypass the canonical stage;
- stock recipe that bypasses Matterworks synthesis policy.

## Nuclear provenance boundary

"Everything can be chemically understood" does not mean that every nuclear state can be recreated by ordinary element recombination.

The following remain provenance-sensitive and MUST NOT collapse into generic parent elements through the normal Dissolver/Combiner path:

- isotopically enriched/depleted materials;
- reactor fuels;
- irradiated/depleted fuels;
- fission products and process wastes;
- isotope-specific intermediates;
- materials whose identity depends on neutron exposure or enrichment history.

Their composition may be analyzable, but synthesis must require the process that gives the state its physical provenance (enrichment, irradiation, reprocessing, accelerator production, etc.).

## Gate policy

Use quest dependencies and quest-awarded stages whenever possible.

Hard KubeJS/datapack restrictions remain only where required to prevent bypasses:

- removing stock recipes that violate the progression contract;
- canonicalization and anti-loop rules;
- provenance protection;
- machine serializers that cannot safely express per-player/per-team knowledge by themselves.

Hard restrictions are enforcement; quests are progression authority.

## Team semantics

Research should normally be shared at the FTB Teams level so a factory operated by a team has one coherent technology state. Individual-only stages should be reserved for genuinely personal progression.

## Machine milestone semantics

A quest should unlock synthesis only after the required capability is demonstrated. Preferred proof, in order:

1. successful production of the characteristic process output;
2. observation/validation of a correctly built multiblock or machine where supported;
3. acquisition of the process controller/block if runtime validation is not available yet.

Simply possessing a random component is not considered research completion.

## Example progression chain

```text
Create mechanical processing
  -> controlled carbon / metallurgy
  -> electrical infrastructure
  -> Mekanism chemical processing
  -> pressure and industrial gases
  -> NuclearCraft fuel preparation
  -> NuclearCraft fission operation
  -> fuel reprocessing / nuclear chemistry
  -> accelerator operation
  -> Alchemistry fission knowledge
  -> Alchemistry fusion knowledge
```

Each node may unlock a set of material synthesis stages, and later nodes may depend on earlier material knowledge.

## Acceptance criteria

A release is not progression-complete until:

- all installed-mod material resources are classified by the chemistry audit;
- all ordinary classified resources have decomposition data;
- all intended synthetic resources have a synthesis definition;
- every synthesis definition has an explicit quest-owned unlock stage;
- no stock recipe provides an ungated equivalent route;
- JEI-visible aliases cannot bypass the canonical material rule;
- nuclear provenance-sensitive materials cannot be recreated through ordinary synthesis;
- questbook dependencies represent the same graph enforced by runtime recipes/scripts.
