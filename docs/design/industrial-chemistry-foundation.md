# Matterworks Industrial Chemistry Foundation

Matterworks treats chemistry as a process-engineering system rather than a set of unrelated machine recipes.

Version 0.5.0 establishes the first hard boundary between electrical engineering, materials science and industrial chemistry: electrolysis.

## 0.5.0 scope

The implemented production dependency is:

```text
Coal
  ↓
Coke
  ↓
Graphite
  ↓
Graphite electrodes
  +
Primitive electrical components
  +
Osmium / infused alloy
  ↓
Electrolytic Core
  ↓
Electrolytic Separator
  ↓
Water electrolysis
  ├─ Hydrogen
  └─ Oxygen
```

This makes the first industrial gas-production process depend on infrastructure built in earlier stages instead of making chemistry an independent parallel progression tree.

## Water electrolysis

The native Mekanism water-separation process is retained because its product ratio is already appropriate for the pack:

```text
2 H2O -> 2 H2 + O2
```

Matterworks gates the process through the construction and materials of the electrolyzer rather than adding meaningless intermediate crafting items.

Hydrogen and oxygen are foundation feedstocks, not progression endpoints. Planned consumers include reduction chemistry, oxidation, combustion/process heat, synthesis chemistry and later laboratory/research systems.

## Electrodes

Graphite becomes the first explicit electrochemical electrode material.

The semantic tags are:

```text
matterworks:materials/electrodes/graphite
matterworks:materials/electrodes/primitive_electrolysis
```

At present both resolve to `kubejs:graphite`, but the role distinction matters. Future electrode systems may accept several materials with different operating envelopes.

Planned engineering properties include:

- current density;
- electrode consumption;
- chemical compatibility;
- oxidation resistance;
- maximum operating temperature;
- overpotential / process efficiency.

These properties are documentation-level constraints for now and are intended to become runtime behaviour in Matterworks Core later.

## Brine is not sodium metal

Mekanism's default separator recipe simplifies aqueous brine into sodium and chlorine. Matterworks disables that route.

The pack will distinguish two different industrial processes:

### Aqueous chlor-alkali

Conceptual chemistry:

```text
2 NaCl + 2 H2O -> Cl2 + H2 + 2 NaOH
```

This route belongs to industrial chemical production and should eventually require brine purification and separated anode/cathode products.

### Metallic sodium

Metallic sodium must not be produced from aqueous brine. It will require a later high-temperature molten-salt electrolysis route.

This distinction is important because Matterworks progression should follow the physical process constraints whenever those constraints create meaningful engineering decisions.

## Planned 0.5.x chemistry progression

The next chemistry milestones are:

```text
0.5.0  Electrolysis foundation
       water -> hydrogen + oxygen

0.5.x  Atmospheric processing
       air -> nitrogen-rich / oxygen-rich streams -> purified gases

0.5.x  Nitrogen chemistry
       N2 + H2 -> ammonia

0.5.x  Chlor-alkali chemistry
       purified brine -> chlorine + hydrogen + sodium hydroxide

0.5.x  Polymer chemistry
       chemical feedstocks -> improved electrical insulation
```

The exact machinery will be selected so that chemistry, Create process equipment, Mekanism gases, Alchemistry/ChemLib materials and CC:Tweaked control form one production system rather than several disconnected mods.

## Design rule

A new process step is justified only when it represents at least one of:

- a real material transformation;
- a separation operation;
- an operating-condition requirement;
- a meaningful equipment boundary;
- a purity or compatibility requirement;
- a control/automation problem.

Extra plates, casings or intermediate items that exist only to increase click count are not progression.
