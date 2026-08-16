console.info('[Matterworks] Loading cross-mod canonical material recipes')

/*
 * Direct inventory canonicalization for ordinary pure bulk materials supplied
 * by mods other than NuclearCraft.
 *
 * Machine interoperability belongs to Forge tags; these recipes exist so JEI
 * also exposes an explicit way to collapse duplicate concrete items into the
 * ChemLib representation. The direction is intentionally provider -> canonical
 * only, preventing recipe loops.
 *
 * Excluded by design:
 * - ores and raw materials (would bypass ore processing);
 * - Mekanism shard/crystal/clump/dirty-dust stages;
 * - alloys and engineered materials;
 * - uranium/radioactive forms;
 * - Create crushed ores;
 * - Create Crafts & Additions wires/rods/spools and electrum, which are
 *   manufactured states or alloys rather than duplicate pure-element forms.
 */

const matterworksExternalCanonicalItems = [
    // Mekanism primary-resource bulk forms.
    ['mekanism:dust_osmium', 'chemlib:osmium_dust', 'mekanism/osmium/dust'],
    ['mekanism:ingot_osmium', 'chemlib:osmium_ingot', 'mekanism/osmium/ingot'],
    ['mekanism:nugget_osmium', 'chemlib:osmium_nugget', 'mekanism/osmium/nugget'],
    ['mekanism:block_osmium', 'chemlib:osmium_metal_block', 'mekanism/osmium/block'],

    ['mekanism:dust_tin', 'chemlib:tin_dust', 'mekanism/tin/dust'],
    ['mekanism:ingot_tin', 'chemlib:tin_ingot', 'mekanism/tin/ingot'],
    ['mekanism:nugget_tin', 'chemlib:tin_nugget', 'mekanism/tin/nugget'],
    ['mekanism:block_tin', 'chemlib:tin_metal_block', 'mekanism/tin/block'],

    ['mekanism:dust_lead', 'chemlib:lead_dust', 'mekanism/lead/dust'],
    ['mekanism:ingot_lead', 'chemlib:lead_ingot', 'mekanism/lead/ingot'],
    ['mekanism:nugget_lead', 'chemlib:lead_nugget', 'mekanism/lead/nugget'],
    ['mekanism:block_lead', 'chemlib:lead_metal_block', 'mekanism/lead/block'],

    // Vanilla owns the base ingot/nugget/block for these elements, but ChemLib
    // still owns their chemical dust representation.
    ['mekanism:dust_iron', 'chemlib:iron_dust', 'mekanism/iron/dust'],
    ['mekanism:dust_copper', 'chemlib:copper_dust', 'mekanism/copper/dust'],
    ['mekanism:dust_gold', 'chemlib:gold_dust', 'mekanism/gold/dust'],

    // Ordinary elemental dusts registered by Mekanism outside PrimaryResource.
    ['mekanism:dust_lithium', 'chemlib:lithium_dust', 'mekanism/lithium/dust'],
    ['mekanism:dust_sulfur', 'chemlib:sulfur_dust', 'mekanism/sulfur/dust'],

    // Create's pure zinc bulk forms.
    ['create:zinc_ingot', 'chemlib:zinc_ingot', 'create/zinc/ingot'],
    ['create:zinc_nugget', 'chemlib:zinc_nugget', 'create/zinc/nugget'],
    ['create:zinc_block', 'chemlib:zinc_metal_block', 'create/zinc/block'],

    // Create pressing is 1 ingot -> 1 sheet, so sheets are mass-equivalent to
    // ChemLib plates for these pure elements.
    ['create:copper_sheet', 'chemlib:copper_plate', 'create/copper/plate'],
    ['create:iron_sheet', 'chemlib:iron_plate', 'create/iron/plate'],
    ['create:golden_sheet', 'chemlib:gold_plate', 'create/gold/plate']
]

ServerEvents.recipes(event => {
    let canonicalCrafts = 0

    matterworksExternalCanonicalItems.forEach(([input, output, idPath]) => {
        event.shapeless(output, [input])
            .id(`matterworks:chemistry/unify/${idPath}`)

        canonicalCrafts++
    })

    /*
     * Create provides a copper nugget while ChemLib delegates normal copper
     * ingot/nugget/block ownership and only exposes its chemical dust/plate
     * forms. Nine nuggets are one ingot-equivalent, so normalize 9 -> 1 dust
     * without inventing a fractional single-nugget conversion.
     */
    event.shaped(
        'chemlib:copper_dust',
        ['NNN', 'NNN', 'NNN'],
        { N: 'create:copper_nugget' }
    ).id('matterworks:chemistry/unify/create/copper/nuggets_to_dust')

    canonicalCrafts++

    console.info(
        `[Matterworks] Cross-mod canonical material recipes registered: ${canonicalCrafts} JEI-visible provider-to-ChemLib crafts`
    )
})
