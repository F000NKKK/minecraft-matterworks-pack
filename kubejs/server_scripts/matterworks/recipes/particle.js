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

    /*
     * First Matterworks accelerator experiment.
     *
     * This is intentionally a calibration experiment instead of a bulk
     * transmutation shortcut. The player must build and tune a real
     * NuclearCraft beamline and target chamber before obtaining the activated
     * target. Later progression can use the activated sample as proof that a
     * stable, focused beam has been achieved.
     */

    event.shaped(
        'kubejs:accelerator_calibration_target',
        [
            'QCQ',
            'CGC',
            'QCQ'
        ],
        {
            Q: 'minecraft:quartz',
            C: 'minecraft:copper_ingot',
            G: 'kubejs:graphite'
        }
    )
        .id('matterworks:particle/calibration_target')

    event.custom({
        type: 'nuclearcraft:target_chamber',
        input: [
            {
                item: 'kubejs:accelerator_calibration_target'
            }
        ],
        inputParticles: [
            {
                particle: 'proton',
                amount: 1000000,
                meanEnergy: 1800,
                focus: 0.9
            }
        ],
        output: [
            {
                item: 'kubejs:activated_calibration_target'
            }
        ],
        outputParticles: [
            {
                particle: 'photon',
                amount: 1,
                meanEnergy: 100,
                focus: 0.5
            }
        ],
        crossSection: 0.25,
        maxEnergy: 2200,
        energyReleased: 100,
    })
        .id('matterworks:particle/proton_beam_calibration')

    console.info(
        '[Matterworks] Particle progression registered: accelerator gated and first beam-calibration experiment installed'
    )
})
