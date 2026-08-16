# Matterworks Material Matrix

Matterworks treats material identity as a first-class integration contract.

This document extends the chemistry compatibility rules beyond pure ChemLib elements. It covers alloys, mineral powders, organic powders, manufactured shapes, nuclear intermediates and process fluids supplied by the pinned Matterworks 0.5.x mod set.

The matrix is intentionally conservative: two items are interchangeable only when they represent the same material **and** the same technologically relevant state. Similar names are not enough.

## Status model

| Status | Meaning |
| --- | --- |
| `EXACT/TAG` | Same material and state; existing Forge tags are the interoperability boundary. |
| `EXACT/GAP` | Same material and state, but the pinned mods do not expose a complete shared tag edge; Matterworks may add the missing tag membership. |
| `CANONICAL` | Duplicate concrete items may normalize one-way to a selected representation when doing so cannot bypass processing. |
| `PROCESS` | Composition, treatment, purity, irradiation, temperature or process history is meaningful. Never globally alias. |
| `MANUFACTURED` | Wire, rod, spool, sheet, pellet, fibre or another manufactured shape. Material identity may be shared, but the shape remains explicit. |
| `OWNER` | The material currently has one authoritative provider in the installed mod set. No compatibility bridge is required. |
| `AUDIT` | Plausible overlap exists, but composition/state has not been proven sufficiently for a global rule. |

`EXACT/TAG` is preferred over inventory conversion. Matterworks only adds shapeless canonicalization when concrete-item ownership matters to JEI or a serializer consumes a concrete ID.

## Canonical ownership rules

| Material domain | Canonical owner / boundary |
| --- | --- |
| pure ordinary elements and ordinary molecular compounds | ChemLib / Alchemistry |
| ordinary bulk alloy with several providers | Forge form tags; no forced concrete owner unless a serializer requires one |
| Create mechanical materials | Create |
| NuclearCraft specialist alloys, salts and nuclear materials | NuclearCraft: Neoteric |
| Mekanism enrichment / ore-processing states | Mekanism |
| PneumaticCraft compressed iron, plastics and petrochemical process streams | PneumaticCraft |
| Matterworks progression materials such as coke and pack graphite | Matterworks |
| manufactured wire/rod/spool/fibre states | producing mod; material-family tags may be shared but the shape is not flattened |

## Common metals, alloys and bulk engineering materials

