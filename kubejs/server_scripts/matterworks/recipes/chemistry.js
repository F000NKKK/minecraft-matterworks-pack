console.info('[Matterworks] Loading industrial chemistry foundation')

ServerEvents.recipes(event => {
    const graphiteElectrode =
        '#matterworks:materials/electrodes/primitive_electrolysis'

    const primitiveWire =
        '#matterworks:components/wires/primitive'

    const primitiveCapacitor =
        '#matterworks:components/capacitors/primitive'

    event.remove({ id: 'mekanism:electrolytic_core' })

    event.shaped(
        'mekanism:electrolytic_core',
        ['GQG', 'WCW', 'OAO'],
        {
            G: graphiteElectrode,
            Q: 'minecraft:quartz',
            W: primitiveWire,
            C: primitiveCapacitor,
            O: '#forge:ingots/osmium',
            A: '#mekanism:alloys/infused'
        }
    ).id('matterworks:chemistry/electrolysis/electrolytic_core')

    event.remove({ id: 'mekanism:electrolytic_separator' })

    event.shaped(
        'mekanism:electrolytic_separator',
        ['STS', 'CEC', 'STS'],
        {
            S: '#forge:ingots/steel',
            T: 'mekanism:basic_chemical_tank',
            C: 'mekanism:basic_control_circuit',
            E: 'mekanism:electrolytic_core'
        }
    ).id('matterworks:chemistry/electrolysis/electrolytic_separator')

    event.remove({ id: 'mekanism:separator/brine' })

    console.info('[Matterworks] Electrolysis foundation registered: graphite cell -> H2/O2; brine sodium shortcut disabled')
})

const matterworksNuclearCraftAtomizerFluids = [
    'hydrogen', 'helium', 'nitrogen', 'oxygen', 'fluorine', 'neon', 'chlorine', 'argon',
    'carbon_dioxide', 'carbon_monoxide', 'ammonia', 'nitric_oxide', 'nitrogen_dioxide',
    'sulfur_dioxide', 'sulfur_trioxide', 'ethanol', 'mercury', 'hydrochloric_acid',
    'nitric_acid', 'sulfuric_acid'
]

const matterworksMekanismAtomizerFluids = [
    'hydrogen', 'oxygen', 'chlorine', 'sulfur_dioxide', 'sulfur_trioxide', 'sulfuric_acid'
]

ServerEvents.recipes(event => {
    matterworksNuclearCraftAtomizerFluids.forEach(name => {
        event.custom({
            type: 'alchemistry:atomizer',
            group: 'matterworks:atomizer_compat',
            input: { amount: 500, fluid: `nuclearcraft:${name}` },
            result: { count: 8, item: `chemlib:${name}` }
        }).id(`matterworks:chemistry/compat/atomizer/nuclearcraft_${name}`)
    })

    event.custom({
        type: 'alchemistry:atomizer',
        group: 'matterworks:atomizer_compat',
        input: { amount: 500, fluid: 'nuclearcraft:ethene' },
        result: { count: 8, item: 'chemlib:ethylene' }
    }).id('matterworks:chemistry/compat/atomizer/nuclearcraft_ethene')

    matterworksMekanismAtomizerFluids.forEach(name => {
        event.custom({
            type: 'alchemistry:atomizer',
            group: 'matterworks:atomizer_compat',
            input: { amount: 500, fluid: `mekanism:${name}` },
            result: { count: 8, item: `chemlib:${name}` }
        }).id(`matterworks:chemistry/compat/atomizer/mekanism_${name}`)
    })

    event.custom({
        type: 'alchemistry:atomizer',
        group: 'matterworks:atomizer_compat',
        input: { amount: 500, fluid: 'mekanism:ethene' },
        result: { count: 8, item: 'chemlib:ethylene' }
    }).id('matterworks:chemistry/compat/atomizer/mekanism_ethene')

    console.info('[Matterworks] Chemistry compatibility registered: NuclearCraft/Mekanism ordinary fluids -> ChemLib chemical units')
})

const matterworksNuclearOwnedParentElements = ['uranium', 'thorium', 'polonium', 'radium']
const matterworksNuclearOwnedDissolverForms = ['ores', 'dusts', 'ingots', 'plates', 'nuggets', 'storage_blocks']

ServerEvents.recipes(event => {
    matterworksNuclearOwnedParentElements.forEach(element => {
        matterworksNuclearOwnedDissolverForms.forEach(form => {
            event.remove({ id: `alchemistry:dissolver/${form}/${element}` })
        })
    })

    console.info(`[Matterworks] Nuclear chemistry boundary registered: ${matterworksNuclearOwnedParentElements.length * matterworksNuclearOwnedDissolverForms.length} radioactive parent-element Dissolver routes blocked`)
})

ServerEvents.recipes(event => {
    event.remove({ output: 'alchemistry:fission_chamber_controller' })
    event.shaped(
        'alchemistry:fission_chamber_controller',
        ['ECE', 'GAG', 'EDE'],
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
        ['ECE', 'GAG', 'ENE'],
        {
            E: 'kubejs:electromechanical_control_unit',
            C: 'alchemistry:reactor_casing',
            G: 'minecraft:glass',
            A: 'nuclearcraft:ring_accelerator_controller',
            N: 'minecraft:nether_star'
        }
    ).id('matterworks:chemistry/transmutation/fusion_chamber_controller')

    console.info('[Matterworks] Alchemistry Fusion/Fission gated behind NuclearCraft ring-accelerator control hardware')
})
