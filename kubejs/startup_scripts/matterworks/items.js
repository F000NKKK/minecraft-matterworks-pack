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

    event.create('accelerator_calibration_target')
        .displayName('Accelerator Calibration Target')

    event.create('activated_calibration_target')
        .displayName('Activated Calibration Target')
})
