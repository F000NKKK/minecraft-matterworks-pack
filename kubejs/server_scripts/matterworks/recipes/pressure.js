console.info('[Matterworks] Loading pressure-engineering progression recipes')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('compressedcreativity') || !Platform.isLoaded('pneumaticcraft')) {
        console.warn('[Matterworks] Pressure progression skipped: Compressed Creativity / PneumaticCraft not loaded')
        return
    }

    /*
     * Compressed Creativity is the bridge between Create rotation and
     * PneumaticCraft pressure. Its two conversion machines are therefore
     * progression boundaries, not free utility blocks.
     */

    event.remove({ output: 'compressedcreativity:rotational_compressor' })
    event.shaped(
        'compressedcreativity:rotational_compressor',
        [
            'SCS',
            'PEP',
            'SAS'
        ],
        {
            S: 'create:shaft',
            C: 'compressedcreativity:compressed_iron_casing',
            P: 'create:precision_mechanism',
            E: 'kubejs:electromechanical_control_unit',
            A: 'create:andesite_alloy'
        }
    )
        .id('matterworks:pressure/rotational_compressor')

    event.remove({ output: 'compressedcreativity:compressed_air_engine' })
    event.shaped(
        'compressedcreativity:compressed_air_engine',
        [
            'SCS',
            'PEP',
            'SAS'
        ],
        {
            S: 'create:shaft',
            C: 'compressedcreativity:compressed_iron_casing',
            P: 'create:precision_mechanism',
            E: 'kubejs:electromechanical_control_unit',
            A: 'create:brass_ingot'
        }
    )
        .id('matterworks:pressure/compressed_air_engine')

    console.info('[Matterworks] Pressure progression registered: Create rotation <-> PneumaticCraft pressure bridge gated')
})
