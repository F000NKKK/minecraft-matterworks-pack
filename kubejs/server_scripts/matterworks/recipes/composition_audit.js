console.info('[Matterworks] Loading material composition audit')

ServerEvents.recipes(event => {
    const registry = global.MatterworksComposition || {}
    const counts = {
        DIRECT: 0,
        PROCESS: 0,
        NUCLEAR: 0,
        MANUFACTURED: 0,
        MIXTURE: 0,
        UNKNOWN: 0
    }

    Object.values(registry).forEach(entry => {
        if (entry && entry.policy in counts) {
            counts[entry.policy]++
        }
    })

    console.info(
        `[Matterworks] Composition audit registered: ${Object.keys(registry).length} materials; ` +
        `DIRECT=${counts.DIRECT}, PROCESS=${counts.PROCESS}, NUCLEAR=${counts.NUCLEAR}, ` +
        `MANUFACTURED=${counts.MANUFACTURED}, MIXTURE=${counts.MIXTURE}, UNKNOWN=${counts.UNKNOWN}`
    )
})
