# Matterworks Material System

Matterworks treats a material as an engineering capability, not merely as a crafting ingredient.

The same nominal form (wire, plate, core, dielectric, coolant, catalyst) can exist at multiple technological levels with different suitability. Recipes should therefore consume semantic material roles whenever possible instead of hard-coding one concrete mod item.

## Design goals

1. **No universal material.** A cheap early material must eventually become unsuitable for advanced equipment.
2. **Properties drive progression.** Conductivity, dielectric strength, temperature tolerance, magnetic behaviour, corrosion resistance and chemical compatibility are progression constraints.
3. **Substitution is explicit.** A recipe may accept several materials only when they satisfy the same engineering role.
4. **Chemistry matters.** Advanced material roles should increasingly require chemical processing rather than direct crafting.
5. **Automation does not erase engineering.** AE2 and CC:Tweaked automate valid processes; they do not bypass material requirements.

## Material role tags

KubeJS exposes semantic item tags under the `matterworks:` namespace.

Current primitive roles:

| Tag | Current backing material | Meaning |
| --- | --- | --- |
| `matterworks:materials/conductors/copper` | Create Crafts & Additions copper wire | Primitive copper conductor |
| `matterworks:materials/dielectrics/primitive` | Paper | Low-grade dielectric layer |
| `matterworks:materials/impregnants/primitive` | Honeycomb | Wax impregnation / moisture protection |
| `matterworks:materials/magnetic_cores/primitive` | Create iron sheet | Primitive magnetic core material |
| `matterworks:components/wires/primitive` | Matterworks insulated copper wire | Low-power insulated conductor |
| `matterworks:components/coils/primitive` | Matterworks electromagnetic coil | Primitive electromechanical winding |
| `matterworks:components/capacitors/primitive` | Create Crafts & Additions capacitor | Primitive electrical capacitor |

These mappings are implementation details. Downstream recipes should normally depend on the role tag, not the backing item ID.

## Planned property families

### Conductors

- electrical conductivity
- current capacity
- resistive heating
- oxidation/corrosion behaviour
- practical operating temperature

Initial progression:

`Copper -> improved copper processing -> aluminium / specialised conductors -> advanced alloys`

### Dielectrics and insulation

- dielectric strength
- maximum continuous temperature
- moisture resistance
- chemical resistance
- flexibility

Initial progression:

`Waxed paper -> natural rubber -> vulcanised rubber -> polyethylene -> specialised high-temperature polymer`

Primitive waxed insulation must remain useful for the first electrical era, but it must not qualify for later high-power/high-temperature components.

### Magnetic materials

- permeability
- coercivity
- hysteresis losses
- saturation behaviour
- high-frequency suitability

Initial progression:

`Processed iron -> soft magnetic iron -> silicon steel -> specialised magnetic alloys`

The current iron-sheet core is deliberately classified as primitive. It is not intended to remain valid for all motors, transformers and generators.

### Carbon materials

Planned progression:

`Charcoal -> coke -> graphite -> high-purity graphite`

These forms will become important for metallurgy, electrodes, high-temperature processing and later nuclear/material-science chains.

## Recipe policy

Recipes should prefer semantic role tags when the engineering role matters.

Example:

```js
const magneticCore = '#matterworks:materials/magnetic_cores/primitive'
```

instead of:

```js
const magneticCore = 'create:iron_sheet'
```

This lets the material model evolve without turning the entire recipe tree into a collection of concrete mod IDs.

## Future Matterworks Core integration

KubeJS tags are the first implementation of the material model. The long-term `Matterworks Core` mod may attach actual engineering properties to materials and machines, allowing runtime constraints such as:

- cable overheating under excessive current;
- insulation failure above its rated temperature/voltage;
- magnetic-core losses at unsuitable frequency/load;
- corrosion or contamination in incompatible chemical processes;
- process controllers exposing those measurements through CC:Tweaked.

The tag system should remain useful even after those runtime properties exist: tags express recipe compatibility, while Matterworks Core expresses operating behaviour.
