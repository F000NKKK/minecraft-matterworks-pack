console.info('[Matterworks] Loading industrial chemistry foundation')

ServerEvents.recipes(event => {
    const graphiteElectrode =
        '#matterworks:materials/electrodes/primitive_electrolysis'

    const primitiveWire =
        '#matterworks:components/wires/primitive'

    const primitiveCapacitor =
        '#matterworks:components/capacitors/primitive'

    /*
     * ---------------------------------------------------------
     * Electrolytic Core
     * ---------------------------------------------------------
     *
     * Mekanism's default core is intentionally replaced with a recipe
     * that represents an actual electrochemical cell stack:
     *
     * - graphite electrodes;
     * - quartz as an early chemically resistant separator/insulator;
     * - insulated conductors;
     * - an electrical capacitor;
     * - osmium/infused-alloy structural and electrical components.
     *
     * This ties the first serious chemistry machine back into the carbon
     * and electrical material chains established in 0.4.x.
     */

    event.remove({
        id: 'mekanism:electrolytic_core'
    })

    event.shaped(
        'mekanism:electrolytic_core',
        [
            'GQG',
            'WCW',
            'OAO'
        ],
        {
            G: graphiteElectrode,
            Q: 'minecraft:quartz',
            W: primitiveWire,
            C: primitiveCapacitor,
            O: '#forge:ingots/osmium',
            A: '#mekanism:alloys/infused'
        }
    )
        .id('matterworks:chemistry/electrolysis/electrolytic_core')

    /*
     * ---------------------------------------------------------
     * Electrolytic Separator
     * ---------------------------------------------------------
     *
     * The separator is now an industrial machine assembled around the
     * electrochemical core rather than an early iron/redstone appliance.
     * Chemical tanks represent independent product-gas handling for the
     * two electrolysis outputs.
     */

    event.remove({
        id: 'mekanism:electrolytic_separator'
    })

    event.shaped(
        'mekanism:electrolytic_separator',
        [
            'STS',
            'CEC',
            'STS'
        ],
        {
            S: '#forge:ingots/steel',
            T: 'mekanism:basic_chemical_tank',
            C: 'mekanism:basic_control_circuit',
            E: 'mekanism:electrolytic_core'
        }
    )
        .id('matterworks:chemistry/electrolysis/electrolytic_separator')

    /*
     * ---------------------------------------------------------
     * Water electrolysis
     * ---------------------------------------------------------
     *
     * Mekanism's native water-separation recipe is deliberately retained:
     * it consumes water and produces hydrogen and oxygen in the correct
     * 2:1 product ratio for H2O electrolysis.
     *
     * We gate the PROCESS through machine construction instead of replacing
     * a chemically reasonable recipe with artificial extra intermediates.
     */

    /*
     * ---------------------------------------------------------
     * Brine electrolysis correction
     * ---------------------------------------------------------
     *
     * Mekanism's aqueous brine recipe directly emits sodium metal and
     * chlorine. That shortcut is not suitable for Matterworks.
     *
     * Metallic sodium will later require molten-salt electrolysis, while
     * aqueous brine belongs to a chlor-alkali process producing chlorine,
     * hydrogen and sodium hydroxide.
     */

    event.remove({
        id: 'mekanism:separator/brine'
    })

    console.info(
        '[Matterworks] Electrolysis foundation registered: graphite cell -> H2/O2; brine sodium shortcut disabled'
    )
})

const matterworksNuclearCraftAtomizerFluids = [
    'hydrogen',
    'helium',
    'nitrogen',
    'oxygen',
    'fluorine',
    'neon',
    'chlorine',
    'argon',
    'carbon_dioxide',
    'carbon_monoxide',
    'ammonia',
    'nitric_oxide',
    'nitrogen_dioxide',
    'sulfur_dioxide',
    'sulfur_trioxide',
    'ethanol',
    'mercury',
    'hydrochloric_acid',
    'nitric_acid',
    'sulfuric_acid'
]

const matterworksMekanismAtomizerFluids = [
    'hydrogen',
    'oxygen',
    'chlorine',
    'sulfur_dioxide',
    'sulfur_trioxide',
    'sulfuric_acid'
]

