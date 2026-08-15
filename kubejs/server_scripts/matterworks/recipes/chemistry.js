console.info('[Matterworks] Loading industrial chemistry foundation')

ServerEvents.recipes(event => {
    const graphiteElectrode =
        '#matterworks:materials/electrodes/primitive_electrolysis'

    const primitiveWire =
        '#matterworks:components/wires/primitive'

    const primitiveCapacitor =
        '#matterworks:components/capacitors/primitive'

    /*
     * ---------------------------------------------------------
     * Electrolytic Core
     * ---------------------------------------------------------
     *
     * Mekanism's default core is intentionally replaced with a recipe
     * that represents an actual electrochemical cell stack:
     *
     * - graphite electrodes;
     * - quartz as an early chemically resistant separator/insulator;
     * - insulated conductors;
     * - an electrical capacitor;
     * - osmium/infused-alloy structural and electrical components.
     *
     * This ties the first serious chemistry machine back into the carbon
     * and electrical material chains established in 0.4.x.
     */

    event.remove({
        id: 'mekanism:electrolytic_core'
    })

    event.shaped(
        'mekanism:electrolytic_core',
        [
            'GQG',
            'WCW',
            'OAO'
        ],
        {
            G: graphiteElectrode,
            Q: 'minecraft:quartz',
            W: primitiveWire,
            C: primitiveCapacitor,
            O: '#forge:ingots/osmium',
            A: '#mekanism:alloys/infused'
        }
    )
        .id('matterworks:chemistry/electrolysis/electrolytic_core')

    /*
     * ---------------------------------------------------------
     * Electrolytic Separator
     * ---------------------------------------------------------
     *
     * The separator is now an industrial machine assembled around the
     * electrochemical core rather than an early iron/redstone appliance.
     * Chemical tanks represent independent product-gas handling for the
     * two electrolysis outputs.
     */

    event.remove({
        id: 'mekanism:electrolytic_separator'
    })

    event.shaped(
        'mekanism:electrolytic_separator',
        [
            'STS',
            'CEC',
            'STS'
        ],
        {
            S: '#forge:ingots/steel',
            T: 'mekanism:basic_chemical_tank',
            C: 'mekanism:basic_control_circuit',
            E: 'mekanism:electrolytic_core'
        }
    )
        .id('matterworks:chemistry/electrolysis/electrolytic_separator')

    /*
     * ---------------------------------------------------------
     * Water electrolysis
     * ---------------------------------------------------------
     *
     * Mekanism's native water-separation recipe is deliberately retained:
     * it consumes water and produces hydrogen and oxygen in the correct
     * 2:1 product ratio for H2O electrolysis.
     *
     * We gate the PROCESS through machine construction instead of replacing
     * a chemically reasonable recipe with artificial extra intermediates.
     */

    /*
     * ---------------------------------------------------------
     * Brine electrolysis correction
     * ---------------------------------------------------------
     *
     * Mekanism's aqueous brine recipe directly emits sodium metal and
     * chlorine. That shortcut is not suitable for Matterworks.
     *
     * Metallic sodium will later require molten-salt electrolysis, while
     * aqueous brine belongs to a chlor-alkali process producing chlorine,
     * hydrogen and sodium hydroxide.
     */

    event.remove({
        id: 'mekanism:separator/brine'
    })

    console.info(
        '[Matterworks] Electrolysis foundation registered: graphite cell -> H2/O2; brine sodium shortcut disabled'
    )
})
