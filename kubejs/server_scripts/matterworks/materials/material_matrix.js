console.info('[Matterworks] Loading material-matrix compatibility edges')

/*
 * This script contains only compatibility edges proven by the material matrix.
 *
 * It deliberately does NOT duplicate ordinary Forge material tags already
 * supplied correctly by the installed mods. Steel, bronze, electrum, mineral
 * dusts, etc. should interoperate through their existing forge:<form>/<name>
 * tags rather than through extra shapeless conversion recipes.
 *
 * Process intermediates and manufactured states (Mekanism shards/clumps,
 * Create crushed ores, NuclearCraft specialist mixtures, wires/rods/spools,
 * irradiated materials, etc.) must never be added here just because their
 * display names share a base material.
 */

ServerEvents.tags('item', event => {
    /*
     * Wheat flour
     *
     * NuclearCraft's Manufactory produces nuclearcraft:flour from wheat seeds.
     * Create publishes its wheat flour through the common Forge food-material
     * boundaries forge:flour and forge:flour/wheat.
     *
     * Add only the missing tag membership. Do not create a 1:1 inventory
     * conversion: each mod's milling/manufactory yield remains authoritative.
     */
    event.add('forge:flour', 'nuclearcraft:flour')
    event.add('forge:flour/wheat', 'nuclearcraft:flour')

    // Matterworks role tag for recipes that specifically require wheat flour
    // while remaining independent of the concrete provider item.
    event.add(
        'matterworks:materials/organics/flour/wheat',
        '#forge:flour/wheat'
    )

    console.info('[Matterworks] Material-matrix compatibility registered: NuclearCraft wheat flour -> Forge flour tags')
})
