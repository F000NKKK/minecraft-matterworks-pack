# Matterworks Material Composition

Matterworks keeps material **identity**, **composition** and **process ownership** as separate concepts.

The composition layer answers what a material is made of. It does not automatically grant a Dissolver or Combiner route, and an engineering alloy ratio is not treated as a molecular formula merely because it is convenient to write one down.

## Composition policies

- `DIRECT`: a defensible fixed stoichiometric model exists and direct decomposition is acceptable.
- `PROCESS`: composition is known, but grade, purity, treatment or production history is part of identity.
- `NUCLEAR`: isotope/conversion/irradiation history is progression-relevant and ordinary chemistry must not erase it.
- `MANUFACTURED`: bulk composition is known, but geometry/composite architecture is part of identity.
- `MIXTURE`: formulation or variable-composition material; no fake molecular formula.
- `UNKNOWN`: there is not enough pinned upstream evidence for a defensible composition model.

ChemLib units are Matterworks' abstract stoichiometric scale. Ratios are mass-balance/gameplay grades, not Minecraft item masses or assertions that metallic alloys are discrete molecules.

## Direct composition models

| Material | Matterworks model | Notes |
| --- | --- | --- |
| bronze | Cu3Sn | nominal pack grade |
| brass | Cu3Zn | nominal pack grade |
| electrum | AuAg | nominal pack grade |
| shibuichi | Cu3Ag | nominal pack grade |
| tin-silver | Sn3Ag | nominal pack grade |
| lead-platinum | Pb3Pt | nominal pack grade |
| osmiridium | Os3Ir | nominal pack grade |
| boron nitride | BN | fixed compound |
| boron arsenide | BAs | fixed compound |
| fluorite | CaF2 | fixed compound/mineral model |
| villiaumite | NaF | fixed compound/mineral model |
| carobbiite | KF | fixed compound/mineral model |
| rhodochrosite | MnCO3 | fixed compound/mineral model |
| magnesium diboride | MgB2 | fixed compound |
| silicon carbide | SiC | fixed compound |
| tungsten carbide | WC | fixed compound abstraction |
| lithium manganese dioxide | LiMnO2 | fixed compound abstraction |
| manganese oxide | MnO | fixed compound |
| manganese dioxide | MnO2 | fixed compound |
| potassium fluoride | KF | fixed compound |
| sodium fluoride | NaF | fixed compound |
| potassium iodide | KI | fixed compound |
| calcium sulfate | CaSO4 | fixed compound |
| sodium hydroxide | NaOH | fixed compound; production route still unresolved |
| potassium hydroxide | KOH | fixed compound; production route still unresolved |
| barium nitrate | Ba(NO3)2 | fixed compound |
| graphite | C | allotrope identity retained by production policy |
| pyrolytic carbon | C | carbon chemistry known; process route still separate |
| hard carbon | C | carbon chemistry known; process route still separate |

`DIRECT` only means decomposition is chemically representable. It does not mean Matterworks claims that generic reconstruction is the correct industrial production route.

## Engineering/process materials

| Material | Model | Policy / reason |
| --- | --- | --- |
| steel | Fe + C family | `PROCESS`; carbon fraction and treatment matter |
| ferroboron | Fe + B family | `PROCESS`; upstream grade not pinned |
| tough alloy | upstream specialist alloy | `UNKNOWN`; exact composition not yet defensible |
| thermoconducting alloy | specialist engineering alloy | `UNKNOWN` |
| zirconium-molybdenum | Zr + Mo family | `PROCESS`; grade ratio/process matter |
| extreme alloy | NuclearCraft specialist alloy | `UNKNOWN` |
| HSLA steel | Fe-based microalloy | `MIXTURE` |
| nichrome | Ni-Cr family | `PROCESS`; invalid Fe+Cr shortcut remains quarantined |
| niobium-tin | Nb3Sn target phase | `PROCESS` |
| niobium-titanium | Nb-Ti family | `PROCESS` |
| stainless steel | Fe-Cr-Ni-C family | `MIXTURE`; grade-dependent |
| super alloy | multicomponent high-temperature alloy | `MIXTURE` |
| SiC-SiC CMC | SiC fibre/matrix composite | `MANUFACTURED`; architecture is part of identity |
| compressed iron | Fe | `PROCESS`; pressure/explosion treatment is identity |
| Zircaloy | nominal Zr-Sn engineering grade | `PROCESS`; **not** a direct `Zr7Sn` chemistry shortcut |
| carbon-manganese | carbon/manganese metallurgical blend | `MIXTURE`; **not** a fictitious `MnC` molecule |
| C-Mn blend | carbon/manganese precursor blend | `MIXTURE` |
| borax | hydrated borate family | `PROCESS`; hydrate/process state matters |
| baratol | barium-nitrate/TNT formulation | `MIXTURE` |
| tributyl phosphate | C12H27O4P | `PROCESS`; extraction reagent manufacture is separate |
| PneumaticCraft plastic | polymer family | `PROCESS`; not globally equivalent to HDPE |
| Mekanism HDPE | polyethylene family | `PROCESS`; polymerisation state is identity |
| crude oil / LPG / gasoline / kerosene / diesel / lubricant | hydrocarbon streams | `MIXTURE` |
| vegetable oil / biodiesel | organic process streams | `MIXTURE` |
| yeast culture / memory essence / etching acid | functional process streams | `MIXTURE` |

## Nuclear process states

NuclearCraft 1.2.34 is treated according to the states it actually models. Matterworks does not add a fictional UF6 chain merely because real-world gaseous-diffusion/centrifuge enrichment commonly uses uranium hexafluoride.

The implemented front end is:

```text
uranium dust + oxygen
  -> uranium-oxide fluid
  -> crystallization
  -> yellowcake
  -> isotope separation
  -> U-235 + U-238
  -> LEU fuel fabrication
  -> irradiation/burnup
  -> depleted fuel
  -> reprocessing
```

The following are `NUCLEAR` provenance states:

- `uranium_oxide` — conversion stream before yellowcake crystallization;
- `yellowcake` — prepared uranium feed for isotope separation;
- isotope-specific material identity;
- fabricated reactor fuel;
- irradiated/depleted fuel;
- fission/reprocessing products and waste;
- irradiated borax and other irradiation-owned states.

Generic Alchemistry decomposition/reconstruction must not erase these histories.

## Nuclear parent elements

Uranium, thorium, polonium and radium are also `NUCLEAR` even though their elemental formula is trivial.

Ordinary NuclearCraft U/Th/Po/Ra forms do not receive generic Dissolver routes before the late transmutation programme. This prevents a bulk radioactive feed item from being flattened into ChemLib units and reconstructed around enrichment/irradiation progression.

## 0.5.8 process-backlog rule

A known composition is not permission to assign a material to the nearest existing machine milestone. If the physical production route is not yet represented, the material stays in an explicit `MatterworksBacklogFamilies` entry.

Examples currently include chlor-alkali products, specialist superconducting/refractory alloys, advanced carbon forms, renewable feedstock extraction/bioprocessing and Zircaloy fabrication.

## Rule for new materials

Every new non-element material must define:

1. canonical identity/state in the material registry matrix;
2. composition policy here and in `composition.js`;
3. a direct Dissolver route only when decomposition is defensible;
4. a physical process owner for `PROCESS`, `NUCLEAR` and `MANUFACTURED` states;
5. `MIXTURE`/`UNKNOWN` semantics instead of a fabricated formula when composition is variable or unverified;
6. an explicit backlog owner when the required physical route has not been implemented yet.
