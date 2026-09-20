import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  FileCheck2,
  Leaf,
  ArrowRight,
  Sparkles,
  Factory,
  RefreshCw,
  Building2,
  Tag,
  Truck,
  CheckCircle2,
  Globe2,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CircularTradeDesk() {
  const [activeHoverNode, setActiveHoverNode] = useState<"generator" | "encorb" | "reprocessor" | null>(null);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#061e14] to-slate-950 py-24 text-white">
      {/* Glow & ambient effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-12 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative z-10">
        
        {/* ─── PART 1: THE CIRCULAR TRADE DESK (Image 1 reference) ─── */}
        <div className="grid gap-12 lg:grid-cols-12 items-center mb-28">
          
          {/* Left Column: Heading & Value Props */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              The circular trade desk
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Turn the scrap you <br />
              generate into a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 italic font-serif">
                settled sale.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Encorb is a US marketplace where businesses that produce recovered metals, plastics, and glass sell them to verified reprocessors — with price, freight, and emissions paperwork handled in one workflow instead of a dozen phone calls.
            </p>

            {/* Feature Points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-4 backdrop-blur-sm transition-all hover:border-emerald-500/40">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-white">
                    See a fair, benchmarked price before you commit —
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    not a broker's guess. Real-time index pricing tied to live commodities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-4 backdrop-blur-sm transition-all hover:border-emerald-500/40">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-white">
                    Trade only with vetted, KYC-verified companies
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    on both sides of the deal with strict EIN validation and facility checks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-4 backdrop-blur-sm transition-all hover:border-emerald-500/40">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-white">
                    Get a Scope 3 diversion report automatically,
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    ready for your ESG books with EPA carbon abatement calculations.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:scale-105"
              >
                Explore Marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Schedule Facility Onboarding
              </Link>
            </div>

            <p className="text-[11px] font-mono tracking-widest text-emerald-400/80 uppercase pt-2">
              LESS WASTE. HIGHER VALUE. A CLEANER TOMORROW.
            </p>
          </motion.div>

          {/* Right Column: Live Desk Interactive Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#041a10]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-emerald-950/50">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                    Live Circular Desk Active
                  </span>
                </div>
                <span className="rounded-full bg-slate-800/80 border border-slate-700 px-3 py-1 text-[11px] font-mono text-slate-300">
                  50 US States • Guaranteed Escrow
                </span>
              </div>

              {/* Sample Live Order Flow Preview */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-emerald-500/40">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Millberry Copper Wire #1
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">$7,700 / Short Ton</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Quantity: 24.5 Tons (Full Vanload)</span>
                    <span className="text-slate-300">Pickup: Cleveland, OH</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 4 Verified Bids • Highest $8,120/t
                    </span>
                    <span className="text-slate-500">BOL Ready in 2m</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-emerald-500/40">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-teal-400" />
                      HDPE Natural Flakes (Post-Consumer)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">$1,160 / Short Ton</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Quantity: 42.0 Tons (2 Full Truckloads)</span>
                    <span className="text-slate-300">Pickup: Dallas, TX</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Lab Spec &gt; 99.4% Purity Verified
                    </span>
                    <span className="text-slate-500">Escrow Funded</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-emerald-500/40">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      Export Grade OCC #11 Bales
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">$145 / Short Ton</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Quantity: 110.0 Tons (5 Rail Containers)</span>
                    <span className="text-slate-300">Pickup: Savannah, GA</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Scope 3 Abatement: 341 MT CO₂e
                    </span>
                    <span className="text-slate-500">Dispatching Freight</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Stat */}
              <div className="mt-6 rounded-xl bg-emerald-950/40 border border-emerald-500/20 p-3.5 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Instant EIN Validation &amp; Lab Spec Matching
                </span>
                <Link to="/marketplace" className="text-emerald-400 font-semibold flex items-center gap-1 hover:underline">
                  Trade Now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>
          </motion.div>

        </div>


        {/* ─── PART 2: THE ENCORB PROCESS INFOGRAPHIC (Image 2 reference) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/95 via-[#031c12]/95 to-slate-950/95 p-6 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          
          {/* Center Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
            <span className="font-mono text-xs md:text-sm font-extrabold uppercase tracking-widest text-emerald-400">
              THE ENCORB PROCESS
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
              FROM SCRAP TO SECOND LIFE
            </h3>
          </div>

          {/* 3 Main Workflow Cards */}
          <div className="grid gap-6 md:grid-cols-3 relative z-10 items-stretch">
            
            {/* 1. GENERATOR */}
            <div 
              onMouseEnter={() => setActiveHoverNode("generator")}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`relative rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                activeHoverNode === "generator" 
                  ? "border-emerald-400 bg-emerald-950/50 shadow-lg shadow-emerald-500/20 scale-[1.02]" 
                  : "border-slate-800 bg-slate-950/60 hover:border-emerald-500/40"
              }`}
            >
              <div className="text-center">
                <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  BUSINESSES GENERATE REUSABLE MATERIALS
                </span>
                
                {/* 3D-like Generator Graphic */}
                <div className="my-4 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500/20 to-slate-900 border border-emerald-500/40 shadow-inner relative group">
                  <Factory className="h-10 w-10 text-emerald-400" />
                  <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-md">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </div>
                </div>

                <h4 className="font-display text-xl font-bold text-white tracking-wide">
                  GENERATOR
                </h4>
                <p className="mt-1 text-sm text-emerald-400 font-medium">
                  List the material
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 text-center">
                Manufacturers &amp; mills turn surplus waste into high-yield revenue streams.
              </div>
            </div>

            {/* 2. ENCORB PLATFORM (Center Hub) */}
            <div 
              onMouseEnter={() => setActiveHoverNode("encorb")}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`relative rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                activeHoverNode === "encorb" 
                  ? "border-emerald-400 bg-emerald-950/60 shadow-xl shadow-emerald-500/30 scale-[1.02]" 
                  : "border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950/70"
              }`}
            >
              <div className="text-center">
                <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold mb-3">
                  OUR MARKETPLACE CREATES OPPORTUNITIES
                </span>

                {/* Central Encorb 3D Slab */}
                <div className="my-4 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 via-emerald-600/20 to-slate-900 border-2 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] relative">
                  <div className="flex flex-col items-center">
                    <Leaf className="h-9 w-9 text-emerald-300 animate-pulse" />
                    <span className="font-display text-xs font-bold text-white tracking-wider mt-0.5">Encorb</span>
                  </div>
                </div>

                <h4 className="font-display text-xl font-bold text-white tracking-wide">
                  Encorb
                </h4>
                <p className="mt-1 text-sm text-emerald-400 font-medium">
                  Prices &amp; routes it
                </p>

                {/* Badges in Center */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
                    <Tag className="h-3.5 w-3.5 mb-1 text-emerald-400" />
                    <span>FAIR PRICING</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
                    <Truck className="h-3.5 w-3.5 mb-1 text-emerald-400" />
                    <span>SMART LOGISTICS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5 mb-1 text-emerald-400" />
                    <span>VERIFIED PARTNERS</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 text-center font-medium">
                Automated freight, guaranteed escrow &amp; live market reference prices.
              </div>
            </div>

            {/* 3. REPROCESSOR */}
            <div 
              onMouseEnter={() => setActiveHoverNode("reprocessor")}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`relative rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                activeHoverNode === "reprocessor" 
                  ? "border-emerald-400 bg-emerald-950/50 shadow-lg shadow-emerald-500/20 scale-[1.02]" 
                  : "border-slate-800 bg-slate-950/60 hover:border-emerald-500/40"
              }`}
            >
              <div className="text-center">
                <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  REPROCESSORS BUY &amp; GIVE MATERIALS A SECOND LIFE
                </span>

                {/* 3D-like Reprocessor Graphic */}
                <div className="my-4 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-b from-teal-500/20 to-slate-900 border border-teal-500/40 shadow-inner relative">
                  <Building2 className="h-10 w-10 text-teal-400" />
                  <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-slate-950 font-bold text-xs shadow-md">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                </div>

                <h4 className="font-display text-xl font-bold text-white tracking-wide">
                  REPROCESSOR
                </h4>
                <p className="mt-1 text-sm text-teal-400 font-medium">
                  They buy &amp; reprocess
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 text-center">
                Certified compounders, smelters, and recyclers obtain verified virgin-alternative feedstock.
              </div>
            </div>

          </div>

          {/* Bottom Circular Earth Flow */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 relative z-10">
            <div className="grid gap-6 md:grid-cols-3 items-center">
              
              {/* Left Benefit */}
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-display font-bold text-white text-base">LESS WASTE</h5>
                  <p className="text-xs text-slate-400">Keep valuable industrial materials in continuous circular use.</p>
                </div>
              </div>

              {/* Center Globe with Circular Badge */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-emerald-500/30 to-slate-950 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                  <Globe2 className="h-10 w-10 text-emerald-300 animate-spin" style={{ animationDuration: "35s" }} />
                  <div className="absolute inset-0 rounded-full border border-dashed border-emerald-400/60 animate-spin" style={{ animationDuration: "18s" }} />
                </div>
                <p className="mt-3 font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  A CLEANER. BRIGHTER. CIRCULAR FUTURE.
                </p>
              </div>

              {/* Right Benefit */}
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-display font-bold text-white text-base">HIGHER VALUE</h5>
                  <p className="text-xs text-slate-400">Turn industrial surplus and scrap into recurring commercial revenue.</p>
                </div>
              </div>

            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
