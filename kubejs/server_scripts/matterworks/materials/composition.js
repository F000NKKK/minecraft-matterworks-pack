console.info('[Matterworks] Loading material composition registry')

/*
 * Matterworks material composition registry.
 *
 * Identity, composition and process ownership are deliberately separate.
 * A known formula never implies that a material may be dissolved directly.
 * Nuclear parents, isotopes, fuels, irradiated states and nuclear process
 * intermediates stay behind the complete Create -> Mekanism -> NuclearCraft
 * technical-program boundary.
 *
 * 0.5.8 also distinguishes a nominal pack grade from a molecular formula.
 * Fixed ratios for ordinary DIRECT alloys are gameplay mass-balance grades;
 * engineering alloys whose grade/process history matters use PROCESS/MIXTURE.
 *
 * 0.5.9 starts auditing specialist NuclearCraft alloys against their actual
 * process recipes instead of inferring chemistry from material names.
 */

const MatterworksComposition = Object.freeze({
    bronze: { policy: 'DIRECT', formula: { copper: 3, tin: 1 }, note: 'nominal Matterworks bronze grade' },
    brass: { policy: 'DIRECT', formula: { copper: 3, zinc: 1 }, note: 'nominal Matterworks brass grade' },
    electrum: { policy: 'DIRECT', formula: { gold: 1, silver: 1 } },
    shibuichi: { policy: 'DIRECT', formula: { copper: 3, silver: 1 }, note: 'nominal Matterworks grade' },
    tin_silver: { policy: 'DIRECT', formula: { tin: 3, silver: 1 }, note: 'nominal Matterworks grade' },
    lead_platinum: { policy: 'DIRECT', formula: { lead: 3, platinum: 1 }, note: 'nominal Matterworks grade' },
    osmiridium: { policy: 'DIRECT', formula: { osmium: 3, iridium: 1 }, note: 'nominal Matterworks grade' },
    zircaloy: { policy: 'PROCESS', formula: { zirconium: 7, tin: 1 }, note: 'nominal NuclearCraft process grade; alloy-smelter history remains part of identity' },
    carbon_manganese: { policy: 'MIXTURE', note: 'carbon/manganese metallurgical blend; no fake fixed molecular formula' },

    boron_nitride: { policy: 'DIRECT', formula: { boron: 1, nitrogen: 1 } },
    boron_arsenide: { policy: 'DIRECT', formula: { boron: 1, arsenic: 1 } },
    fluorite: { policy: 'DIRECT', formula: { calcium: 1, fluorine: 2 } },
    villiaumite: { policy: 'DIRECT', formula: { sodium: 1, fluorine: 1 } },
    carobbiite: { policy: 'DIRECT', formula: { potassium: 1, fluorine: 1 } },
    rhodochrosite: { policy: 'DIRECT', formula: { manganese: 1, carbon: 1, oxygen: 3 } },
    magnesium_diboride: { policy: 'DIRECT', formula: { magnesium: 1, boron: 2 } },
    silicon_carbide: { policy: 'DIRECT', formula: { silicon: 1, carbon: 1 } },
    tungsten_carbide: { policy: 'DIRECT', formula: { tungsten: 1, carbon: 1 } },
    lithium_manganese_dioxide: { policy: 'DIRECT', formula: { lithium: 1, manganese: 1, oxygen: 2 } },
    manganese_oxide: { policy: 'DIRECT', formula: { manganese: 1, oxygen: 1 } },
    manganese_dioxide: { policy: 'DIRECT', formula: { manganese: 1, oxygen: 2 } },
    potassium_fluoride: { policy: 'DIRECT', formula: { potassium: 1, fluorine: 1 } },
    sodium_fluoride: { policy: 'DIRECT', formula: { sodium: 1, fluorine: 1 } },
    potassium_iodide: { policy: 'DIRECT', formula: { potassium: 1, iodine: 1 } },
    calcium_sulfate: { policy: 'DIRECT', formula: { calcium: 1, sulfur: 1, oxygen: 4 } },
    sodium_hydroxide: { policy: 'DIRECT', formula: { sodium: 1, oxygen: 1, hydrogen: 1 } },
    potassium_hydroxide: { policy: 'DIRECT', formula: { potassium: 1, oxygen: 1, hydrogen: 1 } },
    barium_nitrate: { policy: 'DIRECT', formula: { barium: 1, nitrogen: 2, oxygen: 6 } },
    graphite: { policy: 'DIRECT', formula: { carbon: 1 } },
    pyrolytic_carbon: { policy: 'DIRECT', formula: { carbon: 1 } },
    hard_carbon: { policy: 'DIRECT', formula: { carbon: 1 } },

    steel: { policy: 'PROCESS', formula: { iron: 1, carbon: 1 }, note: 'grade-dependent abstraction' },
    ferroboron: { policy: 'PROCESS', note: 'NuclearCraft process uses boron + steel; final elemental ratio inherits the steel grade and is intentionally not flattened to FeB' },
    tough_alloy: { policy: 'PROCESS', note: 'NuclearCraft process uses ferroboron + lithium; composition remains process-derived because ferroboron inherits steel-grade provenance' },
    thermoconducting_alloy: { policy: 'PROCESS', note: 'NuclearCraft process uses extreme alloy + boron arsenide; preserve the engineered-material chain instead of flattening it into elements' },
    zirconium_molybdenum: { policy: 'PROCESS', formula: { molybdenum: 15, zirconium: 1 }, note: 'NuclearCraft high-duty alloy-smelter grade; 15 Mo : 1 Zr' },
    extreme_alloy: { policy: 'PROCESS', note: 'NuclearCraft process uses tough alloy + hard carbon; upstream engineered-material identity remains significant' },
    hsla_steel: { policy: 'MIXTURE' },
    nichrome: { policy: 'PROCESS', formula: { nickel: 4, chromium: 1 }, note: 'Matterworks corrected nominal Nichrome 80/20 grade; stock NuclearCraft Fe/Cr feed is replaced' },
    niobium_tin: { policy: 'PROCESS', formula: { niobium: 2, tin: 1 }, note: 'NuclearCraft pack-process grade; this intentionally models the installed recipe rather than the real Nb3Sn phase formula' },
    niobium_titanium: { policy: 'PROCESS', formula: { niobium: 1, titanium: 1 }, note: 'NuclearCraft pack-process grade' },
    stainless_steel: { policy: 'MIXTURE' },
    super_alloy: { policy: 'MIXTURE' },
    sic_sic_cmc: { policy: 'MANUFACTURED', formula: { silicon: 1, carbon: 1 } },
    compressed_iron: { policy: 'PROCESS', formula: { iron: 1 } },

    yellowcake: { policy: 'NUCLEAR', note: 'uranium concentrate produced from NuclearCraft uranium-oxide fluid; nuclear-program owned' },
    uranium_oxide: { policy: 'NUCLEAR', note: 'NuclearCraft fluid conversion state used before yellowcake crystallization' },
    irradiated_borax: { policy: 'NUCLEAR' },
    nuclear_isotopes: { policy: 'NUCLEAR', note: 'isotope number is part of identity' },
    reactor_fuel: { policy: 'NUCLEAR', note: 'composition/enrichment is part of identity' },
    depleted_fuel: { policy: 'NUCLEAR', note: 'burnup/depletion is part of identity' },
    nuclear_waste: { policy: 'NUCLEAR', note: 'waste provenance/composition is preserved' },

    c_mn_blend: { policy: 'MIXTURE' },
    borax: { policy: 'PROCESS' },
    baratol: { policy: 'MIXTURE' },
    tributyl_phosphate: { policy: 'PROCESS', formula: { carbon: 12, hydrogen: 27, oxygen: 4, phosphorus: 1 } },

    uranium: { policy: 'NUCLEAR', formula: { uranium: 1 } },
    thorium: { policy: 'NUCLEAR', formula: { thorium: 1 } },
    polonium: { policy: 'NUCLEAR', formula: { polonium: 1 } },
    radium: { policy: 'NUCLEAR', formula: { radium: 1 } },

    pneumaticcraft_plastic: { policy: 'PROCESS' },
    mekanism_hdpe: { policy: 'PROCESS' },
    crude_oil: { policy: 'MIXTURE' },
    lpg: { policy: 'MIXTURE' },
    gasoline: { policy: 'MIXTURE' },
    kerosene: { policy: 'MIXTURE' },
    diesel: { policy: 'MIXTURE' },
    lubricant: { policy: 'MIXTURE' },
    vegetable_oil: { policy: 'MIXTURE' },
    biodiesel: { policy: 'MIXTURE' },
    yeast_culture: { policy: 'MIXTURE' },
    etching_acid: { policy: 'MIXTURE' },
    memory_essence: { policy: 'MIXTURE' }
})

global.MatterworksComposition = MatterworksComposition

console.info(`[Matterworks] Material composition registry loaded: ${Object.keys(MatterworksComposition).length} entries`)
