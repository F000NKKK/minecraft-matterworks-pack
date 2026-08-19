console.info('[Matterworks] Loading particle-engineering progression recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('nuclearcraft')) {
        console.warn('[Matterworks] Particle progression skipped: NuclearCraft: Neoteric not loaded')
        return
    }

    /*
     * Target Chamber resource policy
     *
     * NuclearCraft ships a broad transmutation table. Keep reactions that
     * produce isotopes/radioisotopes, consume isotope feedstock, or model
     * nuclear/spallation processing. Remove only stock bulk-material
     * conversions that would bypass Matterworks chemistry and extraction.
     */
    const blockedStockTargetChamberRecipes = [
        // Positron
        'nuclearcraft:target_chamber/positron-2000000-ingots_uranium',
        // Proton
        'nuclearcraft:target_chamber/proton-1500-ingots_aluminum',
        'nuclearcraft:target_chamber/proton-4000-fluorine',
        'nuclearcraft:target_chamber/proton-4500-ingots_copper',
        'nuclearcraft:target_chamber/proton-4600-ingots_cobalt',
        'nuclearcraft:target_chamber/proton-10000-ingots_manganese',
        'nuclearcraft:target_chamber/proton-12500-ingots_gold',
        'nuclearcraft:target_chamber/proton-16500-ingots_calcium',
        'nuclearcraft:target_chamber/proton-19000-oxygen',
        'nuclearcraft:target_chamber/proton-19000-ingots_silicon',
        'nuclearcraft:target_chamber/proton-20000-dusts_bismuth',
        'nuclearcraft:target_chamber/proton-21000-ingots_gold',
        'nuclearcraft:target_chamber/proton-30000-ingots_calcium',
        'nuclearcraft:target_chamber/proton-33000-nitrogen',
        'nuclearcraft:target_chamber/proton-40000-oxygen',
        'nuclearcraft:target_chamber/proton-45000-ingots_copper',
        'nuclearcraft:target_chamber/proton-51000-ingots_calcium',
        'nuclearcraft:target_chamber/proton-150000-dusts_graphite',
        'nuclearcraft:target_chamber/proton-155000-ingots_aluminum',
        // Neutron
        'nuclearcraft:target_chamber/neutron-2800-dusts_sulfur',
        'nuclearcraft:target_chamber/neutron-3000-chlorine',
        'nuclearcraft:target_chamber/neutron-3000-ingots_calcium',
        'nuclearcraft:target_chamber/neutron-5500-ingots_zinc',
        'nuclearcraft:target_chamber/neutron-6000-nitrogen',
        'nuclearcraft:target_chamber/neutron-11000-ingots_iron',
        'nuclearcraft:target_chamber/neutron-11000-ingots_copper',
        'nuclearcraft:target_chamber/neutron-12000-ingots_chromium',
        'nuclearcraft:target_chamber/neutron-14000-ingots_calcium',
        'nuclearcraft:target_chamber/neutron-14000-ingots_zinc',
        'nuclearcraft:target_chamber/neutron-15000-ingots_potassium',
        'nuclearcraft:target_chamber/neutron-15000-ingots_zirconium',
        'nuclearcraft:target_chamber/neutron-18000-ingots_silicon',
        'nuclearcraft:target_chamber/neutron-19000-ingots_nickel',
        'nuclearcraft:target_chamber/neutron-19000-ingots_platinum',
        'nuclearcraft:target_chamber/neutron-21000-ingots_zirconium',
        'nuclearcraft:target_chamber/neutron-22000-oxygen',
        'nuclearcraft:target_chamber/neutron-22000-ingots_niobium',
        'nuclearcraft:target_chamber/neutron-29000-ingots_manganese',
        'nuclearcraft:target_chamber/neutron-30000-ingots_cobalt',
        'nuclearcraft:target_chamber/neutron-30000-ingots_yttrium',
        'nuclearcraft:target_chamber/neutron-30000-ingots_sodium',
        'nuclearcraft:target_chamber/neutron-30000-ingots_gold',
        'nuclearcraft:target_chamber/neutron-70000-dusts_bismuth',
        // Photon
        'nuclearcraft:target_chamber/photon-11000-ingots_tungsten',
        'nuclearcraft:target_chamber/photon-11500-ingots_zirconium',
        'nuclearcraft:target_chamber/photon-12000-dusts_bismuth',
        'nuclearcraft:target_chamber/photon-13000-ingots_niobium',
        'nuclearcraft:target_chamber/photon-14500-ingots_iron',
        'nuclearcraft:target_chamber/photon-16000-ingots_yttrium',
        'nuclearcraft:target_chamber/photon-18000-ingots_silicon',
        'nuclearcraft:target_chamber/photon-18000-ingots_calcium',
        'nuclearcraft:target_chamber/photon-19500-ingots_copper',
        'nuclearcraft:target_chamber/photon-20000-nitrogen',
        'nuclearcraft:target_chamber/photon-29000-oxygen',
        // Electron
        'nuclearcraft:target_chamber/electron-50000-ingots_iron',
        'nuclearcraft:target_chamber/electron-50000-ingots_cobalt',
        'nuclearcraft:target_chamber/electron-50000-ingots_zinc',
        'nuclearcraft:target_chamber/electron-60000-ingots_zirconium',
        // Deuteron
        'nuclearcraft:target_chamber/deuteron-3500-oxygen',
        'nuclearcraft:target_chamber/deuteron-18000-ingots_gold',
        'nuclearcraft:target_chamber/deuteron-60000-ingots_yttrium',
        // Alpha
        'nuclearcraft:target_chamber/alpha-4000-ingots_beryllium',
        'nuclearcraft:target_chamber/alpha-11000-fluorine',
        'nuclearcraft:target_chamber/alpha-12000-ingots_aluminum',
        'nuclearcraft:target_chamber/alpha-14000-nitrogen',
        'nuclearcraft:target_chamber/alpha-16000-ingots_copper',
        'nuclearcraft:target_chamber/alpha-18000-oxygen',
        'nuclearcraft:target_chamber/alpha-19000-ingots_osmium',
        'nuclearcraft:target_chamber/alpha-21200-dusts_ytterbium',
        'nuclearcraft:target_chamber/alpha-30000-nitrogen',
        // Electron antineutrino
        'nuclearcraft:target_chamber/electron_antineutrino-200-ingots_nickel',
        // Positive pion
        'nuclearcraft:target_chamber/pion_plus-70000-argon'
    ]

    blockedStockTargetChamberRecipes.forEach(recipeId => event.remove({ id: recipeId }))

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
     * Ring accelerator controller recipe ownership intentionally lives in
     * digital_control_gates.js. The particle module owns beam hardware and
     * accelerator structure; the control module owns the safety-critical
     * programmable controller boundary.
     */

    console.info(
        '[Matterworks] Particle progression registered: focusing hardware -> accelerator infrastructure; controller delegated to digital control'
    )
})
