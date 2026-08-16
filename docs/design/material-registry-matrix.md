# Matterworks Material Registry Matrix

This is the exhaustive registry-level companion to `material-matrix.md`.

The policy matrix answers **whether two representations may interoperate**. This registry matrix answers a different question: **what materials and technologically relevant forms actually exist in the pinned Matterworks mod set?**

The distinction is mandatory. A material can exist as a dust and ingot while a NuclearCraft recipe asks for a fluid form that no installed mod provides. Such a row is not an interoperability problem; it is a missing process-form problem.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| `EXACT/TAG` | Same substance and same relevant state are already connected by a common tag. |
| `EXACT/GAP` | Identity is proven but tag namespaces are incomplete; Matterworks may add the missing edge. |
| `CANONICAL` | Duplicate concrete solid items may normalize to the chemistry representation without bypassing processing. |
| `OWNER` | One installed mod is authoritative for this material/state. |
| `PROCESS` | Purity, treatment, composition, irradiation, phase or history is part of identity. |
| `MANUFACTURED` | Geometry/assembly is part of identity: plate, wire, rod, spool, fibre, pellet, wafer, etc. |
| `FORM-GAP` | The material exists, but a recipe requires a technological form for which the pinned pack has no provider. Never solve this with an invented alias. |
| `UPSTREAM-DEFECT` | Upstream registry/tag/recipe data is internally inconsistent or compositionally invalid. Quarantine or replace it instead of making it reachable. |
| `AUDIT` | More evidence is required before a global rule is safe. |

## NuclearCraft form semantics

NuclearCraft's `NCMaterial` defaults matter when reading the registry:

- `ore(name)` keeps ore + raw material + dust + ingot + nugget + block + plate + fluid forms unless explicitly restricted;
- `alloy(name)` disables ores/raw material and provides dust + ingot + nugget + block + plate + fluid;
- `dust(name)` provides dust only unless `.fluid(true, ...)` or `.with("gem")` is added;
- `define(...)` clears all default forms and enables exactly the named forms.

This means several materials that look like "one ingot" in JEI actually have a much wider generated form family.

## NuclearCraft: primary ore materials