| Material | Providers / representative forms | Status | Interoperability policy |
| --- | --- | --- | --- |
| steel | NuclearCraft dust/ingot/nugget/block/plate/fluid; Mekanism dust/ingot/nugget/block | `EXACT/TAG` | Use `forge:dusts/steel`, `forge:ingots/steel`, `forge:nuggets/steel`, `forge:storage_blocks/steel`; NuclearCraft plate remains `forge:plates/steel`. Do not canonicalize concrete items merely for appearance. |
| bronze | NuclearCraft dust/ingot/nugget/block/plate/fluid; Mekanism dust/ingot/nugget/block | `EXACT/TAG` | Use standard Forge bronze form tags. |
| electrum | NuclearCraft dust/ingot/nugget/block/plate/fluid; Create Crafts & Additions ingot/nugget/sheet/wire/rod/spool | `EXACT/TAG` + `MANUFACTURED` | Bulk ingot/nugget/plate forms share Forge tags. CA wire/rod/spool remain manufactured states. |
| brass | Create ingot/nugget/sheet; Create Crafts & Additions rod | `OWNER` + `MANUFACTURED` | Create owns brass bulk material. `brass_rod` is a manufactured brass shape, not an ingot substitute. |
| andesite alloy | Create ingot-like bulk item/block | `OWNER` | Mechanical composite owned by Create; do not reinterpret as a chemical element or normal metal alloy. |
| tough alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | NuclearCraft specialist engineering alloy. Preserve its recipe chain. |
| ferroboron | NuclearCraft dust/ingot/plate/fluid | `OWNER` | NuclearCraft specialist alloy; do not collapse into iron + boron items outside a real production recipe. |
| hard carbon | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Engineered carbon material, distinct from coal, coke and graphite. |
| tin-silver | NuclearCraft dust/ingot/fluid | `OWNER` | NuclearCraft solder/alloy family. |
| thermoconducting alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Preserve as engineered alloy. |
| zircaloy | NuclearCraft dust/ingot/fluid | `OWNER` | Nuclear-grade zirconium alloy; distinct from elemental zirconium. |
| zirconium-molybdenum | NuclearCraft dust/ingot/fluid | `OWNER` | Specialist alloy; distinct from its elemental constituents. |
| extreme alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | NuclearCraft progression alloy. |
| SiC-SiC CMC | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Ceramic-matrix composite; never alias to silicon carbide dust. |
| lithium manganese dioxide | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Compound/electrode material, not elemental lithium or manganese. |
| silicon carbide | NuclearCraft dust/ingot/fluid | `OWNER` | Ceramic compound; distinct from SiC-SiC CMC. |
| shibuichi | NuclearCraft dust/ingot/fluid | `OWNER` | Copper-silver alloy; preserve alloy identity. |
| HSLA steel | NuclearCraft dust/ingot/plate/fluid | `OWNER` | High-strength low-alloy steel; not generic `forge:ingots/steel`. |
| osmiridium | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Specialist osmium-iridium alloy. |
| nichrome | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Nickel-chromium resistance alloy. |
| niobium-tin | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Superconducting/intermetallic material; preserve composition. |
| niobium-titanium | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Superconducting alloy; preserve composition. |
| stainless steel | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Distinct from generic steel. |
| super alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | NuclearCraft specialist high-temperature alloy. |
| tungsten carbide | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Carbide, not elemental tungsten or carbon. |
| magnesium diboride | NuclearCraft ingot/fluid | `OWNER` | Compound/superconductor; preserve compound identity. |
| lead-platinum | NuclearCraft dust/ingot/fluid | `OWNER` | Specialist alloy. |
| carbon-manganese | NuclearCraft dust/ingot/fluid | `OWNER` | Alloy/intermediate distinct from the `c_mn_blend` precursor. |
| beryllium | NuclearCraft bulk forms; ChemLib element forms | `CANONICAL` | Ordinary elemental identity follows existing pure-element ChemLib/NuclearCraft policy. |
| zirconium | NuclearCraft bulk forms; ChemLib element forms | `CANONICAL` | Ordinary elemental identity follows pure-element policy; do not confuse with zircaloy. |
| manganese | NuclearCraft bulk forms; ChemLib element forms | `CANONICAL` | Ordinary elemental identity follows pure-element policy; oxide compounds stay separate. |
| aluminum / aluminium | NuclearCraft bulk forms; ChemLib; Forge spelling variants | `EXACT/TAG` + `CANONICAL` | Both spellings resolve the same ordinary metal. Matterworks aliases the Forge spelling boundary. |
| compressed iron | PneumaticCraft ingot/block | `PROCESS` | Pressure/explosion-treated engineering material. Never alias to ordinary iron ingot despite iron feedstock. |
| refined obsidian | Mekanism dust/ingot/nugget/block | `PROCESS` | Infused/refined material; distinct from ordinary obsidian powder. |
| refined glowstone | Mekanism ingot/nugget/block | `PROCESS` | Engineered material; not glowstone dust. |

## Mineral, elemental and inorganic powders

