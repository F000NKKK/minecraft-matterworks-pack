console.info('[Matterworks] Loading particle-engineering progression recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('nuclearcraft')) {
        console.warn('[Matterworks] Particle progression skipped: NuclearCraft: Neoteric not loaded')
        return
    }

    /*
     * Accelerator infrastructure is deliberately gated rather than replaced.
     * NuclearCraft keeps ownership of beam physics, heat, focus and particle
     * transport while Matterworks owns when the player is allowed to enter
     * particle engineering.
     */

    event.remove({ output: 'nuclearcraft:accelerator_casing' })
    event.shaped(
        Item.of('nuclearcraft:accelerator_casing', 4),
        [
            'PCP',
            'E E',
            'PCP'
        ],
        {
            P: '#forge:plates/cobalt',
            C: 'kubejs:electromagnetic_coil',
            E: 'kubejs:electromechanical_control_unit'
        }
    )
        .id('matterworks:particle/accelerator_casing')

    event.remove({ output: 'nuclearcraft:accelerator_ion_source_port' })
    event.shaped(
        'nuclearcraft:accelerator_ion_source_port',
        [
            'LCL',
            'ETE',
            'LCL'
        ],
        {
            L: 'nuclearcraft:laser_assembly',
            C: 'kubejs:electromagnetic_coil',
            E: 'kubejs:electromechanical_control_unit',
            T: 'nuclearcraft:tungsten_filament'
        }
    )
        .id('matterworks:particle/accelerator_ion_source_port')

    console.info('[Matterworks] Particle progression registered: accelerator infrastructure gated behind Matterworks electrical engineering')
})
