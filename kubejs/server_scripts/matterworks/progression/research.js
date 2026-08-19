console.info('[Matterworks] Loading quest-owned research registry')

const MatterworksBacklogFamilies = Object.freeze({})

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
        nuclear_fuel_cycle: ageOwned({ stage: 'matterworks:capability/nuclear_fuel_cycle', age: 'atomic_age', ownerQuest: '2150000000000003' }),
        accelerator_research: ageOwned({ stage: 'matterworks:capability/accelerator_research', age: 'atomic_age', ownerQuest: '2160000000000005' }),
        atomic_fission: ageOwned({ stage: 'matterworks:capability/atomic_fission', age: 'atomic_age', ownerQuest: '2170000000000003' }),
        fusion_engineering: ageOwned({ stage: 'matterworks:capability/fusion_engineering', age: 'fusion_age', ownerQuest: '2180000000000003' }),
        prestige_engineering: ageOwned({ stage: 'matterworks:capability/prestige_engineering', age: 'fusion_age', ownerQuest: '2190000000000007' })
    }),
    synthesisFamilies: Object.freeze({
        basic_alloys: ageOwned({ stage: 'matterworks:synthesis/basic_alloys', age: 'industrial_age', ownerQuest: '2120000000000007', materials: ['bronze', 'brass', 'electrum', 'shibuichi', 'tin_silver', 'lead_platinum', 'osmiridium', 'carbon_manganese'] }),
        fluorides_and_salts: ageOwned({ stage: 'matterworks:synthesis/fluorides_and_salts', age: 'industrial_age', ownerQuest: '2130000000000005', materials: ['fluorite', 'villiaumite', 'carobbiite', 'potassium_fluoride', 'sodium_fluoride', 'potassium_iodide'] }),
        ceramic_and_refractory: ageOwned({ stage: 'matterworks:synthesis/ceramic_and_refractory', age: 'industrial_age', ownerQuest: '2130000000000007', materials: ['boron_nitride', 'boron_arsenide', 'magnesium_diboride', 'silicon_carbide', 'tungsten_carbide', 'lithium_manganese_dioxide'] }),
        industrial_inorganics: ageOwned({ stage: 'matterworks:synthesis/industrial_inorganics', age: 'industrial_age', ownerQuest: '2130000000000005', materials: ['rhodochrosite', 'manganese_oxide', 'manganese_dioxide', 'calcium_sulfate', 'sodium_hydroxide', 'potassium_hydroxide', 'barium_nitrate'] }),
        engineered_carbon: ageOwned({ stage: 'matterworks:synthesis/engineered_carbon', age: 'industrial_age', ownerQuest: '2130000000000006', materials: ['graphite', 'pyrolytic_carbon', 'hard_carbon'] }),
        controlled_steelmaking: ageOwned({ stage: 'matterworks:synthesis/controlled_steelmaking', age: 'industrial_age', ownerQuest: '2130000000000002', materials: ['steel', 'ferroboron', 'zirconium_molybdenum', 'nichrome', 'niobium_tin', 'niobium_titanium'] }),
        high_temperature_engineering: ageOwned({ stage: 'matterworks:synthesis/high_temperature_engineering', age: 'industrial_age', ownerQuest: '2130000000000020', materials: ['tough_alloy', 'thermoconducting_alloy', 'extreme_alloy', 'hsla_steel', 'stainless_steel', 'super_alloy', 'sic_sic_cmc', 'c_mn_blend'] }),
        specialty_chemistry: ageOwned({ stage: 'matterworks:synthesis/specialty_chemistry', age: 'industrial_age', ownerQuest: '2130000000000023', materials: ['borax', 'baratol', 'etching_acid'] }),
        petrochemistry: ageOwned({ stage: 'matterworks:synthesis/petrochemistry', age: 'industrial_age', ownerQuest: '2130000000000021', materials: ['crude_oil', 'lpg', 'gasoline', 'kerosene', 'diesel', 'lubricant'] }),
        renewable_organics: ageOwned({ stage: 'matterworks:synthesis/renewable_organics', age: 'industrial_age', ownerQuest: '2130000000000022', materials: ['vegetable_oil', 'biodiesel', 'yeast_culture'] }),
        nuclear_structural_alloys: ageOwned({ stage: 'matterworks:synthesis/nuclear_structural_alloys', age: 'atomic_age', ownerQuest: '2150000000000003', materials: ['zircaloy'] }),
        pressure_materials: ageOwned({ stage: 'matterworks:synthesis/pressure_materials', age: 'industrial_age', ownerQuest: '2130000000000010', materials: ['compressed_iron'] }),
        organophosphorus: ageOwned({ stage: 'matterworks:synthesis/organophosphorus', age: 'atomic_age', ownerQuest: '2150000000000003', materials: ['tributyl_phosphate'] }),
        polymers: ageOwned({ stage: 'matterworks:synthesis/polymers', age: 'industrial_age', ownerQuest: '2130000000000011', materials: ['pneumaticcraft_plastic', 'mekanism_hdpe'] }),
        experience_capture: ageOwned({ stage: 'matterworks:synthesis/experience_capture', age: 'atomic_age', ownerQuest: '2140000000000008', materials: ['memory_essence'] }),
        nuclear_parent_elements: ageOwned({ stage: 'matterworks:synthesis/nuclear_parent_elements', age: 'fusion_age', ownerQuest: '2180000000000003', materials: ['uranium', 'thorium', 'polonium', 'radium'] })
    }),
    backlogFamilies: MatterworksBacklogFamilies,
    provenanceOnly: Object.freeze(['yellowcake', 'uranium_oxide', 'uranium_hexafluoride', 'irradiated_borax', 'nuclear_isotopes', 'reactor_fuel', 'depleted_fuel', 'nuclear_waste']),
    unresolved: MatterworksUnresolved
})

global.MatterworksResearch = MatterworksResearch

console.info(`[Matterworks] Research registry loaded: ${MatterworksResearch.ages.length} ages, ${Object.keys(MatterworksResearch.capabilities).length} capabilities, ${Object.keys(MatterworksResearch.synthesisFamilies).length} synthesis families, ${Object.keys(MatterworksResearch.backlogFamilies).length} process backlog families`)
