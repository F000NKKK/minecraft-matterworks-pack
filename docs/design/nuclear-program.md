# Matterworks Nuclear Program

Matterworks 0.5.4 treats nuclear chemistry as a terminal technical program, not as an ordinary collection of recipes.

The progression boundary is:

`Create -> Mekanism -> NuclearCraft fission/fuel cycle -> NuclearCraft accelerator -> Alchemistry Fission -> Alchemistry Fusion`

## Design invariant

A player must not be able to bypass nuclear or engineering progression by decomposing a nuclear material into generic ChemLib elements and recombining those elements into a later-stage material.

This restriction applies in both directions. Blocking only Dissolver recipes is insufficient if a Combiner, crafting recipe, machine conversion, ore-dictionary/tag substitution, or another compatibility recipe can recreate an otherwise gated material.

## Program stages

### Stage 1: Industrial foundation

Create owns the mechanical and early industrial infrastructure required to manufacture the first controlled-process components. Mekanism then owns powered chemical processing, gas handling, purification and the higher-energy process infrastructure used by the nuclear chain.

The nuclear program must therefore consume materials and process capabilities whose production already requires both branches. Merely crafting a NuclearCraft controller must not satisfy this stage.

### Stage 2: Fission fuel cycle

NuclearCraft owns uranium/thorium processing, isotope separation, fuel fabrication, reactor operation, depleted fuel handling, irradiation products and waste/reprocessing streams.

Completion evidence must come from process output that cannot be obtained without operating the fuel cycle. Reactor blocks or empty machines are not sufficient evidence.

### Stage 3: Accelerator / advanced nuclear processing

The accelerator branch is a separate technical milestone. It must produce a program-specific completion artifact or otherwise verifiable output before generic atomic transmutation is exposed.

### Stage 4: Alchemistry Fission

Alchemistry Fission is unlocked only after both the practical fission/fuel-cycle milestone and accelerator milestone are complete.

At this point the pack may expose controlled element-splitting routes, but NuclearCraft fuels, isotopes, irradiated products, depleted fuels, wastes and process intermediates remain provenance-sensitive and are never automatically flattened into interchangeable generic elements.

### Stage 5: Alchemistry Fusion

Fusion is the terminal chemistry capability. It is unlocked only after the preceding nuclear program is complete and after an explicit high-energy technical milestone.

Fusion must not provide a backdoor to synthesize gated reactor fuel or isotope-cycle materials unless a dedicated Matterworks recipe intentionally defines that route.

## Gate model

Matterworks uses two complementary layers:

1. **Recipe invariants** — unsafe upstream Dissolver/Combiner/compatibility recipes are removed or replaced so a fresh world cannot bypass progression even without quest state.
2. **Progression state** — FTB Quests represents visible program milestones and records player/team completion for recipes or capabilities that can be safely exposed only after a milestone.

Quest completion is therefore not a substitute for recipe hardening. The static recipe graph itself must remain safe.

## Nuclear material classes

The following classes are program-owned and must never receive generic automatic decomposition/recomposition:

- parent nuclear materials used by the NuclearCraft cycle;
- isotopes and isotope mixtures;
- oxides, fluorides and enrichment intermediates;
- reactor fuels and fuel compounds;
- depleted/spent fuels;
- irradiated materials;
- reprocessing intermediates;
- nuclear wastes;
- accelerator-only products;
- any material whose identity encodes enrichment, burnup, irradiation or process provenance.

The composition registry may record elemental composition for audit/documentation. Composition knowledge does not imply recipe permission.

## Completion evidence

Milestones should prefer process evidence over machine possession. Candidate evidence is selected using these rules:

- it must be impossible or impractical to acquire before performing the intended stage;
- it must not be a common loot/drop/import path;
- it should encode a meaningful process transition, such as depleted fuel, irradiated material, reprocessed product or accelerator output;
- team completion must be compatible with FTB Teams;
- if an upstream item is unsuitable as durable evidence, Matterworks should introduce a dedicated advancement/token artifact awarded only by the process/quest layer.

Exact NuclearCraft item IDs are pinned only after runtime registry verification.

## Audit requirements

0.5.4 runtime audits must report:

- gated NuclearCraft item families discovered at startup;
- unsafe Alchemistry recipes removed;
- missing expected milestone item IDs;
- any nuclear-class item that still has a generic Dissolver or Combiner route;
- progression scripts that load without their required mods.

A missing expected registry item is an implementation error, not a reason to silently weaken the gate.
