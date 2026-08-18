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

    rewrittenOutputs.forEach(output => event.remove({ output: output }))

    event.shaped('mekanism:free_runners', ['E E', 'AWA', 'CSC'], {
        E: 'mekanism:energy_tablet',
        A: 'mekanism:alloy_infused',
        W: 'kubejs:insulated_copper_wire',
        C: 'mekanism:basic_control_circuit',
        S: '#forge:ingots/steel'
    }).id('matterworks:equipment/free_runners')

    event.shaped('mekanism:scuba_mask', ['GCG', 'SWS', 'G G'], {
        G: '#forge:glass',
        C: 'mekanism:basic_control_circuit',
        S: '#forge:ingots/steel',
        W: 'kubejs:insulated_copper_wire'
    }).id('matterworks:equipment/scuba_mask')

    event.shaped('mekanism:scuba_tank', ['ACA', 'TWT', 'SSS'], {
        A: 'mekanism:alloy_infused',
        C: 'mekanism:advanced_control_circuit',
        T: 'mekanism:basic_chemical_tank',
        W: 'kubejs:electromagnetic_coil',
        S: '#forge:ingots/steel'
    }).id('matterworks:equipment/scuba_tank')

    event.shaped('mekanism:jetpack', ['SCS', 'ETE', 'WPW'], {
        S: '#forge:ingots/steel',
        C: 'mekanism:advanced_control_circuit',
        E: 'mekanism:energy_tablet',
        T: 'mekanism:basic_chemical_tank',
        W: 'kubejs:electromagnetic_coil',
        P: 'mekanism:pressurized_reaction_chamber'
    }).id('matterworks:equipment/jetpack')

    event.shaped('mekanism:hazmat_mask', ['LHL', 'GCG', ' R '], {
        L: '#forge:ingots/lead',
        H: 'mekanism:hdpe_sheet',
        G: '#forge:glass_panes',
        C: 'nuclearcraft:fission_reactor_casing',
        R: 'mekanism:alloy_reinforced'
    }).id('matterworks:equipment/hazmat_mask')

    event.shaped('mekanism:hazmat_gown', ['LHL', 'LCL', 'LRL'], {
        L: '#forge:ingots/lead',
        H: 'mekanism:hdpe_sheet',
        C: 'nuclearcraft:fission_reactor_casing',
        R: 'mekanism:alloy_reinforced'
    }).id('matterworks:equipment/hazmat_gown')

    event.shaped('mekanism:hazmat_pants', ['LCL', 'LHL', 'R R'], {
        L: '#forge:ingots/lead',
        H: 'mekanism:hdpe_sheet',
        C: 'nuclearcraft:fission_reactor_casing',
        R: 'mekanism:alloy_reinforced'
    }).id('matterworks:equipment/hazmat_pants')

    event.shaped('mekanism:hazmat_boots', ['L L', 'CRC', ' H '], {
        L: '#forge:ingots/lead',
        H: 'mekanism:hdpe_sheet',
        C: 'nuclearcraft:fission_reactor_casing',
        R: 'mekanism:alloy_reinforced'
    }).id('matterworks:equipment/hazmat_boots')

    event.shaped('mekanism:hdpe_elytra', ['AHA', 'HEH', 'P P'], {
        A: 'mekanism:alloy_atomic',
        H: 'mekanism:hdpe_sheet',
        E: 'minecraft:elytra',
        P: 'ae2:engineering_processor'
    }).id('matterworks:equipment/hdpe_elytra')

    event.shaped('mekanism:free_runners_armored', ['RAR', 'QFQ', ' C '], {
        R: 'mekanism:alloy_reinforced',
        A: 'mekanism:alloy_atomic',
        Q: '#forge:gems/diamond',
        F: 'mekanism:free_runners',
        C: 'nuclearcraft:fission_reactor_casing'
    }).id('matterworks:equipment/free_runners_armored')

    event.shaped('mekanism:jetpack_armored', ['RAR', 'QJQ', 'CPC'], {
        R: 'mekanism:alloy_reinforced',
        A: 'mekanism:alloy_atomic',
        Q: '#forge:gems/diamond',
        J: 'mekanism:jetpack',
        C: 'nuclearcraft:fission_reactor_casing',
        P: 'nuclearcraft:fission_reactor_port'
    }).id('matterworks:equipment/jetpack_armored')

    /*
     * PneumaticCraft is another major survival-power path. Pneumatic Armor is
     * programmable powered equipment, and Jet Boots can become full flight.
     * Keep the base suit in Atomic Age and push the strongest flight upgrades
     * through accelerator/fusion prestige components.
     */
    const pneumaticArmor = [
        'pneumaticcraft:pneumatic_helmet',
        'pneumaticcraft:pneumatic_chestplate',
        'pneumaticcraft:pneumatic_leggings',
        'pneumaticcraft:pneumatic_boots'
    ]
    pneumaticArmor.forEach(output => event.remove({ output: output }))

    const pneumaticArmorIngredients = {
        P: 'pneumaticcraft:printed_circuit_board',
        A: 'pneumaticcraft:reinforced_air_canister',
        R: 'mekanism:alloy_reinforced',
        E: 'ae2:engineering_processor',
        I: '#forge:ingots/compressed_iron'
    }

    event.shaped('pneumaticcraft:pneumatic_helmet', ['IPI', 'AEA', ' R '], pneumaticArmorIngredients)
        .id('matterworks:equipment/pneumatic_helmet')
    event.shaped('pneumaticcraft:pneumatic_chestplate', ['R R', 'APA', 'IEI'], pneumaticArmorIngredients)
        .id('matterworks:equipment/pneumatic_chestplate')
    event.shaped('pneumaticcraft:pneumatic_leggings', ['RPR', 'A A', 'IEI'], pneumaticArmorIngredients)
        .id('matterworks:equipment/pneumatic_leggings')
    event.shaped('pneumaticcraft:pneumatic_boots', ['A A', 'RPR', 'I I'], pneumaticArmorIngredients)
        .id('matterworks:equipment/pneumatic_boots')

    for (let level = 1; level <= 5; level++) {
        event.remove({ output: `pneumaticcraft:jet_boots_upgrade_${level}` })
    }

    event.shaped('pneumaticcraft:jet_boots_upgrade_1', [' C ', 'PJP', ' A '], {
        C: 'pneumaticcraft:printed_circuit_board',
        P: '#forge:ingots/compressed_iron',
        J: 'mekanism:jetpack',
        A: 'pneumaticcraft:reinforced_air_canister'
    }).id('matterworks:equipment/jet_boots_upgrade_1')

    event.shaped('pneumaticcraft:jet_boots_upgrade_2', [' R ', 'PUP', ' A '], {
        R: 'mekanism:alloy_reinforced',
        P: 'pneumaticcraft:printed_circuit_board',
        U: 'pneumaticcraft:jet_boots_upgrade_1',
        A: 'pneumaticcraft:reinforced_air_canister'
    }).id('matterworks:equipment/jet_boots_upgrade_2')

    event.shaped('pneumaticcraft:jet_boots_upgrade_3', ['CRC', 'PUP', ' A '], {
        C: 'nuclearcraft:fission_reactor_casing',
        R: 'mekanism:alloy_atomic',
        P: 'ae2:engineering_processor',
        U: 'pneumaticcraft:jet_boots_upgrade_2',
        A: 'pneumaticcraft:reinforced_air_canister'
    }).id('matterworks:equipment/jet_boots_upgrade_3')

    event.shaped('pneumaticcraft:jet_boots_upgrade_4', ['PMP', 'RUR', ' A '], {
        P: 'kubejs:particle_focusing_coil',
        M: 'kubejs:particle_confinement_matrix',
        R: 'mekanism:alloy_atomic',
        U: 'pneumaticcraft:jet_boots_upgrade_3',
        A: 'pneumaticcraft:reinforced_air_canister'
    }).id('matterworks:equipment/jet_boots_upgrade_4')

    event.shaped('pneumaticcraft:jet_boots_upgrade_5', ['FQF', 'PUP', 'AAA'], {
        F: 'kubejs:fusion_field_core',
        Q: 'kubejs:quantum_singularity_core',
        P: 'kubejs:particle_confinement_matrix',
        U: 'pneumaticcraft:jet_boots_upgrade_4',
        A: 'mekanism:pellet_antimatter'
    }).id('matterworks:equipment/jet_boots_upgrade_5')

    console.info(
        `[Matterworks] Advantage equipment progression registered: ${rewrittenOutputs.length} Mekanism outputs plus PneumaticCraft powered armour/flight rewritten across Industrial/Atomic/Fusion tiers`
    )
})
