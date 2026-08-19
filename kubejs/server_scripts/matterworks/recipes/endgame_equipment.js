ServerEvents.recipes(event => {
    const reactorFrame = 'kubejs:reactor_grade_frame'
    const incompleteReactorFrame = 'kubejs:incomplete_reactor_grade_frame'
    const particleMatrix = 'kubejs:particle_confinement_matrix'
    const incompleteParticleMatrix = 'kubejs:incomplete_particle_confinement_matrix'
    const fusionCore = 'kubejs:fusion_field_core'
    const incompleteFusionCore = 'kubejs:incomplete_fusion_field_core'
    const singularityCore = 'kubejs:quantum_singularity_core'
    const incompleteSingularityCore = 'kubejs:incomplete_quantum_singularity_core'

    /*
     * Prestige components are process proofs, not expensive crafting-table
     * tokens. Each chain repeatedly handles hardware from another engineering
     * program before the component becomes usable by near-creative equipment.
     */
    event.recipes.create.sequenced_assembly(
        reactorFrame,
        'nuclearcraft:fission_reactor_casing',
        [
            event.recipes.create.deploying(incompleteReactorFrame, [incompleteReactorFrame, 'mekanism:pellet_polonium']),
            event.recipes.create.deploying(incompleteReactorFrame, [incompleteReactorFrame, 'mekanismgenerators:fission_reactor_casing']),
            event.recipes.create.deploying(incompleteReactorFrame, [incompleteReactorFrame, 'nuclearcraft:fission_reactor_controller']),
            event.recipes.create.pressing(incompleteReactorFrame, incompleteReactorFrame)
        ]
    )
        .transitionalItem(incompleteReactorFrame)
        .loops(2)
        .id('matterworks:endgame/reactor_grade_frame')

    event.recipes.create.sequenced_assembly(
        particleMatrix,
        'ae2:singularity',
        [
            event.recipes.create.deploying(incompleteParticleMatrix, [incompleteParticleMatrix, 'kubejs:particle_focusing_coil']),
            event.recipes.create.deploying(incompleteParticleMatrix, [incompleteParticleMatrix, 'mekanism:pellet_antimatter']),
            event.recipes.create.deploying(incompleteParticleMatrix, [incompleteParticleMatrix, 'nuclearcraft:ring_accelerator_controller']),
            event.recipes.create.pressing(incompleteParticleMatrix, incompleteParticleMatrix)
        ]
    )
        .transitionalItem(incompleteParticleMatrix)
        .loops(3)
        .id('matterworks:endgame/particle_confinement_matrix')

    event.recipes.create.sequenced_assembly(
        fusionCore,
        'alchemistry:fusion_chamber_controller',
        [
            event.recipes.create.deploying(incompleteFusionCore, [incompleteFusionCore, 'mekanism:pellet_antimatter']),
            event.recipes.create.deploying(incompleteFusionCore, [incompleteFusionCore, 'mekanismgenerators:fusion_reactor_controller']),
            event.recipes.create.deploying(incompleteFusionCore, [incompleteFusionCore, 'minecraft:nether_star']),
            event.recipes.create.pressing(incompleteFusionCore, incompleteFusionCore)
        ]
    )
        .transitionalItem(incompleteFusionCore)
        .loops(3)
        .id('matterworks:endgame/fusion_field_core')

    event.recipes.create.sequenced_assembly(
        singularityCore,
        'ae2:singularity',
        [
            event.recipes.create.deploying(incompleteSingularityCore, [incompleteSingularityCore, reactorFrame]),
            event.recipes.create.deploying(incompleteSingularityCore, [incompleteSingularityCore, particleMatrix]),
            event.recipes.create.deploying(incompleteSingularityCore, [incompleteSingularityCore, fusionCore]),
            event.recipes.create.pressing(incompleteSingularityCore, incompleteSingularityCore)
        ]
    )
        .transitionalItem(incompleteSingularityCore)
        .loops(4)
        .id('matterworks:endgame/quantum_singularity_core')

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
        `[Matterworks] Extreme equipment policy registered: ${extremeOutputs.length} near-creative outputs moved behind multi-program sequenced prestige components`
    )
})
