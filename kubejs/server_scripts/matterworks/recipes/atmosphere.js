console.info('[Matterworks] Loading atmospheric processing recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('pneumaticcraft')) {
        console.warn('[Matterworks] Atmospheric processing skipped: PneumaticCraft not loaded')
        return
    }

    const nitrogen = 'chemlib:nitrogen_fluid'

    /*
     * Pressure-swing adsorption abstraction.
     *
     * The pressure network itself is the atmosphere feed. No bottled or
     * virtual "compressed air" fluid exists.
     *
     * 0.5.8 models `molecular_sieve_charge` as replaceable carbon molecular
     * sieve media rather than a disposable metal cartridge. Charcoal is the
     * carbon precursor; hot water/steam activation in the Thermopneumatic
     * Processing Plant represents pore development and media conditioning.
     * The resulting stackable charge compresses bed replacement/regeneration
     * into a maintainable gameplay consumable.
     *
     * The nitrogen generator recovers the nitrogen fraction. Oxygen, argon
     * and trace gases are vented as the oxygen-rich waste stream. Oxygen for
     * chemistry continues to come from the established water-electrolysis
     * route until a later cryogenic-separation tier is introduced.
     */

    event.custom({
        type: 'pneumaticcraft:thermo_plant',
        item_input: {
            item: 'minecraft:charcoal'
        },
        fluid_input: {
            type: 'pneumaticcraft:fluid',
            amount: 250,
            tag: 'minecraft:water'
        },
        item_output: {
            count: 2,
            item: 'kubejs:molecular_sieve_charge'
        },
        pressure: 2.0,
        temperature: {
            min_temp: 700
        },
        air_use_multiplier: 2.0,
        speed: 0.5,
        exothermic: false
    })
        .id('matterworks:chemistry/atmosphere/molecular_sieve_charge')

    event.custom({
        type: 'pneumaticcraft:thermo_plant',
        item_input: {
            item: 'kubejs:molecular_sieve_charge'
        },
        fluid_output: {
            amount: 780,
            fluid: nitrogen
        },
        pressure: 4.0,
        temperature: {
            max_temp: 330
        },
        air_use_multiplier: 5.0,
        speed: 0.5,
        exothermic: false
    })
        .id('matterworks:chemistry/atmosphere/pressure_swing_nitrogen')

    console.info(
        '[Matterworks] Atmospheric processing registered: steam-activated carbon molecular sieve -> pneumatic PSA -> nitrogen'
    )
})
