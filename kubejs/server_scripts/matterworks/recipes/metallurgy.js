console.info('[Matterworks] Loading molten-metallurgy compatibility policy')

/*
 * NuclearCraft 1.2.34 ships a set of Chemical Reactor recipes whose inputs
 * reference Forge fluid tags that have no provider in the pinned Matterworks
 * mod set (chromium, niobium, titanium, osmium, silicon, graphite, coal).
 *
 * Leaving them registered causes repeated "No fluid found for tag" errors at
 * integrated-server startup. More importantly, blindly supplying placeholder
 * fluids would activate upstream recipes whose material graphs are not all
 * chemically valid (for example iron + chromium -> nichrome and
 * carbon-manganese + titanium -> SiC-SiC CMC).
 *
 * These recipes are therefore quarantined until Matterworks implements an
 * explicit high-temperature / molten-metallurgy layer with controlled solid ->
 * process-fluid transitions and corrected alloy compositions.
 */

const quarantinedNuclearCraftMoltenRecipes = [
    'nuclearcraft:chemical_reactor/coal-iron',
    'nuclearcraft:chemical_reactor/iron-chromium',
    'nuclearcraft:chemical_reactor/steel-chromium',
    'nuclearcraft:chemical_reactor/niobium-tin',
    'nuclearcraft:chemical_reactor/niobium-titanium',
    'nuclearcraft:chemical_reactor/silicon-graphite',
    'nuclearcraft:chemical_reactor/manganese-graphite',
    'nuclearcraft:chemical_reactor/carbon_manganese-titanium',
    'nuclearcraft:chemical_reactor/osmium-iridium',
    'nuclearcraft:chemical_reactor/graphite-diamond'
]

ServerEvents.recipes(event => {
    quarantinedNuclearCraftMoltenRecipes.forEach(id => event.remove({ id }))

    console.info(
        `[Matterworks] Quarantined ${quarantinedNuclearCraftMoltenRecipes.length} NuclearCraft molten-metallurgy recipes pending corrected process routes`
    )
})
