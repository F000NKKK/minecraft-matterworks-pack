console.info('[Matterworks] Loading advantage-equipment progression recipes')

ServerEvents.recipes(event => {
    /*
     * Advantage equipment policy
     *
     * Industrial Age: useful field support is allowed once the plant can
     * manufacture the actual electrical, gas and reaction hardware behind it.
     *
     * Atomic Age: reinforced mobility and radiological equipment may remove
     * much more survival friction, so their stock upgrade recipes are replaced
     * with cross-discipline recipes that consume digital/nuclear-era hardware.
     *
     * Fusion Age: MekaSuit, Meka-Tool, Atomic Disassembler and near-creative
     * modules are handled separately by endgame_equipment.js.
     */

    const rewrittenOutputs = [
        'mekanism:free_runners',
        'mekanism:scuba_mask',
        'mekanism:scuba_tank',
        'mekanism:jetpack',
        'mekanism:hdpe_elytra',
        'mekanism:hazmat_mask',
        'mekanism:hazmat_gown',
        'mekanism:hazmat_pants',
        'mekanism:hazmat_boots',
        'mekanism:free_runners_armored',
        'mekanism:jetpack_armored'
    ]

    rewrittenOutputs.forEach(output => event.remove({ output }))

    // Industrial Age — powered movement without armour-level protection.
    event.shaped(
        'mekanism:free_runners',
        [
            'E E',
            'AWA',
            'CSC'
        ],
        {
            E: 'mekanism:energy_tablet',
            A: 'mekanism:alloy_infused',
            W: 'kubejs:insulated_copper_wire',
            C: 'mekanism:basic_control_circuit',
            S: '#forge:ingots/steel'
        }
    )
        .id('matterworks:equipment/free_runners')

    // Industrial Age — breathing is a complete gas-handling system, not just a mask.
    event.shaped(
        'mekanism:scuba_mask',
        [
            'GCG',
            'SWS',
            'G G'
        ],
        {
            G: '#forge:glass',
            C: 'mekanism:basic_control_circuit',
            S: '#forge:ingots/steel',
            W: 'kubejs:insulated_copper_wire'
        }
    )
        .id('matterworks:equipment/scuba_mask')

    event.shaped(
        'mekanism:scuba_tank',
        [
            'ACA',
            'TWT',
            'SSS'
        ],
        {
            A: 'mekanism:alloy_infused',
            C: 'mekanism:advanced_control_circuit',
            T: 'mekanism:basic_chemical_tank',
            W: 'kubejs:electromagnetic_coil',
            S: '#forge:ingots/steel'
        }
    )
        .id('matterworks:equipment/scuba_tank')

    // Industrial Age — powered flight only after pressurised reaction chemistry.
    event.shaped(
        'mekanism:jetpack',
        [
            'SCS',
            'ETE',
            'WPW'
        ],
        {
            S: '#forge:ingots/steel',
            C: 'mekanism:advanced_control_circuit',
            E: 'mekanism:energy_tablet',
            T: 'mekanism:basic_chemical_tank',
            W: 'kubejs:electromagnetic_coil',
            P: 'mekanism:pressurized_reaction_chamber'
        }
    )
        .id('matterworks:equipment/jetpack')

    /*
     * Atomic Age — radiological protection.
     *
     * The stock Hazmat recipes are mostly lead and dye. In Matterworks the
     * suit is a proper shielded composite: lead mass, HDPE backing, reinforced
     * alloy and NuclearCraft reactor-structure material.
     */
    event.shaped(
        'mekanism:hazmat_mask',
        [
            'LHL',
            'GCG',
            ' R '
        ],
        {
            L: '#forge:ingots/lead',
            H: 'mekanism:hdpe_sheet',
            G: '#forge:glass_panes',
            C: 'nuclearcraft:fission_reactor_casing',
            R: 'mekanism:alloy_reinforced'
        }
    )
        .id('matterworks:equipment/hazmat_mask')

    event.shaped(
        'mekanism:hazmat_gown',
        [
            'LHL',
            'LCL',
            'LRL'
        ],
        {
            L: '#forge:ingots/lead',
            H: 'mekanism:hdpe_sheet',
            C: 'nuclearcraft:fission_reactor_casing',
            R: 'mekanism:alloy_reinforced'
        }
    )
        .id('matterworks:equipment/hazmat_gown')

    event.shaped(
        'mekanism:hazmat_pants',
        [
            'LCL',
            'LHL',
            'R R'
        ],
        {
            L: '#forge:ingots/lead',
            H: 'mekanism:hdpe_sheet',
            C: 'nuclearcraft:fission_reactor_casing',
            R: 'mekanism:alloy_reinforced'
        }
    )
        .id('matterworks:equipment/hazmat_pants')

    event.shaped(
        'mekanism:hazmat_boots',
        [
            'L L',
            'CRC',
            ' H '
        ],
        {
            L: '#forge:ingots/lead',
            H: 'mekanism:hdpe_sheet',
            C: 'nuclearcraft:fission_reactor_casing',
            R: 'mekanism:alloy_reinforced'
        }
    )
        .id('matterworks:equipment/hazmat_boots')

    /*
     * Atomic Age — reinforced/gliding equipment.
     *
     * HDPE Elytra remains below powered armored flight: the End-sourced Elytra
     * is retained, but its reinforcement now also consumes AE2 engineering
     * processors to tie the upgrade to digitally controlled manufacturing.
     */
    event.shaped(
        'mekanism:hdpe_elytra',
        [
            'AHA',
            'HEH',
            'P P'
        ],
        {
            A: 'mekanism:alloy_atomic',
            H: 'mekanism:hdpe_sheet',
            E: 'minecraft:elytra',
            P: 'ae2:engineering_processor'
        }
    )
        .id('matterworks:equipment/hdpe_elytra')

    // Armored Free Runners require an actual fission-structure component.
    event.shaped(
        'mekanism:free_runners_armored',
        [
            'RAR',
            'QFQ',
            ' C '
        ],
        {
            R: 'mekanism:alloy_reinforced',
            A: 'mekanism:alloy_atomic',
            Q: '#forge:gems/diamond',
            F: 'mekanism:free_runners',
            C: 'nuclearcraft:fission_reactor_casing'
        }
    )
        .id('matterworks:equipment/free_runners_armored')

    // Armored Jetpack is later still: the fuel-handling branch must be real.
    event.shaped(
        'mekanism:jetpack_armored',
        [
            'RAR',
            'QJQ',
            'CPC'
        ],
        {
            R: 'mekanism:alloy_reinforced',
            A: 'mekanism:alloy_atomic',
            Q: '#forge:gems/diamond',
            J: 'mekanism:jetpack',
            C: 'nuclearcraft:fission_reactor_casing',
            P: 'nuclearcraft:fission_reactor_port'
        }
    )
        .id('matterworks:equipment/jetpack_armored')

    console.info(
        `[Matterworks] Advantage equipment progression registered: ${rewrittenOutputs.length} stock outputs rewritten across Industrial/Atomic tiers`
    )
})
