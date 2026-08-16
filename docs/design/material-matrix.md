# Matterworks Material Matrix

Matterworks treats material identity as a first-class integration contract.

This document extends the chemistry compatibility rules beyond pure ChemLib elements. It covers alloys, mineral powders, organic powders, manufactured shapes, nuclear intermediates and process fluids supplied by the pinned Matterworks 0.5.x mod set.

The matrix is intentionally conservative: two items are interchangeable only when they represent the same material **and** the same technologically relevant state. Similar names are not enough.

## Status model

| Status | Meaning |
| --- | --- |
| `EXACT/TAG` | Same material and state; an existing common tag is the interoperability boundary. |
| `EXACT/GAP` | Same material and state, but the pinned mods use incomplete or incompatible tag namespaces; Matterworks supplies only the missing tag edge. |
| `CANONICAL` | Duplicate concrete items may normalize one-way to a selected representation when doing so cannot bypass processing. |
| `PROCESS` | Composition, treatment, purity, irradiation, temperature or process history is meaningful. Never globally alias. |
| `MANUFACTURED` | Wire, rod, spool, sheet, pellet, fibre or another manufactured shape. Material identity may be shared, but the shape remains explicit. |
| `OWNER` | The material currently has one authoritative provider in the installed mod set. No compatibility bridge is required. |
| `AUDIT` | Plausible overlap exists, but composition/state has not been proven sufficiently for a global rule. |

`EXACT/TAG` is preferred over inventory conversion. Matterworks adds shapeless canonicalization only when a concrete-item serializer/JEI boundary requires one and the conversion cannot bypass a technological stage.

## Canonical ownership rules

| Domain | Canonical owner / boundary |
| --- | --- |
| pure ordinary elements and ordinary molecular compounds | ChemLib / Alchemistry |
| ordinary bulk alloys with several providers | Forge form tags; no forced concrete owner unless a serializer requires one |
| Create mechanical materials | Create |
| NuclearCraft specialist alloys, salts and nuclear materials | NuclearCraft: Neoteric |
| Mekanism enrichment / ore-processing states | Mekanism |
| PneumaticCraft compressed iron, polymers and petrochemical process streams | PneumaticCraft |
| Matterworks progression materials such as coke and pack graphite | Matterworks |
| manufactured wire/rod/spool/fibre states | producing mod; material identity does not erase geometry |

## Common metals, alloys and engineering materials

