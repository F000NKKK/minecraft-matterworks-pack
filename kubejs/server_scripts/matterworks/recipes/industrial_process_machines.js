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
     * Petrochemical fractionation belongs to the mature pressure branch. A
     * PneumaticCraft refinery therefore consumes the thermopneumatic process
     * hardware that the player already proved during atmospheric separation.
     */
    event.remove({ output: 'pneumaticcraft:refinery' })
    event.shaped(
        'pneumaticcraft:refinery',
        [
            'ITI',
            'PCP',
            'IGI'
        ],
        {
            I: '#forge:ingots/compressed_iron',
            T: 'pneumaticcraft:thermopneumatic_processing_plant',
            P: 'pneumaticcraft:pressure_tube',
            C: 'kubejs:electromechanical_control_unit',
            G: '#forge:glass'
        }
    ).id('matterworks:process/petrochemistry/refinery')

    console.info('[Matterworks] Advanced process gates registered: high-temperature metallurgy, specialty chemistry and petrochemical fractionation')
})
