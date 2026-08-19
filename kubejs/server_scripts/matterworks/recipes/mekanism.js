ServerEvents.recipes(event => {
    const controlUnit = 'kubejs:electromechanical_control_unit'
    const incompleteControlUnit =
        'kubejs:incomplete_electromechanical_control_unit'

    /*
     * Matterworks: Electromechanical Control Unit
     *
     * First integration component between the mechanical and electrical eras.
     * The quest graph requires primitive wiring and charge-storage engineering
     * before this milestone, so the physical recipe now consumes both instead
     * of making those prerequisites purely narrative.
     */
    event.recipes.create.sequenced_assembly(
        controlUnit,
        'create:precision_mechanism',
        [
            event.recipes.create.deploying(
                incompleteControlUnit,
                [incompleteControlUnit, '#matterworks:components/wires/primitive']
            ),

            event.recipes.create.deploying(
                incompleteControlUnit,
                [incompleteControlUnit, '#matterworks:components/capacitors/primitive']
            ),

            event.recipes.create.deploying(
                incompleteControlUnit,
                [incompleteControlUnit, 'minecraft:redstone']
            ),

            event.recipes.create.pressing(
                incompleteControlUnit,
                incompleteControlUnit
            ),

            event.recipes.create.deploying(
                incompleteControlUnit,
                [incompleteControlUnit, 'minecraft:quartz']
            )
        ]
    )
        .transitionalItem(incompleteControlUnit)
        .loops(1)
        .id('matterworks:mekanism/electromechanical_control_unit')

    /*
     * Remove Mekanism's default entry point.
     */
    event.remove({
        output: 'mekanism:metallurgic_infuser'
    })

    /*
     * The Metallurgic Infuser now requires an established Create production
     * line and the electromechanical control component proven in Phase 1.
     */
    event.shaped(
        'mekanism:metallurgic_infuser',
        [
            'BOB',
            'EPE',
            'CRC'
        ],
        {
            B: 'create:brass_casing',
            O: '#forge:ingots/osmium',
            E: controlUnit,
            P: 'create:precision_mechanism',
            C: '#forge:ingots/copper',
            R: 'minecraft:redstone_block'
        }
    )
})
