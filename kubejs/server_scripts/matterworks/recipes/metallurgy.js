console.info('[Matterworks] Loading molten-metallurgy compatibility policy')

/*
 * NuclearCraft 1.2.34 ships a set of Chemical Reactor recipes whose inputs
 * reference Forge fluid tags that have no provider in the pinned Matterworks
 * mod set (chromium, niobium, titanium, osmium, silicon, graphite, coal).
 *
 * Leaving them registered causes repeated "No fluid found for tag" errors at
 * integrated-server startup. More importantly, blindly supplying placeholder
 * fluids would activate upstream recipes whose material graphs are not all
 * chemically valid.
 *
 * 0.5.5 turns the old flat blacklist into an explicit quarantine registry.
 * Each entry records why the stock edge is disabled and what kind of process
 * layer must exist before it can be reconsidered. This is deliberately data,
 * not ad-hoc event.remove calls, so later releases can promote one validated
 * family at a time without silently re-enabling the rest.
 */

const moltenMetallurgyQuarantine = Object.freeze([
    {
        id: 'nuclearcraft:chemical_reactor/coal-iron',
        family: 'steelmaking',
        reason: 'solid carbon + iron is not a validated molten feed model',
        remediation: 'controlled blast/high-temperature steelmaking route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/iron-chromium',
        family: 'nickel_alloys',
        reason: 'iron + chromium does not represent nichrome chemistry',
        remediation: 'validated nickel/chromium alloy route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/steel-chromium',
        family: 'stainless_steel',
        reason: 'stock edge hides required alloy composition and process control',
        remediation: 'explicit stainless-steel composition and high-temperature route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/niobium-tin',
        family: 'superconductors',
        reason: 'feed fluids are absent and superconducting alloying needs its own process tier',
        remediation: 'validated Nb-Sn high-temperature alloy route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/niobium-titanium',
        family: 'superconductors',
        reason: 'feed fluids are absent and superconducting alloying needs its own process tier',
        remediation: 'validated Nb-Ti high-temperature alloy route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/silicon-graphite',
        family: 'ceramics',
        reason: 'stock molten shortcut collapses carbothermal/ceramic processing',
        remediation: 'controlled silicon-carbide ceramic route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/manganese-graphite',
        family: 'carbon_manganese',
        reason: 'stock fluid shortcut bypasses controlled carbon-manganese preparation',
        remediation: 'validated carbon-manganese metallurgical route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/carbon_manganese-titanium',
        family: 'composites',
        reason: 'stock inputs do not chemically model SiC-SiC CMC production',
        remediation: 'dedicated ceramic-matrix-composite process'
    },
    {
        id: 'nuclearcraft:chemical_reactor/osmium-iridium',
        family: 'refractory_alloys',
        reason: 'missing molten feeds and no controlled refractory-alloy process exists yet',
        remediation: 'validated Os-Ir refractory alloy route'
    },
    {
        id: 'nuclearcraft:chemical_reactor/graphite-diamond',
        family: 'high_pressure_carbon',
        reason: 'chemical reactor must not replace pressure/temperature-driven diamond formation',
        remediation: 'dedicated high-pressure carbon process'
    }
])

global.MatterworksMoltenMetallurgyQuarantine = moltenMetallurgyQuarantine

ServerEvents.recipes(event => {
    const familyNames = new Set()

    moltenMetallurgyQuarantine.forEach(entry => {
        event.remove({ id: entry.id })
        familyNames.add(entry.family)
    })

    console.info(
        `[Matterworks] Quarantined ${moltenMetallurgyQuarantine.length} NuclearCraft molten-metallurgy recipes across ${familyNames.size} process families pending validated routes`
    )
})
