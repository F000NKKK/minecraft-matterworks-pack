console.info('[Matterworks] Loading electrical component recipes')

ServerEvents.recipes(event => {
    /*
     * Matterworks 0.4.1 material vocabulary.
     *
     * Recipes consume semantic material roles instead of concrete mod IDs.
     * The backing items live in materials/tags.js. This is what lets later
     * chemistry/material-science tiers replace primitive materials without
     * rewriting every downstream recipe.
     */
    const copperConductor = '#matterworks:materials/conductors/copper'
    const primitiveDielectric = '#matterworks:materials/dielectrics/primitive'
    const primitiveImpregnant = '#matterworks:materials/impregnants/primitive'
    const magneticCore = '#matterworks:materials/magnetic_cores/primitive'

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
        .id('matterworks:electrical/insulated_copper_wire')


    /*
     * ---------------------------------------------------------
     * Stage 2: Electromagnetic coil
     * ---------------------------------------------------------
     *
     * The first core is merely processed iron sheet. It is intentionally
     * classified as a primitive magnetic core rather than being treated as
     * universally valid magnetic material.
     *
     * Later tiers will introduce soft magnetic iron, silicon steel and
     * specialised alloys with their own operating envelopes.
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
        .id('matterworks:electrical/electromagnetic_coil')


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
                tag: 'matterworks:components/coils/primitive'
            },

            R: {
                tag: 'matterworks:components/capacitors/primitive'
            }
        },

        result: {
            item: 'createaddition:alternator'
        },

        acceptMirrored: false
    }).id('matterworks:electrical/alternator')

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
        .id('matterworks:electrical/primitive_capacitor')


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
            C: '#matterworks:components/capacitors/primitive',
            E: '#matterworks:components/coils/primitive',
            P: 'create:precision_mechanism',
            B: 'mekanism:basic_control_circuit'
        }
    )

    console.info(
        '[Matterworks] Primitive capacitor and gated electric motor registered'
    )

    console.info(
        '[Matterworks] Materials foundation: semantic material roles active'
    )
})
