console.info('[Matterworks] Loading Electrical Engineering progression')

ServerEvents.recipes(event => {
    const blockedEarlyGenerators = [
        'mekanismgenerators:heat_generator',
        'mekanismgenerators:wind_generator',
        'mekanismgenerators:solar_generator',
        'mekanismgenerators:advanced_solar_generator',
        'mekanismgenerators:bio_generator',
        'mekanismgenerators:gas_burning_generator'
    ]

    blockedEarlyGenerators.forEach(generator => {
        event.remove({ output: generator })
    })

    console.info(
        `[Matterworks] Disabled ${blockedEarlyGenerators.length} default Mekanism generator recipes`
    )
})
