console.info('[Matterworks] Loading advanced industrial process machine gates')

ServerEvents.recipes(event => {
    /*
     * High-temperature metallurgy.
     *
     * Keep NuclearCraft's chemically meaningful alloy-smelter recipes, but
     * prevent the machine itself from bypassing Matterworks electrical furnace,
     * engineered-carbon and electromechanical infrastructure. The gate must not
     * consume a NuclearCraft alloy whose own production requires this machine.
     */
    event.remove({ output: 'nuclearcraft:alloy_smelter' })
    event.shaped(
        'nuclearcraft:alloy_smelter',
        [
            'SGS',
            'CEC',
            'SRS'
        ],
        {
            S: '#forge:ingots/steel',
            G: 'kubejs:graphite',
            C: 'kubejs:electromechanical_control_unit',
            E: 'mekanism:energized_smelter',
            R: 'mekanism:alloy_reinforced'
        }
    ).id('matterworks:process/high_temperature/alloy_smelter')

    /*
     * Nichrome correction.
     *
     * NuclearCraft Neoteric 1.2.34 calls an Fe + 4Cr alloy "nichrome".
     * Matterworks treats material names as engineering semantics rather than
     * opaque progression tokens, so that stock edge is not acceptable.
     *
     * Use a nominal Nichrome 80/20 grade instead: 4 nickel + 1 chromium.
     * Both ingot and dust feeds remain Alloy Smelter processes and preserve the
     * stock recipe's energy/time class; only the incorrect feed chemistry is
     * replaced.
     */
    event.remove({ id: 'nuclearcraft:alloy_smelter/ingots_iron-ingots_chromium' })
    event.remove({ id: 'nuclearcraft:alloy_smelter/dusts_iron-dusts_chromium' })

    event.custom({
        type: 'nuclearcraft:alloy_smelter',
        input: [
            { count: 4, tag: 'forge:ingots/nickel' },
            { tag: 'forge:ingots/chromium' }
        ],
        output: [
            { count: 5, item: 'nuclearcraft:nichrome_ingot' }
        ],
        powerModifier: 1.0,
        radiation: 1.0,
        timeModifier: 2.5
    }).id('matterworks:process/high_temperature/nichrome_ingots')

    event.custom({
        type: 'nuclearcraft:alloy_smelter',
        input: [
            { count: 4, tag: 'forge:dusts/nickel' },
            { tag: 'forge:dusts/chromium' }
        ],
        output: [
            { count: 5, item: 'nuclearcraft:nichrome_ingot' }
        ],
        powerModifier: 1.0,
        radiation: 1.0,
        timeModifier: 2.0
    }).id('matterworks:process/high_temperature/nichrome_dusts')

    /*
     * Specialty chemistry starts only after the factory owns a controlled PRC
     * and industrial electrolysis. The NuclearCraft Chemical Reactor remains
     * the process authority for its specialist formulations.
     */
    event.remove({ output: 'nuclearcraft:chemical_reactor' })
    event.shaped(
        'nuclearcraft:chemical_reactor',
        [
            'TCT',
            'EPE',
            'TGT'
        ],
        {
            T: 'mekanism:basic_chemical_tank',
            C: 'mekanism:advanced_control_circuit',
            E: 'kubejs:electromagnetic_coil',
            P: 'mekanism:pressurized_reaction_chamber',
            G: 'kubejs:graphite'
        }
    ).id('matterworks:process/specialty_chemistry/chemical_reactor')

    /*
     * Petrochemical fractionation is fundamentally a heat-and-phase-separation
     * process, not a compressed-air process. PneumaticCraft remains the machine
     * implementation, but 0.5.8 moves the manufacturing boundary from pressure
     * tubing to process heat + thermopneumatic heat exchange + control hardware.
     * The pressure network powers the PNC plant; it is no longer presented as
     * the physical reason crude oil separates into boiling-range fractions.
     */
    event.remove({ output: 'pneumaticcraft:refinery' })
    event.shaped(
        'pneumaticcraft:refinery',
        [
            'IHI',
            'TCT',
            'IGI'
        ],
        {
            I: '#forge:ingots/compressed_iron',
            H: 'mekanism:energized_smelter',
            T: 'pneumaticcraft:thermopneumatic_processing_plant',
            C: 'kubejs:electromechanical_control_unit',
            G: '#forge:glass'
        }
    ).id('matterworks:process/petrochemistry/refinery')

    console.info('[Matterworks] Advanced process gates registered: high-temperature metallurgy with corrected nichrome chemistry, specialty chemistry and heat-owned petrochemical fractionation')
})
