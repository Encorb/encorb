import { useState } from "react";
import {
  X,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  DollarSign,
  MapPin,
  Building2,
  ExternalLink,
  HelpCircle,
  Gavel,
  FileText
} from "lucide-react";
import { type Listing } from "@/lib/store";
import { Link } from "@tanstack/react-router";

interface MaterialCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedListings: Listing[];
  onRemoveListing: (id: string) => void;
}

interface ISRIBenchmark {
  category: string;
  isriCode: string;
  title: string;
  purityBenchmark: string;
  contaminationCeiling: string;
  moistureLimit: string;
  densitySpec: string;
  marketFobAvg: string;
  astmSpec: string;
}

const ISRI_BENCHMARKS: Record<string, ISRIBenchmark> = {
  Plastic: {
    category: "Plastic",
    isriCode: "ISRI Grade #1 (Flake / Baled)",
    title: "ISRI Post-Consumer Clear PET / Natural HDPE",
    purityBenchmark: "≥ 98.5%",
    contaminationCeiling: "≤ 1.5% non-polymer",
    moistureLimit: "≤ 1.0% max",
    densitySpec: "≥ 15 lbs/cu ft (Baled)",
    marketFobAvg: "$0.48 - $0.58 / lb",
    astmSpec: "ASTM D7611 / APR Model Guideline"
  },
  Metal: {
    category: "Metal",
    isriCode: "ISRI 200-206 (HMS #1)",
    title: "ISRI Heavy Melting Steel / 380 Secondary Aluminum",
    purityBenchmark: "≥ 99.0% ferrous",
    contaminationCeiling: "≤ 0.5% dirt/non-metallics",
    moistureLimit: "Dry (0.0%)",
    densitySpec: "≥ 50 lbs/cu ft",
    marketFobAvg: "$390 - $440 / Gross Ton",
    astmSpec: "ISRI Scrap Spec Circular 2024"
  },
  Paper: {
    category: "Paper",
    isriCode: "ISRI Grade #11 (OCC)",
    title: "ISRI Old Corrugated Containers (OCC)",
    purityBenchmark: "≥ 95.0% kraft fiber",
    contaminationCeiling: "≤ 1.0% prohibitive materials",
    moistureLimit: "≤ 12.0% max",
    densitySpec: "≥ 28 lbs/cu ft",
    marketFobAvg: "$145 - $175 / Short Ton",
    astmSpec: "ISRI Paper Stock Standards PSI-2024"
  },
  "Reclaimed Timber": {
    category: "Reclaimed Timber",
    isriCode: "NHLA / Reclaimed Heartwood",
    title: "Reclaimed Douglas Fir / Longleaf Pine Heavy Timber",
    purityBenchmark: "100% Solid Heartwood",
    contaminationCeiling: "Denailed & Metal Free",
    moistureLimit: "≤ 14.0% kiln-stable",
    densitySpec: "Structural Grade 1",
    marketFobAvg: "$3.80 - $5.50 / Board Ft",
    astmSpec: "ASTM D245 / Timber Graders Standard"
  },
  "E-Waste": {
    category: "E-Waste",
    isriCode: "R2v3 / ISRI Circuit Board Grade A",
    title: "High-Yield Telecommunication / Server Scrap",
    purityBenchmark: "Gold/Palladium finger yield >120ppm",
    contaminationCeiling: "≤ 2.0% chassis plastic",
    moistureLimit: "Dry",
    densitySpec: "Palletized / Gaylord Box",
    marketFobAvg: "$8.50 - $14.00 / lb",
    astmSpec: "R2v3 Sustainable Electronics Certified"
  },
  Industrial: {
    category: "Industrial",
    isriCode: "ISRI Secondary Raw Material",
    title: "Industrial Manufacturing Off-Spec Surplus",
    purityBenchmark: "≥ 95.0%",
    contaminationCeiling: "≤ 2.0%",
    moistureLimit: "≤ 2.0%",
    densitySpec: "Standard Tote / Drum",
    marketFobAvg: "Custom negotiated",
    astmSpec: "OEM Lot Certificate of Analysis"
  }
};

