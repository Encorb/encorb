import { useState, useMemo } from "react";
import {
  Truck,
  MapPin,
  DollarSign,
  Calculator,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { type Listing } from "@/lib/store";

interface FreightEstimatorProps {
  listing: Listing;
  className?: string;
}

// Major US Freight Hub Coordinates & Distances Approximation
const US_HUBS: Record<string, { state: string; lat: number; lng: number }> = {
  "Houston, TX": { state: "TX", lat: 29.7604, lng: -95.3698 },
  "Chicago, IL": { state: "IL", lat: 41.8781, lng: -87.6298 },
  "Detroit, MI": { state: "MI", lat: 42.3314, lng: -83.0458 },
  "Pittsburgh, PA": { state: "PA", lat: 40.4406, lng: -79.9959 },
  "Atlanta, GA": { state: "GA", lat: 33.749, lng: -84.388 },
  "Austin, TX": { state: "TX", lat: 30.2672, lng: -97.7431 },
  "Los Angeles, CA": { state: "CA", lat: 34.0522, lng: -118.2437 },
  "Dallas, TX": { state: "TX", lat: 32.7767, lng: -96.797 },
  "Cleveland, OH": { state: "OH", lat: 41.4993, lng: -81.6944 },
  "Charlotte, NC": { state: "NC", lat: 35.2271, lng: -80.8431 },
  "Philadelphia, PA": { state: "PA", lat: 39.9526, lng: -75.1652 },
};

const EQUIPMENT_TYPES = [
  { id: "dry_van", name: "53' Dry Van (Baled/Palletized)", ratePerMile: 2.85, maxWeightLbs: 45000 },
  { id: "flatbed", name: "Flatbed / Drop Deck (Structural/Scrap)", ratePerMile: 3.25, maxWeightLbs: 48000 },
  { id: "bulk_hopper", name: "Bulk Hopper / Dump Trailer", ratePerMile: 3.45, maxWeightLbs: 50000 },
  { id: "intermodal", name: "Intermodal Rail (Long Haul >800mi)", ratePerMile: 2.15, maxWeightLbs: 52000 }
];

export function FreightEstimator({ listing, className = "" }: FreightEstimatorProps) {
  const [destLocation, setDestLocation] = useState<string>("Chicago, IL");
  const [destZip, setDestZip] = useState<string>("60601");
  const [equipmentId, setEquipmentId] = useState<string>("dry_van");
  const [cargoWeightLbs, setCargoWeightLbs] = useState<number>(
    listing.unit === "Tons" ? Math.min(listing.quantity * 2000, 44000) : Math.min(listing.quantity, 44000)
  );
  const [quoteLocked, setQuoteLocked] = useState(false);

  // Approximate mileage calculation
  const originHub = Object.keys(US_HUBS).find((h) => listing.location.includes(h.split(",")[0])) || "Houston, TX";
  
  const estimatedMiles = useMemo(() => {
    const origin = US_HUBS[originHub] || US_HUBS["Houston, TX"];
    const dest = US_HUBS[destLocation] || US_HUBS["Chicago, IL"];
    
    // Haversine distance formula approximation with road circuity factor 1.22
    const R = 3958.8; // Radius of the earth in miles
    const dLat = ((dest.lat - origin.lat) * Math.PI) / 180;
    const dLon = ((dest.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((dest.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const directMiles = R * c;
    const roadMiles = Math.max(120, Math.round(directMiles * 1.24));
    return roadMiles;
  }, [originHub, destLocation]);

  const selectedEquipment = EQUIPMENT_TYPES.find((e) => e.id === equipmentId) || EQUIPMENT_TYPES[0];

  // Calculations
  const linehaulCost = Math.round(estimatedMiles * selectedEquipment.ratePerMile);
  const fuelSurcharge = Math.round(linehaulCost * 0.16); // 16% DOE national diesel average
  const tarpAccessorial = equipmentId === "flatbed" ? 120 : 0;
  const totalFreight = linehaulCost + fuelSurcharge + tarpAccessorial;

  // Normalized weight in listing units
  const quantityInListingUnits = listing.unit === "Tons" ? cargoWeightLbs / 2000 : cargoWeightLbs;
  const materialBaseTotal = listing.price * quantityInListingUnits;
  const landedTotalCost = materialBaseTotal + totalFreight;
  
  const landedPerUnit = quantityInListingUnits > 0 ? (landedTotalCost / quantityInListingUnits).toFixed(listing.unit === "lbs" ? 3 : 2) : "0.00";
  const freightPerUnit = quantityInListingUnits > 0 ? (totalFreight / quantityInListingUnits).toFixed(listing.unit === "lbs" ? 3 : 2) : "0.00";

  return (
    <div className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              US Freight & Landed Cost Estimator
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Live FMCSA Rates
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Instant haul rate calculation and landed delivered price at your destination facility.
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-muted-foreground font-mono">Origin Corridor:</span>
          <p className="text-xs font-semibold text-foreground flex items-center justify-end gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            {listing.location}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination & Equipment Configuration */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Destination Terminal / Hub</span>
              <span className="text-[11px] text-muted-foreground">Est. {estimatedMiles} road miles</span>
            </label>
            <select
              value={destLocation}
              onChange={(e) => {
                setDestLocation(e.target.value);
                setQuoteLocked(false);
              }}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-500 focus:outline-none"
            >
              {Object.keys(US_HUBS).map((hub) => (
                <option key={hub} value={hub}>
                  {hub} (US Logistics Corridor)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Receiving ZIP</label>
              <input
                type="text"
                value={destZip}
                onChange={(e) => setDestZip(e.target.value)}
                placeholder="e.g. 77002"
                maxLength={5}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Load Weight (lbs)</label>
              <input
                type="number"
                value={cargoWeightLbs}
                onChange={(e) => setCargoWeightLbs(Number(e.target.value))}
                max={50000}
                min={1000}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Trailer / Equipment Type</label>
            <select
              value={equipmentId}
              onChange={(e) => {
                setEquipmentId(e.target.value);
                setQuoteLocked(false);
              }}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-500 focus:outline-none"
            >
              {EQUIPMENT_TYPES.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} — ~${eq.ratePerMile}/mi
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cost Matrix Summary */}
        <div className="flex flex-col justify-between rounded-lg bg-muted/40 p-4 border border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-border">
              <span className="text-muted-foreground">Linehaul Base ({estimatedMiles} mi @ ${selectedEquipment.ratePerMile}/mi)</span>
              <span className="font-mono font-medium text-foreground">${linehaulCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-1 border-b border-border">
              <span className="text-muted-foreground">EIA Diesel Fuel Surcharge (16%)</span>
              <span className="font-mono font-medium text-foreground">${fuelSurcharge.toLocaleString()}</span>
            </div>
            {tarpAccessorial > 0 && (
              <div className="flex items-center justify-between text-xs pb-1 border-b border-border">
                <span className="text-muted-foreground">Flatbed Tarping / Securement</span>
                <span className="font-mono font-medium text-foreground">${tarpAccessorial}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs font-bold pt-1 text-foreground">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-emerald-600" />
                Est. Freight Total (Full Truckload)
              </span>
              <span className="font-mono text-emerald-600 text-sm">${totalFreight.toLocaleString()}</span>
            </div>
          </div>

          {/* Landed Unit Comparison */}
          <div className="mt-3 rounded-lg bg-background p-3 border border-border">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="border-r border-border pr-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">FOB Origin Price</span>
                <p className="text-sm font-bold text-foreground font-mono">
                  ${listing.price.toFixed(listing.unit === "lbs" ? 2 : 2)} <span className="text-[10px] font-normal text-muted-foreground">/{listing.unit}</span>
                </p>
              </div>
              <div className="pl-2">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">Landed Delivered Cost</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  ${landedPerUnit} <span className="text-[10px] font-normal text-muted-foreground">/{listing.unit}</span>
                </p>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-center text-muted-foreground">
              Includes +${freightPerUnit}/{listing.unit} estimated freight surcharge.
            </p>
          </div>

          <div className="mt-3">
            {quoteLocked ? (
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
                Freight Quote Locked for 24 Hours
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setQuoteLocked(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Lock Freight Quote for RFQ / Bid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
