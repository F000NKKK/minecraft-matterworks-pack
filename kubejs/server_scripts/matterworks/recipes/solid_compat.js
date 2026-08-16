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
 * ChemLib registers plate + dust for every natural solid metal and additionally
 * registers ingot/nugget/metal-block for metals that are not delegated to a
 * vanilla item. Iron, copper and gold are the delegated exceptions.
 *
 * This list is deliberately explicit so adding a new NuclearCraft material can
 * never silently fabricate a ChemLib registry id that does not exist.
 */
const matterworksChemLibMetalElements = [
    'silver', 'lead', 'tin', 'zinc', 'magnesium', 'lithium', 'cobalt', 'platinum',
    'calcium', 'chromium', 'erbium', 'hafnium', 'iridium', 'niobium', 'osmium',
    'potassium', 'sodium', 'strontium', 'titanium', 'tungsten', 'yttrium',
    'ytterbium', 'terbium', 'samarium', 'palladium', 'copper', 'iron', 'gold',
    'zirconium', 'manganese', 'beryllium', 'aluminum', 'molybdenum', 'neodymium',
    'barium', 'bismuth', 'thallium', 'gadolinium'
]

const matterworksChemLibDelegatedBaseMetals = ['iron', 'copper', 'gold']

const matterworksNuclearItemSuffix = {
    dusts: 'dust',
    ingots: 'ingot',
    nuggets: 'nugget',
    plates: 'plate',
    storage_blocks: 'block',
    gems: 'gem'
}

function matterworksHasChemLibSameForm(element, form) {
    if (form === 'dusts') {
        return true
    }

    if (form === 'plates') {
        return matterworksChemLibMetalElements.includes(element)
    }

    if (form === 'ingots' || form === 'nuggets' || form === 'storage_blocks') {
        return matterworksChemLibMetalElements.includes(element)
            && !matterworksChemLibDelegatedBaseMetals.includes(element)
    }

    return false
}

function matterworksChemLibSameFormItem(element, form) {
    if (form === 'storage_blocks') {
        return `chemlib:${element}_metal_block`
    }

    return `chemlib:${element}_${matterworksNuclearItemSuffix[form]}`
}

function matterworksNuclearFormItem(element, form) {
    return `nuclearcraft:${element}_${matterworksNuclearItemSuffix[form]}`
}

/*
 * Ordinary compounds which are independently registered by ChemLib and
 * NuclearCraft but represent the same bulk chemical dust.
 *
 * Alchemistry's generated compound-dust Dissolver recipes consume a concrete
 * ChemLib item instead of the corresponding Forge tag. Replace only these
 * verified overlaps so either provider can be used.
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

    /*
     * JEI-visible inventory unification.
     *
     * Forge tags make machine ingredients interoperable, but they do not turn
     * NuclearCraft's concrete duplicate items into ChemLib's concrete items.
     * Add one-way, lossless crafting recipes from NuclearCraft to the canonical
     * ChemLib representation. This avoids two-way recipe loops while making the
     * conversion explicit and discoverable in JEI.
     *
     * Ores and raw_materials are intentionally excluded: crafting them directly
     * into refined ChemLib material would bypass ore processing progression.
     */
    let canonicalCrafts = 0

    Object.entries(matterworksNuclearElementForms).forEach(([element, forms]) => {
        forms.forEach(form => {
            if (!(form in matterworksNuclearItemSuffix)) {
                return
            }

            const nuclearItem = matterworksNuclearFormItem(element, form)

            if (matterworksHasChemLibSameForm(element, form)) {
                event.shapeless(
                    matterworksChemLibSameFormItem(element, form),
                    [nuclearItem]
                ).id(`matterworks:chemistry/unify/${element}/${form}`)

                canonicalCrafts++
                return
            }

            // ChemLib only exposes dust for solid metalloids/nonmetals such as
            // boron, silicon, germanium, arsenic and iodine. Manufactured forms
            // with the same 16-unit mass can therefore normalize to one dust.
            if (form === 'ingots' || form === 'plates' || form === 'gems') {
                event.shapeless(
                    `chemlib:${element}_dust`,
                    [nuclearItem]
                ).id(`matterworks:chemistry/unify/${element}/${form}_to_dust`)

                canonicalCrafts++
                return
            }

            // Nine refined nuggets are one ingot-equivalent (16 chemical
            // units), so a material without a ChemLib nugget can still be
            // normalized without fractional output.
            if (form === 'nuggets') {
                event.shaped(
                    `chemlib:${element}_dust`,
                    ['NNN', 'NNN', 'NNN'],
                    { N: nuclearItem }
                ).id(`matterworks:chemistry/unify/${element}/nuggets_to_dust`)

                canonicalCrafts++
                return
            }

            // A refined storage block is nine ingot-equivalents. Only use this
            // fallback when ChemLib has no same-form metal block.
            if (form === 'storage_blocks') {
                event.shapeless(
                    `9x chemlib:${element}_dust`,
                    [nuclearItem]
                ).id(`matterworks:chemistry/unify/${element}/block_to_dust`)

                canonicalCrafts++
            }
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

        // Also expose direct item unification in JEI; this is one-way to the
        // ChemLib canonical representation and therefore cannot form a loop.
        event.shapeless(
            `chemlib:${material.chemlib}_dust`,
            [`nuclearcraft:${material.forge}_dust`]
        ).id(`matterworks:chemistry/unify/compound/${material.forge}_dust`)

        compoundDusts++
        canonicalCrafts++
    })

    /*
     * A few Alchemistry machine recipes consume concrete ChemLib ingots
     * instead of Forge tags. Patch those exact inputs so NuclearCraft (or any
     * other correctly-tagged provider) can supply the same pure metal.
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
        `[Matterworks] Solid chemistry compatibility registered: ${registered} pure-element Dissolver bridges + ${compoundDusts} shared compound dust bridges + ${canonicalCrafts} JEI-visible canonicalization crafts + 4 concrete Alchemistry inputs normalized`
    )
})
