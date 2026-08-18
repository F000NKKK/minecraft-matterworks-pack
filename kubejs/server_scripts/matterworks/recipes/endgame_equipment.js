ServerEvents.recipes(event => {
    const reactorFrame = 'kubejs:reactor_grade_frame'
    const particleMatrix = 'kubejs:particle_confinement_matrix'
    const fusionCore = 'kubejs:fusion_field_core'
    const singularityCore = 'kubejs:quantum_singularity_core'

    event.shaped(reactorFrame, ['PCP', 'RFR', 'PCP'], {
        P: 'mekanism:pellet_polonium',
        C: 'mekanismgenerators:fission_reactor_casing',
        R: 'nuclearcraft:fission_reactor_casing',
        F: 'nuclearcraft:fission_reactor_controller'
    }).id('matterworks:endgame/reactor_grade_frame')

    event.shaped(particleMatrix, ['PAP', 'SRS', 'PAP'], {
        P: 'kubejs:particle_focusing_coil',
        A: 'mekanism:pellet_antimatter',
        S: 'ae2:singularity',
        R: 'nuclearcraft:ring_accelerator_controller'
    }).id('matterworks:endgame/particle_confinement_matrix')

    event.shaped(fusionCore, ['ANA', 'FCF', 'ANA'], {
        A: 'mekanism:pellet_antimatter',
        N: 'minecraft:nether_star',
        F: 'mekanismgenerators:fusion_reactor_controller',
        C: 'alchemistry:fusion_chamber_controller'
    }).id('matterworks:endgame/fusion_field_core')

    event.shaped(singularityCore, ['RPR', 'FSF', 'RPR'], {
        R: reactorFrame,
        P: particleMatrix,
        F: fusionCore,
        S: 'ae2:singularity'
    }).id('matterworks:endgame/quantum_singularity_core')

    const extremeOutputs = [
        'mekanism:mekasuit_helmet',
        'mekanism:mekasuit_bodyarmor',
        'mekanism:mekasuit_pants',
        'mekanism:mekasuit_boots',
        'mekanism:meka_tool',
        'mekanism:atomic_disassembler',
        'mekanism:module_gravitational_modulating_unit'
    ]

    extremeOutputs.forEach(output => event.remove({ output: output }))

    event.shaped('mekanism:mekasuit_helmet', ['QUQ', 'RHR', 'QFQ'], {
        Q: singularityCore,
        U: 'mekanism:ultimate_control_circuit',
        R: reactorFrame,
        H: 'minecraft:netherite_helmet',
        F: fusionCore
    }).id('matterworks:endgame/mekasuit_helmet')

    event.shaped('mekanism:mekasuit_bodyarmor', ['QFQ', 'RCR', 'QPQ'], {
        Q: singularityCore,
        F: fusionCore,
        R: reactorFrame,
        C: 'minecraft:netherite_chestplate',
        P: particleMatrix
    }).id('matterworks:endgame/mekasuit_bodyarmor')

    event.shaped('mekanism:mekasuit_pants', ['QRQ', 'PLP', 'F F'], {
        Q: singularityCore,
        R: reactorFrame,
        P: particleMatrix,
        L: 'minecraft:netherite_leggings',
        F: fusionCore
    }).id('matterworks:endgame/mekasuit_pants')

    event.shaped('mekanism:mekasuit_boots', ['P P', 'QBQ', 'RFR'], {
        P: particleMatrix,
        Q: singularityCore,
        B: 'minecraft:netherite_boots',
        R: reactorFrame,
        F: fusionCore
    }).id('matterworks:endgame/mekasuit_boots')

    event.shaped('mekanism:meka_tool', ['PQP', 'FSF', 'RUR'], {
        P: particleMatrix,
        Q: singularityCore,
        F: fusionCore,
        S: 'minecraft:netherite_pickaxe',
        R: reactorFrame,
        U: 'mekanism:ultimate_control_circuit'
    }).id('matterworks:endgame/meka_tool')

    event.shaped('mekanism:atomic_disassembler', [' P ', 'RQR', ' U '], {
        P: particleMatrix,
        R: reactorFrame,
        Q: singularityCore,
        U: 'mekanism:ultimate_control_circuit'
    }).id('matterworks:endgame/atomic_disassembler')

    /* Creative-like flight is a separate prestige purchase even after the suit exists. */
    event.shaped('mekanism:module_gravitational_modulating_unit', ['PQP', 'FSF', 'AAA'], {
        P: particleMatrix,
        Q: singularityCore,
        F: fusionCore,
        S: 'mekanism:module_base',
        A: 'mekanism:pellet_antimatter'
    }).id('matterworks:endgame/module_gravitational_modulating_unit')

    console.info(
        `[Matterworks] Extreme equipment policy registered: ${extremeOutputs.length} near-creative outputs moved behind multi-program prestige components`
    )
})
