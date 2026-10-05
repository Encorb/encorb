/**
 * Official Material Taxonomy from client specification: encorb-nonhaz-materials.xlsx
 * Contains full non-hazardous recovered materials taxonomy (ISRI, SPI resin codes, PS grades, etc.)
 * plus excluded/regulated materials list.
 */

export interface TaxonomyMaterial {
  id: string;
  family: string;
  category: string;
  grade: string;
  specCode: string;
  packaging: string;
  notes: string;
}

export interface RegulatedMaterial {
  id: string;
  material: string;
  reason: string;
  whereItHides: string;
}

export const MATERIAL_TAXONOMY: TaxonomyMaterial[] = [
  {
    "id": "mat-001",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Heavy Melting Steel (HMS 1 & 2)",
    "specCode": "ISRI 200–206",
    "packaging": "Loose / sheared",
    "notes": "Most-traded obsolete steel grade"
  },
  {
    "id": "mat-002",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "#1 Busheling",
    "specCode": "ISRI 207",
    "packaging": "Loose / baled",
    "notes": "Clean prompt factory clips & sheet"
  },
  {
    "id": "mat-003",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "#1 / #2 Bundles",
    "specCode": "ISRI 208–209",
    "packaging": "Baled",
    "notes": "Compressed sheet steel"
  },
  {
    "id": "mat-004",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Shredded / fragmentized scrap",
    "specCode": "ISRI 210–211",
    "packaging": "Loose fragmented",
    "notes": "Auto-shredder output"
  },
  {
    "id": "mat-005",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Plate & Structural (P&S)",
    "specCode": "ISRI 231–235",
    "packaging": "Sheared / torched",
    "notes": "Beams, plate, demolition steel"
  },
  {
    "id": "mat-006",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Rebar / reinforcing steel",
    "specCode": "—",
    "packaging": "Loose / bundled",
    "notes": "Construction offcuts"
  },
  {
    "id": "mat-007",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Rail & rail crops",
    "specCode": "ISRI 260s",
    "packaging": "Loose",
    "notes": "Railroad rail"
  },
  {
    "id": "mat-008",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Tinplate / steel cans",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Food & beverage steel cans"
  },
  {
    "id": "mat-009",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Ferrous turnings & borings",
    "specCode": "ISRI 220–228",
    "packaging": "Loose / briquetted",
    "notes": "Machining swarf"
  },
  {
    "id": "mat-010",
    "family": "Metals",
    "category": "Ferrous — steel",
    "grade": "Auto bodies / whole cars",
    "specCode": "—",
    "packaging": "Whole / flattened",
    "notes": "Shredder feedstock"
  },
  {
    "id": "mat-011",
    "family": "Metals",
    "category": "Ferrous — cast iron",
    "grade": "Clean auto cast / motor blocks / mixed cast",
    "specCode": "ISRI 252–256",
    "packaging": "Loose",
    "notes": "Engine blocks, machinery"
  },
  {
    "id": "mat-012",
    "family": "Metals",
    "category": "Non-ferrous — copper",
    "grade": "Bare Bright (#1 bright wire)",
    "specCode": "ISRI Barley",
    "packaging": "Loose",
    "notes": "Cleanest copper, >99% Cu"
  },
  {
    "id": "mat-013",
    "family": "Metals",
    "category": "Non-ferrous — copper",
    "grade": "#1 Copper",
    "specCode": "ISRI Berry / Candy",
    "packaging": "Loose",
    "notes": "Clean uncoated tube & wire"
  },
  {
    "id": "mat-014",
    "family": "Metals",
    "category": "Non-ferrous — copper",
    "grade": "#2 Copper",
    "specCode": "ISRI Birch / Cliff",
    "packaging": "Loose",
    "notes": "Unalloyed; solder/paint allowed"
  },
  {
    "id": "mat-015",
    "family": "Metals",
    "category": "Non-ferrous — copper",
    "grade": "#3 / light copper",
    "specCode": "ISRI Dream",
    "packaging": "Loose",
    "notes": "Roofing, gutters, thin sheet"
  },
  {
    "id": "mat-016",
    "family": "Metals",
    "category": "Non-ferrous — copper",
    "grade": "Insulated copper wire (ICW)",
    "specCode": "ISRI Druid / Dach etc.",
    "packaging": "Loose / baled",
    "notes": "Priced on recovery %"
  },
  {
    "id": "mat-017",
    "family": "Metals",
    "category": "Non-ferrous — copper",
    "grade": "Copper radiators (clean)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "HVAC / auto cores"
  },
  {
    "id": "mat-018",
    "family": "Metals",
    "category": "Non-ferrous — copper",
    "grade": "Transformer copper windings",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Copper-bearing"
  },
  {
    "id": "mat-019",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Extrusion 6061 / 6063",
    "specCode": "ISRI Tata / Toto",
    "packaging": "Loose",
    "notes": "Window & door profile"
  },
  {
    "id": "mat-020",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Used beverage cans (UBC)",
    "specCode": "ISRI Talk / Taldack",
    "packaging": "Baled",
    "notes": "Beverage cans"
  },
  {
    "id": "mat-021",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Sheet / clips (painted)",
    "specCode": "ISRI Taint-Tabor",
    "packaging": "Loose / baled",
    "notes": "Mixed sheet"
  },
  {
    "id": "mat-022",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Cast aluminum",
    "specCode": "ISRI Tense",
    "packaging": "Loose",
    "notes": "Housings, castings"
  },
  {
    "id": "mat-023",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Wheels — clean / chrome",
    "specCode": "ISRI Troma",
    "packaging": "Loose",
    "notes": "Auto wheels"
  },
  {
    "id": "mat-024",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Radiators (Al / Al-Cu)",
    "specCode": "ISRI Talon / Tally",
    "packaging": "Loose",
    "notes": "HVAC & auto"
  },
  {
    "id": "mat-025",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Turnings / borings",
    "specCode": "ISRI Teens / Telic",
    "packaging": "Loose / briquetted",
    "notes": "Machining swarf"
  },
  {
    "id": "mat-026",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Litho / offset plate",
    "specCode": "ISRI Tablet / Tabloid",
    "packaging": "Baled",
    "notes": "Printing plates"
  },
  {
    "id": "mat-027",
    "family": "Metals",
    "category": "Non-ferrous — aluminum",
    "grade": "Mixed low-copper clips (MLC)",
    "specCode": "ISRI Taldon / Tale",
    "packaging": "Loose",
    "notes": "Shredder aluminum"
  },
  {
    "id": "mat-028",
    "family": "Metals",
    "category": "Non-ferrous — brass",
    "grade": "Yellow brass",
    "specCode": "ISRI Honey",
    "packaging": "Loose",
    "notes": "Fittings, hardware"
  },
  {
    "id": "mat-029",
    "family": "Metals",
    "category": "Non-ferrous — brass",
    "grade": "Red brass",
    "specCode": "ISRI Ebony / Enerv",
    "packaging": "Loose",
    "notes": "Valves, high-copper"
  },
  {
    "id": "mat-030",
    "family": "Metals",
    "category": "Non-ferrous — brass",
    "grade": "Brass turnings",
    "specCode": "ISRI Nomad",
    "packaging": "Loose / briquetted",
    "notes": "Machining"
  },
  {
    "id": "mat-031",
    "family": "Metals",
    "category": "Non-ferrous — brass",
    "grade": "Cartridge brass / shells",
    "specCode": "ISRI Lace / Lark",
    "packaging": "Loose",
    "notes": "Spent casings"
  },
  {
    "id": "mat-032",
    "family": "Metals",
    "category": "Non-ferrous — brass",
    "grade": "Plumbing brass / brass rod",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Mixed plumbing"
  },
  {
    "id": "mat-033",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Stainless 304 (18-8)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Non-magnetic"
  },
  {
    "id": "mat-034",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Stainless 316",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Higher Ni / Mo"
  },
  {
    "id": "mat-035",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Stainless turnings",
    "specCode": "—",
    "packaging": "Loose / briquetted",
    "notes": "Machining"
  },
  {
    "id": "mat-036",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Nickel alloys (Inconel, Monel, Hastelloy)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "High value"
  },
  {
    "id": "mat-037",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Titanium (solids & turnings)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Aerospace / medical"
  },
  {
    "id": "mat-038",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Zinc die-cast (Zamak)",
    "specCode": "ISRI Saves / Scoot",
    "packaging": "Loose",
    "notes": "Castings"
  },
  {
    "id": "mat-039",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Lead — soft / sheet / wheel weights",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Batteries excluded — see tab 2"
  },
  {
    "id": "mat-040",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Magnesium",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Handle dry"
  },
  {
    "id": "mat-041",
    "family": "Metals",
    "category": "Non-ferrous — stainless & alloy",
    "grade": "Carbide (tungsten) inserts",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "High value"
  },
  {
    "id": "mat-042",
    "family": "Metals",
    "category": "Non-ferrous — mixed / recovered",
    "grade": "Electric motors",
    "specCode": "—",
    "packaging": "Loose / whole",
    "notes": "Copper-bearing"
  },
  {
    "id": "mat-043",
    "family": "Metals",
    "category": "Non-ferrous — mixed / recovered",
    "grade": "Sealed units / compressors",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Must be evacuated of refrigerant"
  },
  {
    "id": "mat-044",
    "family": "Metals",
    "category": "Non-ferrous — mixed / recovered",
    "grade": "Zorba / Zurik / Twitch",
    "specCode": "ISRI Zorba / Zurik / Twitch",
    "packaging": "Loose",
    "notes": "Shredder non-ferrous fractions"
  },
  {
    "id": "mat-045",
    "family": "Plastics / polymers",
    "category": "PET (#1)",
    "grade": "Clear PET bottle bale",
    "specCode": "Resin #1",
    "packaging": "Baled",
    "notes": "Beverage & water bottles"
  },
  {
    "id": "mat-046",
    "family": "Plastics / polymers",
    "category": "PET (#1)",
    "grade": "Green / mixed-color PET",
    "specCode": "Resin #1",
    "packaging": "Baled",
    "notes": "Colored bottle"
  },
  {
    "id": "mat-047",
    "family": "Plastics / polymers",
    "category": "PET (#1)",
    "grade": "PET thermoform",
    "specCode": "Resin #1",
    "packaging": "Baled",
    "notes": "Clamshells, trays"
  },
  {
    "id": "mat-048",
    "family": "Plastics / polymers",
    "category": "PET (#1)",
    "grade": "PET strapping / flake",
    "specCode": "Resin #1",
    "packaging": "Flake / regrind",
    "notes": "Post-industrial"
  },
  {
    "id": "mat-049",
    "family": "Plastics / polymers",
    "category": "HDPE (#2)",
    "grade": "Natural HDPE (milk jug)",
    "specCode": "Resin #2",
    "packaging": "Baled / regrind",
    "notes": "Highest-value HDPE"
  },
  {
    "id": "mat-050",
    "family": "Plastics / polymers",
    "category": "HDPE (#2)",
    "grade": "Colored / mixed HDPE",
    "specCode": "Resin #2",
    "packaging": "Baled / regrind",
    "notes": "Detergent bottles"
  },
  {
    "id": "mat-051",
    "family": "Plastics / polymers",
    "category": "HDPE (#2)",
    "grade": "Rigid HDPE (crates, drums, pipe)",
    "specCode": "Resin #2",
    "packaging": "Regrind / pellet",
    "notes": "Industrial"
  },
  {
    "id": "mat-052",
    "family": "Plastics / polymers",
    "category": "PVC (#3)",
    "grade": "Rigid PVC — pipe & profile",
    "specCode": "Resin #3",
    "packaging": "Loose / regrind",
    "notes": "Construction"
  },
  {
    "id": "mat-053",
    "family": "Plastics / polymers",
    "category": "PVC (#3)",
    "grade": "Flexible PVC",
    "specCode": "Resin #3",
    "packaging": "Regrind",
    "notes": "Hose, sheet"
  },
  {
    "id": "mat-054",
    "family": "Plastics / polymers",
    "category": "LDPE / LLDPE (#4)",
    "grade": "Clear stretch / shrink film",
    "specCode": "Resin #4",
    "packaging": "Baled",
    "notes": "Pallet wrap — high volume"
  },
  {
    "id": "mat-055",
    "family": "Plastics / polymers",
    "category": "LDPE / LLDPE (#4)",
    "grade": "Mixed film & bags",
    "specCode": "Resin #4",
    "packaging": "Baled / pellet",
    "notes": "Post-commercial"
  },
  {
    "id": "mat-056",
    "family": "Plastics / polymers",
    "category": "PP (#5)",
    "grade": "Rigid PP (caps, containers, pails)",
    "specCode": "Resin #5",
    "packaging": "Baled / regrind",
    "notes": "Packaging"
  },
  {
    "id": "mat-057",
    "family": "Plastics / polymers",
    "category": "PP (#5)",
    "grade": "FIBC / big bags (woven PP)",
    "specCode": "Resin #5",
    "packaging": "Baled",
    "notes": "Bulk bags"
  },
  {
    "id": "mat-058",
    "family": "Plastics / polymers",
    "category": "PP (#5)",
    "grade": "Automotive PP (bumpers, trim)",
    "specCode": "Resin #5",
    "packaging": "Regrind / lump",
    "notes": "TPO/PP"
  },
  {
    "id": "mat-059",
    "family": "Plastics / polymers",
    "category": "PS (#6)",
    "grade": "GPPS / HIPS (rigid polystyrene)",
    "specCode": "Resin #6",
    "packaging": "Baled / lump",
    "notes": "Cutlery, cups, housings"
  },
  {
    "id": "mat-060",
    "family": "Plastics / polymers",
    "category": "PS (#6)",
    "grade": "EPS foam (densified)",
    "specCode": "Resin #6",
    "packaging": "Densified logs / ingots",
    "notes": "Packaging foam"
  },
  {
    "id": "mat-061",
    "family": "Plastics / polymers",
    "category": "PS (#6)",
    "grade": "XPS foam",
    "specCode": "Resin #6",
    "packaging": "Loose / densified",
    "notes": "Insulation board"
  },
  {
    "id": "mat-062",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "ABS",
    "specCode": "Resin #7",
    "packaging": "Regrind / lump",
    "notes": "Housings, auto"
  },
  {
    "id": "mat-063",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "Polycarbonate (PC)",
    "specCode": "Resin #7",
    "packaging": "Regrind / sheet",
    "notes": "Lenses, glazing"
  },
  {
    "id": "mat-064",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "PC / ABS blend",
    "specCode": "Resin #7",
    "packaging": "Regrind",
    "notes": "Electronics housings"
  },
  {
    "id": "mat-065",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "Nylon (PA6 / PA66)",
    "specCode": "Resin #7",
    "packaging": "Regrind / pellet",
    "notes": "Auto, textile, carpet"
  },
  {
    "id": "mat-066",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "Acetal (POM)",
    "specCode": "Resin #7",
    "packaging": "Regrind",
    "notes": "Gears, precision parts"
  },
  {
    "id": "mat-067",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "Acrylic (PMMA)",
    "specCode": "Resin #7",
    "packaging": "Sheet / regrind",
    "notes": "Signage, glazing"
  },
  {
    "id": "mat-068",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "Polyurethane (PU) foam",
    "specCode": "Resin #7",
    "packaging": "Baled / loose",
    "notes": "Furniture & bedding foam"
  },
  {
    "id": "mat-069",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "PLA (bioplastic)",
    "specCode": "Resin #7",
    "packaging": "Flake",
    "notes": "Compostable resin"
  },
  {
    "id": "mat-070",
    "family": "Plastics / polymers",
    "category": "Engineering (#7)",
    "grade": "PET-G / PBT / PPO / PPS / PEEK",
    "specCode": "Resin #7",
    "packaging": "Regrind / pellet",
    "notes": "Specialty engineering resins"
  },
  {
    "id": "mat-071",
    "family": "Paper & fiber",
    "category": "Corrugated",
    "grade": "Old Corrugated Containers (OCC)",
    "specCode": "PS-11",
    "packaging": "Baled",
    "notes": "Cardboard — highest recovered volume"
  },
  {
    "id": "mat-072",
    "family": "Paper & fiber",
    "category": "Corrugated",
    "grade": "Double-sorted OCC (DS OCC)",
    "specCode": "PS-12",
    "packaging": "Baled",
    "notes": "Clean supermarket grade"
  },
  {
    "id": "mat-073",
    "family": "Paper & fiber",
    "category": "Mixed",
    "grade": "Mixed paper",
    "specCode": "PS-1 / PS-54",
    "packaging": "Baled",
    "notes": "Residential mix"
  },
  {
    "id": "mat-074",
    "family": "Paper & fiber",
    "category": "News",
    "grade": "Old newspaper (ONP)",
    "specCode": "PS-6 / 7 / 8",
    "packaging": "Baled",
    "notes": "De-ink grades"
  },
  {
    "id": "mat-075",
    "family": "Paper & fiber",
    "category": "Office / high grade",
    "grade": "Sorted office paper (SOP)",
    "specCode": "PS-37",
    "packaging": "Baled",
    "notes": "Office mix"
  },
  {
    "id": "mat-076",
    "family": "Paper & fiber",
    "category": "Office / high grade",
    "grade": "White ledger / CPO",
    "specCode": "PS-40 / 42",
    "packaging": "Baled",
    "notes": "High-grade de-ink"
  },
  {
    "id": "mat-077",
    "family": "Paper & fiber",
    "category": "Coated",
    "grade": "Coated book / magazines (OMG)",
    "specCode": "PS-10",
    "packaging": "Baled",
    "notes": "Glossy stock"
  },
  {
    "id": "mat-078",
    "family": "Paper & fiber",
    "category": "Boxboard",
    "grade": "Boxboard / chipboard",
    "specCode": "PS-4",
    "packaging": "Baled",
    "notes": "Cereal & shoe boxes"
  },
  {
    "id": "mat-079",
    "family": "Paper & fiber",
    "category": "Kraft",
    "grade": "Kraft bags & envelopes",
    "specCode": "PS-13",
    "packaging": "Baled",
    "notes": "Brown kraft"
  },
  {
    "id": "mat-080",
    "family": "Paper & fiber",
    "category": "Cartons",
    "grade": "Aseptic & gable-top cartons",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Polycoated — separate stream"
  },
  {
    "id": "mat-081",
    "family": "Paper & fiber",
    "category": "Shredded",
    "grade": "Shredded office paper",
    "specCode": "—",
    "packaging": "Baled / bagged",
    "notes": "Security-shred"
  },
  {
    "id": "mat-082",
    "family": "Wood",
    "category": "Pallets",
    "grade": "Grade-A / repairable pallets",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Reuse market"
  },
  {
    "id": "mat-083",
    "family": "Wood",
    "category": "Pallets",
    "grade": "Scrap / broken pallets",
    "specCode": "—",
    "packaging": "Whole / ground",
    "notes": "Grind to mulch/fuel"
  },
  {
    "id": "mat-084",
    "family": "Wood",
    "category": "Clean wood",
    "grade": "Untreated dimensional lumber & offcuts",
    "specCode": "—",
    "packaging": "Loose / ground",
    "notes": "No paint/preservative"
  },
  {
    "id": "mat-085",
    "family": "Wood",
    "category": "Clean wood",
    "grade": "Wood chips / hog fuel",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Biomass / mulch"
  },
  {
    "id": "mat-086",
    "family": "Wood",
    "category": "Clean wood",
    "grade": "Sawdust & shavings",
    "specCode": "—",
    "packaging": "Bulk / bagged",
    "notes": "Animal bedding, pellets"
  },
  {
    "id": "mat-087",
    "family": "Wood",
    "category": "Engineered wood",
    "grade": "Plywood / OSB / MDF / particleboard",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Adhesive-bonded; limited markets"
  },
  {
    "id": "mat-088",
    "family": "Wood",
    "category": "Reuse",
    "grade": "Crates & dunnage",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Industrial reuse"
  },
  {
    "id": "mat-089",
    "family": "Wood",
    "category": "Reuse",
    "grade": "Reclaimed / architectural timber",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "High-value salvage"
  },
  {
    "id": "mat-090",
    "family": "Wood",
    "category": "Land clearing",
    "grade": "Logs, stumps, brush",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Grind / biomass"
  },
  {
    "id": "mat-091",
    "family": "Glass",
    "category": "Container cullet",
    "grade": "Flint (clear) cullet",
    "specCode": "—",
    "packaging": "Bulk / gaylord",
    "notes": "Container glass"
  },
  {
    "id": "mat-092",
    "family": "Glass",
    "category": "Container cullet",
    "grade": "Amber (brown) cullet",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Container glass"
  },
  {
    "id": "mat-093",
    "family": "Glass",
    "category": "Container cullet",
    "grade": "Green (emerald) cullet",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Container glass"
  },
  {
    "id": "mat-094",
    "family": "Glass",
    "category": "Container cullet",
    "grade": "Mixed / three-mix cullet",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "MRF glass"
  },
  {
    "id": "mat-095",
    "family": "Glass",
    "category": "Flat glass",
    "grade": "Float / plate glass",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Window / auto (laminated separate)"
  },
  {
    "id": "mat-096",
    "family": "Glass",
    "category": "Specialty",
    "grade": "Borosilicate / lab glass",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Limited outlets"
  },
  {
    "id": "mat-097",
    "family": "Glass",
    "category": "Specialty",
    "grade": "Fiberglass",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Limited outlets"
  },
  {
    "id": "mat-098",
    "family": "Rubber & tires",
    "category": "Whole tires",
    "grade": "Passenger & light-truck tires (PCT)",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Reuse / retread / TDF"
  },
  {
    "id": "mat-099",
    "family": "Rubber & tires",
    "category": "Whole tires",
    "grade": "Truck & OTR tires",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Large casings"
  },
  {
    "id": "mat-100",
    "family": "Rubber & tires",
    "category": "Processed tire",
    "grade": "Tire-derived aggregate (TDA)",
    "specCode": "—",
    "packaging": "Shredded",
    "notes": "Civil engineering fill"
  },
  {
    "id": "mat-101",
    "family": "Rubber & tires",
    "category": "Processed tire",
    "grade": "Crumb rubber (by mesh)",
    "specCode": "—",
    "packaging": "Granulate",
    "notes": "Turf, molded, asphalt"
  },
  {
    "id": "mat-102",
    "family": "Rubber & tires",
    "category": "Processed tire",
    "grade": "Rubber buffings / shred",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Molded goods"
  },
  {
    "id": "mat-103",
    "family": "Rubber & tires",
    "category": "Reuse",
    "grade": "Retread casings",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Retreadable"
  },
  {
    "id": "mat-104",
    "family": "Rubber & tires",
    "category": "Fuel",
    "grade": "Tire-derived fuel (TDF)",
    "specCode": "—",
    "packaging": "Chip",
    "notes": "Cement kilns / boilers"
  },
  {
    "id": "mat-105",
    "family": "Rubber & tires",
    "category": "Industrial rubber",
    "grade": "EPDM / SBR / nitrile scrap",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Off-spec / trim"
  },
  {
    "id": "mat-106",
    "family": "Rubber & tires",
    "category": "Industrial rubber",
    "grade": "Conveyor belt rubber",
    "specCode": "—",
    "packaging": "Loose / roll",
    "notes": "Mining / industrial"
  },
  {
    "id": "mat-107",
    "family": "Electronics (e-scrap)",
    "category": "Whole units",
    "grade": "Desktops / laptops / servers",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Refurb or recovery"
  },
  {
    "id": "mat-108",
    "family": "Electronics (e-scrap)",
    "category": "Whole units",
    "grade": "Flat-panel (LCD/LED) monitors",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "CRT excluded — see tab 2"
  },
  {
    "id": "mat-109",
    "family": "Electronics (e-scrap)",
    "category": "Circuit boards",
    "grade": "High-grade PCB (telecom / gold finger)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Highest board value"
  },
  {
    "id": "mat-110",
    "family": "Electronics (e-scrap)",
    "category": "Circuit boards",
    "grade": "Mid-grade PCB (motherboards)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Populated boards"
  },
  {
    "id": "mat-111",
    "family": "Electronics (e-scrap)",
    "category": "Circuit boards",
    "grade": "Low-grade PCB (power / backplane)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Low copper/gold"
  },
  {
    "id": "mat-112",
    "family": "Electronics (e-scrap)",
    "category": "Components",
    "grade": "CPUs / processors",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Ceramic & fiber, high value"
  },
  {
    "id": "mat-113",
    "family": "Electronics (e-scrap)",
    "category": "Components",
    "grade": "Memory / RAM",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Gold-bearing"
  },
  {
    "id": "mat-114",
    "family": "Electronics (e-scrap)",
    "category": "Components",
    "grade": "Hard drives (HDD) / SSD",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Data destruction required"
  },
  {
    "id": "mat-115",
    "family": "Electronics (e-scrap)",
    "category": "Components",
    "grade": "Power supplies (PSU)",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Copper-bearing"
  },
  {
    "id": "mat-116",
    "family": "Electronics (e-scrap)",
    "category": "Devices",
    "grade": "Cell phones / smartphones",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Batteries removed"
  },
  {
    "id": "mat-117",
    "family": "Electronics (e-scrap)",
    "category": "Cable",
    "grade": "Mixed low-grade cable & wire",
    "specCode": "—",
    "packaging": "Loose / baled",
    "notes": "Copper recovery"
  },
  {
    "id": "mat-118",
    "family": "Electronics (e-scrap)",
    "category": "Infrastructure",
    "grade": "Networking / telecom gear",
    "specCode": "—",
    "packaging": "Whole",
    "notes": "Data-center pulls"
  },
  {
    "id": "mat-119",
    "family": "Electronics (e-scrap)",
    "category": "Components",
    "grade": "Aluminum heat sinks",
    "specCode": "—",
    "packaging": "Loose",
    "notes": "Clean aluminum"
  },
  {
    "id": "mat-120",
    "family": "Textiles",
    "category": "Post-consumer",
    "grade": "Credential / mixed rag clothing",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Reuse & export"
  },
  {
    "id": "mat-121",
    "family": "Textiles",
    "category": "Wipers",
    "grade": "Wiping rags (graded)",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Industrial wipers"
  },
  {
    "id": "mat-122",
    "family": "Textiles",
    "category": "Fiber",
    "grade": "Cotton / denim",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Fiber recycling"
  },
  {
    "id": "mat-123",
    "family": "Textiles",
    "category": "Fiber",
    "grade": "Polyester / PET textile",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Fiber-to-fiber"
  },
  {
    "id": "mat-124",
    "family": "Textiles",
    "category": "Fiber",
    "grade": "Wool",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Recarding"
  },
  {
    "id": "mat-125",
    "family": "Textiles",
    "category": "Carpet",
    "grade": "Carpet — Nylon 6 / 66 / PET",
    "specCode": "—",
    "packaging": "Rolled / baled",
    "notes": "CARE program outlets"
  },
  {
    "id": "mat-126",
    "family": "Textiles",
    "category": "Institutional",
    "grade": "Linens & uniforms",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Laundry / hospitality"
  },
  {
    "id": "mat-127",
    "family": "Textiles",
    "category": "Footwear",
    "grade": "Paired shoes",
    "specCode": "—",
    "packaging": "Baled",
    "notes": "Reuse"
  },
  {
    "id": "mat-128",
    "family": "Organics / biomass",
    "category": "Food",
    "grade": "Food waste / scraps",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Compost / anaerobic digestion"
  },
  {
    "id": "mat-129",
    "family": "Organics / biomass",
    "category": "Green",
    "grade": "Yard & green waste",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Compost / mulch"
  },
  {
    "id": "mat-130",
    "family": "Organics / biomass",
    "category": "Oils",
    "grade": "Used cooking oil (yellow grease)",
    "specCode": "—",
    "packaging": "Liquid / tote",
    "notes": "Biodiesel — FOG rules vary by state"
  },
  {
    "id": "mat-131",
    "family": "Organics / biomass",
    "category": "Ag residue",
    "grade": "Agricultural residue",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Feed / compost / fuel"
  },
  {
    "id": "mat-132",
    "family": "Organics / biomass",
    "category": "Fuel",
    "grade": "Wood biomass / RDF / SRF",
    "specCode": "—",
    "packaging": "Bulk / baled",
    "notes": "Waste-to-energy feedstock"
  },
  {
    "id": "mat-133",
    "family": "Aggregates & C&D",
    "category": "Concrete",
    "grade": "Crushed concrete (RCA)",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Road base / fill"
  },
  {
    "id": "mat-134",
    "family": "Aggregates & C&D",
    "category": "Asphalt",
    "grade": "Reclaimed asphalt pavement (RAP)",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Re-paving"
  },
  {
    "id": "mat-135",
    "family": "Aggregates & C&D",
    "category": "Masonry",
    "grade": "Brick & block",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Reuse / crush"
  },
  {
    "id": "mat-136",
    "family": "Aggregates & C&D",
    "category": "Gypsum",
    "grade": "Clean new drywall / gypsum",
    "specCode": "—",
    "packaging": "Board / bulk",
    "notes": "New-construction offcuts"
  },
  {
    "id": "mat-137",
    "family": "Aggregates & C&D",
    "category": "Ceramics",
    "grade": "Ceramics / porcelain",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Limited outlets"
  },
  {
    "id": "mat-138",
    "family": "Aggregates & C&D",
    "category": "Fill",
    "grade": "Clean fill / rock / dirt",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Site reuse"
  },
  {
    "id": "mat-139",
    "family": "Aggregates & C&D",
    "category": "Mixed",
    "grade": "Mixed C&D debris",
    "specCode": "—",
    "packaging": "Bulk",
    "notes": "Sort at facility"
  }
];