| Material | Registered NuclearCraft forms | Matrix status | Matterworks policy |
| --- | --- | --- | --- |
| uranium | ore/raw/dust/ingot/nugget/block/plate/fluid | `PROCESS` | Parent nuclear material. Ordinary Dissolver flattening remains blocked before the nuclear/transmutation boundary. |
| thorium | ore/raw/dust/ingot/nugget/block/plate/fluid | `PROCESS` | Parent nuclear material; preserve nuclear provenance. |
| boron | ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element in solid compatibility; isotopes B-10/B-11 remain distinct. |
| silver | ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element; Forge solid forms may interoperate with ChemLib. |
| lead | overworld ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element; radioactive derivatives/waste remain distinct. |
| tin | overworld ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element. |
| zinc | overworld ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element; Create zinc solid forms share standard tags. |
| magnesium | ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element; Mg-24/Mg-26 remain isotope states. |
| lithium | ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` + `PROCESS` | Ordinary Li may unify; Li-6/Li-7 and irradiated lithium may not. |
| cobalt | ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element; Co-60 remains a radioactive isotope state. |
| platinum | nether ore/raw/dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary element; lead-platinum alloy remains separate. |

## NuclearCraft: ordinary elements and elemental engineering feedstocks

| Material | Registered NuclearCraft forms | Matrix status | Notes |
| --- | --- | --- | --- |
| aluminum / aluminium | dust/ingot/nugget/block/plate/fluid | `CANONICAL` + `EXACT/GAP` | US/UK spelling aliases are required for Forge tags. |
| beryllium | dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Ordinary Be; Be-7 remains isotope state. |
| zirconium | dust/ingot/nugget/block/plate/fluid | `CANONICAL` | Elemental Zr, not zircaloy. |
| manganese | dust/ingot/plate/fluid | `CANONICAL` | Elemental Mn; MnO/MnO2 are separate compounds. |
| palladium | dust/ingot/plate/fluid | `CANONICAL` | Ordinary element. |
| copper | dust/plate/fluid | `EXACT/TAG` | Vanilla/Create provide bulk solids; NuclearCraft provides additional process forms. |
| iron | dust/plate/fluid | `EXACT/TAG` | Vanilla provides bulk solids; NuclearCraft fluid participates in metallurgy. |
| gold | dust/fluid | `EXACT/TAG` | Vanilla provides bulk solids. |
| calcium | dust/ingot | `CANONICAL` | Solid element only in NuclearCraft. |
| chromium | dust/ingot | `FORM-GAP` | NuclearCraft recipes request `forge:chromium` fluid but NuclearCraft registers no chromium fluid and the pinned pack has no external provider. |
| erbium | dust | `CANONICAL` | Solid chemistry representation only. |
| hafnium | dust/ingot | `CANONICAL` | Solid element only in NuclearCraft. |
| iridium | dust/ingot | `CANONICAL` | Solid forms; osmiridium recipe can use NuclearCraft's own iridium fluid only if a fluid provider exists elsewhere; audit before enabling. |
| niobium | dust/ingot | `FORM-GAP` | NuclearCraft Nb-Sn/Nb-Ti recipes request `forge:niobium` fluid, currently absent at runtime. |
| osmium | dust/ingot | `FORM-GAP` | Mekanism supplies osmium solid/gas semantics, not the missing Forge molten-fluid tag required by NuclearCraft. |
| potassium | dust/ingot | `CANONICAL` | Ordinary element; hydroxide/fluoride/iodide remain compounds. |
| sodium | dust/ingot + separate liquid sodium process fluid | `PROCESS` | Solid elemental forms and reactor/coolant liquid state must be treated explicitly. Irradiated sodium is distinct. |
| strontium | dust/ingot | `CANONICAL` | Ordinary element; Sr-90 remains isotope state. |
| titanium | dust/ingot | `FORM-GAP` | NuclearCraft alloy recipes request molten titanium, but no pinned provider supplies `forge:titanium` fluid. |
| tungsten | dust/ingot | `CANONICAL` | Elemental W; tungsten carbide is a compound. |
| yttrium | dust/ingot | `CANONICAL` | Ordinary element. |
| ytterbium | dust | `CANONICAL` | Ordinary element. |
| germanium | dust | `CANONICAL` | Ordinary element/semiconductor feedstock. |
| terbium | dust | `CANONICAL` | Ordinary element. |
| samarium | dust | `CANONICAL` | Ordinary element. |
| molybdenum | dust/fluid | `CANONICAL` | NuclearCraft provides a process fluid as well as dust. |
| arsenic | dust/fluid | `CANONICAL` | Elemental As; boron arsenide remains a compound. |
| barium | dust | `CANONICAL` | Elemental Ba; barium nitrate/baratol remain compounds/formulations. |
| bismuth | dust | `CANONICAL` | Elemental Bi; nuclear waste state remains distinct. |
| thallium | dust | `CANONICAL` | Ordinary element. |
| gadolinium | dust | `CANONICAL` | Ordinary element. |
| neodymium | dust | `CANONICAL` | Ordinary element. |
| iodine | dust | `CANONICAL` | Elemental iodine; potassium iodide remains a compound. |
| sulfur | dust/fluid | `EXACT/TAG` | Ordinary sulfur; Alchemistry special Dissolver handling remains authoritative. |
| silicon | gem | `FORM-GAP` | NuclearCraft SiC recipe requests `forge:silicon` fluid; pinned pack has solid silicon but no molten silicon provider. |
| polonium | dust/fluid | `PROCESS` | Radioactive parent element; gated nuclear state. |
| radium | dust | `PROCESS` | Radioactive parent element. |

## NuclearCraft: engineering alloys, ceramics and composites

`standard alloy forms` below means dust + ingot + nugget + block + plate + fluid, as generated by `NCMaterial.alloy`.

| Material | Registered NuclearCraft forms | Matrix status | Matterworks policy |
| --- | --- | --- | --- |
| steel | standard alloy forms | `EXACT/TAG` | Interoperate with Mekanism through Forge form tags; production route remains progression-controlled. |
| bronze | standard alloy forms | `EXACT/TAG` | Interoperate with Mekanism through Forge form tags. |
| electrum | standard alloy forms | `EXACT/TAG` + `MANUFACTURED` | CreateAddition wire/rod/spool remain manufactured states. |
| tough alloy | ingot/plate/dust/fluid | `OWNER` | Nuclear engineering alloy. |
| ferroboron | dust/ingot/fluid/plate | `OWNER` | Fe-B alloy; keep explicit. |
| hard carbon | ingot/plate/dust/fluid | `OWNER` | Engineered carbon material; source recipe is quarantined pending a correct process model. |
| tin-silver | ingot/dust/fluid | `OWNER` | Specialist solder/alloy. |
| thermoconducting alloy | ingot/plate/dust/fluid | `OWNER` | Preserve thermal-engineering identity. |
| zircaloy | ingot/dust/fluid | `OWNER` | Nuclear-grade zirconium alloy, never elemental zirconium. |
| zirconium-molybdenum | ingot/dust/fluid | `OWNER` | Specialist alloy. |
| extreme alloy | ingot/plate/dust/fluid | `OWNER` | NuclearCraft progression alloy. |
| magnesium diboride | ingot/fluid | `OWNER` | MgB2 superconducting compound. |
| manganese oxide | ingot/dust/fluid | `PROCESS` | MnO. Never merge with ChemLib's misleading `manganese_oxide` item, which represents MnO2. |
| manganese dioxide | ingot/dust/fluid | `CANONICAL` | MnO2; Matterworks maps ChemLib's naming collision to this identity. |
| SiC-SiC CMC | ingot/plate/dust/fluid | `OWNER` + `UPSTREAM-DEFECT` | Composite identity is valid, but upstream production recipe lacks any silicon input and is quarantined. |
| lithium manganese dioxide | ingot/dust/fluid/plate | `OWNER` | Electrode/compound material. |
| silicon carbide | ingot/dust/fluid | `OWNER` | SiC ceramic; distinct from SiC-SiC CMC. |
| shibuichi | ingot/dust/fluid | `OWNER` | Cu-Ag alloy. |
| HSLA steel | ingot/plate/dust/fluid | `OWNER` | Distinct from generic steel. |
| lead-platinum | dust/fluid/ingot | `OWNER` | Specialist Pb-Pt alloy. |
| carbon-manganese | dust/fluid/ingot | `OWNER` | Finished alloy/material distinct from `c_mn_blend`. |
| osmiridium | ingot | `OWNER` + `FORM-GAP` | Finished solid exists; upstream molten route needs missing osmium process form. |
| nichrome | ingot | `OWNER` + `UPSTREAM-DEFECT` | Finished solid exists, but upstream recipe incorrectly uses Fe + Cr instead of Ni + Cr. |
| niobium-tin | ingot | `OWNER` + `FORM-GAP` | Finished solid exists; upstream molten route requires absent Nb fluid and does not model Nb3Sn stoichiometry cleanly. |
| niobium-titanium | ingot | `OWNER` + `FORM-GAP` | Finished solid exists; upstream molten route requires absent Nb/Ti fluids and loses half the input volume. |
| stainless steel | ingot | `OWNER` + `FORM-GAP` | Finished solid exists; upstream molten route requires absent Cr fluid. Matterworks will define a specific grade rather than generic "steel + chromium". |
| super alloy | ingot | `OWNER` | Specialist high-temperature alloy; composition route needs explicit Matterworks definition before broad compatibility. |
| tungsten carbide | ingot | `OWNER` | WC compound; not elemental W or carbon. |
| baratol | ingot/dust/fluid | `PROCESS` | Formulated explosive material, not a generic alloy despite upstream material helper. |
| enderium | dust/fluid | `OWNER` | Compatibility material registered by NuclearCraft; no Thermal provider is pinned, so NC is authoritative if used. |
| pyrolytic carbon | ingot/dust | `PROCESS` | Engineered carbon state, distinct from graphite/coke. |
| BSCCO | dust | `OWNER` | High-temperature superconducting ceramic family; never treat as an elemental dust. |

## NuclearCraft: minerals, compounds and process powders

| Material | Registered forms | Matrix status | Policy |
| --- | --- | --- | --- |
| coal | dust | `FORM-GAP` | Upstream Chemical Reactor asks for a `forge:coal` fluid. Matterworks will not invent "molten coal"; steelmaking belongs to the coke/reductant chain. |
| charcoal | dust | `EXACT/TAG` | Biogenic carbon powder; distinct from coke. |
| graphite | ingot/dust/block/plate | `FORM-GAP` + `PROCESS` | Solid graphite exists; several NC recipes ask for a fluid form that no pinned provider supplies. Matterworks graphite provenance remains explicit. |
| obsidian | dust/fluid | `EXACT/TAG` | Solid powder interoperates through `forge:dusts/obsidian`; fluid is a separate high-temperature/process form. |
| diamond | dust | `EXACT/TAG` | Ordinary diamond powder; CreateAddition diamond grit remains abrasive geometry/state. |
| emerald | dust | `EXACT/TAG` | Ordinary mineral powder. |
| lapis | dust/fluid | `EXACT/TAG` | Ordinary mineral material. |
| quartz | dust | `EXACT/TAG` | Ordinary quartz powder. |
| fluorite | dust/gem | `EXACT/TAG` | Shared with Mekanism through Forge mineral tags. |
| end stone | dust | `OWNER` | Mineral/environmental powder, not an elemental material. |
| purpur | dust/fluid | `PROCESS` | Mod-specific material state. |
| rhodochrosite | dust/gem | `OWNER` | Manganese mineral; preserve mineral identity. |
| villiaumite | dust/gem | `OWNER` | Sodium-fluoride mineral source; preserve mineral identity. |
| carobbiite | dust/gem | `OWNER` | Potassium-fluoride mineral source; preserve mineral identity. |
| boron nitride | dust/gem | `OWNER` | BN compound. |
| boron arsenide | dust/gem/fluid | `OWNER` | BAs compound/semiconductor. |
| borax | dust | `PROCESS` | Borate process material. |
| irradiated borax | dust | `PROCESS` | Irradiation state is identity. |
| potassium fluoride | dust | `OWNER` | KF compound. |
| sodium fluoride | dust | `OWNER` | NaF compound. |
| potassium hydroxide | dust/fluid + separate solution | `PROCESS` | Dry/molten and aqueous states are not interchangeable. |
| sodium hydroxide | dust/fluid + separate solution | `PROCESS` | Dry/molten and aqueous states are not interchangeable. |
| calcium sulfate | dust + separate solution | `CANONICAL` + `PROCESS` | Dry CaSO4 may canonicalize to ChemLib; solution remains a process state. |
| barium nitrate | dust/fluid | `CANONICAL` | Same compound as ChemLib solid chemistry representation. |
| potassium iodide | dust/fluid | `OWNER` | KI compound. |
| yellowcake | dust | `PROCESS` | Uranium concentrate; do not unify with Mekanism yellow cake until mass/progression semantics are reconciled. |
| C-Mn blend | dust | `PROCESS` | Precursor mixture, not finished carbon-manganese material. |
| crystal binder | dust | `PROCESS` | Specialist formulation/intermediate. |
| dimensional blend | dust | `PROCESS` | Specialist mixture. |
| energetic blend | dust | `PROCESS` | Specialist mixture. |
| alugentum | dust | `PROCESS` | Specialist NuclearCraft material. |
| tributyl phosphate (TBP) | dust | `PROCESS` | Extraction reagent abstraction. |
| TNT | fluid | `PROCESS` | Process fluid/explosive state; not a general material alias. |

## Organic and food materials

| Material | Providers/forms | Matrix status | Policy |
| --- | --- | --- | --- |
| wheat flour | Create flour; NuclearCraft flour; PneumaticCraft wheat flour | `EXACT/GAP` | Bridge `forge:flour`, `forge:flour/wheat` and legacy `forge:dusts/flour` at tag level only. |
| wheat dough | Create | `OWNER` | Hydrated process state. |
| cinder flour | Create | `PROCESS` | Mineral/nether reagent despite the name; never add to food-flour tags. |
| biomass | CreateAddition biomass/pellet | `PROCESS` + `MANUFACTURED` | Pelletization remains explicit. |
| bio fuel | Mekanism | `PROCESS` | Processed biomass fuel, not raw biomass. |
| cocoa solids | NuclearCraft | `OWNER` | Food process intermediate. |
| cocoa butter | NuclearCraft item/fluid | `PROCESS` | Composition/phase is explicit. |
| roasted cocoa beans | NuclearCraft | `PROCESS` | Thermal state. |
| ground cocoa nibs | NuclearCraft | `PROCESS` | Grinding state. |
| unsweetened chocolate | NuclearCraft item/fluid | `PROCESS` | Formulated food intermediate. |
| gelatin | NuclearCraft item/fluid | `PROCESS` | Organic process material. |
| hydrated gelatin | NuclearCraft fluid | `PROCESS` | Hydration state. |
| chocolate liquor | NuclearCraft fluid | `PROCESS` | Food process stream. |
| dark chocolate | NuclearCraft fluid | `PROCESS` | Formulated process stream. |
| milk chocolate | NuclearCraft fluid | `PROCESS` | Formulated process stream. |
| pasteurized milk | NuclearCraft fluid | `PROCESS` | Thermal treatment state. |
| sugar | NuclearCraft fluid | `PROCESS` | Molten/process representation, not a replacement for solid sugar item. |
| marshmallow | NuclearCraft fluid | `PROCESS` | Food process stream. |
| straw | CreateAddition | `OWNER` | Biomass/fibre. |
| pulp | Create | `PROCESS` | Cellulosic intermediate. |
| cake base / baked cake base | CreateAddition | `PROCESS` | Baking state is explicit. |

## Mekanism process-state families

| Family | Representative materials | Status | Policy |
| --- | --- | --- | --- |
| raw material | osmium/tin/lead/uranium plus vanilla metals | `PROCESS` | Ore feedstock, not finished metal. |
| shard | processed metals | `PROCESS` | Chemical ore-processing stage. |
| crystal | processed metals | `PROCESS` | Purified ore-processing stage. |
| clump | processed metals | `PROCESS` | Ore-processing stage. |
| dirty dust | processed metals | `PROCESS` | Not ordinary `forge:dusts/<metal>`. |
| dirty/clean slurry | processed ores | `PROCESS` | Cleanliness/provenance is identity. |
| enriched carbon/redstone/diamond/obsidian/gold/tin | enrichment products | `PROCESS` | Infusion feedstock states. |
| enriched iron | iron/carbon intermediate | `PROCESS` | Steel precursor, not iron. |
| infused/reinforced/atomic alloy | tiered components | `PROCESS` | Engineered progression items, not generic bulk alloy families. |
| substrate | HDPE precursor | `PROCESS` | Polymer intermediate. |
| HDPE pellet | polymer pellet | `PROCESS` | Polymer state. |
| HDPE rod | polymer geometry | `MANUFACTURED` | Rod geometry remains explicit. |
| yellow cake uranium | uranium concentrate | `AUDIT` | Similar name to NuclearCraft yellowcake, but production ratios and downstream chains differ. |
| refined obsidian | dust/ingot/nugget/block | `PROCESS` | Infusion/refinement state. |
| refined glowstone | ingot/nugget/block | `PROCESS` | Engineered state. |

## Create / Create Crafts & Additions manufactured and process states

| Material/state | Status | Policy |
| --- | --- | --- |
| brass | `OWNER` | Create bulk alloy. |
| andesite alloy | `OWNER` | Mechanical composite. |
| crushed raw iron/gold/copper/zinc | `PROCESS` | Ore-processing intermediates. |
| crushed compat ores (osmium/platinum/silver/tin/lead/uranium/nickel/etc.) | `PROCESS` | Never direct-convert to finished chemistry dust. |
| powdered obsidian | `EXACT/TAG` | Ordinary obsidian powder. |
| rose quartz / polished rose quartz | `PROCESS` | Material and surface-finishing state are explicit. |
| sturdy sheet | `MANUFACTURED` | Engineered plate geometry. |
| diamond grit | `MANUFACTURED` | Abrasive particle-size state, not diamond dust. |
| diamond grit sandpaper | `MANUFACTURED` | Finished abrasive assembly. |
| copper/iron/gold/electrum wire | `MANUFACTURED` | Wire geometry. |
| copper/iron/gold/electrum/brass rod | `MANUFACTURED` | Rod geometry. |
| copper/gold/electrum spool | `MANUFACTURED` | Assembly state. |
| electrum sheet | `EXACT/TAG` + `MANUFACTURED` | Same alloy identity, explicit plate geometry. |
| zinc sheet | `EXACT/TAG` + `MANUFACTURED` | Same element identity, explicit plate geometry. |

## PneumaticCraft process materials and streams

| Material/stream | Status | Policy |
| --- | --- | --- |
| compressed iron | `PROCESS` | Pressure/explosion-treated engineering material; never ordinary iron. |
| plastic / liquid plastic | `PROCESS` | PneumaticCraft polymer family; do not alias to HDPE. |
| crude oil | `PROCESS` | Feedstock mixture. |
| LPG | `PROCESS` | Hydrocarbon mixture. |
| gasoline | `PROCESS` | Refined fuel mixture. |
| kerosene | `PROCESS` | Refined fraction. |
| diesel | `PROCESS` | Refined fraction. |
| lubricant | `PROCESS` | Formulated process fluid. |
| vegetable oil | `PROCESS` | Biogenic mixture. |
| biodiesel | `PROCESS` | Processed fuel. |
| ethanol | `EXACT/TAG` | PNC and ChemLib already meet at `forge:ethanol`. |
| yeast culture | `PROCESS` | Biological process stream. |
| etching acid | `PROCESS` | Functional mixture, not a mineral-acid alias. |
| glycerol | `AUDIT` | Chemically identifiable molecule; no pack-wide concrete owner defined yet. |
| memory essence | `PROCESS` | Mod-specific functional fluid. |
| wheat flour | `EXACT/GAP` | PNC uses legacy `forge:dusts/flour`; Matterworks bridges it to wheat-flour tags. |

## Nuclear / isotope / exotic families

These are intentionally represented as families rather than collapsed into their parent element. Every isotope number and fuel state is part of identity.

| Family/material | Known examples | Status | Policy |
| --- | --- | --- | --- |
| boron isotopes | B-10, B-11 | `PROCESS` | Isotope identity preserved. |
| lithium isotopes | Li-6, Li-7 | `PROCESS` | Isotope identity preserved. |
| uranium isotopes | U-233, U-234, U-235, U-238 | `PROCESS` | Isotope identity preserved. |
| thorium isotopes | Th-230, Th-232 | `PROCESS` | Isotope identity preserved. |
| plutonium isotopes | Pu-238, Pu-239, Pu-241, Pu-242 | `PROCESS` | Isotope identity preserved. |
| americium isotopes | Am-241, Am-242, Am-243 | `PROCESS` | Isotope identity preserved. |
| curium isotopes | Cm-243, Cm-245, Cm-246, Cm-247 | `PROCESS` | Isotope identity preserved. |
| berkelium isotopes | Bk-247, Bk-248 | `PROCESS` | Isotope identity preserved. |
| californium isotopes | Cf-249, Cf-250, Cf-251, Cf-252 | `PROCESS` | Isotope identity preserved. |
| neptunium isotopes | Np-236, Np-237 | `PROCESS` | Isotope identity preserved. |
| protactinium | Pa-231, Pa-233 | `PROCESS` | Radioactive isotope identity. |
| activation/fission products | Be-7, Ca-48, Co-60, Cs-137, Eu-155, Ir-192, Mg-24, Mg-26, Pm-147, Ru-106, Na-22, Sr-90 | `PROCESS` | Do not merge with ordinary parent elements. |
| copernicium-291 | Cn-291 | `PROCESS` | Exotic isotope/material. |
| xenorium-298 | item/fluid/fuel families | `UPSTREAM-DEFECT` | Runtime requests inconsistent tags (`forge:xenorium298`, `forge:xenorium/298_*`) even though generated resources contain `forge:xenorium/298`; keep isolated until namespace repair is explicit. |
| neutronium | ingot | `PROCESS` | Exotic late-game material. |
| corium | block/fluid | `PROCESS` | Reactor accident/melt material. |
| supercold ice | block | `PROCESS` | Cryogenic state. |
| kumanderite | block | `OWNER` | Exotic NuclearCraft material. |
| quantite | item/fluid + advanced process recipes | `PROCESS` | Late-game exotic material; no ordinary chemistry alias. |
| quantite energy | fluid/process family | `PROCESS` | Energy-bearing exotic state, distinct from quantite bulk material. |
| subliquid matter | cryogenic/exotic liquid | `PROCESS` | Exotic phase/state. |
| reactor fuel | many isotope/composition variants | `PROCESS` | Enrichment/composition is identity. |
| depleted fuel | matching spent variants | `PROCESS` | Burnup/depletion is identity. |
| nuclear waste | multiple waste products | `PROCESS` | Waste provenance/composition preserved. |

## Runtime form-gap audit — 2026-08-16 23:22 run

The latest Matterworks runtime validation is clean at the KubeJS recipe layer: all 15 server scripts loaded with no script errors/warnings and the recipe event finished with zero failed recipes. The remaining material errors are emitted later by NuclearCraft when it resolves fluid tags.

Observed missing fluid tags:

```text
forge:xenorium298
forge:xenorium/298_ni
forge:xenorium/298_ox
forge:xenorium/298_za
forge:coal
forge:graphite
forge:chromium
forge:niobium
forge:silicon
forge:titanium
forge:osmium
```

The ordinary-material subset is a `FORM-GAP`, not a missing item identity. NuclearCraft itself registers Cr/Nb/Ti/Os as solid dust/ingot forms and Si as a gem, while its Chemical Reactor recipes request molten/process fluids. ChemLib cannot fill this gap because ChemLib 2.0.19 creates fluid registrations only for chemicals whose native matter state is liquid or gas.

The xenorium subset is different: NuclearCraft does register xenorium-298 fluid resources under `forge:xenorium/298`, while runtime code/recipes also request incompatible spellings. This is tracked as `UPSTREAM-DEFECT` rather than an ordinary form gap.

## Quarantined NuclearCraft molten recipes

Matterworks 0.5.2 removes the following currently non-functional recipes until the high-temperature metallurgy layer is implemented:

| Recipe | Current upstream graph | Disposition | Reason |
| --- | --- | --- | --- |
| `chemical_reactor/coal-iron` | coal fluid + iron fluid -> steel | `REPLACE` | No valid coal fluid exists in the pack; expert steelmaking should consume coke/carbon through an explicit reduction/alloy route. |
| `chemical_reactor/iron-chromium` | Fe + Cr -> nichrome | `REPLACE` | Compositionally wrong: nichrome is a Ni-Cr alloy, not Fe-Cr. |
| `chemical_reactor/steel-chromium` | steel + Cr -> stainless steel | `REPLACE` | Cr fluid is absent and Matterworks should define a specific stainless grade rather than a generic unnamed blend. |
| `chemical_reactor/niobium-tin` | 2 Nb + 1 Sn -> Nb-Sn | `REPLACE` | Missing Nb fluid; intended superconducting phase should be modelled explicitly (e.g. Nb3Sn) rather than preserving arbitrary volume ratios. |
| `chemical_reactor/niobium-titanium` | Nb + Ti -> 0.5 output volume | `REPLACE` | Missing Nb/Ti fluids and upstream recipe violates simple material conservation. |
| `chemical_reactor/silicon-graphite` | Si + C -> SiC | `REIMPLEMENT` | Composition is plausible, but both reactants require an explicit high-temperature process; do not invent molten tags. |
| `chemical_reactor/manganese-graphite` | Mn + C -> carbon-manganese | `REPLACE` | Generic 1:1 abstraction is not a defensible alloy grade for an expert pack. |
| `chemical_reactor/carbon_manganese-titanium` | C-Mn + Ti -> SiC-SiC CMC | `REPLACE` | Compositionally impossible as written: the output contains silicon while the inputs contain none. |
| `chemical_reactor/osmium-iridium` | 3 Os + 1 Ir -> osmiridium | `REIMPLEMENT` | Alloy concept is plausible; missing Os process-fluid form must be solved by metallurgy, not aliasing. |
| `chemical_reactor/graphite-diamond` | graphite + diamond -> hard carbon | `REPLACE` | Mixing two carbon allotropes is not a sufficient hard-carbon production model; use controlled carbonisation/pyrolysis. |

Quarantine is intentionally lossless with respect to currently working gameplay: these recipes cannot execute in the pinned pack because at least one required input fluid tag is unresolved.

## Implemented 0.5.2 compatibility edges

### Wheat flour namespace bridge

```text
create:wheat_flour            -> forge:flour + forge:flour/wheat
nuclearcraft:flour            -> forge:flour + forge:flour/wheat
pneumaticcraft:wheat_flour    -> forge:flour + forge:flour/wheat
forge:flour/wheat             -> forge:dusts/flour
```

No inventory conversion is added, so each mod retains its production yield.

### Ethanol

PneumaticCraft already publishes ethanol through `forge:ethanol`; Matterworks contributes ChemLib ethanol to that same tag. No extra recipe is required.

## Next audit/build order

1. build a real high-temperature metallurgy layer with explicit solid -> molten/process transitions where physically and progression-wise justified;
2. define pack alloy grades/compositions for steel, stainless, nichrome, Nb3Sn/Nb-Ti, osmiridium and advanced composites;
3. repair or isolate xenorium-298 namespace defects without broad aliases;
4. finish NuclearCraft vs Mekanism sawdust provenance/ratio audit;
5. reconcile Mekanism yellow cake vs NuclearCraft yellowcake only if a mass-conserving, non-bypass bridge exists;
6. define graphite production/provenance and high-temperature carbon processing;
7. audit PneumaticCraft plastic vs Mekanism HDPE and glycerol chemistry;
8. require every future mod integration to update this registry matrix before adding global tags or canonicalization recipes.
