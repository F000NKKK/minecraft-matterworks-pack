console.info('[Matterworks] Loading quest-owned research registry')

/*
 * 0.5.8 tightens the meaning of a synthesis owner.
 *
 * A quest may own a synthesis family only when completing that quest proves
 * the physical process which creates the listed material. Materials that are
 * known to the composition layer but are not yet demonstrated by a concrete
 * process are deliberately placed in the process backlog instead of being
 * silently unlocked by a nearby machine milestone.
 */
const MatterworksBacklogFamilies = Object.freeze({
    salt_and_fluoride_chemistry: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['fluorite', 'villiaumite', 'carobbiite', 'potassium_fluoride', 'sodium_fluoride', 'potassium_iodide'],
        reason: 'requires explicit salt preparation / electrochemical production rather than generic water electrolysis'
    }),
    ceramic_and_refractory_processing: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['boron_nitride', 'boron_arsenide', 'magnesium_diboride', 'silicon_carbide', 'tungsten_carbide', 'lithium_manganese_dioxide'],
        reason: 'requires dedicated ceramic, powder-metallurgy or high-temperature routes'
    }),
    industrial_inorganic_chemistry: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['rhodochrosite', 'manganese_oxide', 'manganese_dioxide', 'calcium_sulfate', 'sodium_hydroxide', 'potassium_hydroxide', 'barium_nitrate'],
        reason: 'requires explicit acid/base, precipitation, oxidation or chlor-alkali process ownership'
    }),
    advanced_engineered_carbon: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['pyrolytic_carbon', 'hard_carbon'],
        reason: 'graphite production does not prove pyrolytic-carbon deposition or hard-carbon processing'
    }),
    specialist_alloying: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['carbon_manganese', 'ferroboron', 'zirconium_molybdenum', 'nichrome', 'niobium_tin', 'niobium_titanium', 'thermoconducting_alloy', 'extreme_alloy', 'super_alloy', 'sic_sic_cmc', 'c_mn_blend'],
        reason: 'each material needs a validated alloy/composite route instead of inheriting the generic alloy-smelter milestone'
    }),
    specialty_formulations: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['etching_acid'],
        reason: 'borax/baratol production does not prove an etchant formulation route'
    }),
    petrochemical_feed_and_light_fractions: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['crude_oil', 'lpg', 'gasoline', 'kerosene'],
        reason: 'refinery commissioning proves diesel/lubricant fractionation but must not create or automatically unlock its feedstock and all fractions'
    }),
    renewable_feedstocks_and_bioprocessing: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['vegetable_oil', 'yeast_culture'],
        reason: 'biodiesel production does not prove oil extraction or fermentation/yeast cultivation'
    }),
    pneumatic_polymer_processing: Object.freeze({
        targetAge: 'industrial_age',
        materials: ['pneumaticcraft_plastic'],
        reason: 'Mekanism HDPE production is not equivalent to PneumaticCraft plastic chemistry'
    }),
    nuclear_structural_materials: Object.freeze({
        targetAge: 'atomic_age',
        materials: ['zircaloy'],
        reason: 'fuel handling does not prove a zirconium-alloy fabrication route'
    }),
    nuclear_solvent_extraction: Object.freeze({
        targetAge: 'atomic_age',
        materials: ['tributyl_phosphate'],
        reason: 'requires an explicit solvent-extraction/reprocessing chemistry milestone'
    })
})

const MatterworksUnresolved = Object.freeze(
    Object.values(MatterworksBacklogFamilies).reduce((materials, family) => {
        family.materials.forEach(material => materials.push(material))
        return materials
    }, [])
)

const MatterworksAges = Object.freeze([
    { id: 'industrial_age', stage: 'matterworks:age/industrial', ownerQuest: '2130000000000007', title: 'Industrial Age' },
    { id: 'atomic_age', stage: 'matterworks:age/atomic', ownerQuest: '2170000000000003', title: 'Atomic Age' },
    { id: 'fusion_age', stage: 'matterworks:age/fusion', ownerQuest: '2190000000000007', title: 'Fusion Age' }
])

function ageOwned(entry) {
    // `phase` is retained as a 0.5.x compatibility alias for scripts that consumed the old registry shape.
    return Object.freeze(Object.assign({}, entry, { phase: entry.age }))
}

