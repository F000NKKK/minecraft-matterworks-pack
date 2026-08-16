# Matterworks Pressure and Particle Systems

Matterworks 0.5.1 promotes pressure engineering and particle physics from compatibility experiments into the unified progression graph.

The integration uses:

- PneumaticCraft: Repressurized for pressure networks and pressure/temperature processing;
- Compressed Creativity as the Create-to-pressure bridge;
- NuclearCraft: Neoteric for accelerator, beam, isotope and semiconductor physics.

These mods provide physical infrastructure. They do not become independent progression trees that can bypass Matterworks metallurgy, chemistry, electrical engineering or resource processing.

## Pinned versions

| Component | Version | Matterworks role |
| --- | --- | --- |
| PneumaticCraft: Repressurized | 6.0.23 for MC 1.20.1 | pressure networks, compressors, pressure/temperature processing |
| Compressed Creativity | 1.20.1-0.2.0 | Create rotation -> PneumaticCraft pressure bridge |
| NuclearCraft: Neoteric | 1.20.1-1.2.34 | particle accelerators, isotope production and late-game experimental infrastructure |
| Create | 6.0.8 | mechanical infrastructure feeding the first pressure tier |

Compressed Creativity 0.2.0 declares Create compatibility as `[6.0.4,6.1.0)`, so Create 6.0.8 is inside its declared loader range.

## Pressure engineering

Pressure is an engineering domain rather than another Forge Energy skin.

Implemented dependency structure:

```text
Create rotation
      |
      v
Compressed Creativity Rotational Compressor
      |
      v
PneumaticCraft pressure network
      |
      +--> pressure storage / transport
      |
      +--> Thermopneumatic Processing Plant
               |
               +--> atmospheric nitrogen separation
               |
               +--> later pressure/temperature chemistry
```

The Rotational Compressor is the initial pressure source. The stock PneumaticCraft Air Compressor is not an early shortcut; in Matterworks it is an upgrade that requires the established pressure tier.

### Atmospheric nitrogen

The 0.5.1 atmospheric path uses real PneumaticCraft pressure:

```text
atmospheric feed
      +
Molecular Sieve Charge
      |
      v
Thermopneumatic PSA step
      |
      +--> 780 mB nitrogen
      |
      +--> oxygen-rich / argon / trace remainder vented at this tier
```

`Molecular Sieve Charge` is a stackable consumable operating cost. It represents adsorbent usage without introducing a refillable cartridge loop before the pack has a reason to model regeneration equipment.

The atmosphere remains renewable, but throughput is constrained by compressor work, pressure equipment and separation media.

Water electrolysis remains a separate route:

```text
H2O
 |
 v
Mekanism Electrolytic Separator
 |
 +--> H2
 |
 +--> O2
```

Electrolysis does not replace atmospheric processing because it cannot provide nitrogen.

A later cryogenic tier may recover oxygen, argon and trace components instead of venting the PSA remainder.

## Particle engineering

NuclearCraft is used selectively for accelerator and reaction physics.

Implemented dependency structure:

```text
Matterworks electrical infrastructure
             |
             v
Particle Focusing Coil
             |
             v
NuclearCraft accelerator casing / beam hardware
             |
             v
linear accelerator + Target Chamber
             |
             v
boron-ion implantation / isotope production
             |
             v
advanced accelerator electronics
             |
             v
ring accelerator
```

Matterworks gates construction of accelerator casing, ion-source ports and beam ports while leaving beam energy, focus, heat, particle transport and multiblock simulation to NuclearCraft.

### Target Chamber resource policy

NuclearCraft ships a broad Target Chamber reaction table. A subset of those reactions converts ordinary bulk resources directly into other ordinary resources.

Matterworks removes 72 stock bulk-material transmutations that would bypass established chemistry, metallurgy or extraction. Examples include nickel -> iron, argon -> chlorine and several metal-to-metal reactions driven by proton, neutron, photon, electron, deuteron or alpha beams.

The policy intentionally preserves reactions that are useful as particle or nuclear engineering rather than resource duplication:

