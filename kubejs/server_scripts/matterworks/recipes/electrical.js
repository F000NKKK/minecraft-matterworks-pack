console.info('[Matterworks] Loading electrical component recipes')

ServerEvents.recipes(event => {
    const insulatedWire = 'kubejs:insulated_copper_wire'
    const incompleteInsulatedWire =
        'kubejs:incomplete_insulated_copper_wire'

    const coil = 'kubejs:electromagnetic_coil'
    const incompleteCoil =
        'kubejs:incomplete_electromagnetic_coil'

    /*
     * ---------------------------------------------------------
     * Stage 1: Copper conductor insulation
     * ---------------------------------------------------------
     *
     * Early-game insulation uses waxed paper.
     * Later this will be superseded by rubber/polymer insulation
     * from the chemical industry.
     */

    event.recipes.create.sequenced_assembly(
        insulatedWire,
        'createaddition:copper_wire',
        [
            event.recipes.create.deploying(
                incompleteInsulatedWire,
                [
                    incompleteInsulatedWire,
                    'minecraft:paper'
                ]
            ),

            event.recipes.create.deploying(
                incompleteInsulatedWire,
                [
                    incompleteInsulatedWire,
                    'minecraft:honeycomb'
                ]
            ),

            event.recipes.create.pressing(
                incompleteInsulatedWire,
                incompleteInsulatedWire
            )
        ]
    )
        .transitionalItem(incompleteInsulatedWire)
        .loops(2)


    /*
     * ---------------------------------------------------------
     * Stage 2: Electromagnetic coil
     * ---------------------------------------------------------
     *
     * Copper winding around an iron magnetic core.
     */

    event.recipes.create.sequenced_assembly(
        coil,
        '#forge:rods/iron',
        [
            event.recipes.create.deploying(
                incompleteCoil,
                [
                    incompleteCoil,
                    insulatedWire
                ]
            ),

            event.recipes.create.deploying(
                incompleteCoil,
                [
                    incompleteCoil,
                    insulatedWire
                ]
            ),

            event.recipes.create.pressing(
                incompleteCoil,
                incompleteCoil
            )
        ]
    )
        .transitionalItem(incompleteCoil)
        .loops(2)


    /*
     * ---------------------------------------------------------
     * Stage 3: Matterworks Alternator
     * ---------------------------------------------------------
     */

    event.remove({
        output: 'createaddition:alternator'
    })

    event.custom({
        type: 'create:mechanical_crafting',

        pattern: [
            ' IPI ',
            ' C C ',
            'ICRCI',
            ' C C ',
            ' IPI '
        ],

        key: {
            I: {
                tag: 'forge:plates/iron'
            },

            P: {
                item: 'create:precision_mechanism'
            },

            C: {
                item: coil
            },

            R: {
                item: 'createaddition:capacitor'
            }
        },

        result: {
            item: 'createaddition:alternator'
        },

        acceptMirrored: false
    })

    console.info(
        '[Matterworks] Electrical component production chain registered'
    )
})
