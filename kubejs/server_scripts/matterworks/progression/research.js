console.info('[Matterworks] Loading quest-owned research registry')

const MatterworksBacklogFamilies = Object.freeze({
    high_temperature_metallurgy: Object.freeze({ targetPhase: 'phase_3', title: 'High-Temperature Metallurgy', materials: Object.freeze(['tough_alloy', 'thermoconducting_alloy', 'extreme_alloy', 'hsla_steel', 'stainless_steel', 'super_alloy', 'sic_sic_cmc', 'c_mn_blend']) }),
    specialty_chemistry: Object.freeze({ targetPhase: 'phase_3', title: 'Specialty Industrial Chemistry', materials: Object.freeze(['borax', 'baratol', 'etching_acid']) }),
    petrochemistry: Object.freeze({ targetPhase: 'phase_3', title: 'Petrochemical Processing', materials: Object.freeze(['crude_oil', 'lpg', 'gasoline', 'kerosene', 'diesel', 'lubricant']) }),
    renewable_organics: Object.freeze({ targetPhase: 'phase_3', title: 'Renewable Organic Processing', materials: Object.freeze(['vegetable_oil', 'biodiesel', 'yeast_culture']) }),
    exotic_process_materials: Object.freeze({ targetPhase: 'phase_4', title: 'Exotic Process Materials', materials: Object.freeze(['memory_essence']) })
})

const MatterworksUnresolved = Object.freeze(
    Object.values(MatterworksBacklogFamilies).reduce((materials, family) => {
        family.materials.forEach(material => materials.push(material))
        return materials
    }, [])
)