- ordinary feedstock -> isotope or radioisotope;
- isotope/radioisotope feedstock -> another nuclear product;
- spallation and antimatter-production paths;
- radioactive/nuclear by-product production;
- destructive particle reactions with no bulk-resource output;
- semiconductor ion implantation.

The accelerator therefore remains useful for products that are difficult or impossible to obtain by ordinary chemistry, while being intentionally unavailable as a generic bulk-resource converter.

### Real pre-ring semiconductor dependency

No synthetic calibration item is required to prove that the player has built a Target Chamber.

NuclearCraft already provides a physically meaningful semiconductor chain that Matterworks deliberately retains:

```text
silicon wafer
    +
600-energy boron-ion beam
    |
    v
silicon_p_doped
    |
    + hafnium dust
    + basic processor
    + 4 redstone
    |
    v
NuclearCraft Assembler
    |
    v
advanced_processor
    |
    v
Matterworks ring_accelerator_controller recipe
```

The boron-ion Target Chamber recipe is ion implantation: the beam changes the electrical properties of the silicon wafer rather than acting as an arbitrary crafting key.

Because the Matterworks ring-controller recipe retains `nuclearcraft:advanced_processor`, the Target Chamber is a real prerequisite for the ring tier. This dependency comes from a useful production material and remains meaningful outside the controller recipe.

## Progression policy

The pressure and particle systems follow these rules:

1. PneumaticCraft recipes that bypass established Matterworks metallurgy, chemistry or electrical progression are gated or replaced.
2. Compressed Creativity primarily bridges Create mechanical power into pressure engineering.
3. NuclearCraft generic ore processing and machine progression must not replace the existing Matterworks resource-processing graph by default.
4. Accelerator transmutation must not become a competitive source of normal bulk materials.
5. Accelerator-only isotopes, semiconductor processing and nuclear products are valid reasons to build particle infrastructure.
6. Particle engineering belongs after industrial chemistry and substantial power infrastructure.
7. Advanced operation should increasingly require instrumentation and process control rather than only larger crafting recipes.

## CC:Tweaked integration target

Accelerator operation should eventually become a control problem. Matterworks should expose a stable pack-level API rather than forcing automation programs to depend directly on every underlying mod implementation detail.

Conceptual API:

```lua
local accelerator = peripheral.wrap("back")

local state = accelerator.getState()

accelerator.setBeamCurrent(0.15)
accelerator.setTargetEnergy(12.5)
accelerator.enableBeam(true)

if state.vacuum < 0.95 or state.temperature > 700 then
    accelerator.abort()
end
```

Potential controlled variables include:

- particle source;
- target beam energy;
- beam current;
- RF cavity state;
- magnetic field and beam steering;
- target material/isotope;
- vacuum state;
- radiation;
- thermal load;
- reaction products.

Matterworks Core can later provide this bridge if the native NuclearCraft computer surface is incomplete.

## Runtime validation

For the 0.5.1 integration, validate all of the following after a clean restart:

- Forge reaches the main menu and a world loads;
- KubeJS startup/server scripts load with zero failed Matterworks recipes;
- Create 6.0.8 remains operational;
- Rotational Compressor and Compressed Air Engine work;
- PneumaticCraft pressure tubes, compressors and Thermopneumatic Processing Plant work;
- Molecular Sieve Charge is consumed by the PSA nitrogen recipe;
- the PSA recipe produces the expected 780 mB nitrogen stream;
- NuclearCraft linear accelerator and Target Chamber form correctly;
- Particle Focusing Coil recipes resolve correctly;
- the boron-ion silicon-wafer -> p-doped-silicon Target Chamber recipe remains available;
- the p-doped silicon path still produces `nuclearcraft:advanced_processor`;
- `nuclearcraft:ring_accelerator_controller` has the Matterworks recipe;
- blocked bulk Target Chamber routes such as nickel -> iron and argon -> chlorine are absent;
- isotope/radioisotope Target Chamber routes remain available;
- existing Mekanism machines and chemistry remain operational;
- remaining NuclearCraft missing-fluid-tag diagnostics are reviewed separately;
- no Create/Flywheel/mixin/registry failures appear in `latest.log`.
