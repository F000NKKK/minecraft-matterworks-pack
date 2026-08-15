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
