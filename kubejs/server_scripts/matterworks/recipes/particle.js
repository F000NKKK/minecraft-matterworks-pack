console.info('[Matterworks] Loading particle-engineering progression recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('nuclearcraft')) {
        console.warn('[Matterworks] Particle progression skipped: NuclearCraft: Neoteric not loaded')
        return
    }

    /*
     * Particle Focusing Coil
     *
     * This is the one Matterworks-owned accelerator component. It packages
     * precision windings, field control and electrical conditioning without
     * replacing NuclearCraft's actual beam, magnet, RF and heat simulation.
     */
    event.shaped(
        Item.of('kubejs:particle_focusing_coil', 2),
        [
            'CBC',
            'BEB',
            'CBC'
        ],
        {
            C: 'create:copper_sheet',
            B: 'create:brass_sheet',
            E: 'kubejs:electromechanical_control_unit'
        }
    )
        .id('matterworks:particle/focusing_coil')

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
            'F F',
            'PCP'
        ],
        {
            P: '#forge:plates/cobalt',
            C: 'kubejs:electromagnetic_coil',
            F: 'kubejs:particle_focusing_coil'
        }
    )
        .id('matterworks:particle/accelerator_casing')

    event.remove({ output: 'nuclearcraft:accelerator_ion_source_port' })
    event.shaped(
        'nuclearcraft:accelerator_ion_source_port',
        [
            'LFL',
            'ETE',
            'LFL'
        ],
        {
            L: 'nuclearcraft:laser_assembly',
            F: 'kubejs:particle_focusing_coil',
            E: 'kubejs:electromechanical_control_unit',
            T: 'nuclearcraft:tungsten_filament'
        }
    )
        .id('matterworks:particle/accelerator_ion_source_port')

    event.remove({ output: 'nuclearcraft:accelerator_beam_port' })
    event.shaped(
        Item.of('nuclearcraft:accelerator_beam_port', 2),
        [
            'SFS',
            'BEB',
            'SFS'
        ],
        {
            S: '#forge:ingots/steel',
            F: 'kubejs:particle_focusing_coil',
            B: 'nuclearcraft:particle_beam',
            E: 'kubejs:electromechanical_control_unit'
        }
    )
        .id('matterworks:particle/accelerator_beam_port')

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
        energyReleased: 100
    })
        .id('matterworks:particle/proton_beam_calibration')

    event.remove({ output: 'nuclearcraft:toroidal_accelerator_controller' })
    event.shaped(
        'nuclearcraft:toroidal_accelerator_controller',
        [
            'ACA',
            'RER',
            'ACA'
        ],
        {
            A: 'nuclearcraft:accelerator_casing',
            C: 'kubejs:activated_calibration_target',
            R: 'nuclearcraft:basic_rf_amplifier',
            E: 'kubejs:electromechanical_control_unit'
        }
    )
        .id('matterworks:particle/toroidal_accelerator_controller')

    console.info(
        '[Matterworks] Particle progression registered: focusing hardware -> linear calibration -> toroidal accelerator'
    )
})
