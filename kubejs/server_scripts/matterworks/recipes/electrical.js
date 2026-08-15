console.info('[Matterworks] Loading electrical component recipes')

ServerEvents.recipes(event => {
    /*
     * Matterworks 0.4.1 material vocabulary.
     *
     * These are deliberately explicit even where an existing mod item
     * represents the material form. The goal is to make later material
     * substitutions (rubber, polymers, magnetic alloys, etc.) local and
     * auditable instead of scattering magic IDs through recipes.
     */
    const copperConductor = 'createaddition:copper_wire'
    const primitiveDielectric = 'minecraft:paper'
    const primitiveImpregnant = 'minecraft:honeycomb'
    const magneticCore = 'create:iron_sheet'

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
     * Early-game insulation is deliberately primitive:
     * paper provides the dielectric layer and wax impregnation
     * improves moisture resistance.
     *
     * It is good enough for the first low-power electrical era,
     * but it is NOT the final Matterworks cable technology.
     * Industrial chemistry will later replace it with rubber and
     * polymer insulation.
     */

    event.recipes.create.sequenced_assembly(
        insulatedWire,
        copperConductor,
        [
            event.recipes.create.deploying(
                incompleteInsulatedWire,
                [
                    incompleteInsulatedWire,
                    primitiveDielectric
                ]
            ),

            event.recipes.create.deploying(
                incompleteInsulatedWire,
                [
                    incompleteInsulatedWire,
                    primitiveImpregnant
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
     * The core now requires processed sheet iron rather than an
     * abstract iron rod. This is the first step toward a real
     * magnetic-material system.
     *
     * In later tiers generic iron will stop being sufficient:
     * soft magnetic iron, silicon steel and specialised magnetic
     * alloys will have distinct operating envelopes.
     */

    event.recipes.create.sequenced_assembly(
        coil,
        magneticCore,
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
        .loops(3)


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
     * Copper electrodes + primitive dielectric + wax impregnation.
     * This component intentionally belongs to the mechanical era:
     * the first generator must be manufacturable before FE exists.
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
                    primitiveDielectric
                ]
            ),

            event.recipes.create.deploying(
                'create:copper_sheet',
                [
                    'create:copper_sheet',
                    primitiveImpregnant
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
            E: coil,
            P: 'create:precision_mechanism',
            B: 'mekanism:basic_control_circuit'
        }
    )

    console.info(
        '[Matterworks] Primitive capacitor and gated electric motor registered'
    )

    console.info(
        '[Matterworks] Materials foundation: conductor, dielectric and magnetic core roles registered'
    )
})
