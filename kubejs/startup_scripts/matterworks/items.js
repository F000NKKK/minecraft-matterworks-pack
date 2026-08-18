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
 * These items deliberately have no independent utility. They exist to force
 * near-creative equipment to consume proof from several completed industrial
 * programs instead of collapsing into one mod's local material ladder.
 */
StartupEvents.registry('item', event => {
    event.create('reactor_grade_frame')
        .displayName('Reactor-Grade Frame')
        .maxStackSize(16)

    event.create('particle_confinement_matrix')
        .displayName('Particle Confinement Matrix')
        .maxStackSize(16)

    event.create('fusion_field_core')
        .displayName('Fusion Field Core')
        .maxStackSize(16)

    event.create('quantum_singularity_core')
        .displayName('Quantum Singularity Core')
        .maxStackSize(4)
})
