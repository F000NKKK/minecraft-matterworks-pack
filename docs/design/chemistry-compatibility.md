# Matterworks Chemistry Compatibility Matrix

Matterworks treats chemical identity as a cross-mod contract rather than allowing each mod to create an isolated copy of the same substance.

## Ownership boundaries

| Domain | Canonical owner | Rule |
| --- | --- | --- |
| ordinary elements and compounds | ChemLib / Alchemistry | element/compound identity and decomposition/composition |
| nuclear isotopes and radioactive fuel states | NuclearCraft: Neoteric | isotopic identity, fuel processing, irradiation and accelerator reactions |
| pressure | PneumaticCraft | pressure is not a Forge process fluid |
| process gas handling | Mekanism | ChemicalStack machinery may exchange equivalent ordinary substances through its Forge-fluid Rotary boundary |
| logistics | AE2 | transports the resulting items/fluids without redefining chemistry |

The compatibility layer uses Forge tags only when two registrations represent the same chemical substance in the same process phase. Similar names are not enough.

## Ordinary fluid equivalence

ChemLib registers its chemical fluids as concrete IDs such as `chemlib:oxygen_fluid`, but it does not publish per-substance `forge:<name>` fluid tags. NuclearCraft and Mekanism recipes rely heavily on those Forge tags.

Matterworks therefore adds the ChemLib form to the corresponding Forge tag for these verified ordinary substances:

### Elemental / atmospheric gases

- hydrogen
- helium
- nitrogen
- oxygen
- fluorine
- neon
- chlorine
- argon
- radon

### Molecular process gases

- carbon dioxide
- carbon monoxide
- ammonia
- nitric oxide
- nitrogen dioxide
- sulfur dioxide
- sulfur trioxide

### Ordinary liquids / acids

- ethanol
- mercury
- hydrochloric acid
- nitric acid
- sulfuric acid

### Ethene / ethylene alias

NuclearCraft and Mekanism use `ethene`; ChemLib uses `ethylene`. Both names refer to C2H4 in this integration.

Matterworks publishes both `forge:ethene` and `forge:ethylene` aliases for:

- `nuclearcraft:ethene`
- `mekanism:ethene`
- `chemlib:ethylene_fluid`

This is a naming alias, not a new conversion recipe.

## Alchemistry Atomizer compatibility

Alchemistry's Atomizer serializer consumes a concrete fluid ID rather than a fluid tag. Its generated recipes therefore only accept the ChemLib-owned fluid registration.

Matterworks mirrors the stock Atomizer stoichiometric interface for equivalent NuclearCraft fluids:

```text
500 mB equivalent NuclearCraft fluid
    ->
8 ChemLib chemical units
```

The same bridge is added for Mekanism Forge-fluid representations that can be produced by the Rotary Condensentrator.

This closes both directions without inventing duplicate substances:

```text
ChemLib chemical
    -> Alchemistry Liquifier
    -> ChemLib fluid
    -> forge:<chemical>
    -> NuclearCraft recipe

ChemLib / NuclearCraft fluid
    -> forge:<chemical>
    -> Mekanism Rotary Condensentrator
    -> Mekanism gas

Mekanism gas
    -> Mekanism Rotary Condensentrator
    -> Mekanism fluid
    -> Matterworks Atomizer compatibility
    -> ChemLib chemical
```

## Solid material compatibility

ChemLib and NuclearCraft already generate standard Forge item tags for many pure-element forms such as:

- `forge:ingots/<element>`
- `forge:nuggets/<element>`
- `forge:dusts/<element>`
- `forge:plates/<element>`

Alchemistry's generated Dissolver recipes consume those Forge tags. Consequently, NuclearCraft pure-element ingots/dusts/plates are already valid Alchemistry feedstock where the corresponding tag exists; Matterworks does not duplicate those recipes.

Matterworks only adds missing naming aliases where necessary. The first explicit alias is `aluminum` / `aluminium`, so ChemLib aluminum forms also satisfy NuclearCraft-compatible British-spelling Forge tags.

## Accelerator chemistry bridge

The accelerator chain deliberately uses ordinary chemistry as feedstock instead of inventing accelerator-only key items.