| Material | Providers / representative forms | Status | Interoperability policy |
| --- | --- | --- | --- |
| obsidian powder | Create powdered obsidian; Mekanism obsidian dust; NuclearCraft obsidian dust | `EXACT/TAG` | `forge:dusts/obsidian` is authoritative. Create already contributes `create:powdered_obsidian`. |
| quartz dust | Mekanism quartz dust; NuclearCraft quartz dust | `EXACT/TAG` | Use `forge:dusts/quartz`. |
| diamond dust | Mekanism diamond dust; NuclearCraft diamond dust | `EXACT/TAG` | Use `forge:dusts/diamond`. Do not alias CreateAddition diamond grit: grit is an abrasive particle-size state. |
| emerald dust | Mekanism emerald dust; NuclearCraft emerald dust | `EXACT/TAG` | Use `forge:dusts/emerald`. |
| lapis dust | Mekanism lapis lazuli dust; NuclearCraft lapis dust | `EXACT/TAG` | Use the standard Forge lapis dust tag family. |
| coal dust | Mekanism coal dust; NuclearCraft coal dust | `EXACT/TAG` | Same pulverized fossil-carbon feedstock. Still distinct from coke/graphite. |
| charcoal dust | Mekanism charcoal dust; NuclearCraft charcoal dust | `EXACT/TAG` | Same pulverized biogenic charcoal; never substitute for metallurgical coke where origin matters. |
| sulfur dust | Mekanism sulfur dust; NuclearCraft sulfur dust; ChemLib sulfur dust | `EXACT/TAG` | Ordinary sulfur identity is shared, but Alchemistry's special Dissolver behavior remains authoritative. |
| lithium dust | Mekanism lithium dust; NuclearCraft/ChemLib element forms | `EXACT/TAG` + `CANONICAL` | Ordinary elemental lithium only. Irradiated lithium and lithium compounds remain protected. |
| fluorite | NuclearCraft gem/dust; Mekanism gem/dust | `EXACT/TAG` | Shared mineral identity through `forge:gems/fluorite` / `forge:dusts/fluorite` where present. |
| salt / sodium chloride | NuclearCraft salt; Mekanism salt | `EXACT/TAG` | Both participate in the Forge salt dust boundary. NuclearCraft additionally exposes its salt as sodium-chloride dust. Do not merge salt solutions/brine with dry salt. |
| sawdust / wood dust | NuclearCraft sawdust; Mekanism sawdust | `AUDIT` | Mekanism publishes sawdust as wood dust; NuclearCraft item provenance/recipes must be confirmed before adding it globally to the same tag. |
| rhodochrosite | NuclearCraft dust/gem | `OWNER` | Mineral feedstock; do not collapse into manganese carbonate chemistry without an explicit reaction model. |
| villiaumite | NuclearCraft dust/gem | `OWNER` | Mineral source used to obtain sodium fluoride; mineral identity remains explicit. |
| carobbiite | NuclearCraft dust/gem | `OWNER` | Mineral source used to obtain potassium fluoride; mineral identity remains explicit. |
| boron nitride | NuclearCraft dust/gem | `OWNER` | Compound material, not elemental boron/nitrogen. |
| boron arsenide | NuclearCraft dust | `OWNER` | Compound semiconductor; preserve identity. |
| borax | NuclearCraft dust | `OWNER` | Borate process material; distinct from irradiated borax. |
| potassium fluoride | NuclearCraft dust | `OWNER` | Salt/compound material. |
| sodium fluoride | NuclearCraft dust | `OWNER` | Salt/compound material. |
| calcium sulfate | NuclearCraft and ChemLib compound dust | `CANONICAL` | One-way NuclearCraft -> ChemLib concrete dust canonicalization; stock Alchemistry decomposition stays authoritative. |
| sodium hydroxide | NuclearCraft and ChemLib compound dust | `CANONICAL` | One-way NuclearCraft -> ChemLib dust canonicalization. Aqueous solution state remains separate. |
| potassium hydroxide | NuclearCraft and ChemLib compound dust | `CANONICAL` | One-way NuclearCraft -> ChemLib dust canonicalization. |
| barium nitrate | NuclearCraft and ChemLib compound dust | `CANONICAL` | One-way NuclearCraft -> ChemLib dust canonicalization. |
| manganese oxide (MnO) | NuclearCraft dust/ingot/fluid | `PROCESS` | Keep NuclearCraft MnO separate. ChemLib's item named `manganese_oxide` represents MnO2 and must not enter this tag. |
| manganese dioxide (MnO2) | NuclearCraft dust/ingot/fluid; ChemLib `manganese_oxide` | `CANONICAL` | Matterworks maps the ChemLib naming collision to the dioxide identity and canonicalizes NuclearCraft MnO2 dust to ChemLib. |
| potassium iodide | NuclearCraft dust | `OWNER` | Compound process material. |
| iodine | NuclearCraft/ChemLib elemental forms | `CANONICAL` | Ordinary elemental iodine may follow pure-element rules; iodine compounds do not. |
| barium | NuclearCraft/ChemLib elemental forms | `CANONICAL` | Ordinary element only. |
| bismuth | NuclearCraft/ChemLib elemental forms | `CANONICAL` | Ordinary element only; nuclear waste state remains separate. |
| neodymium | NuclearCraft/ChemLib elemental dust | `CANONICAL` | Ordinary element only. |

