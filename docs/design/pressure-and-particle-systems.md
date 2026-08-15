# Matterworks Pressure and Particle Systems

Matterworks 0.5.1 introduces a compatibility spike for three systems which can become first-class engineering layers in the pack:

- PneumaticCraft: Repressurized;
- Compressed Creativity;
- NuclearCraft: Neoteric.

The compatibility spike is deliberately separated from progression rewrites. The first gate is a clean runtime with the existing Matterworks stack. Only after that gate passes are recipes and progression allowed to depend on these mods.

## Pinned compatibility-spike versions

| Component | Version | Role in Matterworks |
| --- | --- | --- |
| PneumaticCraft: Repressurized | 6.0.23 for MC 1.20.1 | pressure networks, compressors, pressure/temperature processing |
| Compressed Creativity | 1.20.1-0.2.0 | Create rotation ↔ PneumaticCraft pressure bridge |
| NuclearCraft: Neoteric | 1.20.1-1.2.34 | particle accelerators, isotope/nuclear processing, late-game experimental infrastructure |

Matterworks currently uses Create 6.0.8. Compressed Creativity 0.2.0 declares Create compatibility as `[6.0.4,6.1.0)`, so 6.0.8 satisfies its loader dependency range. Runtime compatibility still has to be validated because a version-range match is not proof that every integration path is bug-free.

## Pressure engineering

Pressure becomes an engineering domain rather than another Forge Energy skin.

Intended architecture:

```text
Create rotation
      ↓
Rotational Compressor
      ↓
PneumaticCraft pressure network
      ├─ pressure storage / transport
      ├─ pressure chamber processing
      ├─ temperature + pressure processing
      └─ atmospheric / chemical process equipment
```

Compressed Creativity is therefore not an independent progression tree. Its primary Matterworks role is to bridge the mechanical era into pressure engineering.

The old 0.5.0 `kubejs:compressed_air` path is retained only as a temporary compatibility baseline during the spike. The rejected Create Press/Compacting representation has been removed. After the spike passes, atmospheric processing should be redesigned around real PneumaticCraft pressure rather than pretending that a Create machine is an air compressor.

## Atmospheric processing target

The desired long-term process is:

```text
Atmosphere
    ↓
mechanical compressor
    ↓
pressurised air network
    ↓
drying / purification
    ↓
pressure-swing or cryogenic separation
    ├─ N2
    ├─ O2
    └─ Ar / trace stream
```

The atmosphere itself is renewable. Cost comes from compressor work, pressure equipment, throughput, separation media, temperature control and later process-control requirements.

Water electrolysis remains a separate route:

```text
H2O
 ↓ Electrolytic Separator
H2 + O2
```

Water does not replace atmospheric processing because it cannot supply nitrogen.

## Particle engineering

NuclearCraft: Neoteric is not being added as a second self-contained nuclear progression tree. Matterworks will selectively use its physical infrastructure, especially particle accelerators and reaction equipment.

Target dependency structure:

```text
Mekanism / power infrastructure
          +
PneumaticCraft / vacuum-pressure engineering
          +
ChemLib / Alchemistry target materials
          +
AE2 material handling
          +
CC:Tweaked control
          ↓
NuclearCraft particle accelerator
          ↓
beam experiments / isotope production / transmutation
```

Accelerator operation should eventually be an experimental control problem rather than a single deterministic crafting recipe.

Potential controlled variables include:

- particle source;
- beam energy;
- beam current;
- RF cavity state;
- magnetic field / beam steering;
- target material and isotope;
- vacuum state;
- radiation;
- thermal load;
- reaction products.

## CC:Tweaked integration target

NuclearCraft already has computer integration in parts of the mod, but Matterworks should expose a stable pack-level API instead of coupling user programs to every underlying mod implementation detail.

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

Matterworks Core can later implement this bridge if the native NuclearCraft peripheral surface is incomplete.

## Progression policy

The three new systems are infrastructure providers, not three new independent mod trees.

Rules:

1. PneumaticCraft recipes that bypass established Matterworks metallurgy, chemistry or electrical progression will be gated or replaced.
2. Compressed Creativity primarily bridges Create mechanical power into pressure engineering.
3. NuclearCraft ore processing and generic machine progression must not replace the existing Matterworks resource-processing graph by default.
4. Accelerator transmutation must remain far more expensive than ordinary mining and chemistry for normal bulk materials.
5. Particle engineering belongs after industrial chemistry and substantial power infrastructure.
6. CC:Tweaked should become increasingly important for safe, efficient and scalable operation of advanced plants.

## Compatibility gate

Before any progression rewrite, perform a full client restart and verify:

- Forge reaches the main menu;
- a world loads successfully;
- Create 6.0.8 remains operational;
- Rotational Compressor and Compressed Air Engine are present;
- PneumaticCraft pressure tubes and compressors are present;
- NuclearCraft accelerator blocks are present;
- existing Mekanism machines still load;
- existing KubeJS scripts produce no new errors;
- no mixin, Flywheel/Create, rendering or registry conflicts appear in `latest.log`.

Only after this gate passes should Matterworks replace the temporary atmospheric-capture recipe and start gating the new mods into the unified progression graph.
