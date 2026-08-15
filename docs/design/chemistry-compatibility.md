# Matterworks Chemistry Compatibility Matrix

Matterworks treats chemical identity as a cross-mod contract rather than allowing each mod to create an isolated copy of the same substance.

The integration is deliberately asymmetric. Identical ordinary substances should interoperate; phase, concentration, temperature, isotope composition, irradiation state and nuclear provenance must remain explicit when they are technologically meaningful.

## Ownership boundaries

| Domain | Canonical owner | Rule |
| --- | --- | --- |
| ordinary elements and compounds | ChemLib / Alchemistry | element/compound identity and decomposition/composition |
| nuclear isotopes, radioactive parent materials and fuel states | NuclearCraft: Neoteric | isotopic identity, irradiation, fuel processing and accelerator reactions |
| pressure | PneumaticCraft | pressure is not a Forge process fluid |
| process gas handling | Mekanism | ChemicalStack machinery may exchange equivalent ordinary substances through its Forge-fluid Rotary boundary |
| logistics | AE2 | transports resulting items/fluids without redefining chemistry |

A shared name or formula is not sufficient for an alias. Matterworks only unifies registrations when their process state is intentionally equivalent.

## Compatibility classes

Every cross-mod substance falls into one of four classes:

1. **Exact identity** — safe to share through Forge tags.
2. **Naming alias** — same substance, different registry spelling; normalize explicitly.
3. **Process conversion** — same chemistry but different storage abstraction; use a real machine boundary.
4. **Protected state** — phase/isotope/radiation/concentration carries progression information; never globally alias.

This classification is the rule for future integrations as more mods and recipes are added.

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

`radon` is intentionally excluded even though ChemLib has the element: NuclearCraft owns its radioactive process state.

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

These aliases allow the ChemLib representation to enter NuclearCraft recipes that already consume the corresponding Forge fluid tag.

## ChemLib water-tag sanitation

ChemLib 1.20.1 adds every registered ChemLib chemical fluid to `minecraft:water`. That includes gases, acids and solvents and can make unrelated chemicals satisfy recipes that consume the vanilla water tag.

Matterworks removes the entire `chemlib` namespace from `minecraft:water`:

```js
event.remove('minecraft:water', '@chemlib')
```

This does not remove real H2O. ChemLib/Alchemistry special-case water and use `minecraft:water` directly instead of registering a normal `chemlib:water_fluid`.

No Matterworks compatibility rule may reintroduce generic chemical fluids into `minecraft:water`.

## Ethene / ethylene alias

NuclearCraft and Mekanism use `ethene`; ChemLib uses `ethylene`. Both names refer to C2H4 in this integration.

Matterworks publishes both `forge:ethene` and `forge:ethylene` aliases for:

- `nuclearcraft:ethene`
- `mekanism:ethene`
- `chemlib:ethylene_fluid`

This is a naming alias, not a new conversion recipe.

## Alchemistry Atomizer compatibility

Alchemistry's Atomizer serializer consumes a concrete fluid ID rather than a fluid tag. Its generated recipes therefore only accept the ChemLib-owned fluid registration.

Matterworks mirrors the stock Atomizer stoichiometric interface for verified equivalent NuclearCraft fluids:

```text
500 mB equivalent NuclearCraft fluid
    ->
8 ChemLib chemical units
```

The same bridge is added for supported Mekanism Forge-fluid representations produced by the Rotary Condensentrator.

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
    -> Mekanism ChemicalStack

Mekanism ChemicalStack
    -> Mekanism Rotary Condensentrator
    -> Mekanism fluid
    -> Matterworks Atomizer compatibility
    -> ChemLib chemical
