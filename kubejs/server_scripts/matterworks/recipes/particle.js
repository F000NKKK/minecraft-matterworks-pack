console.info('[Matterworks] Loading particle-engineering progression recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('nuclearcraft')) {
        console.warn('[Matterworks] Particle progression skipped: NuclearCraft: Neoteric not loaded')
        return
    }

    /*
     * Particle Focusing Coil
     *
     * This is the Matterworks-owned accelerator component. It packages
     * precision windings, field control and electrical conditioning without
     * replacing NuclearCraft's beam, magnet, RF and heat simulation.
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
     * transport while Matterworks owns the cross-mod engineering boundary.
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
     * Ring accelerator
     *
     * NuclearCraft registers the ring controller as
     * `nuclearcraft:ring_accelerator_controller`.
     *
     * Keep NuclearCraft's own high-tier materials in the recipe and add the
     * Matterworks focusing component. Useful Target Chamber reactions will be
     * introduced as production/experimental recipes later; artificial
     * calibration-token items are intentionally not part of progression.
     */
    event.remove({ output: 'nuclearcraft:ring_accelerator_controller' })
    event.shaped(
        'nuclearcraft:ring_accelerator_controller',
        [
            'PFP',
            'XAX',
            'PCP'
        ],
        {
            P: 'nuclearcraft:plate_elite',
            F: 'kubejs:particle_focusing_coil',
            X: '#forge:ingots/extreme',
            A: 'nuclearcraft:advanced_processor',
            C: 'nuclearcraft:accelerator_casing'
        }
    )
        .id('matterworks:particle/ring_accelerator_controller')

    console.info(
        '[Matterworks] Particle progression registered: focusing hardware -> linear/ring accelerator infrastructure'
    )
})
