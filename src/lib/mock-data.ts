/**
 * Mock/placeholder data only — Phase 1 marketing site.
 * No API calls, no auth, no database. Prices are indicative and non-binding.
 */

export type MaterialFamily = "metals" | "polymers" | "glass";

export type TickerItem = {
  code: string;
  label: string;
  price: number;
  unit: string;
  change: number;
};

export const tickerItems: TickerItem[] = [
  { code: "CU-1", label: "Copper #1 Bare Bright", price: 8420, unit: "USD/t", change: 1.42 },
  { code: "CU-2", label: "Copper #2 Birch/Cliff", price: 7610, unit: "USD/t", change: 0.86 },
  { code: "AL-6063", label: "Aluminium 6063 Extrusion", price: 2185, unit: "USD/t", change: -0.54 },
  { code: "AL-UBC", label: "Aluminium UBC Baled", price: 1740, unit: "USD/t", change: 0.31 },
  { code: "BR-YEL", label: "Brass Solids", price: 5290, unit: "USD/t", change: -0.22 },
  { code: "SS-304", label: "Stainless 304 Solids", price: 1395, unit: "USD/t", change: 0.64 },
  { code: "HDPE-NAT", label: "HDPE Natural Regrind", price: 985, unit: "USD/t", change: 2.05 },
  { code: "HDPE-COL", label: "HDPE Coloured Flake", price: 720, unit: "USD/t", change: -1.12 },
  { code: "PET-CB", label: "PET Clear Bales", price: 640, unit: "USD/t", change: 0.94 },
  { code: "PP-INJ", label: "PP Injection Regrind", price: 815, unit: "USD/t", change: 0.18 },
  { code: "LDPE-FILM", label: "LDPE Film Grade A", price: 690, unit: "USD/t", change: -0.41 },
  { code: "GL-FLINT", label: "Flint Cullet 3mm", price: 88, unit: "USD/t", change: 0.52 },
  { code: "GL-AMBER", label: "Amber Cullet Furnace-Ready", price: 74, unit: "USD/t", change: -0.13 },
  { code: "GL-MIX", label: "Mixed Colour Cullet", price: 46, unit: "USD/t", change: 0.27 },
];

export type Listing = {
  id: string;
  material: string;
  family: MaterialFamily;
  grade: string;
  tonnage: string;
  location: string;
  referencePrice: string;
  cadence: string;
  verified: boolean;
};

export const sampleListings: Listing[] = [
  {
    id: "ENC-4471",
    material: "Copper",
    family: "metals",
    grade: "Copper #1 Bare Bright",
    tonnage: "24 t / month",
    location: "Pittsburgh, PA",
    referencePrice: "USD 8,420 / t",
    cadence: "Recurring — monthly",
    verified: true,
  },
  {
    id: "ENC-4488",
    material: "HDPE",
    family: "polymers",
    grade: "HDPE Natural Regrind, MFI 0.7",
    tonnage: "120 t / quarter",
    location: "Houston, TX",
    referencePrice: "USD 985 / t",
    cadence: "Recurring — quarterly",
    verified: true,
  },
  {
    id: "ENC-4502",
    material: "Flint Cullet",
    family: "glass",
    grade: "Furnace-ready, ≤3mm, <0.5% ceramic",
    tonnage: "480 t / month",
    location: "Cleveland, OH",
    referencePrice: "USD 88 / t",
    cadence: "Recurring — monthly",
    verified: false,
  },
  {
    id: "ENC-4515",
    material: "Aluminium",
    family: "metals",
    grade: "6063 Extrusion, painted-free",
    tonnage: "60 t spot",
    location: "Detroit, MI",
    referencePrice: "USD 2,185 / t",
    cadence: "Spot lot",
    verified: true,
  },
  {
    id: "ENC-4530",
    material: "PET",
    family: "polymers",
    grade: "Clear bales, 95/5 sortation",
    tonnage: "300 t / month",
    location: "Charlotte, NC",
    referencePrice: "USD 640 / t",
    cadence: "Recurring — monthly",
    verified: true,
  },
  {
    id: "ENC-4544",
    material: "Stainless",
    family: "metals",
    grade: "304 Solids, 18/8",
    tonnage: "18 t spot",
    location: "Chicago, IL",
    referencePrice: "USD 1,395 / t",
    cadence: "Spot lot",
    verified: false,
  },
];

