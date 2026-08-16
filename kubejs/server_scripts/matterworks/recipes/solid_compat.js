console.info('[Matterworks] Loading solid-material chemistry compatibility')

/*
 * NuclearCraft: Neoteric exposes many ordinary elements as its own dust,
 * ingot, nugget, plate, block, ore/raw-material or gem forms.
 *
 * Standard Alchemistry Dissolver recipes for ore/dust/ingot/nugget/plate/
 * storage-block forms already consume Forge tags. Those recipes MUST remain
 * owned by Alchemistry: NuclearCraft items become compatible simply by being
 * members of the same Forge tags.
 *
 * Matterworks only owns:
 * - explicit inventory canonicalization into ChemLib concrete bulk forms;
 * - the raw-material and silicon-gem Dissolver gaps supplied as datapack JSON;
 * - verified compound aliases where both mods model the same substance.
 *
 * Nuclear isotopes, irradiated materials, alloys, compounds outside the
 * verified overlap set, and the U/Th/Po/Ra parent-element boundary are
 * deliberately excluded.
 */

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

    // NuclearCraft models elemental silicon as a gem. The Dissolver route for
    // this gap is supplied by kubejs/data/matterworks/.../silicon_gem.json.
    silicon: ['gems']
}

/*
 * ChemLib registers plate + dust for every natural solid metal and additionally
 * registers ingot/nugget/metal-block for metals that are not delegated to a
 * vanilla item. Iron, copper and gold are the delegated exceptions.
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
 * Ordinary compounds independently registered by ChemLib and NuclearCraft but
 * representing the same bulk chemical dust.
 *
 * We deliberately do NOT replace the Alchemistry Dissolver recipe here. The
 * kubejsalchem recipe schema rewrites event.custom(alchemistry:dissolver)
 * output data in this pack and caused the former 132 failed recipes.
 *
 * Instead NuclearCraft's duplicate dust canonicalizes to ChemLib's dust; the
 * original Alchemistry recipe then remains the single Dissolver authority.
 *
 * ChemLib's "manganese_oxide" is MnO2, while NuclearCraft distinguishes
 * manganese_oxide (MnO) from manganese_dioxide (MnO2). tags.js sanitizes that
 * naming collision, so only nuclearcraft:manganese_dioxide_dust is mapped.
 */
const matterworksSharedCompoundDusts = [
    { chemlib: 'calcium_sulfate', nuclearcraft: 'calcium_sulfate' },
    { chemlib: 'sodium_hydroxide', nuclearcraft: 'sodium_hydroxide' },
    { chemlib: 'potassium_hydroxide', nuclearcraft: 'potassium_hydroxide' },
    { chemlib: 'barium_nitrate', nuclearcraft: 'barium_nitrate' },
    { chemlib: 'manganese_oxide', nuclearcraft: 'manganese_dioxide' }
]

ServerEvents.recipes(event => {
    /*
     * JEI-visible inventory unification.
     *
     * The conversion is one-way NuclearCraft -> ChemLib to avoid recipe loops.
     * Ores/raw materials are excluded from crafting conversion so the ore
     * processing chain cannot be bypassed.
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
                ).id(`matterworks:chemistry/unify/nuclearcraft/${element}/${form}`)

                canonicalCrafts++
                return
            }

            // ChemLib exposes only dust for several solid metalloids/nonmetals.
            // Manufactured one-ingot-equivalent forms normalize to one dust.
            if (form === 'ingots' || form === 'plates' || form === 'gems') {
                event.shapeless(
                    `chemlib:${element}_dust`,
                    [nuclearItem]
                ).id(`matterworks:chemistry/unify/nuclearcraft/${element}/${form}_to_dust`)

                canonicalCrafts++
                return
            }

            if (form === 'nuggets') {
                event.shaped(
                    `chemlib:${element}_dust`,
                    ['NNN', 'NNN', 'NNN'],
                    { N: nuclearItem }
                ).id(`matterworks:chemistry/unify/nuclearcraft/${element}/nuggets_to_dust`)

                canonicalCrafts++
                return
            }

            if (form === 'storage_blocks') {
                event.shapeless(
                    `9x chemlib:${element}_dust`,
                    [nuclearItem]
                ).id(`matterworks:chemistry/unify/nuclearcraft/${element}/block_to_dust`)

                canonicalCrafts++
            }
        })
    })

    matterworksSharedCompoundDusts.forEach(material => {
        event.shapeless(
            `chemlib:${material.chemlib}_dust`,
            [`nuclearcraft:${material.nuclearcraft}_dust`]
        ).id(`matterworks:chemistry/unify/nuclearcraft/compound/${material.nuclearcraft}_dust`)

        canonicalCrafts++
    })

    /*
     * A few Alchemistry crafting recipes consume concrete ChemLib ingots rather
     * than Forge tags. Normalize those exact inputs without touching machine
     * recipe serializers.
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
        `[Matterworks] Solid chemistry compatibility registered: stock Forge-tag Dissolver recipes preserved + ${canonicalCrafts} JEI-visible NuclearCraft-to-ChemLib crafts + 4 concrete Alchemistry inputs normalized`
    )
})
