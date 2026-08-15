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