const MatterworksResearch = Object.freeze({
    phases: Object.freeze([
        { id: 'phase_1', stage: 'matterworks:phase/mechanical_industry', ownerQuest: '2110000000000004', title: 'Mechanical Industry' },
        { id: 'phase_2', stage: 'matterworks:phase/chemical_analysis', ownerQuest: '2120000000000007', title: 'Chemical Analysis' },
        { id: 'phase_3', stage: 'matterworks:phase/process_industry', ownerQuest: '2130000000000007', title: 'Electrotechnics and Process Industry' },
        { id: 'phase_4', stage: 'matterworks:phase/digital_industry', ownerQuest: '2140000000000008', title: 'Digital Industry' },
        { id: 'phase_5', stage: 'matterworks:phase/nuclear_engineering', ownerQuest: '2150000000000003', title: 'Nuclear Engineering' },
        { id: 'phase_6', stage: 'matterworks:phase/nuclear_research', ownerQuest: '2160000000000005', title: 'Nuclear Research' },
        { id: 'phase_7', stage: 'matterworks:phase/atomic_engineering', ownerQuest: '2170000000000003', title: 'Atomic Engineering' },
        { id: 'phase_8', stage: 'matterworks:phase/fusion_engineering', ownerQuest: '2180000000000003', title: 'Fusion Engineering' }
    ]),
    guides: Object.freeze(['create', 'mekanism', 'alchemistry_chemlib', 'nuclearcraft', 'applied_energistics_2', 'cc_tweaked', 'pressure_engineering', 'high_temperature_metallurgy']),
    capabilities: Object.freeze({
        electromechanical_power_conversion: { stage: 'matterworks:capability/electromechanical_power_conversion', phase: 'phase_3', ownerQuest: '2130000000000008' },
        pressure_engineering: { stage: 'matterworks:capability/pressure_engineering', phase: 'phase_3', ownerQuest: '2130000000000010' },
        atmospheric_separation: { stage: 'matterworks:capability/atmospheric_separation', phase: 'phase_3', ownerQuest: '2130000000000012' },
        polymer_engineering: { stage: 'matterworks:capability/polymer_engineering', phase: 'phase_3', ownerQuest: '2130000000000011' },
        network_supervision: { stage: 'matterworks:capability/network_supervision', phase: 'phase_4', ownerQuest: '2140000000000007' },
        digital_control: { stage: 'matterworks:capability/digital_control', phase: 'phase_4', ownerQuest: '2140000000000008' },
        nuclear_fuel_cycle: { stage: 'matterworks:capability/nuclear_fuel_cycle', phase: 'phase_5', ownerQuest: '2150000000000003' },
        accelerator_research: { stage: 'matterworks:capability/accelerator_research', phase: 'phase_6', ownerQuest: '2160000000000005' },
        atomic_fission: { stage: 'matterworks:capability/atomic_fission', phase: 'phase_7', ownerQuest: '2170000000000003' },
        fusion_engineering: { stage: 'matterworks:capability/fusion_engineering', phase: 'phase_8', ownerQuest: '2180000000000003' }
    }),
    synthesisFamilies: Object.freeze({
        basic_alloys: { stage: 'matterworks:synthesis/basic_alloys', phase: 'phase_2', ownerQuest: '2120000000000007', materials: ['bronze', 'brass', 'electrum', 'shibuichi', 'tin_silver', 'lead_platinum', 'osmiridium', 'carbon_manganese'] },
        fluorides_and_salts: { stage: 'matterworks:synthesis/fluorides_and_salts', phase: 'phase_3', ownerQuest: '2130000000000005', materials: ['fluorite', 'villiaumite', 'carobbiite', 'potassium_fluoride', 'sodium_fluoride', 'potassium_iodide'] },
        ceramic_and_refractory: { stage: 'matterworks:synthesis/ceramic_and_refractory', phase: 'phase_3', ownerQuest: '2130000000000007', materials: ['boron_nitride', 'boron_arsenide', 'magnesium_diboride', 'silicon_carbide', 'tungsten_carbide', 'lithium_manganese_dioxide'] },
        industrial_inorganics: { stage: 'matterworks:synthesis/industrial_inorganics', phase: 'phase_3', ownerQuest: '2130000000000005', materials: ['rhodochrosite', 'manganese_oxide', 'manganese_dioxide', 'calcium_sulfate', 'sodium_hydroxide', 'potassium_hydroxide', 'barium_nitrate'] },
        engineered_carbon: { stage: 'matterworks:synthesis/engineered_carbon', phase: 'phase_3', ownerQuest: '2130000000000006', materials: ['graphite', 'pyrolytic_carbon', 'hard_carbon'] },
        controlled_steelmaking: { stage: 'matterworks:synthesis/controlled_steelmaking', phase: 'phase_3', ownerQuest: '2130000000000002', materials: ['steel', 'ferroboron', 'zirconium_molybdenum', 'nichrome', 'niobium_tin', 'niobium_titanium'] },
        pressure_materials: { stage: 'matterworks:synthesis/pressure_materials', phase: 'phase_3', ownerQuest: '2130000000000010', materials: ['compressed_iron'] },
        organophosphorus: { stage: 'matterworks:synthesis/organophosphorus', phase: 'phase_5', ownerQuest: '2150000000000003', materials: ['tributyl_phosphate'] },
        polymers: { stage: 'matterworks:synthesis/polymers', phase: 'phase_3', ownerQuest: '2130000000000011', materials: ['pneumaticcraft_plastic', 'mekanism_hdpe'] },
        nuclear_parent_elements: { stage: 'matterworks:synthesis/nuclear_parent_elements', phase: 'phase_8', ownerQuest: '2180000000000003', materials: ['uranium', 'thorium', 'polonium', 'radium'] }
    }),
    backlogFamilies: MatterworksBacklogFamilies,
    provenanceOnly: Object.freeze(['yellowcake', 'uranium_oxide', 'uranium_hexafluoride', 'irradiated_borax', 'nuclear_isotopes', 'reactor_fuel', 'depleted_fuel', 'nuclear_waste']),
    unresolved: MatterworksUnresolved
})

global.MatterworksResearch = MatterworksResearch

console.info(`[Matterworks] Research registry loaded: ${MatterworksResearch.phases.length} phases, ${Object.keys(MatterworksResearch.capabilities).length} capabilities, ${Object.keys(MatterworksResearch.synthesisFamilies).length} synthesis families, ${Object.keys(MatterworksResearch.backlogFamilies).length} process backlog families`)
