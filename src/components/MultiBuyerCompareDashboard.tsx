import { useState, useMemo } from "react";
import {
  ROUTING_DB,
  compareMultipleBuyers,
  type LocationItem,
  type MassUnit,
  type PathwayName,
  type MultiBuyerOption,
  MASS_UNITS,
  PATHWAY_NAMES,
} from "@/lib/routing-calculator";
import {
  GitCompare,
  TrendingUp,
  DollarSign,
  Award,
  Leaf,
  Truck,
  Building2,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function MultiBuyerCompareDashboard() {
  // Seller State matching Sheet 09 defaults
  const [sellerCompany, setSellerCompany] = useState("Walmart DC #4521");
  const [pickupCity, setPickupCity] = useState<LocationItem>(
    () =>
      ROUTING_DB.locations.find((l) => l.name.includes("Columbus, OH")) ||
      ROUTING_DB.locations[0]!
  );
  const [materialName, setMaterialName] = useState("OCC (Cardboard)");
  const [quantity, setQuantity] = useState<number>(24000);
  const [unit, setUnit] = useState<MassUnit>("lb");
  const [baselinePathway, setBaselinePathway] = useState<PathwayName>("Landfill (avg)");

  // 5 Candidate Buyers matching Sheet 09 row 16-20
  const [candidates, setCandidates] = useState<MultiBuyerOption[]>([
    {
      optionId: 1,
      buyerCompany: "Pratt Industries",
      dropoffLocation:
        ROUTING_DB.locations.find((l) => l.name.includes("Indianapolis city, IN")) ||
        ROUTING_DB.locations[1]!,
      encorbPathway: "Recycle",
      bidPricePerTon: 95,
      transportMode: "Truck",
      vehicleType: "Heavy (Class 8) Long-haul",
      fuelType: "Diesel",
    },
    {
      optionId: 2,
      buyerCompany: "WestRock",
      dropoffLocation:
        ROUTING_DB.locations.find((l) => l.name.includes("Atlanta, GA")) ||
        ROUTING_DB.locations[2]!,
      encorbPathway: "Recycle",
      bidPricePerTon: 110,
      transportMode: "Truck",
      vehicleType: "Heavy (Class 8) Long-haul",
      fuelType: "Diesel",
    },
    {
      optionId: 3,
      buyerCompany: "Caraustar Recycling",
      dropoffLocation:
        ROUTING_DB.locations.find((l) => l.name.includes("Charlotte, NC")) ||
        ROUTING_DB.locations[3]!,
      encorbPathway: "Recycle",
      bidPricePerTon: 88,
      transportMode: "Truck",
      vehicleType: "Heavy (Class 8) Long-haul",
      fuelType: "Biodiesel B100",
    },
    {
      optionId: 4,
      buyerCompany: "Local Composting LLC",
      dropoffLocation:
        ROUTING_DB.locations.find((l) => l.name.includes("Cincinnati, OH")) ||
        ROUTING_DB.locations[4]!,
      encorbPathway: "Compost",
      bidPricePerTon: 25,
      transportMode: "Truck",
      vehicleType: "Medium (Class 5-7)",
      fuelType: "Diesel",
    },
    {
      optionId: 5,
      buyerCompany: "Covanta WTE",
      dropoffLocation:
        ROUTING_DB.locations.find((l) => l.name.includes("Detroit, MI")) ||
        ROUTING_DB.locations[5]!,
      encorbPathway: "WTE (energy)",
      bidPricePerTon: 15,
      transportMode: "Truck",
      vehicleType: "Heavy (Class 8) Short-haul",
      fuelType: "Diesel",
    },
  ]);

  // Compute live comparison result
  const comparison = useMemo(() => {
    return compareMultipleBuyers(
      {
        sellerCompany,
        pickupLocation: pickupCity,
        materialName,
        quantity,
        unit,
        baselinePathway,
      },
      candidates
    );
  }, [sellerCompany, pickupCity, materialName, quantity, unit, baselinePathway, candidates]);

  const updateCandidate = (
    index: number,
    field: keyof MultiBuyerOption,
    value: any
  ) => {
    setCandidates((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 border border-blue-500/30 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
            <GitCompare className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-white">
                Multi-Buyer Comparison & Routing Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                1 Seller × 5 Candidate Buyers
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Optimizes net avoided emissions (tCO2e) against commercial bid revenues ($) with haul-adjusted factors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span>Payload Mass:</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold border border-slate-700">
            {comparison.sellerInfo.massShortTons} short tons
          </span>
        </div>
      </div>

      {/* Top 4 Recommendation Highlights (Sheet 09 Rows 24-27) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recommendation 1 */}
        <div className="p-4 rounded-2xl bg-card border border-emerald-500/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Highest Avoided GHG
            </span>
            <Trophy className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {comparison.recommendations.bestByAvoidedEmissions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Max avoided:{" "}
            <span className="font-bold text-emerald-600 font-mono">
              +{comparison.recommendations.maxTonsAvoided} tCO2e
            </span>
          </p>
        </div>

        {/* Recommendation 2 */}
        <div className="p-4 rounded-2xl bg-card border border-blue-500/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Max Bid Revenue
            </span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {comparison.recommendations.highestBid}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Highest commercial dollar offer per ton
          </p>
        </div>

        {/* Recommendation 3 */}
        <div className="p-4 rounded-2xl bg-card border border-purple-500/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
              Best Emissions / Dollar
            </span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {comparison.recommendations.bestByEmissionsPerDollar}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Highest environmental return per transaction dollar
          </p>
        </div>

        {/* Recommendation 4 */}
        <div className="p-4 rounded-2xl bg-card border border-amber-500/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Counterfactual
            </span>
            <Leaf className="h-4 w-4 text-amber-600" />
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {baselinePathway}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Replaced baseline disposal reference
          </p>
        </div>
      </div>

      {/* Seller Origin Header Configuration */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-600" />
          Seller Dispatch Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-muted-foreground mb-1 block">Seller Facility</label>
            <input
              type="text"
              value={sellerCompany}
              onChange={(e) => setSellerCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-muted-foreground mb-1 block">Origin City (Pickup)</label>
            <select
              value={pickupCity.name}
              onChange={(e) => {
                const found = ROUTING_DB.locations.find((l) => l.name === e.target.value);
                if (found) setPickupCity(found);
              }}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {ROUTING_DB.locations.slice(0, 100).map((l, i) => (
                <option key={i} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground mb-1 block">Commodity Stream</label>
            <select
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {ROUTING_DB.materials.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground mb-1 block">Quantity & Unit</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as MassUnit)}
                className="px-2 py-2 rounded-lg border border-input bg-background font-medium"
              >
                {MASS_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Candidate Comparison Matrix Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Candidate Bidders Evaluation Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked automatically by verified net avoided emissions after transport deductions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground border-b border-border font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Candidate Buyer</th>
                <th className="py-3 px-4">Dropoff City</th>
                <th className="py-3 px-4">Pathway</th>
                <th className="py-3 px-4">Haul Dist</th>
                <th className="py-3 px-4">Bid Price</th>
                <th className="py-3 px-4">Bid Revenue</th>
                <th className="py-3 px-4">Freight CO2</th>
                <th className="py-3 px-4">Net Avoided</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.buyers.map((b, idx) => {
                const isBestEmissions = b.buyerCompany === comparison.recommendations.bestByAvoidedEmissions;
                const isBestBid = b.buyerCompany === comparison.recommendations.highestBid;

                return (
                  <tr
                    key={b.optionId}
                    className={`transition-colors hover:bg-muted/30 ${
                      isBestEmissions ? "bg-emerald-500/5 font-medium" : ""
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full font-bold text-[11px] ${
                          b.rank === 1
                            ? "bg-emerald-600 text-white"
                            : b.rank === 2
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        #{b.rank}
                      </span>
                    </td>

                    {/* Candidate Buyer */}
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{b.buyerCompany}</span>
                        {isBestEmissions && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Top Eco
                          </span>
                        )}
                        {isBestBid && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            Top Bid
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        {b.transportMode} · {b.vehicleType} ({b.fuelType})
                      </span>
                    </td>

                    {/* Dropoff City */}
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {b.dropoffLocation.name}
                    </td>

                    {/* Pathway */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {b.encorbPathway}
                      </span>
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-4 font-mono">
                      {b.roadMiles} mi
                    </td>

                    {/* Bid Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      ${b.bidPricePerTon}/ton
                    </td>

                    {/* Bid Revenue */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      ${b.bidRevenue.toLocaleString()}
                    </td>

                    {/* Transport CO2 */}
                    <td className="py-3.5 px-4 font-mono text-rose-500">
                      -{b.transportEmissionsKg.toLocaleString()} kg
                    </td>

                    {/* Net Avoided */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-extrabold text-emerald-600 text-sm">
                        +{b.avoidedTons.toFixed(2)} tCO2e
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {b.totalAvoidedKg.toLocaleString()} kg
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm">
                        Select Buyer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
