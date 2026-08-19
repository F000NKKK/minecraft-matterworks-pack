console.info('[Matterworks] Loading nitrogen chemistry recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('pneumaticcraft')) {
        console.warn('[Matterworks] Nitrogen chemistry skipped: PneumaticCraft not loaded')
        return
    }

    const ironCatalyst = 'mekanism:dust_iron'

    /*
     * ---------------------------------------------------------
     * Haber-Bosch synthesis — pressure-owned implementation
     * ---------------------------------------------------------
     *
     * Stoichiometric process basis:
     *
     *      N2 + 3 H2 <-> 2 NH3
     *
     * 0.5.7 represented this as a heated Create basin. That erased the most
     * important engineering boundary of the process: a compressed synthesis
     * loop. 0.5.8 moves the reaction into PneumaticCraft's pressure chamber.
     * ChemLib units are used as the pack's stoichiometric gas basis; pressure
     * chamber pressure is a gameplay process-class requirement, not a claim
     * that the displayed PNC number is the real plant pressure in bar.
     *
     * Iron dust is returned with the products. Catalyst replacement/activity
     * remains an abstraction, but catalyst is no longer randomly destroyed by
     * each reaction event.
     */

    event.custom({
        type: 'pneumaticcraft:pressure_chamber',
        inputs: [
            {
                item: 'chemlib:nitrogen'
            },
            {
                type: 'pneumaticcraft:stacked_item',
                count: 3,
                item: 'chemlib:hydrogen'
            },
            {
                item: ironCatalyst
            }
        ],
        pressure: 4.5,
        results: [
            {
                count: 2,
                item: 'chemlib:ammonia'
            },
            {
                item: ironCatalyst
            }
        ]
    })
        .id('matterworks:chemistry/nitrogen/haber_bosch_ammonia')

    console.info(
        '[Matterworks] Nitrogen chemistry registered: pressure-owned N2 + 3H2 -> 2NH3 with reusable iron catalyst'
    )
})
