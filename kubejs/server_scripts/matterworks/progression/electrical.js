console.info('[Matterworks] Loading Electrical Engineering progression')

ServerEvents.recipes(event => {
    /*
     * 0.5.7 disabled the entire Mekanism generator family to protect the
     * Create -> alternator electrical bootstrap.  That solved bypasses but
     * also erased legitimate later energy technologies.
     *
     * 0.5.8 keeps only photovoltaics unavailable until Matterworks has an
     * explicit semiconductor / photovoltaic manufacturing branch.  The other
     * generators return through recipes whose components prove the physical
     * capability that makes that generator class reasonable.
     */
    const generatorOutputs = [
        'mekanismgenerators:heat_generator',
        'mekanismgenerators:wind_generator',
        'mekanismgenerators:solar_generator',
        'mekanismgenerators:advanced_solar_generator',
        'mekanismgenerators:bio_generator',
        'mekanismgenerators:gas_burning_generator'
    ]

    generatorOutputs.forEach(generator => event.remove({ output: generator }))

    /*
     * Thermal-gradient generation.
     *
     * The Matterworks alternator is the established electromechanical core;
     * copper sheets provide the heat-transfer shell and a furnace represents
     * the primitive hot-side assembly.  This is an optional early electrical
     * source, not a prerequisite for chemistry.
     */
    event.shaped(
        'mekanismgenerators:heat_generator',
        [
            'CCC',
            'AFA',
            'CEC'
        ],
        {
            C: 'create:copper_sheet',
            A: 'createaddition:alternator',
            F: 'minecraft:furnace',
            E: 'kubejs:electromechanical_control_unit'
        }
    ).id('matterworks:energy/heat_generator')

    /*
     * Wind generation.
     *
     * Wind does not require metallurgy chemistry, but it does require the same
     * repeatable generator, winding and mechanical-control capabilities already
     * proven by the alternator program.  Iron sheet is structural rather than a
     * fake turbine-alloy gate.
     */
    event.shaped(
        'mekanismgenerators:wind_generator',
        [
            'IPI',
            'CAC',
            'IEI'
        ],
        {
            I: '#forge:plates/iron',
            P: 'create:propeller',
            C: 'kubejs:electromagnetic_coil',
            A: 'createaddition:alternator',
            E: 'kubejs:electromechanical_control_unit'
        }
    ).id('matterworks:energy/wind_generator')

    /*
     * Renewable-fuel generation.
     *
     * The Bio-Generator returns only after the player owns reaction chemistry
     * and thermopneumatic renewable-fuel hardware.  A biodiesel bucket is the
     * commissioning/process proof rather than an arbitrary rare ingredient.
     */
    event.shaped(
        'mekanismgenerators:bio_generator',
        [
            'SBS',
            'PEP',
            'SCS'
        ],
        {
            S: '#forge:ingots/steel',
            B: 'pneumaticcraft:biodiesel_bucket',
            P: 'pneumaticcraft:thermopneumatic_processing_plant',
            E: 'kubejs:electromechanical_control_unit',
            C: 'mekanism:pressurized_reaction_chamber'
        }
    ).id('matterworks:energy/bio_generator')

    /*
     * Gas turbine / combustion generation.
     *
     * This machine can turn several already-useful process gases into large
     * amounts of FE, so it belongs at the mature chemical-plant boundary.  The
     * recipe converges reaction chemistry, petrochemical fractionation,
     * specialty chemistry and dedicated gas containment.
     */
    event.shaped(
        'mekanismgenerators:gas_burning_generator',
        [
            'TCT',
            'RGR',
            'AEA'
        ],
        {
            T: 'mekanism:advanced_chemical_tank',
            C: 'mekanism:advanced_control_circuit',
            R: 'mekanism:pressurized_reaction_chamber',
            G: 'pneumaticcraft:refinery',
            A: 'nuclearcraft:chemical_reactor',
            E: 'kubejs:electromagnetic_coil'
        }
    ).id('matterworks:energy/gas_burning_generator')

    console.info(
        '[Matterworks] Electrical generation registered: alternator-gated heat/wind, renewable bio and mature process-gas generation; photovoltaics remain blocked pending semiconductor engineering'
    )
})