export const materialFamilies: {
  key: MaterialFamily;
  name: string;
  blurb: string;
  grades: { name: string; spec: string }[];
}[] = [
  {
    key: "metals",
    name: "Metals",
    blurb:
      "Ferrous and non-ferrous recovered metal, traded against ISRI grade definitions and assay-backed chemistry.",
    grades: [
      { name: "Copper #1 (Bare Bright)", spec: "≥99.9% Cu, uncoated, unalloyed, 16 AWG+" },
      { name: "Copper #2 (Birch/Cliff)", spec: "≥96% Cu, misc. unalloyed, solder-free" },
      { name: "Aluminium 6063 Extrusion", spec: "Painted-free, ≤0.5% attachments" },
      { name: "Aluminium UBC", spec: "Baled used beverage can, ≤2% moisture" },
      { name: "Brass Solids", spec: "Free of radiators, ≤1% irony" },
      { name: "Stainless 304 Solids", spec: "18/8 chemistry, oil-free" },
    ],
  },
  {
    key: "polymers",
    name: "Polymers",
    blurb:
      "Post-industrial and post-consumer polymer streams specified by melt flow, colour, contamination and odour profile.",
    grades: [
      { name: "HDPE Natural Regrind", spec: "MFI 0.4–0.9, ≤200 ppm contamination" },
      { name: "HDPE Coloured Flake", spec: "Washed, ≤1% PP, ≤0.5% moisture" },
      { name: "PET Clear Bales", spec: "95/5 sortation, ≤2% PVC" },
      { name: "PP Injection Regrind", spec: "MFI 12–25, single-source" },
      { name: "LDPE Film Grade A", spec: "Clear, dry, ≤1% print coverage" },
      { name: "ABS Regrind", spec: "Natural / black, flame-retardant-free" },
    ],
  },
  {
    key: "glass",
    name: "Glass",
    blurb:
      "Colour-sorted cullet graded on furnace-readiness: ceramic, stone and porcelain limits drive the price.",
    grades: [
      { name: "Flint Cullet 3mm", spec: "≤0.5% CSP, ≤1% organics, furnace-ready" },
      { name: "Amber Cullet", spec: "≥95% colour purity, ≤10 ppm ceramic" },
      { name: "Green Cullet", spec: "≥93% colour purity, dry" },
      { name: "Mixed Colour Cullet", spec: "Aggregate / fibreglass feedstock" },
    ],
  },
];

export const complianceItems = [
  {
    title: "RCRA-aligned handling",
    body: "Every listing carries a declared waste classification and handling profile mapped to RCRA Subtitle C/D expectations.",
    status: "live" as const,
  },
  {
    title: "ISRI grade definitions",
    body: "Metals are listed against ISRI specification codes, so a Birch/Cliff lot means the same thing to both sides.",
    status: "live" as const,
  },
  {
    title: "Immutable audit trail",
    body: "Listing edits, verification events, assays and settlement records are append-only and exportable per counterparty.",
    status: "live" as const,
  },
  {
    title: "SOC 2 Type II",
    body: "Controls design underway with an independent auditor; observation window scheduled post-launch.",
    status: "roadmap" as const,
  },
];