One important verified path is:

```text
Alchemistry / ChemLib boron
    -> forge:dusts/boron
    -> NuclearCraft Melter
    -> forge:boron process fluid
             +
       forge:hydrogen
    -> NuclearCraft Chemical Reactor
    -> diborane
    -> NuclearCraft boron-ion source
    -> Target Chamber silicon implantation
    -> p-doped silicon
    -> advanced processor
    -> ring accelerator tier
```

This means atmospheric/electrolytic hydrogen and Alchemistry-derived boron participate directly in particle-engineering progression.

## Deliberate non-equivalences

The following substances must NOT be globally aliased even when their names or formulas are related:

| NuclearCraft / Mekanism substance | Do not alias to | Reason |
| --- | --- | --- |
| deuterium | hydrogen | isotope identity is progression-relevant |
| tritium | hydrogen | radioactive isotope and fusion feedstock |
| helium-3 | helium | isotope identity |
| hot helium | helium | thermal state carries process information |
| liquid hydrogen | hydrogen gas | cryogenic phase is a process boundary |
| liquid helium | helium gas | cryogenic phase is a process boundary |
| liquid nitrogen | nitrogen gas | cryogenic phase is a process boundary |
| liquid oxygen | oxygen gas | cryogenic phase is a process boundary |
| heavy water | water | isotopic composition |
| hydrogen chloride | hydrochloric acid | HCl gas and aqueous acid are not the same process stream |
| sodium hydroxide solution | sodium hydroxide solid | solution concentration/state matters |
| lithium fluoride / beryllium fluoride molten fluids | solid ChemLib compounds | molten-salt phase matters |
| graphite | generic carbon | allotrope/material role matters |
| irradiated boron/lithium | ordinary boron/lithium | irradiation state is nuclear information |
| isotope/fuel/waste fluids | parent element | nuclear composition must remain explicit |

PneumaticCraft compressed air is also not represented as a generic Forge `compressed_air` fluid. Pressure belongs to the PneumaticCraft network.

## Alchemistry transmutation risk

Fluid/material interoperability exposes a separate progression issue: Alchemistry generates Fusion recipes for every valid pair of atomic numbers and Fission recipes across essentially the whole periodic table.

For example, stock Alchemistry can synthesize uranium by combinations whose atomic numbers sum to 92. That is chemically useful as a late-game transmutation model but it must not bypass Matterworks nuclear progression.

The compatibility policy is therefore:

1. ordinary element decomposition/combination remains an Alchemistry concern;
2. isotope production remains a NuclearCraft concern;
3. actinide/radioactive-element synthesis must be gated behind particle/nuclear infrastructure before the compatibility PR can leave draft;
4. no generic Forge tag may collapse an isotope into its parent element;
5. no unlimited transmutation loop may become the dominant source of normal bulk resources.

The exact Fusion/Fission progression gate is tracked as part of the 0.5.1 runtime/balance audit rather than being hidden inside a fluid alias.

## Runtime validation

After a clean restart verify:

- ChemLib oxygen/hydrogen/etc. appear in the expected `forge:<substance>` fluid tags;
- NuclearCraft ordinary tagged recipes accept the ChemLib fluid forms;
- NuclearCraft fluid forms have Matterworks Atomizer recipes and produce 8 matching ChemLib chemical units per 500 mB;
- Mekanism Rotary Condensentrator accepts compatible ChemLib/NuclearCraft fluids for its supported gas types;
- Mekanism gas -> fluid -> Atomizer returns to ChemLib for H2, O2, Cl2, SO2, SO3, H2SO4 and ethene/ethylene;
- ethene/ethylene aliases do not create duplicate or cyclic machine recipes;
- cryogenic fluids, isotopes, heavy water and irradiated fluids remain outside ordinary tags;
- `hydrogen_chloride` is not treated as `hydrochloric_acid`;
- boron dust from ChemLib can enter the NuclearCraft boron melting / diborane chain;
- no unexpected recipe accepts `minecraft:water` solely because ChemLib upstream marks all of its chemical fluids with the water tag;
- Alchemistry Fusion/Fission does not bypass the intended nuclear progression once the nuclear gate is implemented.