ServerEvents.recipes(event => {
    /*
     * Alchemistry's Atomizer consumes a concrete fluid ID rather than a
     * fluid tag. Stock recipes therefore accept ChemLib fluids only.
     *
     * Alchemistry generates every liquid/gas chemical conversion with the
     * same interface: 500 mB fluid -> 8 ChemLib chemical units. Mirror that
     * interface for verified equivalent NuclearCraft process fluids.
     *
     * Radioactive parent-element fluids such as radon are intentionally not
     * mirrored: converting them into ordinary ChemLib units would erase the
     * NuclearCraft-owned nuclear state boundary.
     */
    matterworksNuclearCraftAtomizerFluids.forEach(name => {
        event.custom({
            type: 'alchemistry:atomizer',
            group: 'matterworks:atomizer_compat',
            input: {
                amount: 500,
                fluid: `nuclearcraft:${name}`
            },
            result: {
                count: 8,
                item: `chemlib:${name}`
            }
        }).id(`matterworks:chemistry/compat/atomizer/nuclearcraft_${name}`)
    })

    event.custom({
        type: 'alchemistry:atomizer',
        group: 'matterworks:atomizer_compat',
        input: {
            amount: 500,
            fluid: 'nuclearcraft:ethene'
        },
        result: {
            count: 8,
            item: 'chemlib:ethylene'
        }
    }).id('matterworks:chemistry/compat/atomizer/nuclearcraft_ethene')

    /*
     * Mekanism's stock Rotary Condensentrator already uses forge:<name>
     * fluid tags for its fluid -> gas direction. The tags registered by
     * materials/tags.js therefore let ChemLib and NuclearCraft fluids enter
     * Mekanism without duplicate rotary recipes.
     *
     * Gas -> fluid produces Mekanism's concrete fluid, so add the reverse
     * Atomizer edge here for the overlapping ordinary chemicals.
     */
    matterworksMekanismAtomizerFluids.forEach(name => {
        event.custom({
            type: 'alchemistry:atomizer',
            group: 'matterworks:atomizer_compat',
            input: {
                amount: 500,
                fluid: `mekanism:${name}`
            },
            result: {
                count: 8,
                item: `chemlib:${name}`
            }
        }).id(`matterworks:chemistry/compat/atomizer/mekanism_${name}`)
    })

    event.custom({
        type: 'alchemistry:atomizer',
        group: 'matterworks:atomizer_compat',
        input: {
            amount: 500,
            fluid: 'mekanism:ethene'
        },
        result: {
            count: 8,
            item: 'chemlib:ethylene'
        }
    }).id('matterworks:chemistry/compat/atomizer/mekanism_ethene')

    console.info(
        '[Matterworks] Chemistry compatibility registered: NuclearCraft/Mekanism ordinary fluids -> ChemLib chemical units'
    )
})

const matterworksNuclearOwnedParentElements = [
    'uranium',
    'thorium',
    'polonium',
    'radium'
]

const matterworksNuclearOwnedDissolverForms = [
    'ores',
    'dusts',
    'ingots',
    'plates',
    'nuggets',
    'storage_blocks'
]

ServerEvents.recipes(event => {
    /*
     * ---------------------------------------------------------
     * Nuclear parent-element boundary
     * ---------------------------------------------------------
     *
     * Alchemistry generates generic Dissolver recipes from Forge material
     * tags. NuclearCraft's U/Th/Po/Ra forms therefore become valid inputs and
     * can be flattened into ChemLib element units, losing their nuclear
     * provenance/state before the player reaches particle engineering.
     *
     * Keep ordinary element interoperability, but do not let the Dissolver
     * erase NuclearCraft-owned radioactive parent materials. Alchemistry can
     * still synthesize those elements later through its post-ring Fusion /
     * Fission tier.
     */
    matterworksNuclearOwnedParentElements.forEach(element => {
        matterworksNuclearOwnedDissolverForms.forEach(form => {
            event.remove({
                id: `alchemistry:dissolver/${form}/${element}`
            })
        })
    })

    console.info(
        `[Matterworks] Nuclear chemistry boundary registered: ${matterworksNuclearOwnedParentElements.length * matterworksNuclearOwnedDissolverForms.length} radioactive parent-element Dissolver routes blocked`
    )
})

ServerEvents.recipes(event => {
    /*
     * ---------------------------------------------------------
     * Alchemistry transmutation boundary
     * ---------------------------------------------------------
     *
     * Stock Alchemistry generates Fusion for essentially every valid pair of
     * atomic numbers and Fission across the periodic table. Once NuclearCraft
     * pure-element forms are connected through Forge tags, leaving the stock
     * reactor controllers cheap would let atomic-number arithmetic bypass the
     * accelerator/nuclear progression entirely (for example Ne + Pb -> U).
     *
     * Keep Alchemistry's transmutation graph, but make both reactor types a
     * post-ring-accelerator technology. The real NuclearCraft ring controller
     * is consumed as the field/RF-control subsystem; no artificial unlock
     * token is introduced.
     */
    event.remove({ output: 'alchemistry:fission_chamber_controller' })
    event.shaped(
        'alchemistry:fission_chamber_controller',
        [
            'ECE',
            'GAG',
            'EDE'
        ],
        {
            E: 'kubejs:electromechanical_control_unit',
            C: 'alchemistry:reactor_casing',
            G: 'minecraft:glass',
            A: 'nuclearcraft:ring_accelerator_controller',
            D: 'minecraft:glowstone_dust'
        }
    ).id('matterworks:chemistry/transmutation/fission_chamber_controller')

    event.remove({ output: 'alchemistry:fusion_chamber_controller' })
    event.shaped(
        'alchemistry:fusion_chamber_controller',
        [
            'ECE',
            'GAG',
            'ENE'
        ],
        {
            E: 'kubejs:electromechanical_control_unit',
            C: 'alchemistry:reactor_casing',
            G: 'minecraft:glass',
            A: 'nuclearcraft:ring_accelerator_controller',
            N: 'minecraft:nether_star'
        }
    ).id('matterworks:chemistry/transmutation/fusion_chamber_controller')

    console.info(
        '[Matterworks] Alchemistry Fusion/Fission gated behind NuclearCraft ring-accelerator control hardware'
    )
})
