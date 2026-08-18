StartupEvents.registry('item', event => {
    event.create('electromechanical_control_unit')
        .displayName('Electromechanical Control Unit')

    event.create(
        'incomplete_electromechanical_control_unit',
        'create:sequenced_assembly'
    )
        .displayName('Incomplete Electromechanical Control Unit')
})

StartupEvents.registry('item', event => {
    event.create('insulated_copper_wire')
        .displayName('Insulated Copper Wire')

    event.create(
        'incomplete_insulated_copper_wire',
        'create:sequenced_assembly'
    )
        .displayName('Incomplete Insulated Copper Wire')

    event.create('electromagnetic_coil')
        .displayName('Electromagnetic Coil')

    event.create(
        'incomplete_electromagnetic_coil',
        'create:sequenced_assembly'
    )
        .displayName('Incomplete Electromagnetic Coil')
})

StartupEvents.registry('item', event => {
    event.create('coke')
        .displayName('Coke')

    event.create('graphite')
        .displayName('Graphite')
})

StartupEvents.registry('item', event => {
    event.create('molecular_sieve_charge')
        .displayName('Molecular Sieve Charge')
        .maxStackSize(64)

    event.create('particle_focusing_coil')
        .displayName('Particle Focusing Coil')
        .maxStackSize(64)
})

/*
 * Endgame prestige components.
 *
 * Final components have no independent utility. Their incomplete forms are
 * Create sequenced-assembly carriers, forcing late-game equipment to pass
 * through a repeatable manufacturing process instead of one shaped recipe.
 */
StartupEvents.registry('item', event => {
    event.create('reactor_grade_frame')
        .displayName('Reactor-Grade Frame')
        .maxStackSize(16)
    event.create('incomplete_reactor_grade_frame', 'create:sequenced_assembly')
        .displayName('Incomplete Reactor-Grade Frame')

    event.create('particle_confinement_matrix')
        .displayName('Particle Confinement Matrix')
        .maxStackSize(16)
    event.create('incomplete_particle_confinement_matrix', 'create:sequenced_assembly')
        .displayName('Incomplete Particle Confinement Matrix')

    event.create('fusion_field_core')
        .displayName('Fusion Field Core')
        .maxStackSize(16)
    event.create('incomplete_fusion_field_core', 'create:sequenced_assembly')
        .displayName('Incomplete Fusion Field Core')

    event.create('quantum_singularity_core')
        .displayName('Quantum Singularity Core')
        .maxStackSize(4)
    event.create('incomplete_quantum_singularity_core', 'create:sequenced_assembly')
        .displayName('Incomplete Quantum Singularity Core')
})
