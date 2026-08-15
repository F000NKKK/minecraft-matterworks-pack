console.info('[Matterworks] Loading atmospheric processing recipes')

ServerEvents.recipes(event => {
    const compressedAir = 'kubejs:compressed_air'
    const nitrogen = 'chemlib:nitrogen_fluid'
    const oxygen = 'chemlib:oxygen_fluid'

    /*
     * ---------------------------------------------------------
     * Atmospheric compression
     * ---------------------------------------------------------
     *
     * Air is an implicit renewable process feed. Producing compressed air
     * must nevertheless require actual compression work.
     *
     * The first Matterworks implementation therefore uses Create Compacting:
     * a Mechanical Press operating over a Basin acts as the primitive
     * mechanical compressor. The reusable filter represents the intake/filter
     * stage and is returned unchanged.
     *
     * A dedicated electrically driven compressor can supersede this route in
     * a later tier without changing compressed air into a different substance.
     */

    event.recipes.create.compacting(
        [
            Fluid.of(compressedAir, 1000),
            'create:filter'
        ],
        [
            'create:filter'
        ]
    )
        .id('matterworks:chemistry/atmosphere/mechanical_air_compression')

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
        '[Matterworks] Atmospheric processing registered: mechanical compression -> compressed air -> N2 + O2'
    )
})