| Material | Providers / forms | Status | Policy |
| --- | --- | --- | --- |
| steel | NuclearCraft dust/ingot/nugget/block/plate/fluid; Mekanism dust/ingot/nugget/block | `EXACT/TAG` | Standard Forge steel form tags are authoritative. |
| bronze | NuclearCraft dust/ingot/nugget/block/plate/fluid; Mekanism dust/ingot/nugget/block | `EXACT/TAG` | Standard Forge bronze form tags are authoritative. |
| electrum | NuclearCraft bulk forms; Create Crafts & Additions ingot/nugget/sheet/wire/rod/spool | `EXACT/TAG` + `MANUFACTURED` | Bulk forms share material identity; CA wire/rod/spool keep their manufactured state. |
| brass | Create ingot/nugget/sheet; Create Crafts & Additions rod | `OWNER` + `MANUFACTURED` | Create owns the bulk alloy; brass rod remains a rod. |
| andesite alloy | Create bulk item/block | `OWNER` | Mechanical composite, not a generic chemical alloy. |
| tough alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Specialist nuclear engineering alloy. |
| ferroboron | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Specialist alloy; not iron or boron substitute. |
| hard carbon | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Engineered carbon material, distinct from coal/coke/graphite. |
| tin-silver | NuclearCraft dust/ingot/fluid | `OWNER` | Specialist alloy. |
| thermoconducting alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Preserve engineered alloy identity. |
| zircaloy | NuclearCraft dust/ingot/fluid | `OWNER` | Nuclear-grade zirconium alloy; distinct from elemental zirconium. |
| zirconium-molybdenum | NuclearCraft dust/ingot/fluid | `OWNER` | Specialist alloy. |
| extreme alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | NuclearCraft progression alloy. |
| SiC-SiC CMC | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Ceramic-matrix composite; not generic silicon carbide. |
| lithium manganese dioxide | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Compound/electrode material. |
| silicon carbide | NuclearCraft dust/ingot/fluid | `OWNER` | Ceramic compound; distinct from SiC-SiC CMC. |
| shibuichi | NuclearCraft dust/ingot/fluid | `OWNER` | Copper-silver alloy. |
| HSLA steel | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Not generic steel. |
| osmiridium | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Osmium-iridium alloy. |
| nichrome | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Nickel-chromium resistance alloy. |
| niobium-tin | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Superconducting/intermetallic material. |
| niobium-titanium | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Superconducting alloy. |
| stainless steel | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Distinct from generic steel. |
| super alloy | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Specialist high-temperature alloy. |
| tungsten carbide | NuclearCraft dust/ingot/plate/fluid | `OWNER` | Carbide, not elemental tungsten/carbon. |
| magnesium diboride | NuclearCraft ingot/fluid | `OWNER` | Compound/superconductor. |
| lead-platinum | NuclearCraft dust/ingot/fluid | `OWNER` | Specialist alloy. |
| carbon-manganese | NuclearCraft dust/ingot/fluid | `OWNER` | Finished material distinct from `c_mn_blend`. |
| aluminum / aluminium | NuclearCraft; ChemLib; Forge spelling variants | `EXACT/TAG` + `CANONICAL` | Both spellings resolve ordinary elemental aluminum. |
| beryllium | NuclearCraft; ChemLib | `CANONICAL` | Ordinary elemental identity follows pure-element policy. |
| zirconium | NuclearCraft; ChemLib | `CANONICAL` | Ordinary element only; never collapse zircaloy into it. |
| manganese | NuclearCraft; ChemLib | `CANONICAL` | Ordinary element only; oxides remain compounds. |
| compressed iron | PneumaticCraft ingot/block | `PROCESS` | Pressure/explosion-treated material; never alias to ordinary iron. |
| refined obsidian | Mekanism dust/ingot/nugget/block | `PROCESS` | Infusion/refinement is material state. |
| refined glowstone | Mekanism ingot/nugget/block | `PROCESS` | Engineered state, not glowstone dust. |

## Mineral and inorganic powders

| Material | Providers / forms | Status | Policy |
| --- | --- | --- | --- |
| obsidian powder | Create powdered obsidian; Mekanism/NuclearCraft obsidian dust | `EXACT/TAG` | `forge:dusts/obsidian` is authoritative. |
| quartz dust | Mekanism; NuclearCraft | `EXACT/TAG` | Use `forge:dusts/quartz`. |
| diamond dust | Mekanism; NuclearCraft | `EXACT/TAG` | Use `forge:dusts/diamond`; diamond grit remains separate. |
| emerald dust | Mekanism; NuclearCraft | `EXACT/TAG` | Use `forge:dusts/emerald`. |
| lapis dust | Mekanism; NuclearCraft | `EXACT/TAG` | Shared ordinary mineral powder. |
| coal dust | Mekanism; NuclearCraft | `EXACT/TAG` | Pulverized fossil-carbon feedstock; not coke/graphite. |
| charcoal dust | Mekanism; NuclearCraft | `EXACT/TAG` | Pulverized biogenic charcoal; not metallurgical coke. |
| sulfur dust | Mekanism; NuclearCraft; ChemLib | `EXACT/TAG` | Ordinary sulfur identity; Alchemistry special Dissolver behavior remains authoritative. |
| lithium dust | Mekanism; NuclearCraft/ChemLib | `EXACT/TAG` + `CANONICAL` | Ordinary elemental lithium only. |
| fluorite | NuclearCraft gem/dust; Mekanism gem/dust | `EXACT/TAG` | Shared mineral identity through Forge gem/dust tags. |
| salt / sodium chloride | NuclearCraft salt; Mekanism salt | `EXACT/TAG` | Dry salt shares the Forge salt-dust boundary; brine/solutions remain separate. |
| sawdust / wood dust | NuclearCraft sawdust; Mekanism sawdust | `AUDIT` | Mekanism publishes wood dust; NuclearCraft production/provenance must be verified before global aliasing. |
| rhodochrosite | NuclearCraft dust/gem | `OWNER` | Mineral feedstock; do not flatten into manganese chemistry implicitly. |
| villiaumite | NuclearCraft dust/gem | `OWNER` | Mineral source; preserve mineral identity. |
| carobbiite | NuclearCraft dust/gem | `OWNER` | Mineral source; preserve mineral identity. |
| boron nitride | NuclearCraft dust/gem | `OWNER` | Compound, not elemental B/N. |
| boron arsenide | NuclearCraft dust | `OWNER` | Compound semiconductor. |
| borax | NuclearCraft dust | `OWNER` | Borate process material; irradiated borax remains separate. |
| potassium fluoride | NuclearCraft dust | `OWNER` | Compound salt. |
| sodium fluoride | NuclearCraft dust | `OWNER` | Compound salt. |
| calcium sulfate | NuclearCraft + ChemLib dust | `CANONICAL` | One-way NuclearCraft -> ChemLib concrete dust canonicalization. |
| sodium hydroxide | NuclearCraft + ChemLib dust | `CANONICAL` | One-way dust canonicalization; aqueous solution remains distinct. |
| potassium hydroxide | NuclearCraft + ChemLib dust | `CANONICAL` | One-way dust canonicalization. |
| barium nitrate | NuclearCraft + ChemLib dust | `CANONICAL` | One-way dust canonicalization. |
| manganese oxide (MnO) | NuclearCraft dust/ingot/fluid | `PROCESS` | Keep separate from ChemLib's misleading `manganese_oxide` name. |
| manganese dioxide (MnO2) | NuclearCraft; ChemLib `manganese_oxide` | `CANONICAL` | Matterworks maps ChemLib's name to the dioxide identity. |
| potassium iodide | NuclearCraft dust | `OWNER` | Compound process material. |
| iodine | NuclearCraft/ChemLib | `CANONICAL` | Ordinary element only. |
| barium | NuclearCraft/ChemLib | `CANONICAL` | Ordinary element only. |
| bismuth | NuclearCraft/ChemLib | `CANONICAL` | Ordinary element only; nuclear waste remains protected. |
| neodymium | NuclearCraft/ChemLib | `CANONICAL` | Ordinary elemental dust. |

