ServerEvents.recipes(event => {
    /*
     * Matterworks advantage-equipment policy
     *
     * Mobility and survival assistance are tiered rather than universally
     * pushed into Prestige Engineering. Basic powered equipment belongs to the
     * process-industry era, while near-creative equipment remains Phase 9.
     */

    const midTierOutputs = [
        'mekanism:free_runners',
        'mekanism:jetpack',
        'mekanism:scuba_mask'
    ]

    midTierOutputs.forEach(output => event.remove({ output: output }))

    // Powered fall/movement assistance requires an established electrical
    // metallurgy line and actual stored-energy hardware.
    event.shaped(
        'mekanism:free_runners',
        [
            'EAE',
            'ICI',
            'S S'
        ],
        {
            E: 'mekanism:energy_tablet',
            A: 'mekanism:alloy_infused',
            I: 'kubejs:insulated_copper_wire',
            C: 'mekanism:basic_control_circuit',
            S: '#forge:ingots/steel'
        }
    ).id('matterworks:equipment/free_runners')

    // Flight-like vertical mobility is deliberately later than Free Runners:
    // the player must already understand gas containment and controlled
    // reaction/electrochemical infrastructure.
    event.shaped(
        'mekanism:jetpack',
        [
            'TCT',
            'EPE',
            'SWS'
        ],
        {
            T: 'mekanism:basic_chemical_tank',
            C: 'mekanism:advanced_control_circuit',
            E: 'mekanism:energy_tablet',
            P: 'mekanism:pressurized_reaction_chamber',
            S: '#forge:ingots/steel',
            W: 'kubejs:electromagnetic_coil'
        }
    ).id('matterworks:equipment/jetpack')

    // Underwater breathing is useful but not a prestige capability. It still
    // requires a mature gas-handling stack instead of an early steel recipe.
    event.shaped(
        'mekanism:scuba_mask',
        [
            'GTG',
            'ICI',
            'S S'
        ],
        {
            G: '#forge:glass',
            T: 'mekanism:basic_chemical_tank',
            I: 'kubejs:insulated_copper_wire',
            C: 'mekanism:basic_control_circuit',
            S: '#forge:ingots/steel'
        }
    ).id('matterworks:equipment/scuba_mask')

    console.info(`[Matterworks] Advantage equipment policy registered: ${midTierOutputs.length} mid-tier mobility/survival outputs rewritten`)
})
