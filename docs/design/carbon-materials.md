# Matterworks Carbon Materials

Matterworks separates carbon materials by origin, processing route and engineering role. A generic `carbon` ingredient is intentionally avoided.

## Stage 0.4.2 scope

The first implemented chain is:

```text
Coal
  │
  └─ coking / destructive distillation
          ↓
         Coke
          ├─ enrichment → Mekanism Enriched Carbon → carbon infusion
          └─ electrical graphitisation → Graphite

Wood / biomass
  ↓
Charcoal
```

Charcoal remains a useful renewable fuel and primitive reductant, but it does not directly replace coke in the industrial steel route.

## Why coal and charcoal are not interchangeable

Coal is a geological fossil feedstock containing fixed carbon, volatile matter, mineral matter and impurities. Metallurgical coke is produced by heating suitable coal in a low-oxygen environment, driving off volatile components and leaving a mechanically strong carbon-rich material.

Charcoal is produced by carbonising biomass. It is chemically carbon-rich and useful as a fuel/reductant, but it has a different origin, structure and industrial behaviour. Matterworks therefore treats `charcoal` and `coke` as separate engineering materials rather than two skins for the same recipe input.

## Material roles

| Role | Backing item | Current use |
| --- | --- | --- |
| `matterworks:materials/carbon/feedstocks/fossil` | Coal | Coke feedstock |
| `matterworks:materials/carbon/feedstocks/biogenic` | Charcoal | Primitive renewable carbon |
| `matterworks:materials/carbon/reductants/metallurgical` | Coke | Industrial carbon / steel route |
| `matterworks:materials/carbon/allotropes/graphite` | Graphite | Electrode/high-temperature precursor |

## Mekanism integration

Default direct carbon-infusion conversions from coal and charcoal are removed.

The default `coal/charcoal -> Enriched Carbon` enriching shortcut is also removed. Enriched Carbon is retained as a Mekanism-native process intermediate, but Matterworks requires Coke as its feedstock.

This changes the steel path from:

```text
coal or charcoal
      ↓
carbon infusion
      ↓
steel
```

to:

```text
coal
 ↓
coking
 ↓
coke
 ↓
enrichment
 ↓
enriched carbon
 ↓
carbon infusion
 ↓
steel
```

The extra step is not intended as arbitrary grind. It establishes a production dependency that later chemistry can expand with coal gas, tar, sulfur compounds and other coking by-products.

## Graphite

Graphite is introduced as a separate carbon allotrope instead of treating coal, charcoal or coke as universal electrode material.

In 0.4.2, Coke → Graphite is represented by a Mekanism Energized Smelter recipe. This is deliberately an abstraction for industrial electrical graphitisation. A later Matterworks Core temperature/process model should replace the simple recipe gate with an actual high-temperature operating envelope.

Future consumers include:

- electrodes;
- high-temperature furnace components;
- electrolysis equipment;
- advanced metallurgy;
- nuclear material processing;
- high-purity graphite chains.

High-purity graphite is intentionally not implemented yet. It belongs to the industrial-chemistry stage, where purification can depend on acids, halogens or other chemical processing rather than another crafting-table step.
