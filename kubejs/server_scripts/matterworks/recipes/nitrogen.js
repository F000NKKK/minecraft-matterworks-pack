console.info('[Matterworks] Loading nitrogen chemistry recipes')

ServerEvents.recipes(event => {
    const nitrogen = 'chemlib:nitrogen_fluid'
    const hydrogen = 'mekanism:hydrogen'
    const ammonia = 'chemlib:ammonia_fluid'
    const ironCatalyst = 'mekanism:dust_iron'

    /*
     * ---------------------------------------------------------
     * Haber-Bosch synthesis — first implementation
     * ---------------------------------------------------------
     *
     * Stoichiometric process basis:
     *
     *      N2 + 3 H2 <-> 2 NH3
     *
     * Fluid amounts preserve the 1:3:2 molar/volume relationship used by
     * the simplified gas model. The heated basin currently represents the
     * reactor temperature boundary; upstream gas handling/compression and
     * the reusable iron catalyst represent the remaining plant dependency.
     *
     * This is intentionally a process abstraction. Matterworks Core will
     * later replace it with explicit pressure, temperature, equilibrium,
     * recycle/purge and catalyst-activity behaviour.
     */

    event.recipes.create.mixing(
        [
            Fluid.of(ammonia, 200),
            Item.of(ironCatalyst).withChance(0.98)
        ],
        [
            Fluid.of(nitrogen, 100),
            Fluid.of(hydrogen, 300),
            ironCatalyst
        ]
    )
        .heated()
        .id('matterworks:chemistry/nitrogen/haber_bosch_ammonia')

    console.info(
        '[Matterworks] Nitrogen chemistry registered: N2 + 3H2 -> 2NH3'
    )
})
