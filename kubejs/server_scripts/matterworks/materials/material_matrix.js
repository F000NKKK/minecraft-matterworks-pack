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
     * Create publishes create:wheat_flour through forge:flour and
     * forge:flour/wheat. PneumaticCraft publishes pneumaticcraft:wheat_flour
     * through the older forge:dusts/flour convention.
     *
     * Bridge the tag namespaces so all three providers interoperate without
     * replacing their concrete items or changing any milling/manufactory yield.
     */
    event.add('forge:flour', 'nuclearcraft:flour')
    event.add('forge:flour', 'pneumaticcraft:wheat_flour')
    event.add('forge:flour/wheat', 'nuclearcraft:flour')
    event.add('forge:flour/wheat', 'pneumaticcraft:wheat_flour')
    event.add('forge:dusts/flour', '#forge:flour/wheat')

    // Matterworks role tag for recipes that specifically require wheat flour
    // while remaining independent of the concrete provider item.
    event.add(
        'matterworks:materials/organics/flour/wheat',
        '#forge:flour/wheat'
    )

    console.info('[Matterworks] Material-matrix compatibility registered: Create/NuclearCraft/PneumaticCraft wheat flour tags unified')
})
