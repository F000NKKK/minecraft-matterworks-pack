# Matterworks Material Composition

Matterworks 0.5.3 introduces an explicit composition layer on top of the 0.5.2 material registry.

The material matrix answers identity/state compatibility. The composition layer answers what a material is made of and whether that composition may be exposed through Alchemistry's Dissolver without violating progression.

## Composition policies

- `DIRECT`: the material may decompose directly into ChemLib units.
- `PROCESS`: composition is known, but direct Dissolver decomposition is blocked because process history, purity, treatment or technological state is gameplay-relevant.
- `NUCLEAR`: elemental composition is known, but direct decomposition is blocked before nuclear processing/transmutation.
- `MANUFACTURED`: composition follows the underlying bulk material, but geometry must first be normalized by an explicit manufacturing/recycling route.
- `MIXTURE`: the material is a formulation or non-stoichiometric mixture and must not be represented as a fake molecular formula.
- `UNKNOWN`: insufficient evidence for a defensible composition; no Dissolver recipe is generated.

ChemLib/Alchemistry chemical units are used as the pack's abstract stoichiometric scale. The coefficients below are therefore ratios, not claims about Minecraft item mass.

## Direct compositions

| Material | Composition | Policy |
| --- | --- | --- |
| bronze | Cu3Sn | `DIRECT` |
| brass | Cu3Zn | `DIRECT` |
| electrum | AuAg | `DIRECT` |
| shibuichi | Cu3Ag | `DIRECT` |
| tin-silver | Sn3Ag | `DIRECT` |
| lead-platinum | Pb3Pt | `DIRECT` |
| osmiridium | Os3Ir | `DIRECT` |
| zircaloy | Zr7Sn | `DIRECT` pack abstraction |
| carbon-manganese | MnC | `DIRECT` pack abstraction |
| boron nitride | BN | `DIRECT` |
| boron arsenide | BAs | `DIRECT` |
| fluorite | CaF2 | `DIRECT` |
| villiaumite | NaF | `DIRECT` |
| carobbiite | KF | `DIRECT` |
| rhodochrosite | MnCO3 | `DIRECT` |
| magnesium diboride | MgB2 | `DIRECT` |
| silicon carbide | SiC | `DIRECT` |
| tungsten carbide | WC | `DIRECT` |
| lithium manganese dioxide | LiMnO2 | `DIRECT` |
| manganese oxide | MnO | `DIRECT` |
| manganese dioxide | MnO2 | `DIRECT` |
| potassium fluoride | KF | `DIRECT` |
| sodium fluoride | NaF | `DIRECT` |
| potassium iodide | KI | `DIRECT` |
| calcium sulfate | CaSO4 | `DIRECT` |
| sodium hydroxide | NaOH | `DIRECT` |
| potassium hydroxide | KOH | `DIRECT` |
| barium nitrate | BaN2O6 | `DIRECT` |
| graphite | C | `DIRECT` only for NuclearCraft graphite forms; Matterworks progression still controls graphite production |
| pyrolytic carbon | C | `DIRECT` |
| hard carbon | C | `DIRECT` |

## Process/engineering compositions

These compositions are recorded for audit, JEI documentation and future process recipes but are not automatically exposed through a Dissolver.

| Material | Composition model | Policy / reason |
| --- | --- | --- |
| steel | Fe + C | `PROCESS`; grade and carbon fraction matter |
| ferroboron | Fe + B | `PROCESS`; grade is unspecified upstream |
| tough alloy | specialist Ni/Cr/Fe-family engineering alloy | `UNKNOWN` until exact upstream composition is pinned |
| thermoconducting alloy | specialist engineering alloy | `UNKNOWN` |
| zirconium-molybdenum | Zr + Mo | `PROCESS`; grade ratio must be explicit before decomposition |
| extreme alloy | specialist NuclearCraft alloy | `UNKNOWN` |
| HSLA steel | Fe-based microalloy | `MIXTURE`; no fake formula |
| nichrome | Ni + Cr | `PROCESS`; upstream Fe+Cr recipe is invalid and remains quarantined |
| niobium-tin | Nb3Sn target phase | `PROCESS` |
| niobium-titanium | Nb + Ti | `PROCESS`; superconducting grade ratio not yet fixed |
| stainless steel | Fe + Cr + Ni + C family | `MIXTURE`; grade must be selected |
| super alloy | multicomponent high-temperature alloy | `MIXTURE` |
| SiC-SiC CMC | SiC fibre/matrix composite | `MANUFACTURED`; composite architecture is part of identity |
| compressed iron | Fe | `PROCESS`; pressure/explosion treatment is identity |
| refined obsidian | enriched/infused engineered material | `PROCESS` |
| refined glowstone | engineered material | `PROCESS` |
| yellowcake | uranium oxide concentrate mixture | `PROCESS` |
| C-Mn blend | carbon/manganese precursor blend | `MIXTURE` |
| borax | hydrated sodium borate family | `PROCESS`; hydrate state must be pinned |
| irradiated borax | borax-derived irradiated material | `NUCLEAR` |
| baratol | barium-nitrate/TNT formulation | `MIXTURE` |
| tributyl phosphate | C12H27O4P | `PROCESS`; extraction reagent |
| PneumaticCraft plastic | polymer family | `PROCESS`; monomer/polymer identity not globally equivalent to HDPE |
| Mekanism HDPE | polyethylene family | `PROCESS`; polymerisation state is identity |
| crude oil / LPG / gasoline / kerosene / diesel / lubricant | hydrocarbon mixtures | `MIXTURE` |
| biodiesel / vegetable oil | organic mixtures | `MIXTURE` |
| yeast culture / memory essence / etching acid | functional process streams | `MIXTURE` |

## Nuclear parent elements

Uranium, thorium, polonium and radium remain special even though their elemental composition is trivial.

Their ordinary NuclearCraft forms are `NUCLEAR`, not `DIRECT`. A generic Dissolver route would destroy the distinction between ore-derived nuclear material, isotope processing and post-accelerator transmutation. Matterworks therefore keeps the existing block on stock Alchemistry parent-element recipes.

This means `nuclearcraft:uranium_* -> chemlib:uranium` is intentionally **not** a 0.5.3 direct Dissolver recipe. Uranium chemistry will be exposed through the nuclear processing chain instead.

## Rule for new materials

Every new non-element material added to Matterworks must define all of:

1. canonical material/state identity in `material-registry-matrix.md`;
2. composition policy in this document;
3. direct Dissolver recipe only when policy is `DIRECT`;
4. an explicit process route for `PROCESS`, `NUCLEAR` and `MANUFACTURED` materials;
5. no decomposition for `MIXTURE`, `UNKNOWN` or compositionally defective upstream materials until resolved.