console.info('[Matterworks] Loading petrochemical and polymer-feedstock corrections')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('pneumaticcraft') || !Platform.isLoaded('mekanism')) {
        console.warn('[Matterworks] Petrochemical corrections skipped: PneumaticCraft / Mekanism not loaded')
        return
    }

    /*
     * ---------------------------------------------------------
     * Light hydrocarbon -> ethylene
     * ---------------------------------------------------------
     *
     * The stock Mekanism HDPE chain creates ethene while processing biofuel,
     * water and hydrogen. That is convenient gameplay, but it makes the
     * polymer monomer appear from a biologically named fuel stream with no
     * petrochemical cracking step.
     *
     * Matterworks instead obtains ethylene from the light fraction produced by
     * the refinery. The Thermopneumatic Processing Plant represents the heated
     * cracking coil; a water bucket represents steam dilution and is returned
     * as an empty bucket. The 1000 K threshold is a gameplay process envelope,
     * not a complete furnace/kinetics simulation.
     */
    event.custom({
        type: 'pneumaticcraft:thermo_plant',
        item_input: {
            item: 'minecraft:water_bucket'
        },
        fluid_input: {
            type: 'pneumaticcraft:fluid',
            amount: 250,
            fluid: 'pneumaticcraft:lpg'
        },
        item_output: {
            item: 'minecraft:bucket'
        },
        fluid_output: {
            amount: 500,
            fluid: 'chemlib:ethylene_fluid'
        },
        temperature: {
            min_temp: 1000
        },
        air_use_multiplier: 4.0,
        speed: 0.35,
        exothermic: false
    })
        .id('matterworks:petrochemistry/steam_cracking/lpg_to_ethylene')

    /*
     * ---------------------------------------------------------
     * Substrate seed production
     * ---------------------------------------------------------
     *
     * Remove the stock PRC recipe whose by-product is Mekanism ethene. Biomass
     * still supplies the solid substrate seed, but hydrogen is now a consumed
     * conditioning reagent rather than the source of the polymer monomer.
     * Subsequent HDPE production consumes refinery-derived ethylene through the
     * existing forge:ethene fluid interface.
     */
    event.remove({ id: 'mekanism:reaction/substrate/water_hydrogen' })

    event.custom({
        type: 'mekanism:reaction',
        duration: 120,
        energyRequired: 1000,
        fluidInput: {
            amount: 100,
            tag: 'minecraft:water'
        },
        gasInput: {
            amount: 100,
            gas: 'mekanism:hydrogen'
        },
        gasOutput: {
            amount: 90,
            gas: 'mekanism:hydrogen'
        },
        itemInput: {
            amount: 2,
            ingredient: {
                tag: 'forge:fuels/bio'
            }
        },
        itemOutput: {
            item: 'mekanism:substrate'
        }
    })
        .id('matterworks:polymers/substrate/biomass_conditioning')

    console.info('[Matterworks] Petrochemical chain registered: refinery LPG -> steam cracking -> ethylene; biofuel no longer creates ethene')
})
