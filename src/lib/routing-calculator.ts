import { ROUTING_RAW_DATA } from "./routing-data-store";

export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  density: number | null;
  hazard: string;
  notes: string;
  source: string;
}

export interface PathwayFactors {
  factors: Record<string, number>;
  confidence: string;
}

export interface TransportModeItem {
  mode: string;
  vehicleType: string;
  fuelType: string;
  ef: number; // g CO2 / short ton-mile
  capacity: number; // short tons
  source: string;
}

export interface LocationItem {
  name: string;
  state: string;
  city: string;
  lat: number;
  lon: number;
}

export interface EquivalencyItem {
  label: string;
  conversionKg: number;
  unit: string;
  source: string;
}

export interface RoutingSettings {
  conservativeBuffer: number;
  roadDistanceMultiplier: number;
  internalHaulRemoved: number;
  methaneOxidationFactor: number;
  certificateThresholdKg: number;
}

export interface RoutingDatabase {
  settings: RoutingSettings;
  fuelFactors: Record<string, number>;
  materials: MaterialItem[];
  pathways: Record<string, PathwayFactors>;
  transportModes: TransportModeItem[];
  tippingFees: Record<string, number>;
  equivalencies: EquivalencyItem[];
  locations: LocationItem[];
}

export const ROUTING_DB = ROUTING_RAW_DATA as unknown as RoutingDatabase;

export const MASS_UNITS = ["lb", "short ton", "metric ton", "kg"] as const;
export type MassUnit = (typeof MASS_UNITS)[number];

export const PATHWAY_NAMES = [
  "Reuse",
  "Recycle",
  "Landfill (avg)",
  "Landfill (no rec)",
  "Landfill (flare)",
  "Landfill (energy)",
  "WTE (no rec)",
  "WTE (energy)",
  "Compost",
  "AD wet",
  "AD dry",
] as const;
export type PathwayName = (typeof PATHWAY_NAMES)[number];

/**
 * Converts user quantity to short tons based on Excel 08_Transaction_Calculator formula:
 * lb -> /2000
 * kg -> /907.185
 * metric ton -> *1.10231
 * short ton -> *1
 */
export function convertToShortTons(qty: number, unit: MassUnit): number {
  if (!qty || isNaN(qty) || qty <= 0) return 0;
  switch (unit) {
    case "lb":
      return qty / 2000;
    case "kg":
      return qty / 907.185;
    case "metric ton":
      return qty * 1.10231;
    case "short ton":
    default:
      return qty;
  }
}

/**
 * Great-circle distance using spherical law of cosines (miles)
 * multiplied by road distance multiplier (1.2) per Excel sheet 02_Settings
 */
export function calculateDistance(
  pLat: number,
  pLon: number,
  dLat: number,
  dLon: number
): { greatCircleMiles: number; roadMiles: number } {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const lat1 = rad(pLat);
  const lat2 = rad(dLat);
  const lonDiff = rad(dLon - pLon);

  // 3958.8 * ACOS(SIN(lat1)*SIN(lat2) + COS(lat1)*COS(lat2)*COS(lonDiff))
  const cosAngle =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDiff);

  const clampedCos = Math.min(1, Math.max(-1, cosAngle));
  const greatCircleMiles = 3958.8 * Math.acos(clampedCos);
  const roadMultiplier = ROUTING_DB.settings.roadDistanceMultiplier || 1.2;
  const roadMiles = greatCircleMiles * roadMultiplier;

  return {
    greatCircleMiles: Number(greatCircleMiles.toFixed(2)),
    roadMiles: Number(roadMiles.toFixed(2)),
  };
}

export interface RoutingCalculationParams {
  materialName: string;
  quantity: number;
  unit: MassUnit;
  pickupLocation: LocationItem;
  dropoffLocation: LocationItem;
  transportMode: string;
  vehicleType: string;
  fuelType: string;
  baselinePathway: PathwayName | string;
  encorbPathway: PathwayName | string;
}

export interface RoutingCalculationResult {
  massShortTons: number;
  greatCircleMiles: number;
  roadMiles: number;
  transportEF: number; // g / ton-mile
  transportEmissionsKg: number;
  baselinePathwayEF: number; // MTCO2e / short ton
  encorbPathwayEF: number; // MTCO2e / short ton
  baselineMgmtKg: number;
  encorbMgmtKg: number;
  pathwayEmissionsDiffKg: number;
  avoidedEmissionsKg: number;
  avoidedEmissionsTons: number; // tCO2e
  confidence: string;
  certificateEligible: boolean;
  certificateId: string | null;
  equivalencies: {
    label: string;
    value: number;
    unit: string;
    source: string;
  }[];
}