export const REGULATED_EXCLUDED_MATERIALS: RegulatedMaterial[] = [
  {
    "id": "reg-01",
    "material": "Lead-acid batteries",
    "reason": "RCRA / DOT — corrosive & lead",
    "whereItHides": "Mixed in with lead or auto scrap"
  },
  {
    "id": "reg-02",
    "material": "Lithium-ion & other batteries",
    "reason": "Universal waste — fire risk",
    "whereItHides": "Inside e-scrap & devices"
  },
  {
    "id": "reg-03",
    "material": "CRT glass (leaded funnel)",
    "reason": "RCRA — leaded glass",
    "whereItHides": "Old TVs & tube monitors"
  },
  {
    "id": "reg-04",
    "material": "Treated lumber (CCA / ACQ)",
    "reason": "Wood preservatives",
    "whereItHides": "Looks like clean dimensional wood"
  },
  {
    "id": "reg-05",
    "material": "Railroad ties (creosote)",
    "reason": "Creosote — regulated",
    "whereItHides": "Sold as reclaimed timber"
  },
  {
    "id": "reg-06",
    "material": "Used oil & oil filters",
    "reason": "Used-oil management rules",
    "whereItHides": "With engines / auto scrap"
  },
  {
    "id": "reg-07",
    "material": "Fluorescent lamps & ballasts",
    "reason": "Mercury / PCB",
    "whereItHides": "With building demolition"
  },
  {
    "id": "reg-08",
    "material": "Non-empty aerosol cans",
    "reason": "Ignitable / pressurized",
    "whereItHides": "With steel & aluminum cans"
  },
  {
    "id": "reg-09",
    "material": "Refrigerants / charged sealed units",
    "reason": "Clean Air Act — CFC/HFC",
    "whereItHides": "HVAC compressors (must be evacuated)"
  },
  {
    "id": "reg-10",
    "material": "Mercury devices (thermostats, switches)",
    "reason": "Mercury",
    "whereItHides": "Older HVAC & electrical"
  },
  {
    "id": "reg-11",
    "material": "Asbestos-containing material (ACM)",
    "reason": "Regulated — friable asbestos",
    "whereItHides": "Demolition & C&D debris"
  },
  {
    "id": "reg-12",
    "material": "PCB transformers & capacitors",
    "reason": "TSCA — PCBs",
    "whereItHides": "Older electrical equipment"
  },
  {
    "id": "reg-13",
    "material": "Medical / biohazard waste",
    "reason": "Regulated medical waste",
    "whereItHides": "Institutional streams"
  },
  {
    "id": "reg-14",
    "material": "Oily / solvent-soaked rags",
    "reason": "Ignitable",
    "whereItHides": "vs clean graded wiping rags"
  },
  {
    "id": "reg-15",
    "material": "Contaminated soil / drums",
    "reason": "Varies by contaminant",
    "whereItHides": "Site cleanouts"
  }
];

export const MATERIAL_FAMILIES = [
  "Metals",
  "Plastics / polymers",
  "Paper & fiber",
  "Wood",
  "Glass",
  "Rubber & tires",
  "Electronics (e-scrap)",
  "Textiles",
  "Organics / biomass",
  "Aggregates & C&D"
] as const;

export type MaterialFamilyName = (typeof MATERIAL_FAMILIES)[number];

export function getMaterialsByFamily(family: string): TaxonomyMaterial[] {
  return MATERIAL_TAXONOMY.filter(
    (m) => m.family.toLowerCase() === family.toLowerCase()
  );
}

export function searchMaterials(query: string): TaxonomyMaterial[] {
  const q = query.toLowerCase().trim();
  if (!q) return MATERIAL_TAXONOMY;
  return MATERIAL_TAXONOMY.filter(
    (m) =>
      m.family.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.grade.toLowerCase().includes(q) ||
      m.specCode.toLowerCase().includes(q) ||
      m.notes.toLowerCase().includes(q)
  );
}

export const REGULATED_MATERIALS = REGULATED_EXCLUDED_MATERIALS;
