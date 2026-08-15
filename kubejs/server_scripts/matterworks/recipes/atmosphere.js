console.info('[Matterworks] Loading atmospheric processing recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('pneumaticcraft')) {
        console.warn('[Matterworks] Atmospheric processing skipped: PneumaticCraft not loaded')
        return
    }

    const nitrogen = 'chemlib:nitrogen_fluid'
    const oxygen = 'chemlib:oxygen_fluid'

    /*
     * Pressure / temperature swing adsorption abstraction.
     *
     * The pressure network itself is the atmosphere feed. No bottled or
     * virtual "compressed air" fluid exists anymore.
     *
     * Adsorption:
     *   1000 mL pressure-network air equivalent
     *     -> 780 mB N2
     *     -> oxygen-loaded adsorbent
     *     -> ~10 mB Ar / trace gases vented
     *
     * Regeneration:
     *   oxygen-loaded adsorbent + heat
     *     -> 210 mB O2
     *     -> regenerated adsorbent
     *
     * PneumaticCraft's Thermopneumatic Processing Plant consumes real air
     * according to recipe pressure. At 4 bar the base cost is 200 mL; the
     * 5x air-use multiplier makes one adsorption cycle consume 1000 mL.
     */

    event.shaped(
        Item.of('kubejs:psa_adsorbent', 2),
        [
            'QIQ',
            'ICI',
            'QIQ'
        ],
        {
            Q: '#forge:gems/quartz',
            I: '#forge:ingots/compressed_iron',
            C: 'minecraft:charcoal'
        }
    )
        .id('matterworks:chemistry/atmosphere/psa_adsorbent')

    event.custom({
        type: 'pneumaticcraft:thermo_plant',
        item_input: {
            item: 'kubejs:psa_adsorbent'
        },
        item_output: {
            item: 'kubejs:oxygen_loaded_psa_adsorbent'
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
        .id('matterworks:chemistry/atmosphere/pressure_adsorption')

    event.custom({
        type: 'pneumaticcraft:thermo_plant',
        item_input: {
            item: 'kubejs:oxygen_loaded_psa_adsorbent'
        },
        item_output: {
            item: 'kubejs:psa_adsorbent'
        },
        fluid_output: {
            amount: 210,
            fluid: oxygen
        },
        temperature: {
            min_temp: 373,
            max_temp: 423
        },
        speed: 0.35,
        exothermic: false
    })
        .id('matterworks:chemistry/atmosphere/adsorbent_regeneration')

    console.info(
        '[Matterworks] Atmospheric processing registered: real pneumatic pressure -> N2/O2 separation'
    )
})