export function calculateEmissions(
  params: RoutingCalculationParams
): RoutingCalculationResult {
  const massShortTons = convertToShortTons(params.quantity, params.unit);

  const { greatCircleMiles, roadMiles } = calculateDistance(
    params.pickupLocation.lat,
    params.pickupLocation.lon,
    params.dropoffLocation.lat,
    params.dropoffLocation.lon
  );

  // Find transport emission factor
  const tm = ROUTING_DB.transportModes.find(
    (t) =>
      t.mode.toLowerCase() === params.transportMode.toLowerCase() &&
      t.vehicleType.toLowerCase() === params.vehicleType.toLowerCase() &&
      t.fuelType.toLowerCase() === params.fuelType.toLowerCase()
  );
  const transportEF = tm ? tm.ef : 178; // Fallback to Class 8 diesel (178 g/ton-mi)

  // Transport emissions in kg CO2e: (mass_tons * road_dist * EF_g) / 1000
  const transportEmissionsKg = (massShortTons * roadMiles * transportEF) / 1000;

  // Pathways
  const materialPathway = ROUTING_DB.pathways[params.materialName];
  const baselinePathwayEF =
    materialPathway?.factors[params.baselinePathway] ?? 0.02; // Landfill default
  const encorbPathwayEF =
    materialPathway?.factors[params.encorbPathway] ?? -1.5;

  // Management emissions: mass_tons * EF * 1000 (kg CO2e)
  const baselineMgmtKg = massShortTons * baselinePathwayEF * 1000;
  const encorbMgmtKg = massShortTons * encorbPathwayEF * 1000;
  const pathwayEmissionsDiffKg = baselineMgmtKg - encorbMgmtKg;

  // Avoided emissions formula from Excel:
  // (BaselineMgmt - EncorbMgmt - TransportEmissions) * (1 - ConservativeBuffer)
  const buffer = ROUTING_DB.settings.conservativeBuffer || 0.05;
  const avoidedEmissionsKg =
    (pathwayEmissionsDiffKg - transportEmissionsKg) * (1 - buffer);
  const avoidedEmissionsTons = avoidedEmissionsKg / 1000;

  const confidence = materialPathway?.confidence || "Medium";
  const threshold = ROUTING_DB.settings.certificateThresholdKg || 100;
  const certificateEligible = avoidedEmissionsKg >= threshold;
  const certificateId = certificateEligible
    ? `CERT-${Math.floor(1000 + Math.random() * 9000)}`
    : null;

  // Compute equivalencies based on positive avoided emissions
  const positiveKg = Math.max(0, avoidedEmissionsKg);
  const equivalencies = ROUTING_DB.equivalencies.map((eq) => {
    let value = 0;
    if (eq.conversionKg > 0) {
      value = positiveKg / eq.conversionKg;
    }
    return {
      label: eq.label,
      value: Number(value.toFixed(2)),
      unit: eq.unit,
      source: eq.source,
    };
  });

  return {
    massShortTons: Number(massShortTons.toFixed(3)),
    greatCircleMiles,
    roadMiles,
    transportEF,
    transportEmissionsKg: Number(transportEmissionsKg.toFixed(2)),
    baselinePathwayEF,
    encorbPathwayEF,
    baselineMgmtKg: Number(baselineMgmtKg.toFixed(2)),
    encorbMgmtKg: Number(encorbMgmtKg.toFixed(2)),
    pathwayEmissionsDiffKg: Number(pathwayEmissionsDiffKg.toFixed(2)),
    avoidedEmissionsKg: Number(avoidedEmissionsKg.toFixed(2)),
    avoidedEmissionsTons: Number(avoidedEmissionsTons.toFixed(4)),
    confidence,
    certificateEligible,
    certificateId,
    equivalencies,
  };
}

export interface MultiBuyerOption {
  optionId: number;
  buyerCompany: string;
  dropoffLocation: LocationItem;
  encorbPathway: PathwayName | string;
  bidPricePerTon: number;
  transportMode: string;
  vehicleType: string;
  fuelType: string;
}

