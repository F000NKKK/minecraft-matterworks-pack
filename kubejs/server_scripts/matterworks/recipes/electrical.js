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

    /*
     * ---------------------------------------------------------
     * Primitive Capacitor
     * ---------------------------------------------------------
     *
     * Early electrical storage/control component.
     *
     * This is intentionally mechanical to manufacture:
     * copper electrodes + dielectric + wax impregnation.
     */

    event.remove({
        output: 'createaddition:capacitor'
    })

    event.recipes.create.sequenced_assembly(
        'createaddition:capacitor',
        'create:copper_sheet',
        [
            event.recipes.create.deploying(
                'create:copper_sheet',
                [
                    'create:copper_sheet',
                    'minecraft:paper'
                ]
            ),

            event.recipes.create.deploying(
                'create:copper_sheet',
                [
                    'create:copper_sheet',
                    'minecraft:honeycomb'
                ]
            ),

            event.recipes.create.deploying(
                'create:copper_sheet',
                [
                    'create:copper_sheet',
                    'minecraft:redstone'
                ]
            ),

            event.recipes.create.pressing(
                'create:copper_sheet',
                'create:copper_sheet'
            )
        ]
    )
        .transitionalItem('create:copper_sheet')
        .loops(2)


    /*
     * ---------------------------------------------------------
     * Electric Motor
     * ---------------------------------------------------------
     *
     * Motor is NOT part of the first electrical age.
     *
     * Unlocking FE -> kinetic conversion before Mekanism would
     * trivialise the mechanical infrastructure that got us here.
     */

    event.remove({
        output: 'createaddition:electric_motor'
    })

    event.shaped(
        'createaddition:electric_motor',
        [
            'SCS',
            'EPE',
            'SBS'
        ],
        {
            S: '#forge:ingots/steel',
            C: 'createaddition:capacitor',
            E: 'kubejs:electromagnetic_coil',
            P: 'create:precision_mechanism',
            B: 'mekanism:basic_control_circuit'
        }
    )

    console.info(
        '[Matterworks] Primitive capacitor and gated electric motor registered'
    )
})