export const resourceArticles = [
  {
    slug: "isri-grades-explained",
    title: "ISRI grades, explained for buyers who never touched a scrapyard",
    kicker: "Grading",
    minutes: 9,
    excerpt:
      "Why Birch/Cliff and Bare Bright are not interchangeable, and how grade drift silently destroys margin on recurring contracts.",
  },
  {
    slug: "polymer-specs-that-matter",
    title: "The four polymer specs that actually decide your price",
    kicker: "Polymers",
    minutes: 7,
    excerpt:
      "Melt flow index, colour consistency, moisture and odour — everything else is negotiation theatre.",
  },
  {
    slug: "cullet-furnace-readiness",
    title: "Cullet furnace-readiness: the CSP problem",
    kicker: "Glass",
    minutes: 6,
    excerpt:
      "Ceramic, stone and porcelain contamination is the single biggest reason glass lots get rejected at the gate.",
  },
  {
    slug: "transfrontier-shipment",
    title: "Moving recovered material across borders without stalling",
    kicker: "Regulation",
    minutes: 12,
    excerpt:
      "Basel notifications, EU Waste Shipment Regulation and the paperwork that quietly adds three weeks to a deal.",
  },
  {
    slug: "recurring-vs-spot",
    title: "Recurring offtake vs spot lots: choosing a cadence",
    kicker: "Trading",
    minutes: 8,
    excerpt:
      "Spot pays the invoice. Recurring builds the plant. How mature desks split volume between the two.",
  },
  {
    slug: "verification-playbook",
    title: "A verification playbook for first-time counterparties",
    kicker: "Compliance",
    minutes: 10,
    excerpt:
      "Document checks, sample draws, third-party assay and site attestation — in the order that fails fastest and cheapest.",
  },
];

export const faqs = [
  {
    group: "Buyers",
    items: [
      {
        q: "Can I buy material on Encorb today?",
        a: "Not yet. Phase 1 is the public desk preview — listings shown across the site are illustrative and non-transactable. Register interest and you will be onboarded when the exchange opens.",
      },
      {
        q: "How are grades verified before I commit volume?",
        a: "Sellers submit documentation and declared specs, Encorb runs a verification workflow (document review, sample draw, third-party assay where the lot value justifies it), and the result is attached to the listing as a verification badge.",
      },
      {
        q: "Are the reference prices binding?",
        a: "No. All prices on the site and in the ticker are indicative, non-binding reference levels built from mock data for this preview.",
      },
    ],
  },
  {
    group: "Sellers",
    items: [
      {
        q: "What do I need to list a material?",
        a: "A declared grade, tonnage and cadence, origin and handling classification, and any assay or lab documentation you already hold. The engine will flag missing fields before a listing goes live.",
      },
      {
        q: "Do I have to expose my counterparties?",
        a: "No. Listings are visible at grade and region level; identity is only disclosed when both sides move into a negotiation.",
      },
      {
        q: "What does it cost?",
        a: "Plan tiers shown on the Pricing page are indicative for this preview. A transaction-fee model is still under evaluation.",
      },
    ],
  },
  {
    group: "Compliance",
    items: [
      {
        q: "How does Encorb handle regulated waste streams?",
        a: "Each listing carries a declared classification aligned to RCRA expectations, plus the handling and transport constraints that follow from it. Streams outside the platform's permitted scope are rejected at listing.",
      },
      {
        q: "Is Encorb SOC 2 certified?",
        a: "Not yet — SOC 2 Type II is on the roadmap and labelled as such everywhere it appears. Controls design is underway with an independent auditor.",
      },
      {
        q: "Can I export an audit trail?",
        a: "Yes, that is a core design commitment: append-only records of listing changes, verification events and settlement, exportable per counterparty.",
      },
    ],
  },
];

export const team = [
  { name: "Anneke Vos", role: "Co-founder, Desk", note: "12 years non-ferrous trading, Rotterdam." },
  { name: "M. Karthik", role: "Co-founder, Engineering", note: "Built matching systems for energy markets." },
  { name: "Dana Ferreira", role: "Head of Compliance", note: "Ex-regulator, transfrontier shipment." },
  { name: "Yuki Tanabe", role: "Head of Materials", note: "Polymer metallurgy and spec design." },
];
