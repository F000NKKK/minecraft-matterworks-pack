console.info('[Matterworks] Loading PneumaticCraft advantage-equipment policy')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('pneumaticcraft')) {
        return
    }

    /*
     * Pneumatic Armor is a programmable powered suit, not ordinary compressed
     * iron armour. Move the base suit behind digital manufacturing and mature
     * pressure hardware so it cannot become a parallel early-game power path
     * around the Atomic Age equipment policy.
     */
    const armorOutputs = [
        'pneumaticcraft:pneumatic_helmet',
        'pneumaticcraft:pneumatic_chestplate',
        'pneumaticcraft:pneumatic_leggings',
        'pneumaticcraft:pneumatic_boots'
    ]
    armorOutputs.forEach(output => event.remove({ output: output }))

    const armorIngredient = {
        P: 'pneumaticcraft:printed_circuit_board',
        A: 'pneumaticcraft:reinforced_air_canister',
        R: 'mekanism:alloy_reinforced',
        E: 'ae2:engineering_processor',
        I: '#forge:ingots/compressed_iron'
    }

    event.shaped('pneumaticcraft:pneumatic_helmet', ['IPI', 'AEA', ' R '], armorIngredient)
        .id('matterworks:equipment/pneumatic_helmet')
    event.shaped('pneumaticcraft:pneumatic_chestplate', ['R R', 'APA', 'IEI'], armorIngredient)
        .id('matterworks:equipment/pneumatic_chestplate')
    event.shaped('pneumaticcraft:pneumatic_leggings', ['RPR', 'A A', 'IEI'], armorIngredient)
        .id('matterworks:equipment/pneumatic_leggings')
    event.shaped('pneumaticcraft:pneumatic_boots', ['A A', 'RPR', 'I I'], armorIngredient)
        .id('matterworks:equipment/pneumatic_boots')

    /*
     * Jet Boots upgrades ultimately provide extremely strong mobility. Keep
     * the first levels in Atomic infrastructure, then force the two highest
     * levels through accelerator/fusion prestige components.
     */
    const jetBootUpgrades = [1, 2, 3, 4, 5]
    jetBootUpgrades.forEach(level => event.remove({ output: `pneumaticcraft:jet_boots_upgrade_${level}` }))

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

    console.info('[Matterworks] PneumaticCraft powered armour and Jet Boots upgrades moved behind Atomic/Fusion cross-system gates')
})