## Organic, food and biomass materials

| Material | Providers / forms | Status | Policy |
| --- | --- | --- | --- |
| wheat flour | Create `wheat_flour`; NuclearCraft `flour`; PneumaticCraft `wheat_flour` | `EXACT/GAP` | Create uses `forge:flour` + `forge:flour/wheat`; PneumaticCraft uses `forge:dusts/flour`; NuclearCraft lacks the common food tags. Matterworks bridges all three namespaces without concrete conversion. |
| wheat dough | Create dough | `OWNER` | Hydrated food state, not flour. |
| cinder flour | Create cinder flour | `PROCESS` | Nether/mineral reagent; never enter food-flour tags. |
| biomass | Create Crafts & Additions biomass/pellet | `PROCESS` + `MANUFACTURED` | Biomass feedstock; pelletization is explicit geometry/state. |
| bio fuel | Mekanism bio fuel | `PROCESS` | Processed biomass fuel; not raw biomass. |
| cocoa solids | NuclearCraft | `OWNER` | Food-processing intermediate. |
| cocoa butter | NuclearCraft | `OWNER` | Food-processing intermediate. |
| roasted cocoa beans | NuclearCraft | `PROCESS` | Thermal-treatment state. |
| ground cocoa nibs | NuclearCraft | `PROCESS` | Ground intermediate. |
| unsweetened chocolate | NuclearCraft | `PROCESS` | Formulated intermediate. |
| gelatin | NuclearCraft | `OWNER` | Organic process material. |
| straw | Create Crafts & Additions | `OWNER` | Biomass/fibre material. |
| pulp | Create | `PROCESS` | Cellulosic process intermediate. |
| cake base | Create Crafts & Additions | `PROCESS` | Food-processing intermediate. |
| baked cake base | Create Crafts & Additions | `PROCESS` | Thermal state distinct from unbaked base. |

## NuclearCraft process powders and mixtures

These are matrix entries specifically so broad "dust compatibility" cannot accidentally flatten them.

