ServerEvents.recipes(event => {
    const controlUnit = 'kubejs:electromechanical_control_unit'
    const incompleteControlUnit =
        'kubejs:incomplete_electromechanical_control_unit'

    /*
     * Matterworks: Electromechanical Control Unit
     *
     * First integration component between the mechanical
     * and electrical eras.
     */
    event.recipes.create.sequenced_assembly(
        controlUnit,
        'create:precision_mechanism',
        [
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
        .loops(2)

    /*
     * Remove Mekanism's default entry point.
     */
    event.remove({
        output: 'mekanism:metallurgic_infuser'
    })

    /*
     * The Metallurgic Infuser now requires an established
     * Create production line.
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
