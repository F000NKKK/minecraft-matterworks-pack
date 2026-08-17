console.info('[Matterworks] Loading industrial chemistry foundation')

// NOTE: existing chemistry foundation content intentionally preserved by 0.5.3.
// The nuclear atomic-chemistry gate is defined here as an architectural rule:
// Alchemistry Dissolver/Fission/Fusion may not flatten or synthesize nuclear
// materials until the complete Create -> Mekanism -> NuclearCraft technical
// program has been completed. Fuel/isotope/process states remain explicit.

const matterworksNuclearOwnedParentElements = [
    'uranium',
    'thorium',
    'polonium',
    'radium'
]

const matterworksNuclearOwnedDissolverForms = [
    'ores',
    'raw_materials',
    'dusts',
    'ingots',
    'plates',
    'nuggets',
    'storage_blocks'
]

ServerEvents.recipes(event => {
    matterworksNuclearOwnedParentElements.forEach(element => {
        matterworksNuclearOwnedDissolverForms.forEach(form => {
            event.remove({ id: `alchemistry:dissolver/${form}/${element}` })
        })
    })

    console.info(
        `[Matterworks] Nuclear chemistry boundary registered: ${matterworksNuclearOwnedParentElements.length * matterworksNuclearOwnedDissolverForms.length} parent-element Dissolver routes blocked until technical-program completion`
    )

    // Atomic reconstruction must not be usable as a shortcut around NuclearCraft.
    // Chamber recipes are deliberately rebuilt as terminal technologies.
    event.remove({ output: 'alchemistry:fission_chamber_controller' })
    event.shaped(
        'alchemistry:fission_chamber_controller',
        [
            'PCP',
            'NAN',
            'MEM'
        ],
        {
            P: 'create:precision_mechanism',
            C: 'mekanism:ultimate_control_circuit',
            N: 'nuclearcraft:fission_reactor_controller',
            A: 'nuclearcraft:ring_accelerator_controller',
            M: 'mekanism:pellet_polonium',
            E: 'kubejs:electromechanical_control_unit'
        }
    ).id('matterworks:chemistry/transmutation/fission_chamber_controller')

    event.remove({ output: 'alchemistry:fusion_chamber_controller' })
    event.shaped(
        'alchemistry:fusion_chamber_controller',
        [
            'CAC',
            'RFR',
            'ENE'
        ],
        {
            C: 'mekanism:ultimate_control_circuit',
            A: 'nuclearcraft:ring_accelerator_controller',
            R: 'nuclearcraft:accelerator_ring',
            F: 'alchemistry:fission_chamber_controller',
            E: 'kubejs:electromechanical_control_unit',
            N: 'minecraft:nether_star'
        }
    ).id('matterworks:chemistry/transmutation/fusion_chamber_controller')

    console.info('[Matterworks] Atomic transmutation gated behind Create + Mekanism + NuclearCraft program completion')
})
