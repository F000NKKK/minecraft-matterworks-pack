console.info('[Matterworks] Loading solid-material chemistry compatibility')

/*
 * NuclearCraft: Neoteric exposes many ordinary elements as its own dust,
 * ingot, nugget, plate, block, ore/raw-material or gem forms. Alchemistry
 * normally dissolves the standard Forge forms, but its generated recipes are
 * wrapped in Forge tag-not-empty conditions and do not cover raw_materials or
 * NuclearCraft's silicon gem at all.
 *
 * Matterworks owns the cross-mod identity boundary for ordinary elements:
 * equivalent bulk forms dissolve to the same ChemLib element units regardless
 * of which mod supplied the concrete item. Nuclear isotopes, irradiated
 * materials, alloys, compounds and the U/Th/Po/Ra parent-element boundary are
 * deliberately NOT represented here.
 */

const matterworksSolidFormYield = {
    ores: 32,
    raw_materials: 16,
    dusts: 16,
    ingots: 16,
    nuggets: 1,
    plates: 16,
    storage_blocks: 144,
    gems: 16
}

const matterworksNuclearElementForms = {
    // NuclearCraft ore materials: raw material + ordinary processed forms.
    boron: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    silver: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    lead: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    tin: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    zinc: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    magnesium: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    lithium: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    cobalt: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    platinum: ['ores', 'raw_materials', 'dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],

    // Pure elements registered by NuclearCraft in selected manufactured forms.
    calcium: ['dusts', 'ingots'],
    chromium: ['dusts', 'ingots'],
    erbium: ['dusts'],
    hafnium: ['dusts', 'ingots'],
    iridium: ['dusts', 'ingots'],
    niobium: ['dusts', 'ingots'],
    osmium: ['dusts', 'ingots'],
    potassium: ['dusts', 'ingots'],
    sodium: ['dusts', 'ingots'],
    strontium: ['dusts', 'ingots'],
    titanium: ['dusts', 'ingots'],
    tungsten: ['dusts', 'ingots'],
    yttrium: ['dusts', 'ingots'],
    ytterbium: ['dusts'],
    germanium: ['dusts'],
    terbium: ['dusts'],
    samarium: ['dusts'],
    palladium: ['dusts', 'ingots', 'plates'],
    copper: ['dusts', 'plates'],
    iron: ['dusts', 'plates'],
    gold: ['dusts'],
    zirconium: ['dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    manganese: ['dusts', 'ingots', 'plates'],
    beryllium: ['dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    aluminum: ['dusts', 'ingots', 'nuggets', 'plates', 'storage_blocks'],
    molybdenum: ['dusts'],
    arsenic: ['dusts'],
    neodymium: ['dusts'],
    iodine: ['dusts'],
    barium: ['dusts'],
    bismuth: ['dusts'],
    thallium: ['dusts'],
    gadolinium: ['dusts'],

    // NuclearCraft models elemental silicon as a gem; stock Alchemistry has
    // no forge:gems/silicon Dissolver recipe.
    silicon: ['gems']
}

/*
 * Ordinary compounds which are independently registered by ChemLib and
 * NuclearCraft but represent the same bulk chemical dust.
 *
 * Alchemistry's generated compound-dust Dissolver recipes consume a concrete
 * ChemLib item instead of the corresponding Forge tag. Replace only these
 * verified overlaps so either provider can be used without inventory-level
 * conversion recipes.
 *
 * ChemLib's "manganese_oxide" is MnO2 (its Dissolver yields Mn + 2 O), while
 * NuclearCraft distinguishes manganese_oxide (MnO) and manganese_dioxide
 * (MnO2). tags.js sanitizes that naming collision, so the ChemLib recipe must
 * use forge:dusts/manganese_dioxide here.
 */
const matterworksSharedCompoundDusts = [
    { chemlib: 'calcium_sulfate', forge: 'calcium_sulfate' },
    { chemlib: 'sodium_hydroxide', forge: 'sodium_hydroxide' },
    { chemlib: 'potassium_hydroxide', forge: 'potassium_hydroxide' },
    { chemlib: 'barium_nitrate', forge: 'barium_nitrate' },
    { chemlib: 'manganese_oxide', forge: 'manganese_dioxide' }
]

ServerEvents.recipes(event => {
    let registered = 0

    Object.entries(matterworksNuclearElementForms).forEach(([element, forms]) => {
        forms.forEach(form => {
            const outputCount = matterworksSolidFormYield[form]

            // Replace Alchemistry's conditional standard recipe when one
            // exists. Removal is harmless for raw_materials/gems where there
            // is no upstream recipe.
            event.remove({ id: `alchemistry:dissolver/${form}/${element}` })

            event.custom({
                type: 'alchemistry:dissolver',
                group: 'matterworks:dissolver_compat',
                input: {
                    count: 1,
                    ingredient: {
                        tag: `forge:${form}/${element}`
                    }
                },
                output: {
                    groups: [
                        {
                            probability: 100.0,
                            results: [
                                {
                                    count: outputCount,
                                    item: `chemlib:${element}`
                                }
                            ]
                        }
                    ],
                    rolls: 1,
                    weighted: false
                }
            }).id(`matterworks:chemistry/compat/dissolver/${form}/${element}`)

            registered++
        })
    })

    let compoundDusts = 0

    matterworksSharedCompoundDusts.forEach(material => {
        event.remove({ id: `alchemistry:dissolver/${material.chemlib}_dust` })

        event.custom({
            type: 'alchemistry:dissolver',
            group: 'matterworks:dissolver_compat',
            input: {
                count: 1,
                ingredient: {
                    tag: `forge:dusts/${material.forge}`
                }
            },
            output: {
                groups: [
                    {
                        probability: 100.0,
                        results: [
                            {
                                count: 8,
                                item: `chemlib:${material.chemlib}`
                            }
                        ]
                    }
                ],
                rolls: 1,
                weighted: false
            }
        }).id(`matterworks:chemistry/compat/dissolver/compound_dust/${material.forge}`)

        compoundDusts++
    })

    /*
     * A few Alchemistry machine recipes consume concrete ChemLib ingots
     * instead of Forge tags. Patch those exact inputs so NuclearCraft (or any
     * other correctly-tagged provider) can supply the same pure metal without
     * inventory-level conversion recipes.
     */
    event.replaceInput(
        { id: 'alchemistry:reactor_casing' },
        'chemlib:osmium_ingot',
        '#forge:ingots/osmium'
    )
    event.replaceInput(
        { id: 'alchemistry:reactor_casing' },
        'chemlib:platinum_ingot',
        '#forge:ingots/platinum'
    )
    event.replaceInput(
        { id: 'alchemistry:fission_core' },
        'chemlib:yttrium_ingot',
        '#forge:ingots/yttrium'
    )
    event.replaceInput(
        { id: 'alchemistry:fusion_core' },
        'chemlib:tungsten_ingot',
        '#forge:ingots/tungsten'
    )

    console.info(
        `[Matterworks] Solid chemistry compatibility registered: ${registered} pure-element Dissolver bridges + ${compoundDusts} shared compound dust bridges + 4 concrete Alchemistry inputs normalized`
    )
})