export interface MultiBuyerComparisonResult {
  sellerInfo: {
    sellerCompany: string;
    pickupLocation: LocationItem;
    materialName: string;
    quantity: number;
    unit: MassUnit;
    massShortTons: number;
    baselinePathway: PathwayName | string;
  };
  buyers: Array<
    MultiBuyerOption & {
      roadMiles: number;
      transportEmissionsKg: number;
      pathwayEmissionsDiffKg: number;
      totalAvoidedKg: number;
      avoidedTons: number;
      bidRevenue: number;
      tCO2ePerDollar: number;
      rank: number;
    }
  >;
  recommendations: {
    bestByAvoidedEmissions: string;
    maxTonsAvoided: number;
    bestByEmissionsPerDollar: string;
    highestBid: string;
  };
}

export function compareMultipleBuyers(
  seller: {
    sellerCompany: string;
    pickupLocation: LocationItem;
    materialName: string;
    quantity: number;
    unit: MassUnit;
    baselinePathway: PathwayName | string;
  },
  buyerOptions: MultiBuyerOption[]
): MultiBuyerComparisonResult {
  const massShortTons = convertToShortTons(seller.quantity, seller.unit);
  const buffer = ROUTING_DB.settings.conservativeBuffer || 0.05;
  const materialPathway = ROUTING_DB.pathways[seller.materialName];
  const baselineEF =
    materialPathway?.factors[seller.baselinePathway] ?? 0.02;
  const baseMgmtKg = massShortTons * baselineEF * 1000;

  const evaluated = buyerOptions.map((opt) => {
    const { roadMiles } = calculateDistance(
      seller.pickupLocation.lat,
      seller.pickupLocation.lon,
      opt.dropoffLocation.lat,
      opt.dropoffLocation.lon
    );

    const tm = ROUTING_DB.transportModes.find(
      (t) =>
        t.mode.toLowerCase() === opt.transportMode.toLowerCase() &&
        t.vehicleType.toLowerCase() === opt.vehicleType.toLowerCase() &&
        t.fuelType.toLowerCase() === opt.fuelType.toLowerCase()
    );
    const ef = tm ? tm.ef : 178;
    const transportEmissionsKg = (massShortTons * roadMiles * ef) / 1000;

    const encorbEF = materialPathway?.factors[opt.encorbPathway] ?? -1.5;
    const encorbMgmtKg = massShortTons * encorbEF * 1000;
    const pathwayDiffKg = baseMgmtKg - encorbMgmtKg;

    const totalAvoidedKg = (pathwayDiffKg - transportEmissionsKg) * (1 - buffer);
    const avoidedTons = totalAvoidedKg / 1000;
    const bidRevenue = massShortTons * opt.bidPricePerTon;
    const tCO2ePerDollar =
      bidRevenue > 0 ? Number((avoidedTons / bidRevenue).toFixed(6)) : 0;

    return {
      ...opt,
      roadMiles: Number(roadMiles.toFixed(1)),
      transportEmissionsKg: Number(transportEmissionsKg.toFixed(1)),
      pathwayEmissionsDiffKg: Number(pathwayDiffKg.toFixed(1)),
      totalAvoidedKg: Number(totalAvoidedKg.toFixed(1)),
      avoidedTons: Number(avoidedTons.toFixed(3)),
      bidRevenue: Number(bidRevenue.toFixed(2)),
      tCO2ePerDollar,
      rank: 1, // calculated next
    };
  });

  // Calculate ranks by avoided emissions descending
  const indices = evaluated.map((_, i) => i);
  indices.sort((a, b) => {
    const valA = evaluated[a]?.totalAvoidedKg ?? 0;
    const valB = evaluated[b]?.totalAvoidedKg ?? 0;
    return valB - valA;
  });
  indices.forEach((origIdx, rankIdx) => {
    const target = evaluated[origIdx];
    if (target) {
      target.rank = rankIdx + 1;
    }
  });

  // Recommendations
  const bestEmissionsBuyer = [...evaluated].sort(
    (a, b) => b.totalAvoidedKg - a.totalAvoidedKg
  )[0];
  const bestValueBuyer = [...evaluated].sort(
    (a, b) => b.tCO2ePerDollar - a.tCO2ePerDollar
  )[0];
  const highestBidBuyer = [...evaluated].sort(
    (a, b) => b.bidRevenue - a.bidRevenue
  )[0];

  return {
    sellerInfo: {
      ...seller,
      massShortTons: Number(massShortTons.toFixed(3)),
    },
    buyers: evaluated,
    recommendations: {
      bestByAvoidedEmissions: bestEmissionsBuyer?.buyerCompany || "N/A",
      maxTonsAvoided: bestEmissionsBuyer?.avoidedTons || 0,
      bestByEmissionsPerDollar: bestValueBuyer?.buyerCompany || "N/A",
      highestBid: highestBidBuyer?.buyerCompany || "N/A",
    },
  };
}
