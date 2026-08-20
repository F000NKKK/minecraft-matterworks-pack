console.info('[Matterworks] Loading carbon material recipes')

ServerEvents.recipes(event => {
    const coke = 'kubejs:coke'
    const graphite = 'kubejs:graphite'

    /*
     * ---------------------------------------------------------
     * Coal -> Coke
     * ---------------------------------------------------------
     *
     * This represents destructive distillation / coking of coal.
     * The heated Create basin is an early abstraction for a retort.
     *
     * Charcoal intentionally does not enter this recipe: charcoal is
     * already the carbonisation product of biomass and remains a
     * separate biogenic carbon route.
     */

    event.recipes.create.mixing(
        coke,
        '#matterworks:materials/carbon/feedstocks/fossil'
    )
        .heated()
        .id('matterworks:carbon/coking/coal_to_coke')

    /*
     * ---------------------------------------------------------
     * Mekanism carbon gate
     * ---------------------------------------------------------
     *
     * Vanilla Mekanism lets raw coal and charcoal become carbon infusion
     * directly, including through Enriched Carbon. Matterworks removes
     * those shortcuts: industrial steelmaking must first establish a
     * coke-processing line.
     */

    event.remove({
        id: 'mekanism:infusion_conversion/carbon/from_coal'
    })

    event.remove({
        id: 'mekanism:infusion_conversion/carbon/from_coal_block'
    })

    event.remove({
        id: 'mekanism:infusion_conversion/carbon/from_charcoal'
    })

    event.remove({
        id: 'mekanism:infusion_conversion/carbon/from_charcoal_block'
    })

    event.remove({
        id: 'mekanism:enriching/enriched/carbon'
    })

    event.custom({
        type: 'mekanism:enriching',
        input: {
            ingredient: {
                item: coke
            }
        },
        output: {
            item: 'mekanism:enriched_carbon'
        }
    })
        .id('matterworks:carbon/enriching/coke_to_enriched_carbon')

    /*
     * ---------------------------------------------------------
     * Coke -> Graphite
     * ---------------------------------------------------------
     *
     * 0.5.7 used ordinary Mekanism smelting as an electrical-furnace token.
     * That made graphitisation indistinguishable from routine ore smelting.
     * 0.5.8 gives the conversion an explicit high-temperature process window
     * in the Thermopneumatic Processing Plant. 1600 K is deliberately a
     * gameplay process-class threshold, not a claim that industrial graphite
     * is fully graphitised at that exact temperature; Matterworks Core can
     * later replace the abstraction with a richer furnace model.
     */

    if (Platform.isLoaded('pneumaticcraft')) {
        event.custom({
            type: 'pneumaticcraft:thermo_plant',
            item_input: {
                item: coke
            },
            item_output: {
                item: graphite
            },
            temperature: {
                min_temp: 1600
            },
            air_use_multiplier: 4.0,
            speed: 0.25,
            exothermic: false
        })
            .id('matterworks:carbon/graphitization/coke_to_graphite')
    } else {
        console.warn('[Matterworks] Graphitization skipped: PneumaticCraft not loaded')
    }

    console.info(
        '[Matterworks] Carbon chain registered: coal -> coke -> enriched carbon; high-temperature coke -> graphite'
    )
})
