console.info('[Matterworks] Loading experience-capture progression recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('pneumaticcraft')) {
        return
    }

    /*
     * Memory Essence is process-owned player experience, not a chemical
     * material. Keep PneumaticCraft's extraction mechanics intact, but move
     * the hardware that can extract it behind Atomic digital control.
     */
    event.remove({ output: 'pneumaticcraft:memory_stick' })
    event.shaped(
        'pneumaticcraft:memory_stick',
        [
            'PEP',
            'CAC',
            'GSG'
        ],
        {
            P: '#pneumaticcraft:plastic_sheets',
            E: 'ae2:engineering_processor',
            C: 'mekanism:advanced_control_circuit',
            A: 'computercraft:computer_advanced',
            G: '#forge:ingots/gold',
            S: 'minecraft:soul_sand'
        }
    )
        .id('matterworks:experience/memory_stick')

    /*
     * The Aerial Interface is the stationary high-throughput path. Requiring
     * the portable capture device preserves PneumaticCraft's concept while
     * making the machine an upgrade of an already-established experience
     * capture process instead of an unrelated shortcut.
     */
    event.remove({ output: 'pneumaticcraft:aerial_interface' })
    event.shaped(
        'pneumaticcraft:aerial_interface',
        [
            'WHW',
            'MSM',
            'WTW'
        ],
        {
            W: 'pneumaticcraft:pressure_chamber_wall',
            H: 'pneumaticcraft:omnidirectional_hopper',
            M: 'pneumaticcraft:memory_stick',
            S: 'minecraft:nether_star',
            T: 'pneumaticcraft:advanced_pressure_tube'
        }
    )
        .id('matterworks:experience/aerial_interface')

    console.info('[Matterworks] Experience capture registered: digital Memory Stick -> Aerial Interface')
})
