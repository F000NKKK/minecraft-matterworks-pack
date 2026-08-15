console.info('[Matterworks] Loading atmospheric processing recipes')

ServerEvents.recipes(event => {
    const compressedAir = 'kubejs:compressed_air'
    const nitrogen = 'chemlib:nitrogen_fluid'
    const oxygen = 'chemlib:oxygen_fluid'

    /*
     * ---------------------------------------------------------
     * Atmospheric capture / compression
     * ---------------------------------------------------------
     *
     * The atmosphere itself is intentionally renewable. The engineering
     * cost is the continuously powered machinery required to capture and
     * compress it, not a finite "air ore" item.
     *
     * Create's filter acts as the reusable intake/filter medium. It is
     * consumed by the recipe and returned unchanged, making it a process
     * component rather than a feedstock.
     */

    event.recipes.create.mixing(
        [
            Fluid.of(compressedAir, 1000),
            'create:filter'
        ],
        [
            'create:filter'
        ]
    )
        .id('matterworks:chemistry/atmosphere/capture_compressed_air')

    /*
     * ---------------------------------------------------------
     * Pressure-swing adsorption abstraction
     * ---------------------------------------------------------
     *
     * 1000 mB compressed air is separated approximately according to dry
     * atmospheric composition:
     *
     *   ~78 % nitrogen
     *   ~21 % oxygen
     *   ~ 1 % argon / trace gases (not recovered in this stage)
     *
     * Quartz currently represents a reusable silica-rich adsorption bed.
     * Matterworks Core will eventually replace this recipe abstraction with
     * pressure, bed saturation, cycle timing and purity constraints.
     */

    event.recipes.create.mixing(
        [
            Fluid.of(nitrogen, 780),
            Fluid.of(oxygen, 210),
            'minecraft:quartz'
        ],
        [
            Fluid.of(compressedAir, 1000),
            'minecraft:quartz'
        ]
    )
        .id('matterworks:chemistry/atmosphere/air_separation')

    console.info(
        '[Matterworks] Atmospheric processing registered: air -> compressed air -> N2 + O2'
    )
})
