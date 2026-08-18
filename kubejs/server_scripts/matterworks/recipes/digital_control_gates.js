console.info('[Matterworks] Loading programmable process-control gates')

ServerEvents.recipes(event => {
    /*
     * Digital Process Control must be a real manufacturing boundary, not only
     * quest-book prose. Safety-critical nuclear control hardware therefore
     * embeds programmable and network-engineering components.
     */
    event.remove({ output: 'nuclearcraft:fission_reactor_controller' })
    event.shaped(
        'nuclearcraft:fission_reactor_controller',
        [
            'CEC',
            'RPR',
            'CAC'
        ],
        {
            C: 'nuclearcraft:fission_reactor_casing',
            E: 'ae2:engineering_processor',
            R: 'mekanism:alloy_reinforced',
            P: 'computercraft:computer_advanced',
            A: 'mekanism:advanced_control_circuit'
        }
    ).id('matterworks:control/fission_reactor_controller')

    /*
     * Accelerator control is later still. The ring controller consumes the
     * supervision bridge itself, making the network/control branch an actual
     * prerequisite for beam research instead of an optional parallel quest.
     */
    event.remove({ output: 'nuclearcraft:ring_accelerator_controller' })
    event.shaped(
        'nuclearcraft:ring_accelerator_controller',
        [
            'FCF',
            'AMA',
            'FCF'
        ],
        {
            F: 'kubejs:particle_focusing_coil',
            C: 'nuclearcraft:accelerator_casing',
            A: 'mekanism:alloy_atomic',
            M: 'advancedperipherals:me_bridge'
        }
    ).id('matterworks:control/ring_accelerator_controller')

    console.info('[Matterworks] Programmable process-control gates registered for fission and accelerator control hardware')
})
