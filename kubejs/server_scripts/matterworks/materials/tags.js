console.info('[Matterworks] Loading material role tags')

ServerEvents.tags('item', event => {
    // Raw / semi-finished electrical materials.
    event.add(
        'matterworks:materials/conductors/copper',
        'createaddition:copper_wire'
    )

    event.add(
        'matterworks:materials/dielectrics/primitive',
        'minecraft:paper'
    )

    event.add(
        'matterworks:materials/impregnants/primitive',
        'minecraft:honeycomb'
    )

    event.add(
        'matterworks:materials/magnetic_cores/primitive',
        'create:iron_sheet'
    )

    // Carbon feedstocks are deliberately separated by origin.
    // Charcoal is a renewable biogenic carbon source; coke is an
    // industrial fossil-carbon reductant and must not be interchangeable
    // with raw coal in advanced metallurgy.
    event.add(
        'matterworks:materials/carbon/feedstocks/fossil',
        'minecraft:coal'
    )

    event.add(
        'matterworks:materials/carbon/feedstocks/biogenic',
        'minecraft:charcoal'
    )

    event.add(
        'matterworks:materials/carbon/reductants/metallurgical',
        'kubejs:coke'
    )

    event.add(
        'matterworks:materials/carbon/allotropes/graphite',
        'kubejs:graphite'
    )

    // Graphite becomes the first explicit electrochemical electrode
    // material in the pack. Later chemistry can add alternative electrode
    // materials without changing every machine recipe that consumes them.
    event.add(
        'matterworks:materials/electrodes/graphite',
        'kubejs:graphite'
    )

    event.add(
        'matterworks:materials/electrodes/primitive_electrolysis',
        '#matterworks:materials/electrodes/graphite'
    )

    /*
     * Cross-mod naming aliases
     *
     * NuclearCraft publishes both aluminum/aluminium aliases for its own
     * forms. ChemLib uses the US spelling. Add ChemLib to the British Forge
     * aliases as well so recipes from either ecosystem remain symmetric.
     */
    event.add('forge:ingots/aluminium', 'chemlib:aluminum_ingot')
    event.add('forge:nuggets/aluminium', 'chemlib:aluminum_nugget')
    event.add('forge:dusts/aluminium', 'chemlib:aluminum_dust')
    event.add('forge:plates/aluminium', 'chemlib:aluminum_plate')

    // Finished electrical components. These tags are intentionally
    // capability-oriented: later tiers can add alternative components
    // without forcing every consuming recipe to know their concrete IDs.
    event.add(
        'matterworks:components/wires/primitive',
        'kubejs:insulated_copper_wire'
    )

    event.add(
        'matterworks:components/coils/primitive',
        'kubejs:electromagnetic_coil'
    )

    event.add(
        'matterworks:components/capacitors/primitive',
        'createaddition:capacitor'
    )

    console.info('[Matterworks] Material role tags registered')
})

const matterworksExactFluidEquivalents = [
    'hydrogen',
    'helium',
    'nitrogen',
    'oxygen',
    'fluorine',
    'neon',
    'chlorine',
    'argon',
    'radon',
    'carbon_dioxide',
    'carbon_monoxide',
    'ammonia',
    'nitric_oxide',
    'nitrogen_dioxide',
    'sulfur_dioxide',
    'sulfur_trioxide',
    'ethanol',
    'mercury',
    'hydrochloric_acid',
    'nitric_acid',
    'sulfuric_acid'
]

const matterworksGaseousFluidEquivalents = [
    'hydrogen',
    'helium',
    'nitrogen',
    'oxygen',
    'fluorine',
    'neon',
    'chlorine',
    'argon',
    'radon',
    'carbon_dioxide',
    'carbon_monoxide',
    'ammonia',
    'nitric_oxide',
    'nitrogen_dioxide',
    'sulfur_dioxide',
    'sulfur_trioxide'
]

const matterworksMekanismGasFluidEquivalents = [
    'hydrogen',
    'oxygen',
    'chlorine',
    'sulfur_dioxide',
    'sulfur_trioxide'
]

ServerEvents.tags('fluid', event => {
    /*
     * ChemLib registers concrete chemical fluids but does not publish
     * per-substance forge:<name> fluid tags. NuclearCraft and Mekanism use
     * those tags as process interfaces, so add only verified same-substance
     * ordinary fluids here.
     *
     * Do not put isotope, cryogenic, irradiated or solution-state fluids in
     * this table. Phase/composition is progression-relevant in Matterworks.
     */
    matterworksExactFluidEquivalents.forEach(name => {
        event.add(`forge:${name}`, `chemlib:${name}_fluid`)
    })

    /*
     * C2H4 naming: NuclearCraft/Mekanism use "ethene"; ChemLib uses
     * "ethylene". Both Forge spellings deliberately resolve the same
     * ordinary process fluid.
     */
    event.add('forge:ethene', 'chemlib:ethylene_fluid')
    event.add('forge:ethylene', 'chemlib:ethylene_fluid')
    event.add('forge:ethylene', 'nuclearcraft:ethene')
    event.add('forge:ethylene', 'mekanism:ethene')

    matterworksGaseousFluidEquivalents.forEach(name => {
        event.add(`forge:gases/${name}`, `chemlib:${name}_fluid`)
        event.add(`forge:gases/${name}`, `nuclearcraft:${name}`)
    })

    matterworksMekanismGasFluidEquivalents.forEach(name => {
        event.add(`forge:gases/${name}`, `mekanism:${name}`)
    })

    event.add('forge:gases/ethene', 'chemlib:ethylene_fluid')
    event.add('forge:gases/ethene', 'nuclearcraft:ethene')
    event.add('forge:gases/ethene', 'mekanism:ethene')
    event.add('forge:gases/ethylene', 'chemlib:ethylene_fluid')
    event.add('forge:gases/ethylene', 'nuclearcraft:ethene')
    event.add('forge:gases/ethylene', 'mekanism:ethene')

    console.info(
        `[Matterworks] Chemistry fluid tags registered: ${matterworksExactFluidEquivalents.length} exact substances + ethene/ethylene alias`
    )
})