| Material | Status | Policy |
| --- | --- | --- |
| yellowcake | `PROCESS` | Uranium concentrate; never alias to uranium dust. |
| C-Mn blend (`c_mn_blend`) | `PROCESS` | Precursor mixture; distinct from finished carbon-manganese material. |
| crystal binder | `PROCESS` | Specialist formulation/intermediate. |
| dimensional blend | `PROCESS` | Specialist mixture. |
| energetic blend | `PROCESS` | Specialist mixture. |
| irradiated borax | `PROCESS` | Irradiation history is part of identity. |
| alugentum | `PROCESS` | Specialist NuclearCraft material. |
| baratol | `PROCESS` | Formulated material. |
| tributyl phosphate / TBP | `PROCESS` | Extraction reagent; not constituent elements. |
| graphite | `PROCESS` | NuclearCraft and Matterworks graphite are chemically related carbon allotrope materials, but progression currently keeps production provenance explicit. |
| pyrolytic carbon | `PROCESS` | Engineered carbon state. |
| corium | `PROCESS` | Reactor accident/melt material. |
| neutronium | `PROCESS` | Exotic late-game material. |

## Mekanism processing states

| Family | Examples | Status | Policy |
| --- | --- | --- | --- |
| raw ore material | raw osmium/tin/lead/uranium etc. | `PROCESS` | Ore feedstock; never direct-canonicalize to finished dust/ingot. |
| shard | metal shards | `PROCESS` | Chemical ore-processing stage. |
| crystal | metal crystals | `PROCESS` | Purified ore-processing stage. |
| clump | metal clumps | `PROCESS` | Ore-processing stage. |
| dirty dust | metal dirty dusts | `PROCESS` | Not ordinary Forge metal dust. |
| clean/dirty slurry | ore slurries | `PROCESS` | Cleanliness and ore provenance are explicit. |
| enriched carbon/redstone/diamond/obsidian/gold/tin | enrichment products | `PROCESS` | Enrichment state, not source material. |
| enriched iron | steel precursor | `PROCESS` | Not ordinary iron. |
| infused alloy | Mekanism tiered component | `PROCESS` | Engineered progression item. |
| reinforced alloy | Mekanism tiered component | `PROCESS` | Engineered progression item. |
| atomic alloy | Mekanism tiered component | `PROCESS` | Engineered progression item. |
| substrate | HDPE precursor | `PROCESS` | Polymer-production intermediate. |
| HDPE pellet | polymer pellet | `PROCESS` | Polymer material state. |
| HDPE rod/stick | manufactured polymer shape | `MANUFACTURED` | Geometry remains explicit. |
| yellow cake uranium | nuclear concentrate | `AUDIT` | Do not equate with NuclearCraft yellowcake until composition/process equivalence is demonstrated. |
| dirty netherite scrap | contaminated process material | `PROCESS` | Processing contamination state. |

## Create and Create Crafts & Additions states

| Material/state | Status | Policy |
| --- | --- | --- |
| crushed raw iron/gold/copper/zinc | `PROCESS` | Create ore-processing intermediates. |
| crushed osmium/platinum/silver/tin/lead/uranium/nickel/etc. | `PROCESS` | Compat crushed-ore state; never direct-convert to finished ChemLib dust. |
| powdered obsidian | `EXACT/TAG` | Ordinary pulverized obsidian in `forge:dusts/obsidian`. |
| sturdy sheet | `MANUFACTURED` | Obsidian plate/engineered sheet. |
| diamond grit | `MANUFACTURED` | Abrasive grit; not generic diamond dust. |
| diamond grit sandpaper | `MANUFACTURED` | Finished abrasive tool/composite. |
| rose quartz | `PROCESS` | Create material; not vanilla quartz dust. |
| polished rose quartz | `PROCESS` | Surface-finished state. |
| copper/iron/gold/electrum wire | `MANUFACTURED` | Material identity does not erase wire geometry. |
| copper/iron/gold/electrum/brass rod | `MANUFACTURED` | Rod geometry remains explicit. |
| copper/gold/electrum spool | `MANUFACTURED` | Assembly state, not raw wire. |
| electrum sheet | `MANUFACTURED` + `EXACT/TAG` | Same electrum material as plate, explicit sheet/plate geometry. |
| zinc sheet | `MANUFACTURED` + `EXACT/TAG` | Same zinc material, explicit sheet/plate geometry. |

## PneumaticCraft materials and streams

PneumaticCraft 6.0.23 is pinned in Matterworks. It publishes several process streams through explicit Forge tags; those tags are accepted when they name a chemically exact substance, while functional mixtures remain protected.