```

Radioactive parent-element fluids are excluded from this bridge.

## Native Mekanism / NuclearCraft process bridges

Mekanism's Rotary Condensentrator already uses Forge fluid tags on the fluid side. NuclearCraft publishes compatible tags for several process streams, so Matterworks does not duplicate those recipes.

Important native boundaries include:

- hydrogen;
- oxygen;
- chlorine;
- ethene;
- sulfur dioxide;
- sulfur trioxide;
- sulfuric acid;
- hydrogen chloride;
- hydrofluoric acid;
- sodium;
- lithium;
- uranium oxide / uranium hexafluoride where the nuclear process graph uses them.

These are still subject to state policy. `hydrogen_chloride` is not aliased to aqueous `hydrochloric_acid`, and sodium/lithium process fluids are not treated as generic room-temperature ChemLib fluids.

## Solid material compatibility

ChemLib and NuclearCraft already generate standard Forge item tags for many pure-element forms such as:

- `forge:ingots/<element>`
- `forge:nuggets/<element>`
- `forge:dusts/<element>`
- `forge:plates/<element>`

Alchemistry's generated Dissolver recipes consume those Forge tags. Consequently, non-nuclear NuclearCraft pure-element ingots/dusts/plates are already valid Alchemistry feedstock where the corresponding tag exists; Matterworks does not duplicate those recipes.

Matterworks only adds missing naming aliases where necessary. The first explicit alias is `aluminum` / `aluminium`, so ChemLib aluminum forms also satisfy NuclearCraft-compatible British-spelling Forge tags.

### Shared compounds that already converge through Forge tags

Verified examples include:

- sodium hydroxide — `forge:dusts/sodium_hydroxide`;
- potassium hydroxide — `forge:dusts/potassium_hydroxide`;
- calcium sulfate — `forge:dusts/calcium_sulfate`.

Because both mods contribute their concrete item to the same tag, machine recipes can already consume either representation. Adding conversion crafting recipes for these materials would only introduce duplicate paths.

### NuclearCraft-only process compounds

Do not fabricate ChemLib equivalents merely to make every NuclearCraft material appear in Alchemistry. Examples currently remaining NuclearCraft-owned include materials such as:

- boron nitride;
- silicon carbide;
- manganese dioxide;
- sodium fluoride / potassium fluoride where no matching ChemLib material exists;
- borax where no matching ChemLib material exists;
- specialized alloys, nuclear salts and irradiated compounds.

They may later receive real chemical synthesis routes if ChemLib contains the necessary constituent chemistry, but they are not aliases by name alone.

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

## Radioactive parent-element boundary

Ordinary Forge item tags create a dangerous special case for radioactive parent elements. NuclearCraft uranium, thorium, polonium and radium forms can match stock Alchemistry Dissolver recipes and be flattened into generic ChemLib element units.

That conversion would erase NuclearCraft-owned nuclear provenance before particle engineering is unlocked.

Matterworks therefore removes the stock Alchemistry Dissolver routes for all generated forms of:

- uranium;
- thorium;
- polonium;
- radium.

The blocked form families are:

- ores;
- dusts;
- ingots;
- plates;
- nuggets;
- storage blocks.

This is intentionally a boundary around the **input side**. Alchemistry Fusion/Fission can still synthesize these elements after the player reaches the post-ring transmutation tier.

Radon is handled similarly on the fluid side: `nuclearcraft:radon` is not added to the ordinary ChemLib Atomizer/Forge-fluid bridge.

## Deliberate non-equivalences

The following substances must NOT be globally aliased even when their names or formulas are related:

| NuclearCraft / Mekanism substance | Do not alias to | Reason |
| --- | --- | --- |
| deuterium | hydrogen | isotope identity is progression-relevant |
| tritium | hydrogen | radioactive isotope and fusion feedstock |
| helium-3 | helium | isotope identity |
| radon | generic ChemLib radon fluid | radioactive process state |
| hot helium | helium | thermal state carries process information |
| liquid hydrogen | hydrogen gas | cryogenic phase is a process boundary |
| liquid helium | helium gas | cryogenic phase is a process boundary |
| liquid nitrogen | nitrogen gas | cryogenic phase is a process boundary |
| liquid oxygen | oxygen gas | cryogenic phase is a process boundary |
| heavy water | water | isotopic composition |
| hydrogen chloride | hydrochloric acid | HCl gas and aqueous acid are not the same process stream |
| sodium hydroxide solution | sodium hydroxide solid | solution concentration/state matters |
| lithium fluoride / beryllium fluoride molten fluids | solid compounds | molten-salt phase matters |
| graphite | generic carbon | allotrope/material role matters |
| irradiated boron/lithium | ordinary boron/lithium | irradiation state is nuclear information |
| isotope/fuel/waste fluids | parent element | nuclear composition must remain explicit |

PneumaticCraft compressed air is also not represented as a generic Forge `compressed_air` fluid. Pressure belongs to the PneumaticCraft network.

## Alchemistry transmutation boundary

Alchemistry generates Fusion recipes for every valid pair of atomic numbers and Fission recipes across essentially the whole periodic table. For example, atomic-number arithmetic can synthesize uranium from lighter elements.

Matterworks keeps this feature, but it is not an early universal resource farm.

Both Alchemistry reactor controllers are now gated behind the NuclearCraft ring-accelerator controller. The resulting order is:

```text
industrial chemistry
    -> linear accelerator
    -> Target Chamber / semiconductor implantation
    -> advanced processor
    -> ring accelerator
    -> Alchemistry Fusion / Fission transmutation
