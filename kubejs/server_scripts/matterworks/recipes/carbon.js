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
     * Industrial graphitisation is a very high-temperature process.
     * The Energized Smelter is currently used as the electrical-furnace
     * abstraction. Matterworks Core will later model actual temperature
     * and process envelopes instead of representing this only by a recipe.
     */

    event.custom({
        type: 'mekanism:smelting',
        input: {
            ingredient: {
                item: coke
            }
        },
        output: {
            item: graphite
        }
    })
        .id('matterworks:carbon/graphitization/coke_to_graphite')

    console.info(
        '[Matterworks] Carbon chain registered: coal -> coke -> enriched carbon / graphite'
    )
})