## Organic, food and biomass powders

| Material | Providers / representative forms | Status | Interoperability policy |
| --- | --- | --- | --- |
| wheat flour | Create `wheat_flour`; NuclearCraft `flour` | `EXACT/GAP` | Both are wheat-derived flour. Matterworks adds NuclearCraft flour to `forge:flour` and `forge:flour/wheat`; recipes should consume the tag rather than a concrete provider item. |
| wheat dough | Create dough | `OWNER` | Hydrated/processed food state, not dry flour. |
| cinder flour | Create cinder flour | `PROCESS` | Nether/mineral processing reagent despite the word "flour"; never place in food flour tags. |
| biomass | Create Crafts & Additions biomass / biomass pellet | `PROCESS` + `MANUFACTURED` | Energy/feedstock state. Pelletization is a manufactured form. |
| bio fuel | Mekanism bio fuel | `PROCESS` | Enriched/processed biomass fuel; do not globally alias to raw biomass. |
| cocoa solids | NuclearCraft | `OWNER` | Food-processing intermediate. |
| cocoa butter | NuclearCraft | `OWNER` | Food-processing intermediate; phase/composition distinct from cocoa solids. |
| roasted cocoa beans | NuclearCraft | `PROCESS` | Thermal treatment state. |
| ground cocoa nibs | NuclearCraft | `PROCESS` | Ground food intermediate. |
| unsweetened chocolate | NuclearCraft | `PROCESS` | Formulated food intermediate. |
| gelatin | NuclearCraft | `OWNER` | Organic process material. |
| straw | Create Crafts & Additions | `OWNER` | Biomass/fibre material. |
| pulp | Create | `PROCESS` | Cellulosic process intermediate. |
| cake base | Create Crafts & Additions | `PROCESS` | Food-processing intermediate. |
| baked cake base | Create Crafts & Additions | `PROCESS` | Thermal state distinct from unbaked cake base. |

## NuclearCraft process powders and mixtures

These materials are deliberately recorded in the matrix even when no cross-mod provider exists. They are exactly the class most likely to be accidentally flattened by broad "dust compatibility" logic.

| Material | Status | Policy |
| --- | --- | --- |
| yellowcake | `PROCESS` | Uranium concentrate; nuclear provenance must survive. Never alias to uranium dust. |
| C-Mn blend (`c_mn_blend`) | `PROCESS` | Precursor mixture; distinct from finished carbon-manganese alloy. |
| crystal binder | `PROCESS` | NuclearCraft formulation/intermediate. |
| dimensional blend | `PROCESS` | Specialist mixture; preserve recipe provenance. |
| energetic blend | `PROCESS` | Specialist mixture; preserve recipe provenance. |
| irradiated borax | `PROCESS` | Irradiation state is progression information; distinct from ordinary borax. |
| alugentum | `PROCESS` | Specialist NuclearCraft material. |
| baratol | `PROCESS` | Specialist formulated material. |
| tributyl phosphate / TBP | `PROCESS` | Chemical extraction reagent; do not flatten to component elements. |
| graphite | `PROCESS` | NuclearCraft graphite and Matterworks graphite are both carbon allotrope materials, but current progression deliberately keeps graphite production provenance explicit. No global canonicalization yet. |
| pyrolytic carbon | `PROCESS` | Engineered carbon state; distinct from generic graphite/carbon dust. |
| corium | `PROCESS` | Reactor accident/melt material. Nuclear state and provenance are mandatory. |
| neutronium | `PROCESS` | Exotic late-game material. Never treat as ordinary bulk metal. |

## Mekanism processing states

Mekanism ore-processing states are not material duplicates even when their registry names contain the same base metal.

