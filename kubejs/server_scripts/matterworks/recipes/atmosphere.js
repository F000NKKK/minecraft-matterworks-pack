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
     * `molecular_sieve_charge` is now the replaceable adsorbent media, not a
     * fake disposable pressure vessel. Quartz supplies the silica fraction,
     * clay supplies the aluminosilicate precursor and sodium hydroxide stands
     * in for the alkaline zeolite-synthesis/activation step. Media replacement
     * and regeneration are compressed into one stackable maintenance charge.
     *
     * The nitrogen generator recovers the nitrogen fraction. Oxygen, argon
     * and trace gases are vented as the oxygen-rich waste stream. Oxygen for
     * chemistry continues to come from the established water-electrolysis
     * route until a later cryogenic-separation tier is introduced.
     */

    event.shaped(
        Item.of('kubejs:molecular_sieve_charge', 4),
        [
            'QAQ',
            'ASA',
            'QAQ'
        ],
        {
            Q: '#forge:gems/quartz',
            A: 'minecraft:clay_ball',
            S: 'chemlib:sodium_hydroxide'
        }
    )
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
        '[Matterworks] Atmospheric processing registered: pneumatic PSA -> nitrogen with replaceable aluminosilicate molecular-sieve media'
    )
})