```

The compatibility policy is therefore:

1. ordinary element decomposition/combination remains an Alchemistry concern;
2. isotope production remains a NuclearCraft concern;
3. radioactive parent material may not be flattened through the ordinary Dissolver path;
4. full periodic-table Fusion/Fission is post-ring technology;
5. no generic Forge tag may collapse an isotope into its parent element;
6. no unlimited transmutation loop may become the dominant source of normal bulk resources.

## Next audit classes

The remaining chemistry audit should be handled by class rather than by mod:

1. acids and acid/gas distinctions;
2. hydroxides, salts and solution concentration;
3. molten metals versus ordinary elemental forms;
4. cryogenic liquids and steam quality/pressure tiers;
5. slurries and ore-processing intermediates;
6. fluorides and molten reactor salts;
7. uranium oxide / uranium hexafluoride and other nuclear process streams;
8. isotope/fuel/depleted-fuel/waste fluids;
9. specialized NuclearCraft compounds and alloys;
10. any future PneumaticCraft chemical recipe that crosses the same identity boundary.

Each candidate must be classified as exact identity, naming alias, process conversion or protected state before a recipe/tag is added.

## Runtime validation

After a clean restart verify:

- no `chemlib:*` chemical fluid remains in `minecraft:water`;
- actual `minecraft:water` still works in Alchemistry and Mekanism water recipes;
- ChemLib ordinary oxygen/hydrogen/etc. appear in the expected `forge:<substance>` fluid tags;
- NuclearCraft ordinary tagged recipes accept the ChemLib fluid forms;
- NuclearCraft ordinary fluid forms have Matterworks Atomizer recipes and produce 8 matching ChemLib chemical units per 500 mB;
- `nuclearcraft:radon` has no Matterworks Atomizer bridge and is not injected into ordinary ChemLib gas aliases;
- Mekanism Rotary Condensentrator accepts compatible ChemLib/NuclearCraft fluids for its supported gas types;
- Mekanism gas -> fluid -> Atomizer returns to ChemLib for H2, O2, Cl2, SO2, SO3, H2SO4 and ethene/ethylene;
- ethene/ethylene aliases do not create duplicate or cyclic machine recipes;
- cryogenic fluids, isotopes, heavy water and irradiated fluids remain outside ordinary tags;
- `hydrogen_chloride` is not treated as `hydrochloric_acid`;
- boron dust from ChemLib can enter the NuclearCraft boron melting / diborane chain;
- NuclearCraft U/Th/Po/Ra material forms do not have stock Alchemistry Dissolver routes;
- Alchemistry Fusion/Fission controllers require the NuclearCraft ring accelerator controller;
- NaOH/KOH/CaSO4 shared dust tags expose both mods' forms without duplicate crafting conversions.
