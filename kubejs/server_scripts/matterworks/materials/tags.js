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
