# Matterworks Industrial Gases

Version 0.5.x begins treating gases as process streams with explicit origin and separation routes rather than as interchangeable recipe tokens.

## Substance ownership

Matterworks avoids duplicating chemical species that already exist in ChemLib or Mekanism.

- `kubejs:compressed_air` is a Matterworks process mixture, not a pure substance.
- `chemlib:nitrogen_fluid` is the canonical nitrogen fluid for atmospheric/nitrogen chemistry.
- `chemlib:oxygen_fluid` is used as the atmospheric-separation oxygen product.
- Mekanism water electrolysis remains the canonical early hydrogen-production route.
- `mekanism:hydrogen` fluid is obtained from Mekanism hydrogen gas through the Rotary Condensentrator before being fed into the current Haber-Bosch abstraction.
- `chemlib:ammonia_fluid` is the ammonia product.

This split is intentional. A future Matterworks Core chemical abstraction should make fluid/gas representations of one substance interoperable without duplicating the substance itself.

## Atmospheric compression

Atmospheric gas is renewable. The cost should therefore come from compression work, machinery throughput and later electrical power, not from a finite air resource.

Current primitive route:

```text
Atmosphere
   ↓ intake/filter
Mechanical Press + Basin
   ↓ compression work
Compressed Air
```

The recipe uses Create Compacting rather than ordinary Mixing. The Mechanical Press/Basin pair therefore acts as the first mechanical compressor. A reusable Create filter represents the intake/filter stage and is returned unchanged.

This is intentionally an early mechanical implementation. A dedicated electrically driven compressor can supersede it in a later tier without introducing a second compressed-air substance.

`kubejs:compressed_air` is registered as a gaseous, non-placeable Forge fluid. Its bucket uses Forge's dynamic fluid-container model with `flip_gas: true`, so compressed air is represented by the standard upside-down gas bucket rather than an ordinary liquid bucket.

## Air separation

The first air-separation implementation represents pressure-swing adsorption / industrial gas separation rather than chemical conversion.

```text
1000 mB compressed air
        ↓ separation bed
780 mB nitrogen
210 mB oxygen
 ~10 mB inert/trace fraction not recovered
```

The current reusable quartz input is a temporary silica-rich adsorption-bed abstraction. It is not intended to imply that raw quartz by itself is an industrial molecular sieve.

Matterworks Core should eventually model:

- pressure swing / regeneration cycles;
- bed saturation;
- adsorbent chemistry;
- gas purity;
- compressor work;
- cycle timing;
- argon/trace-gas recovery.

## Hydrogen route

Hydrogen is deliberately not sourced from generic elemental transmutation for the first industrial-chemistry tier.

```text
Water
  ↓ Electrolytic Separator
H2 (Mekanism gas)
  ↓ Rotary Condensentrator / process representation bridge
H2 (Mekanism fluid)
```

This keeps the chemistry stage dependent on the graphite-electrode/electrolysis infrastructure established earlier in 0.5.0.

## Haber-Bosch

The first ammonia synthesis follows the stoichiometric basis:

```text
N2 + 3 H2 <-> 2 NH3
```

Current recipe basis:

```text
100 mB N2
300 mB H2
+ iron catalyst
+ heat
    ↓
200 mB NH3
```

The iron dust catalyst has a high return chance rather than being consumed stoichiometrically. This approximates catalyst deactivation until a proper catalyst-lifetime model exists.

The Create heated basin is explicitly a temporary reactor abstraction. It does **not** mean an open basin is a valid Haber-Bosch reactor.

A future Matterworks reactor implementation must include at minimum:

- pressure;
- temperature;
- catalyst activity;
- equilibrium-limited conversion;
- recycle of unreacted N2/H2;
- purge control for inert accumulation;
- heat recovery;
- compressor power;
- process trips outside the operating envelope.

## Progression dependency

```text
Create mechanical power
        ↓
first FE / Mekanism
        ↓
Coke → Graphite
        ↓
Electrolytic Core / Separator
        ↓
Water → H2 + O2
        │
        ├────────────────────────────┐
        │                            │
Atmosphere → mechanical compression → compressed air → N2 + O2
                                             │
                               N2 + H2 + catalyst
                                             ↓
                                          Ammonia
```

This is the first production chain in Matterworks where mechanical engineering, electrical engineering, carbon materials, fluid handling and chemistry are all required by one downstream product.

## Anti-shortcut policy

The intended industrial route must remain economically and progression-wise superior to generic element synthesis.

Alchemistry remains part of Matterworks, but direct elemental synthesis is not intended to replace industrial gas separation or bulk chemical production in this tier. Machine/recipe gating for those transmutation paths will be tightened as the Alchemistry progression layer is implemented.