| Material / stream | Status | Policy |
| --- | --- | --- |
| compressed iron ingot/block | `PROCESS` | Pressure/explosion treatment defines the material; not ordinary iron. |
| plastic / liquid plastic | `PROCESS` | PneumaticCraft polymer family; do not equate with Mekanism HDPE without a polymer audit. |
| crude oil | `PROCESS` | Feedstock mixture. |
| LPG | `PROCESS` | Hydrocarbon mixture/state. |
| gasoline | `PROCESS` | Refined fuel mixture. |
| kerosene | `PROCESS` | Refined fuel fraction. |
| diesel | `PROCESS` | Refined fuel fraction. |
| lubricant | `PROCESS` | Formulated process fluid. |
| vegetable oil | `PROCESS` | Biogenic oil mixture. |
| biodiesel | `PROCESS` | Processed fuel mixture. |
| ethanol | `EXACT/TAG` | PneumaticCraft publishes `pneumaticcraft:ethanol` through `forge:ethanol`; Matterworks already contributes `chemlib:ethanol_fluid` to the same tag. No extra recipe is needed. |
| yeast culture | `PROCESS` | Biological process fluid, not a pure substance. |
| etching acid | `PROCESS` | Functional mixture; do not alias to a mineral acid by role/name. |
| glycerol | `AUDIT` | Chemically identifiable molecule, but no current cross-provider canonical owner is established. |
| memory essence | `PROCESS` | Mod-specific functional fluid. |
| wheat flour | `EXACT/GAP` | PneumaticCraft exposes `pneumaticcraft:wheat_flour` as `forge:dusts/flour`; Matterworks bridges this older namespace to Create's wheat-flour tags. |

## Radioactive and nuclear-state families

| Family | Status | Policy |
| --- | --- | --- |
| uranium/thorium/polonium/radium parent forms | `PROCESS` | Ordinary Alchemistry Dissolver flattening is blocked before transmutation. |
| isotopes | `PROCESS` | Isotope number is identity. |
| irradiated boron/lithium and other irradiated materials | `PROCESS` | Irradiation history is identity. |
| reactor fuel | `PROCESS` | Fuel composition/enrichment is identity. |
| depleted fuel | `PROCESS` | Burnup/depletion state is identity. |
| nuclear waste | `PROCESS` | Waste composition/provenance is preserved. |
| uranium oxide / uranium hexafluoride | `PROCESS` | Nuclear conversion streams; never flatten to generic uranium. |
| molten reactor salts | `PROCESS` | Composition and phase are required. |
| corium | `PROCESS` | Accident-state material. |

## Implemented 0.5.2 compatibility edges

### Wheat flour namespace bridge

The pinned mods expose three concrete wheat-flour representations through two incompatible Forge tag conventions:

```text
Create:
    create:wheat_flour -> forge:flour + forge:flour/wheat

NuclearCraft:
    nuclearcraft:flour (wheat-derived Manufactory output)

PneumaticCraft:
    pneumaticcraft:wheat_flour -> forge:dusts/flour
```

Matterworks bridges the identity at the tag layer:

```text
nuclearcraft:flour           -> forge:flour
nuclearcraft:flour           -> forge:flour/wheat
pneumaticcraft:wheat_flour   -> forge:flour
pneumaticcraft:wheat_flour   -> forge:flour/wheat
forge:flour/wheat            -> forge:dusts/flour
```

No inventory conversion is added. Each mod keeps its original production yield and recipe balance.

### PneumaticCraft ethanol

No Matterworks-specific conversion is required. PneumaticCraft already publishes ethanol through `forge:ethanol`, and the chemistry compatibility layer already contributes ChemLib ethanol to that exact tag. This is therefore a resolved `EXACT/TAG` edge.

## Audit queue

Remaining uncertain overlaps should be resolved in this order:

1. NuclearCraft vs Mekanism sawdust/wood-dust provenance and production ratios;
2. Mekanism yellow-cake uranium vs NuclearCraft yellowcake composition/state;
3. graphite provenance and whether a later high-temperature process should provide a controlled bridge;
4. polymer families: PneumaticCraft plastic vs Mekanism HDPE;
5. PneumaticCraft glycerol against future chemistry-provider molecules;
6. any newly installed mod contributing an existing alloy/dust/flour family.

A future mod integration must add its materials here before adding global tags or canonicalization recipes.
