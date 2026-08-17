console.info('[Matterworks] Loading quest-owned research registry')

const MatterworksResearch = Object.freeze({
    phases: Object.freeze([
        { id: 'phase_1', stage: 'matterworks:phase/mechanical_industry', title: 'Mechanical Industry' },
        { id: 'phase_2', stage: 'matterworks:phase/chemical_analysis', title: 'Chemical Analysis' },
        { id: 'phase_3', stage: 'matterworks:phase/process_industry', title: 'Electrotechnics and Process Industry' },
        { id: 'phase_4', stage: 'matterworks:phase/digital_industry', title: 'Digital Industry' },
        { id: 'phase_5', stage: 'matterworks:phase/nuclear_engineering', title: 'Nuclear Engineering' },
        { id: 'phase_6', stage: 'matterworks:phase/nuclear_research', title: 'Nuclear Research' },
        { id: 'phase_7', stage: 'matterworks:phase/atomic_engineering', title: 'Atomic Engineering' },
        { id: 'phase_8', stage: 'matterworks:phase/fusion_engineering', title: 'Fusion Engineering' }
    ]),

    guides: Object.freeze([
        'create',
        'mekanism',
        'alchemistry_chemlib',
        'nuclearcraft',
        'applied_energistics_2',
        'cc_tweaked'
    ]),

    synthesisFamilies: Object.freeze({
        basic_alloys: {
            stage: 'matterworks:synthesis/basic_alloys',
            phase: 'phase_2',
            materials: ['bronze', 'brass', 'electrum', 'shibuichi', 'tin_silver', 'lead_platinum', 'osmiridium', 'carbon_manganese']
        },
        fluorides_and_salts: {
            stage: 'matterworks:synthesis/fluorides_and_salts',
            phase: 'phase_3',
            materials: ['fluorite', 'villiaumite', 'carobbiite', 'potassium_fluoride', 'sodium_fluoride', 'potassium_iodide']
        },
        ceramic_and_refractory: {
            stage: 'matterworks:synthesis/ceramic_and_refractory',
            phase: 'phase_3',
            materials: ['boron_nitride', 'boron_arsenide', 'magnesium_diboride', 'silicon_carbide', 'tungsten_carbide', 'lithium_manganese_dioxide']
        },
        industrial_inorganics: {
            stage: 'matterworks:synthesis/industrial_inorganics',
            phase: 'phase_3',
            materials: ['rhodochrosite', 'manganese_oxide', 'manganese_dioxide', 'calcium_sulfate', 'sodium_hydroxide', 'potassium_hydroxide', 'barium_nitrate']
        },
        engineered_carbon: {
            stage: 'matterworks:synthesis/engineered_carbon',
            phase: 'phase_3',
            materials: ['graphite', 'pyrolytic_carbon', 'hard_carbon']
        },
        controlled_steelmaking: {
            stage: 'matterworks:synthesis/controlled_steelmaking',
            phase: 'phase_3',
            materials: ['steel', 'ferroboron', 'zirconium_molybdenum', 'nichrome', 'niobium_tin', 'niobium_titanium']
        },
        pressure_materials: {
            stage: 'matterworks:synthesis/pressure_materials',
            phase: 'phase_3',
            materials: ['compressed_iron']
        },
        organophosphorus: {
            stage: 'matterworks:synthesis/organophosphorus',
            phase: 'phase_5',
            materials: ['tributyl_phosphate']
        },
        polymers: {
            stage: 'matterworks:synthesis/polymers',
            phase: 'phase_3',
            materials: ['pneumaticcraft_plastic', 'mekanism_hdpe']
        },
        nuclear_parent_elements: {
            stage: 'matterworks:synthesis/nuclear_parent_elements',
            phase: 'phase_7',
            materials: ['uranium', 'thorium', 'polonium', 'radium']
        }
    }),

    provenanceOnly: Object.freeze([
        'yellowcake',
        'uranium_oxide',
        'uranium_hexafluoride',
        'irradiated_borax',
        'nuclear_isotopes',
        'reactor_fuel',
        'depleted_fuel',
        'nuclear_waste'
    ]),

    unresolved: Object.freeze([
        'tough_alloy',
        'thermoconducting_alloy',
        'extreme_alloy',
        'hsla_steel',
        'stainless_steel',
        'super_alloy',
        'sic_sic_cmc',
        'c_mn_blend',
        'borax',
        'baratol',
        'crude_oil',
        'lpg',
        'gasoline',
        'kerosene',
        'diesel',
        'lubricant',
        'vegetable_oil',
        'biodiesel',
        'yeast_culture',
        'etching_acid',
        'memory_essence'
    ])
})

global.MatterworksResearch = MatterworksResearch

console.info(
    `[Matterworks] Research registry loaded: ${MatterworksResearch.phases.length} phases, ` +
    `${Object.keys(MatterworksResearch.synthesisFamilies).length} synthesis families`
)