| Family | Examples | Status | Policy |
| --- | --- | --- | --- |
| raw ore material | `raw_osmium`, `raw_tin`, `raw_lead`, `raw_uranium` | `PROCESS` | Ore-processing feedstock; never inventory-canonicalize directly to ingot/dust. |
| shard | iron/gold/osmium/copper/tin/lead/uranium shards | `PROCESS` | Mekanism chemical ore-processing stage. |
| crystal | corresponding crystals | `PROCESS` | Purified ore-processing stage. |
| clump | corresponding clumps | `PROCESS` | Ore-processing stage. |
| dirty dust | corresponding dirty dusts | `PROCESS` | Ore-processing stage; not ordinary `forge:dusts/<metal>`. |
| enriched carbon/redstone/diamond/obsidian/gold/tin | enrichment products | `PROCESS` | Infusion/enrichment state; never alias to source material. |
| enriched iron | Mekanism intermediate | `PROCESS` | Steelmaking precursor; not iron ingot/dust. |
| infused alloy | Mekanism `alloy_infused` | `PROCESS` | Tiered engineered component, not a generic bulk alloy. |
| reinforced alloy | Mekanism `alloy_reinforced` | `PROCESS` | Tiered engineered component. |
| atomic alloy | Mekanism `alloy_atomic` | `PROCESS` | Tiered engineered component. |
| substrate | Mekanism substrate | `PROCESS` | HDPE production intermediate. |
| HDPE pellet | Mekanism | `PROCESS` | Polymer material state. |
| HDPE rod/stick | Mekanism | `MANUFACTURED` | Manufactured polymer geometry. |
| yellow cake uranium | Mekanism | `PROCESS` | Nuclear concentrate; do not alias to NuclearCraft generic uranium or yellowcake until composition/process audit proves an exact boundary. |
| dirty netherite scrap | Mekanism | `PROCESS` | Ore-processing contamination state. |

## Create ore and abrasive states

| Material / state | Status | Policy |
| --- | --- | --- |
| crushed raw iron | `PROCESS` | Create ore-processing intermediate. |
| crushed raw gold | `PROCESS` | Create ore-processing intermediate. |
| crushed raw copper | `PROCESS` | Create ore-processing intermediate. |
| crushed raw zinc | `PROCESS` | Create ore-processing intermediate. |
| crushed osmium/platinum/silver/tin/lead/etc. compat materials | `PROCESS` | Keep in Create crushed-ore contract; never convert directly to finished ChemLib dust. |
| powdered obsidian | `EXACT/TAG` | Ordinary pulverized obsidian; safely shared through `forge:dusts/obsidian`. |
| sturdy sheet | `MANUFACTURED` | Obsidian plate/engineered sheet; preserve plate geometry. |
| diamond grit | `MANUFACTURED` | Abrasive grit, not generic diamond dust. |
| diamond grit sandpaper | `MANUFACTURED` | Finished tool/material composite. |
| rose quartz | `PROCESS` | Create material; do not equate with vanilla quartz or quartz dust. |
| polished rose quartz | `PROCESS` | Surface-finished state distinct from rose quartz. |

## Manufactured electrical shapes

Material compatibility does not imply shape compatibility.

| Shape/material | Provider | Status | Policy |
| --- | --- | --- | --- |
| copper wire | Create Crafts & Additions | `MANUFACTURED` | Copper identity is known, but wire is not an ingot/dust. Consume through conductor/wire tags. |
| iron wire | Create Crafts & Additions | `MANUFACTURED` | Keep wire geometry. |
| gold wire | Create Crafts & Additions | `MANUFACTURED` | Keep wire geometry. |
| electrum wire | Create Crafts & Additions | `MANUFACTURED` | Bulk electrum is shared; wire remains explicit. |
| copper rod | Create Crafts & Additions | `MANUFACTURED` | Rod geometry. |
| iron rod | Create Crafts & Additions | `MANUFACTURED` | Rod geometry. |
| gold rod | Create Crafts & Additions | `MANUFACTURED` | Rod geometry. |
| electrum rod | Create Crafts & Additions | `MANUFACTURED` | Rod geometry. |
| brass rod | Create Crafts & Additions | `MANUFACTURED` | Rod geometry; Create owns brass material. |
| copper/gold/electrum spool | Create Crafts & Additions | `MANUFACTURED` | Assembly state, not raw wire. |
| silicon wafer | NuclearCraft | `MANUFACTURED` | Semiconductor geometry/purity state. |
| p-doped / n-doped silicon | NuclearCraft | `PROCESS` + `MANUFACTURED` | Doping state is progression information; never alias to elemental silicon. |
| SiC fibre | NuclearCraft | `MANUFACTURED` | Fibre geometry and composition; distinct from bulk silicon carbide. |