const MatterworksResearch = Object.freeze({
    ages: MatterworksAges,
    phases: MatterworksAges,
    guides: Object.freeze(['create', 'mekanism', 'alchemistry_chemlib', 'nuclearcraft', 'applied_energistics_2', 'cc_tweaked', 'pressure_engineering', 'high_temperature_metallurgy']),
    capabilities: Object.freeze({
        electromechanical_power_conversion: ageOwned({ stage: 'matterworks:capability/electromechanical_power_conversion', age: 'industrial_age', ownerQuest: '2130000000000008' }),
        pressure_engineering: ageOwned({ stage: 'matterworks:capability/pressure_engineering', age: 'industrial_age', ownerQuest: '2130000000000010' }),
        atmospheric_separation: ageOwned({ stage: 'matterworks:capability/atmospheric_separation', age: 'industrial_age', ownerQuest: '2130000000000012' }),
        polymer_engineering: ageOwned({ stage: 'matterworks:capability/polymer_engineering', age: 'industrial_age', ownerQuest: '2130000000000011' }),
        high_temperature_metallurgy: ageOwned({ stage: 'matterworks:capability/high_temperature_metallurgy', age: 'industrial_age', ownerQuest: '2130000000000020' }),
        petrochemical_processing: ageOwned({ stage: 'matterworks:capability/petrochemical_processing', age: 'industrial_age', ownerQuest: '2130000000000021' }),
        renewable_organic_processing: ageOwned({ stage: 'matterworks:capability/renewable_organic_processing', age: 'industrial_age', ownerQuest: '2130000000000022' }),
        specialty_industrial_chemistry: ageOwned({ stage: 'matterworks:capability/specialty_industrial_chemistry', age: 'industrial_age', ownerQuest: '2130000000000023' }),
        industrial_process_integration: ageOwned({ stage: 'matterworks:capability/industrial_process_integration', age: 'industrial_age', ownerQuest: '2130000000000024' }),
        network_supervision: ageOwned({ stage: 'matterworks:capability/network_supervision', age: 'atomic_age', ownerQuest: '2140000000000007' }),
        digital_control: ageOwned({ stage: 'matterworks:capability/digital_control', age: 'atomic_age', ownerQuest: '2140000000000008' }),
        operational_fission: ageOwned({ stage: 'matterworks:capability/operational_fission', age: 'atomic_age', ownerQuest: '2150000000000009' }),
        nuclear_fuel_cycle: ageOwned({ stage: 'matterworks:capability/nuclear_fuel_cycle', age: 'atomic_age', ownerQuest: '2150000000000010' }),
        accelerator_research: ageOwned({ stage: 'matterworks:capability/accelerator_research', age: 'atomic_age', ownerQuest: '2160000000000005' }),
        atomic_fission: ageOwned({ stage: 'matterworks:capability/atomic_fission', age: 'atomic_age', ownerQuest: '2170000000000003' }),
        fusion_engineering: ageOwned({ stage: 'matterworks:capability/fusion_engineering', age: 'fusion_age', ownerQuest: '2180000000000003' }),
        prestige_engineering: ageOwned({ stage: 'matterworks:capability/prestige_engineering', age: 'fusion_age', ownerQuest: '2190000000000007' })
    }),
    synthesisFamilies: Object.freeze({
        basic_alloys: ageOwned({ stage: 'matterworks:synthesis/basic_alloys', age: 'industrial_age', ownerQuest: '2120000000000007', materials: ['bronze', 'brass', 'electrum', 'shibuichi', 'tin_silver', 'lead_platinum', 'osmiridium'] }),
        graphite_engineering: ageOwned({ stage: 'matterworks:synthesis/graphite_engineering', age: 'industrial_age', ownerQuest: '2130000000000006', materials: ['graphite'] }),
        controlled_steelmaking: ageOwned({ stage: 'matterworks:synthesis/controlled_steelmaking', age: 'industrial_age', ownerQuest: '2130000000000020', materials: ['steel', 'hsla_steel', 'stainless_steel'] }),
        tough_alloy_processing: ageOwned({ stage: 'matterworks:synthesis/tough_alloy_processing', age: 'industrial_age', ownerQuest: '2130000000000020', materials: ['tough_alloy'] }),
        specialty_chemistry: ageOwned({ stage: 'matterworks:synthesis/specialty_chemistry', age: 'industrial_age', ownerQuest: '2130000000000023', materials: ['borax', 'baratol'] }),
        refinery_products: ageOwned({ stage: 'matterworks:synthesis/refinery_products', age: 'industrial_age', ownerQuest: '2130000000000021', materials: ['diesel', 'lubricant'] }),
        biodiesel_processing: ageOwned({ stage: 'matterworks:synthesis/biodiesel_processing', age: 'industrial_age', ownerQuest: '2130000000000022', materials: ['biodiesel'] }),
        pressure_materials: ageOwned({ stage: 'matterworks:synthesis/pressure_materials', age: 'industrial_age', ownerQuest: '2130000000000010', materials: ['compressed_iron'] }),
        mekanism_hdpe: ageOwned({ stage: 'matterworks:synthesis/mekanism_hdpe', age: 'industrial_age', ownerQuest: '2130000000000011', materials: ['mekanism_hdpe'] }),
        experience_capture: ageOwned({ stage: 'matterworks:synthesis/experience_capture', age: 'atomic_age', ownerQuest: '2140000000000008', materials: ['memory_essence'] }),
        nuclear_parent_elements: ageOwned({ stage: 'matterworks:synthesis/nuclear_parent_elements', age: 'fusion_age', ownerQuest: '2180000000000003', materials: ['uranium', 'thorium', 'polonium', 'radium'] })
    }),
    backlogFamilies: MatterworksBacklogFamilies,
    provenanceOnly: Object.freeze(['yellowcake', 'uranium_oxide', 'irradiated_borax', 'nuclear_isotopes', 'reactor_fuel', 'depleted_fuel', 'nuclear_waste']),
    unresolved: MatterworksUnresolved
})

global.MatterworksResearch = MatterworksResearch

console.info(`[Matterworks] Research registry loaded: ${MatterworksResearch.ages.length} ages, ${Object.keys(MatterworksResearch.capabilities).length} capabilities, ${Object.keys(MatterworksResearch.synthesisFamilies).length} synthesis families, ${Object.keys(MatterworksResearch.backlogFamilies).length} process backlog families`)
