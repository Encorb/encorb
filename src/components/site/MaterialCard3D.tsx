import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MaterialFamily } from "@/lib/mock-data";
import { Sparkles, ShieldCheck, Eye, Layers } from "lucide-react";

interface SpecimenImage {
  name: string;
  isriCode: string;
  purity: string;
  textureLabel: string;
  imageUrl: string;
}

const SPECIMENS: Record<MaterialFamily, SpecimenImage[]> = {
  metals: [
    {
      name: "Copper #1 (Bare Bright)",
      isriCode: "ISRI 'Berry' / 'Candy'",
      purity: "≥99.9% Cu",
      textureLabel: "Continuous Cast Copper Wire & Cable Chops",
      imageUrl: "/images/materials/copper.png", // User Upload 1: Copper wire reels in facility
    },
    {
      name: "Aluminium Coils & UBC",
      isriCode: "ISRI 'Taldon' / 'Taboo'",
      purity: "≥98.5% Al",
      textureLabel: "Clean Industrial Aluminium Coils & Extrusions",
      imageUrl: "/images/materials/aluminium.png", // User Upload 2: Aluminium warehouse coils
    },
    {
      name: "Stainless 304 & Alloy Solids",
      isriCode: "ISRI 'Sabot'",
      purity: "18% Cr / 8% Ni",
      textureLabel: "Engineered Solid Alloy Cylinders & Billets",
      imageUrl: "/images/materials/brass.png", // User Upload 3: Solid metal billets & rods
    },
    {
      name: "Brass Solids",
      isriCode: "ISRI 'Honey' / 'Ebony'",
      purity: "60% Cu / 40% Zn",
      textureLabel: "Free-Cutting Brass Rods & Solid Extrusions",
      imageUrl: "/images/materials/brass.png", // User Upload 3: Solid brass/copper rods
    },
  ],
  polymers: [
    {
      name: "PET Clear Resin Pellets",
      isriCode: "ISRI Grade #1 PET",
      purity: "≥99.5% Virgin-Grade",
      textureLabel: "High-Clarity Translucent Polymer Granules",
      imageUrl: "/images/materials/polymers.png", // User Upload 4: High purity polymer granules
    },
    {
      name: "HDPE Natural Pellets",
      isriCode: "ISRI Grade #2 HDPE",
      purity: "MFI 0.4–0.9",
      textureLabel: "Unpigmented Pure Blow-Molding Polymer",
      imageUrl: "/images/materials/polymers.png", // User Upload 4: Polymer pellets
    },
    {
      name: "LDPE Film Grade Pellets",
      isriCode: "ISRI Clear Film 98/2",
      purity: "Low-Density Resin",
      textureLabel: "Clean Post-Industrial Extrusion Pellets",
      imageUrl: "/images/materials/polymers.png", // User Upload 4: Polymer pellets
    },
    {
      name: "PP Injection Molding Pellets",
      isriCode: "ISRI Grade #5 PP",
      purity: "MFI 12–25",
      textureLabel: "Homopolymer / Copolymer Compounded Resin",
      imageUrl: "/images/materials/polymers.png", // User Upload 4: Polymer pellets
    },
  ],
  glass: [
    {
      name: "Flint Glass (Furnace-Ready)",
      isriCode: "ISRI Flint Plate",
      purity: "≤0.5% CSP Ceramic",
      textureLabel: "High-Clarity Flat & Container Float Glass",
      imageUrl: "/images/materials/glass.png", // User Upload 5: Layered architectural float glass
    },
    {
      name: "Amber Glass Cullet",
      isriCode: "ISRI Amber Grade",
      purity: "≥95% Colour Purity",
      textureLabel: "Colour-Sorted Secondary Cullet Feedstock",
      imageUrl: "/images/materials/glass.png", // User Upload 5: Layered glass
    },
    {
      name: "Green Bottle Glass",
      isriCode: "ISRI Emerald Cullet",
      purity: "≥93% Colour Purity",
      textureLabel: "Clean Furnace-Ready Container Feedstock",
      imageUrl: "/images/materials/glass.png", // User Upload 5: Layered glass
    },
    {
      name: "Mixed Aggregate Glass",
      isriCode: "ISRI Mixed Float",
      purity: "Multi-Spectrum",
      textureLabel: "Float Glass Edge Trim & Reclaimed Panes",
      imageUrl: "/images/materials/glass.png", // User Upload 5: Layered glass
    },
  ],
};

export function MaterialCard3D({
  family,
  label,
  className,
}: {
  family: MaterialFamily;
  label: string;
  density?: number;
  className?: string;
}) {
  const specimens = SPECIMENS[family] || SPECIMENS.metals;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = specimens[selectedIndex] || specimens[0];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl",
        className
      )}
    >
      {/* High-Resolution Real Specimen Imagery */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
        <img
          src={current.imageUrl}
          alt={current.name}
          key={current.imageUrl + current.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Overlays for optimal text contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur-md border border-white/15">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>{current.isriCode}</span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500/25 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300 backdrop-blur-md border border-emerald-500/40 shadow-sm">
          <Sparkles className="h-3 w-3" />
          <span>{current.purity}</span>
        </div>

        {/* Bottom Specimen Details Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="drop-shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Eye className="h-3 w-3 text-emerald-400" /> Verified Commercial Grade
            </span>
            <h4 className="font-display text-base font-extrabold text-white">
              {current.name}
            </h4>
            <p className="text-[11px] font-medium text-emerald-300">
              {current.textureLabel}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-200 bg-slate-900/85 px-2.5 py-1 rounded-lg border border-slate-700 backdrop-blur-sm shadow-sm">
            <Layers className="h-3 w-3 text-emerald-400" />
            <span>Grade {selectedIndex + 1}/{specimens.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive Grade Specimen Switcher Thumbnails */}
      <div className="p-3 bg-slate-950/95 border-t border-white/10">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {specimens.map((spec, idx) => (
            <button
              key={spec.name}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex-1 min-w-[70px] rounded-lg p-1.5 text-left transition-all border",
                selectedIndex === idx
                  ? "bg-emerald-500/20 border-emerald-500/60 text-white shadow-sm ring-1 ring-emerald-400/40"
                  : "bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  selectedIndex === idx ? "bg-emerald-400" : "bg-slate-600"
                )} />
                <p className="text-[10px] font-bold truncate">
                  {spec.name.split(" ")[0]}
                </p>
              </div>
              <p className="text-[9px] font-mono text-muted-foreground truncate mt-0.5">
                {spec.isriCode.split(" ")[1] || spec.isriCode.split(" ")[0]}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
