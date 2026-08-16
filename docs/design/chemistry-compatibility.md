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

Forge tags are the canonical machine boundary for ordinary solid materials. Matterworks does not replace a stock Alchemistry Dissolver recipe when the stock recipe already consumes the correct Forge tag.

For NuclearCraft pure-element forms, compatibility is split into three mechanisms:

1. **Stock Alchemistry Dissolver recipes** remain authoritative for ore, dust, ingot, nugget, plate and storage-block forms that already consume Forge tags.
2. **Matterworks datapack recipes** fill only verified gaps in Alchemistry's generated table:
   - `forge:raw_materials/boron`
   - `forge:raw_materials/silver`
   - `forge:raw_materials/lead`
   - `forge:raw_materials/tin`
   - `forge:raw_materials/zinc`
   - `forge:raw_materials/magnesium`
   - `forge:raw_materials/lithium`
   - `forge:raw_materials/cobalt`
   - `forge:raw_materials/platinum`
   - `forge:gems/silicon`
3. **One-way inventory canonicalization** converts duplicate NuclearCraft concrete bulk forms into the ChemLib-owned equivalent so JEI exposes an explicit normalization path without creating recipe loops.

The stock-equivalent Dissolver yields are preserved:

| Form | ChemLib element units |
| --- | ---: |
| ore | 32 |
| raw material | 16 |
| dust | 16 |
| ingot | 16 |
| nugget | 1 |
| plate | 16 |
| storage block | 144 |
| gem | 16 |

Ores and raw materials are deliberately excluded from shapeless canonicalization. They must enter an ore-processing or Dissolver path rather than being collapsed directly into a finished bulk form.

For elements where ChemLib owns the same manufactured form, NuclearCraft converts directly to that form. Where ChemLib only exposes a dust representation, one ingot/plate/gem-equivalent converts to one dust, nine nuggets convert to one dust, and one storage block converts to nine dusts. The direction is always NuclearCraft -> ChemLib.

Matterworks also normalizes the `aluminum` / `aluminium` spelling boundary so both Forge spellings resolve ordinary aluminum forms.

The solid compatibility table deliberately excludes:

- uranium, thorium, polonium and radium parent-material forms from ordinary decomposition;
- isotopes;
- irradiated materials;
- alloys;
- NuclearCraft-only process compounds;
- graphite and other progression-significant allotropes.

Sulfur retains Alchemistry's stock special Dissolver behavior. Provider-side sulfur dust may canonicalize to the ChemLib concrete dust, but Matterworks does not replace its Dissolver serializer or probabilistic output model.

### Mekanism and Create bulk canonicalization

`material_unification.js` applies the same one-way rule to verified duplicate pure-material forms from other providers.

Current explicit coverage includes:

- Mekanism osmium, tin and lead dust/ingot/nugget/block forms;
- Mekanism iron, copper, gold, lithium and sulfur dust forms;
- Create zinc ingot/nugget/block;
- Create copper, iron and gold sheet -> ChemLib plate;
- nine Create copper nuggets -> one ChemLib copper dust.

Ore, raw-material, Mekanism shard/crystal/clump/dirty-dust stages, Create crushed ores, alloys and engineered Create Crafts & Additions wire/rod/spool states remain outside inventory canonicalization.

### Shared compound dusts

ChemLib and NuclearCraft independently register several ordinary compound dusts. Alchemistry's generated compound-dust Dissolver recipes consume concrete `chemlib:*_dust` inputs rather than Forge tags, so a shared tag alone does not make the NuclearCraft item usable by the stock recipe.

Matterworks therefore does **not** replace the Alchemistry Dissolver serializer. Instead it provides a one-way NuclearCraft -> ChemLib dust canonicalization for the verified identity set, after which the original Alchemistry recipe remains the single decomposition authority.

Current shared compound canonicalizations are:

- `nuclearcraft:sodium_hydroxide_dust` -> `chemlib:sodium_hydroxide_dust`;
- `nuclearcraft:potassium_hydroxide_dust` -> `chemlib:potassium_hydroxide_dust`;
- `nuclearcraft:calcium_sulfate_dust` -> `chemlib:calcium_sulfate_dust`;
- `nuclearcraft:barium_nitrate_dust` -> `chemlib:barium_nitrate_dust`;
- `nuclearcraft:manganese_dioxide_dust` -> `chemlib:manganese_oxide_dust`.

These conversions are intentionally one-way and do not create alternate Dissolver outputs.

### Manganese oxide naming collision

This is a semantic collision, not a harmless spelling alias.

ChemLib names its MnO2 compound `manganese_oxide`; Alchemistry decomposition confirms that one ChemLib molecule produces one manganese and two oxygen units. NuclearCraft separately models `manganese_oxide` and `manganese_dioxide`, and its process graph oxidizes the former with oxygen to produce the latter.

Consequently:

- NuclearCraft `manganese_oxide` remains the MnO process material;
- NuclearCraft `manganese_dioxide` is the equivalent of ChemLib `manganese_oxide` (MnO2);
- `chemlib:manganese_oxide_dust` is removed from `forge:dusts/manganese_oxide`;
- `chemlib:manganese_oxide_dust` is added to `forge:dusts/manganese_dioxide`;
- only `nuclearcraft:manganese_dioxide_dust` canonicalizes to `chemlib:manganese_oxide_dust`.

The original Alchemistry ChemLib dust recipe then performs decomposition. This prevents an already-oxidized ChemLib MnO2 dust from satisfying NuclearCraft recipes that specifically require MnO.

### NuclearCraft-only process compounds

Do not fabricate ChemLib equivalents merely to make every NuclearCraft material appear in Alchemistry. Verified NuclearCraft-owned examples in the pinned versions include:

- potassium iodide;
- boron nitride;
- fluorite;
- borax;
- potassium fluoride;
- sodium fluoride;
- silicon carbide;
- magnesium diboride;
- lithium manganese dioxide;
- boron arsenide;
- tungsten carbide;
- specialized alloys, nuclear salts and irradiated compounds.

They may later receive real chemical synthesis routes where Matterworks intentionally defines the constituent chemistry, but they are not aliases by name alone.

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
- NuclearCraft ordinary ore/dust/ingot/nugget/plate/storage-block forms continue to use stock Alchemistry Forge-tag Dissolver recipes and preserve stock yields;
- the nine Matterworks `forge:raw_materials/*` gap recipes dissolve to 16 matching ChemLib element units;
- `nuclearcraft:silicon_gem` dissolves through the Matterworks `forge:gems/silicon` gap recipe to 16 `chemlib:silicon`;
- one-way NuclearCraft bulk canonicalization is JEI-visible, does not accept ores/raw materials and has no ChemLib -> NuclearCraft reverse recipe;
- Mekanism/Create canonicalization only covers verified ordinary finished forms and does not collapse ore-processing intermediates;
- NuclearCraft osmium/platinum satisfy the Alchemistry reactor-casing recipe and NuclearCraft yttrium/tungsten satisfy the fission/fusion core recipes through Forge tags;
- NuclearCraft sodium hydroxide, potassium hydroxide, calcium sulfate and barium nitrate dusts canonicalize to the matching ChemLib dust and then use the stock Alchemistry compound-dust Dissolver recipe;
- `nuclearcraft:manganese_dioxide_dust` canonicalizes to `chemlib:manganese_oxide_dust` (MnO2) before stock Alchemistry decomposition;
- `chemlib:manganese_oxide_dust` is absent from `forge:dusts/manganese_oxide` and present in `forge:dusts/manganese_dioxide`;
- NuclearCraft manganese-oxide + oxygen -> manganese-dioxide remains a meaningful process and is not short-circuited by tag aliasing;
- sulfur retains its stock special Alchemistry Dissolver behavior;
- boron dust from ChemLib can enter the NuclearCraft boron melting / diborane chain;
- NuclearCraft U/Th/Po/Ra material forms do not have stock Alchemistry Dissolver routes;
- Alchemistry Fusion/Fission controllers require the NuclearCraft ring accelerator controller.