## PneumaticCraft materials and process streams

PneumaticCraft 6.0.23 is pinned in Matterworks. Its material system is process-oriented rather than an ore-material duplicate set, so most entries remain protected until a specific cross-mod chemical identity is proven.

| Material / stream | Status | Policy |
| --- | --- | --- |
| compressed iron ingot/block | `PROCESS` | Pressure/explosion treatment defines the material. Never alias to ordinary iron. |
| plastic / liquid plastic | `PROCESS` | Polymerisation/process stream owned by PneumaticCraft. Do not equate with Mekanism HDPE without explicit chemistry and recipe balance. |
| oil | `PROCESS` | Feedstock mixture, not a pure chemical. |
| LPG | `PROCESS` | Hydrocarbon mixture/state. |
| gasoline | `PROCESS` | Refined fuel mixture. |
| kerosene | `PROCESS` | Refined fuel fraction. |
| diesel | `PROCESS` | Refined fuel fraction. |
| lubricant | `PROCESS` | Formulated process fluid. |
| vegetable oil | `PROCESS` | Biogenic oil mixture. |
| biodiesel | `PROCESS` | Processed fuel mixture. |
| ethanol | `AUDIT` | Name matches ChemLib ethanol, but the exact cross-mod fluid boundary must be checked before global aliasing. |
| yeast culture | `PROCESS` | Biological process fluid, not a pure substance. |
| etching acid | `PROCESS` | Functional mixture; do not alias to a named mineral acid by role alone. |
| glycerol | `AUDIT` | Chemically identifiable molecule, but concrete cross-mod overlap must be verified before adding a global alias. |
| memory essence | `PROCESS` | Mod-specific functional fluid; no chemistry alias. |

## Radioactive and nuclear-state families

The following families are recorded as matrix entries but intentionally excluded from ordinary material unification:

| Family | Status | Policy |
| --- | --- | --- |
| uranium/thorium/polonium/radium parent forms | `PROCESS` | Ordinary Alchemistry Dissolver flattening is blocked before the transmutation tier. |
| isotopes | `PROCESS` | Isotope number is part of identity. |
| irradiated boron/lithium and other irradiated materials | `PROCESS` | Irradiation history is part of identity. |
| reactor fuel | `PROCESS` | Fuel composition/enrichment is part of identity. |
| depleted fuel | `PROCESS` | Burnup/depletion state is part of identity. |
| nuclear waste | `PROCESS` | Waste composition/provenance is preserved. |
| clean/dirty slurries | `PROCESS` | Ore-processing state and cleanliness are explicit. |
| uranium oxide / uranium hexafluoride | `PROCESS` | Nuclear conversion streams; never flatten to generic uranium. |
| molten reactor salts | `PROCESS` | Composition and phase are required. |
| corium | `PROCESS` | Accident-state material. |

## Implemented 0.5.2 gaps

The first material-matrix pass only changes runtime compatibility when identity is already proven and the pinned mods leave a real gap.

### Wheat flour

NuclearCraft's Manufactory produces `nuclearcraft:flour` from wheat seeds. Create defines the common food boundaries `forge:flour` and `forge:flour/wheat` for its `create:wheat_flour`.

Matterworks therefore adds:

```text
nuclearcraft:flour -> forge:flour
nuclearcraft:flour -> forge:flour/wheat
```

This is tag interoperability only. No 1:1 inventory conversion is added, so existing machine yields remain intact.

## Audit queue

The matrix is now the source of truth for future compatibility work. Remaining `AUDIT` entries should be resolved in this order:

1. NuclearCraft vs Mekanism sawdust/wood-dust semantics and production ratios;
2. PneumaticCraft ethanol vs ChemLib ethanol fluid identity;
3. PneumaticCraft glycerol against any chemistry provider added later;
4. Mekanism yellow-cake uranium vs NuclearCraft yellowcake composition/state;
5. graphite provenance and whether a later high-temperature process can provide a controlled bridge;
6. polymer families: PneumaticCraft plastic vs Mekanism HDPE;
7. any newly installed mod that contributes an existing Forge alloy/dust/flour material.

A future mod integration must add its materials here before adding global tags or canonicalization recipes.