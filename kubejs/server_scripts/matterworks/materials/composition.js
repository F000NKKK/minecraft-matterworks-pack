console.info('[Matterworks] Loading material composition registry')

/*
 * Matterworks 0.5.3 composition registry.
 *
 * Identity, composition and process ownership are deliberately separate.
 * A material may have a known formula while still being forbidden from direct
 * Dissolver decomposition because treatment, grade, geometry or nuclear
 * provenance is technologically meaningful.
 */

const MatterworksComposition = Object.freeze({
    bronze: { policy: 'DIRECT', formula: { copper: 3, tin: 1 } },
    brass: { policy: 'DIRECT', formula: { copper: 3, zinc: 1 } },
    electrum: { policy: 'DIRECT', formula: { gold: 1, silver: 1 } },
    shibuichi: { policy: 'DIRECT', formula: { copper: 3, silver: 1 } },
    tin_silver: { policy: 'DIRECT', formula: { tin: 3, silver: 1 } },
    lead_platinum: { policy: 'DIRECT', formula: { lead: 3, platinum: 1 } },
    osmiridium: { policy: 'DIRECT', formula: { osmium: 3, iridium: 1 } },
    zircaloy: { policy: 'DIRECT', formula: { zirconium: 7, tin: 1 } },
    carbon_manganese: { policy: 'DIRECT', formula: { manganese: 1, carbon: 1 } },

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
    ferroboron: { policy: 'PROCESS', formula: { iron: 1, boron: 1 }, note: 'grade ratio intentionally unresolved' },
    tough_alloy: { policy: 'UNKNOWN' },
    thermoconducting_alloy: { policy: 'UNKNOWN' },
    zirconium_molybdenum: { policy: 'PROCESS', formula: { zirconium: 1, molybdenum: 1 } },
    extreme_alloy: { policy: 'UNKNOWN' },
    hsla_steel: { policy: 'MIXTURE' },
    nichrome: { policy: 'PROCESS', formula: { nickel: 1, chromium: 1 } },
    niobium_tin: { policy: 'PROCESS', formula: { niobium: 3, tin: 1 } },
    niobium_titanium: { policy: 'PROCESS', formula: { niobium: 1, titanium: 1 } },
    stainless_steel: { policy: 'MIXTURE' },
    super_alloy: { policy: 'MIXTURE' },
    sic_sic_cmc: { policy: 'MANUFACTURED', formula: { silicon: 1, carbon: 1 } },
    compressed_iron: { policy: 'PROCESS', formula: { iron: 1 } },
    yellowcake: { policy: 'PROCESS' },
    c_mn_blend: { policy: 'MIXTURE' },
    borax: { policy: 'PROCESS' },
    irradiated_borax: { policy: 'NUCLEAR' },
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