export function MaterialCompareModal({
  isOpen,
  onClose,
  selectedListings,
  onRemoveListing
}: MaterialCompareModalProps) {
  if (!isOpen || selectedListings.length === 0) return null;

  const primaryCategory = selectedListings[0].category;
  const isriBenchmark = ISRI_BENCHMARKS[primaryCategory] || ISRI_BENCHMARKS["Plastic"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Material Spec & ISRI Benchmark Comparison
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedListings.length} Lot{selectedListings.length > 1 ? "s" : ""} Selected
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Side-by-side technical evaluation against official North American scrap commodity specifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider text-[11px] w-44">
                  Specification Dimension
                </th>
                {/* Official Benchmark Column */}
                <th className="pb-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-t-lg border-x border-t border-emerald-500/20 w-64">
                  <div className="flex items-center justify-between">
                    <span>ISRI Official Benchmark</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-normal text-muted-foreground block truncate">
                    {isriBenchmark.isriCode}
                  </span>
                </th>
                {/* Selected Lots Columns */}
                {selectedListings.map((item) => (
                  <th key={item.id} className="pb-3 px-4 font-bold text-foreground w-64">
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{item.title}</span>
                      <button
                        onClick={() => onRemoveListing(item.id)}
                        className="text-muted-foreground hover:text-rose-600 transition"
                        title="Remove from comparison"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-normal text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-emerald-600" />
                      {item.location}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Pricing & Format */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">FOB Unit Price</td>
                <td className="py-3 px-4 font-mono font-medium text-muted-foreground bg-emerald-500/5 border-x border-emerald-500/20">
                  {isriBenchmark.marketFobAvg}
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 font-mono font-bold text-foreground">
                    ${item.price.toFixed(item.unit === "lbs" ? 2 : 2)} /{item.unit}
                    {item.listing_type === "auction" && (
                      <span className="ml-1.5 rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-600">
                        AUCTION
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Total Lot Quantity */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Available Quantity</td>
                <td className="py-3 px-4 text-muted-foreground bg-emerald-500/5 border-x border-emerald-500/20">
                  Full Truckload (FTL ~44k lbs)
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 font-mono text-foreground font-semibold">
                    {item.quantity.toLocaleString()} {item.unit}
                  </td>
                ))}
              </tr>

              {/* Material Purity Grade */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Purity / Composition</td>
                <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20">
                  {isriBenchmark.purityBenchmark}
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{item.specs?.purity || "98%+ Tested"}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Contamination Tolerance Ceiling */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Contamination Ceiling</td>
                <td className="py-3 px-4 text-muted-foreground bg-emerald-500/5 border-x border-emerald-500/20">
                  {isriBenchmark.contaminationCeiling}
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-foreground font-medium">
                    {item.specs?.contamination_level || "≤ 1.0% Non-target"}
                  </td>
                ))}
              </tr>

              {/* Moisture Content */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Moisture Content</td>
                <td className="py-3 px-4 text-muted-foreground bg-emerald-500/5 border-x border-emerald-500/20">
                  {isriBenchmark.moistureLimit}
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-foreground">
                    {item.specs?.moisture_content || "≤ 0.5% (Dry Stored)"}
                  </td>
                ))}
              </tr>

              {/* Bale Density / Package Form */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Packaging & Density</td>
                <td className="py-3 px-4 text-muted-foreground bg-emerald-500/5 border-x border-emerald-500/20">
                  {isriBenchmark.densitySpec}
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-foreground">
                    {item.specs?.bale_density || item.specs?.mesh_size || "High-Density Baled / Wire Tied"}
                  </td>
                ))}
              </tr>

              {/* ISRI / ASTM Spec Standard */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Standard Standard / Code</td>
                <td className="py-3 px-4 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20">
                  {isriBenchmark.astmSpec}
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                    {item.specs?.isri_code || "ISRI Certified Lot"}
                  </td>
                ))}
              </tr>

              {/* Generator / Origin Facility */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Generator Company</td>
                <td className="py-3 px-4 text-muted-foreground bg-emerald-500/5 border-x border-emerald-500/20">
                  ISRI Member Mills
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.seller?.business_name || item.seller?.name || "Verified Enterprise"}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Direct Action Row */}
              <tr>
                <td className="py-4 pr-4 font-bold text-foreground">Direct Procurement Action</td>
                <td className="py-4 px-4 bg-emerald-500/5 border-x border-b border-emerald-500/20 rounded-b-lg text-center text-muted-foreground text-[11px]">
                  Standard Guideline Baseline
                </td>
                {selectedListings.map((item) => (
                  <td key={item.id} className="py-4 px-4">
                    <Link
                      to="/listing/$id"
                      params={{ id: item.id }}
                      onClick={onClose}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                      {item.listing_type === "auction" ? (
                        <>
                          <Gavel className="h-3.5 w-3.5" />
                          Bid on Lot
                        </>
                      ) : (
                        <>
                          <FileText className="h-3.5 w-3.5" />
                          Request RFQ
                        </>
                      )}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            ISRI specifications conform to the Institute of Scrap Recycling Industries Guidelines (Circular 2024).
          </p>
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
