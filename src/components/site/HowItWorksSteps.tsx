import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Truck,
  Crown,
  Search,
  Scale,
  DollarSign,
  Leaf,
  Layers,
  Sparkles,
  ChevronRight,
  Shield,
  FileSpreadsheet,
  Coins,
  Lock
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export function HowItWorksSteps() {
  const [activeTab, setActiveTab] = useState<"seller" | "buyer">("seller");

  const sellerSteps = [
    {
      num: "01",
      badge: "LIST",
      title: "Post your material",
      desc: "List a load by material type, grade, tonnage, and pickup location. We verify your company (EIN) in minutes.",
      tag: "Cu | ISRI: Bare Bright | 18 t",
      subtag: "Verified company ✓",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Bare Bright Cu #1
            </span>
            <span className="text-slate-300 font-bold">18.0 Short Tons</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-medium text-slate-300 my-1">
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-950/70 px-2 py-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Metals
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-950/70 px-2 py-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Plastics
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-950/70 px-2 py-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Glass
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-950/70 px-2 py-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Electronics
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
            <span>EIN: 84-2910***</span>
            <span className="text-emerald-400 font-bold">Verified in 2 mins</span>
          </div>
        </div>
      )
    },
    {
      num: "02",
      badge: "COMPARE",
      title: "Get verified offers",
      desc: "Matched buyers bid against a live reference price. You see the landed number, not a vague \"market rate.\"",
      tag: "3 offers • best $8,510/t",
      subtag: "Real-time, transparent pricing",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-2.5 flex items-center justify-center gap-2 overflow-hidden shadow-inner">
          {/* Side Offer 1 */}
          <div className="flex-1 rounded-xl bg-slate-900/80 border border-slate-800 p-2 text-center opacity-70">
            <span className="text-[9px] text-slate-400 block truncate">EcoMetals</span>
            <span className="text-[11px] font-bold text-slate-200 block">$8,200/t</span>
            <span className="text-[8px] text-amber-400">★ 4.8</span>
          </div>

          {/* Winning Center Offer */}
          <div className="flex-[1.4] rounded-xl bg-gradient-to-b from-emerald-500/25 to-emerald-950/90 border-2 border-emerald-400 p-2.5 text-center shadow-[0_0_20px_rgba(52,211,153,0.35)] relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full bg-amber-400 px-2 py-0.5 text-[8px] font-black text-slate-950 shadow">
              <Crown className="h-2.5 w-2.5" /> Best Offer
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold block mt-1">GreenLoop</span>
            <span className="text-xs sm:text-sm font-black text-white block">$8,510/t</span>
            <span className="text-[9px] text-amber-300">★ 4.9 Verified</span>
          </div>

          {/* Side Offer 2 */}
          <div className="flex-1 rounded-xl bg-slate-900/80 border border-slate-800 p-2 text-center opacity-70">
            <span className="text-[9px] text-slate-400 block truncate">CircuTech</span>
            <span className="text-[11px] font-bold text-slate-200 block">$7,950/t</span>
            <span className="text-[8px] text-amber-400">★ 4.7</span>
          </div>
        </div>
      )
    },
    {
      num: "03",
      badge: "CONFIRM",
      title: "Confirm the deal",
      desc: "Accept an offer and Encorb generates the Bill of Lading (BOL) and chain-of-custody record automatically — no paperwork chase.",
      tag: "BOL + chain of custody",
      subtag: "Auto-generated & compliant",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-white border-b border-slate-800/80 pb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <FileCheck className="h-4 w-4" /> Digital BOL #8921-US
            </span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300 font-mono font-bold">
              Ready
            </span>
          </div>
          <div className="space-y-1 text-[10px] text-slate-300 my-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-300"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Offer accepted</span>
              <span className="text-[9px] font-mono text-slate-400">T+0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-300"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Generate BOL</span>
              <span className="text-[9px] font-mono text-emerald-400">Auto</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-300"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Chain of custody locked</span>
              <span className="text-[9px] font-mono text-emerald-400">Secured</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 font-mono">
            <span>Status:</span>
            <span className="text-emerald-400 font-bold">Ready for pickup</span>
          </div>
        </div>
      )
    },
    {
      num: "04",
      badge: "SHIP & GET PAID",
      title: "Ship and get paid",
      desc: "Freight is booked for you. Payment releases once the weight ticket confirms delivery — typically T+2.",
      tag: "Weight-ticket verified • T+2",
      subtag: "Fast, secure payments",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-white">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Truck className="h-4 w-4" /> Encorb Logistics
            </span>
            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">Live GPS</span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center text-[8px] font-bold uppercase my-1">
            <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-1 text-emerald-300">
              Pickup ✓
            </div>
            <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-1 text-emerald-300">
              Transit ✓
            </div>
            <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-1 text-emerald-300">
              Delivered ✓
            </div>
            <div className="rounded-lg bg-emerald-400 text-slate-950 p-1 font-black shadow">
              Payment ✓
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
            <span>Weight ticket: #40921</span>
            <span className="text-emerald-400 font-bold">$153,180.00 Released</span>
          </div>
        </div>
      )
    }
  ];

  /* ─── BUYER STEPS EXACTLY FROM IMAGE 5 & 6 ─── */
  const buyerSteps = [
    {
      num: "01",
      badge: "BROWSE",
      title: "Browse the order book",
      desc: "Filter live listings by material, grade, region, and price. No cold-calling brokers to find out what's available.",
      tag: "240+ live loads",
      subtag: "US-wide inventory",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 border-b border-slate-800/80 pb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-emerald-400" /> Search Order Book
            </span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300 font-bold">
              240+ Loads
            </span>
          </div>
          {/* Visual sample items */}
          <div className="grid grid-cols-3 gap-1.5 my-1 text-center text-[9px]">
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-1 text-slate-300">
              <span className="block text-emerald-400 font-bold">Copper</span>
              <span className="text-[8px] text-slate-400">ISRI Bare #1</span>
            </div>
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-1 text-slate-300">
              <span className="block text-teal-400 font-bold">HDPE</span>
              <span className="text-[8px] text-slate-400">Natural Regrind</span>
            </div>
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-1 text-slate-300">
              <span className="block text-amber-400 font-bold">OCC #11</span>
              <span className="text-[8px] text-slate-400">Export Bales</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
            <span>Verified COA Specs</span>
            <span className="text-emerald-400 font-bold">Live Pricing</span>
          </div>
        </div>
      )
    },
    {
      num: "02",
      badge: "MAKE AN OFFER",
      title: "Make an offer",
      desc: "Bid with the full landed cost in view — material, freight, and Scope 3 emissions all totalled before you commit.",
      tag: "Landed $8,690/t",
      subtag: "All-in transparent pricing",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-white border-b border-slate-800/80 pb-1.5">
            <span className="text-amber-300 flex items-center gap-1.5">
              <Coins className="h-4 w-4" /> Landed Cost Calculation
            </span>
            <span className="text-emerald-400 font-mono text-[10px] font-bold">$8,690 / Ton</span>
          </div>
          <div className="space-y-1 text-[10px] text-slate-300 my-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-300"><Layers className="h-3 w-3 text-emerald-400" /> Material Price:</span>
              <span className="font-mono text-white">$8,200/t</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-300"><Truck className="h-3 w-3 text-teal-400" /> Freight (LTL/FTL):</span>
              <span className="font-mono text-white">$490/t</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-300"><Leaf className="h-3 w-3 text-emerald-400" /> CO₂e Emission Credit:</span>
              <span className="font-mono text-emerald-400">-4.2 MT</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 font-mono">
            <span>No hidden markups</span>
            <span className="text-emerald-400 font-bold">100% Guaranteed</span>
          </div>
        </div>
      )
    },
    {
      num: "03",
      badge: "LOCK IN",
      title: "Lock it in",
      desc: "Both sides are KYC-verified and your funds sit in escrow until delivery is confirmed. Nobody trades on trust alone.",
      tag: "Escrow-held",
      subtag: "KYC verified both sides",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-white border-b border-slate-800/80 pb-1.5">
            <span className="flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="h-4 w-4" /> Escrow Protected
            </span>
            <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[9px] text-amber-300 font-mono font-bold">
              Locked
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-[10px] my-1">
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-1.5">
              <Shield className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[9px] font-bold text-white block">KYC Verified</span>
              <span className="text-[8px] text-slate-400">Buyer &amp; Seller</span>
            </div>
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-1.5">
              <Lock className="h-4 w-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[9px] font-bold text-white block">Escrow Protected</span>
              <span className="text-[8px] text-slate-400">FDIC-Insured</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 font-mono">
            <span>Release Condition:</span>
            <span className="text-emerald-400 font-bold">Weight Scale Confirmed</span>
          </div>
        </div>
      )
    },
    {
      num: "04",
      badge: "RECEIVE & REPORT",
      title: "Receive and report",
      desc: "Take delivery with a weigh ticket and an automatic Scope 3 diversion report — audit-ready for your ESG filings.",
      tag: "Weight ticket + Scope 3 report",
      subtag: "Audit-ready ESG filings",
      illustration: (
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950/70 to-slate-950 border border-emerald-500/20 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-white">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Truck className="h-4 w-4" /> Encorb Logistics
            </span>
            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">Delivered</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-medium text-slate-300 my-1">
            <div className="flex items-center gap-1 rounded bg-emerald-950/70 p-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> Weight verified
            </div>
            <div className="flex items-center gap-1 rounded bg-emerald-950/70 p-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> Report generated
            </div>
            <div className="flex items-center gap-1 rounded bg-emerald-950/70 p-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> Scope 3 certified
            </div>
            <div className="flex items-center gap-1 rounded bg-emerald-950/70 p-1 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> ESG ready
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
            <span>Bill of Lading #8921</span>
            <span className="text-emerald-400 font-bold">PDF Ready</span>
          </div>
        </div>
      )
    }
  ];

  const currentSteps = activeTab === "seller" ? sellerSteps : buyerSteps;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#061c12] via-slate-950 to-[#041910] py-24 text-white">
      {/* Ambient background glow effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative z-10">
        
        {/* Header (Image 4 reference) */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-4">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            How it works
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Four steps, whichever side <br />
            of the deal you're on.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            The same clean path handles a mill selling copper scrap and a compounder buying it. Pick your side.
          </p>

          {/* Interactive Toggle Switch (Image 4 reference) */}
          <div className="mt-8 inline-flex items-center rounded-full bg-slate-900/90 p-1.5 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("seller")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "seller"
                  ? "bg-[#e5e5d8] text-slate-950 shadow-md scale-100 font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowUp className="h-4 w-4 font-bold" />
              I have material to sell
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("buyer")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "buyer"
                  ? "bg-[#e5e5d8] text-slate-950 shadow-md scale-100 font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowDown className="h-4 w-4 font-bold" />
              I want to buy material
            </button>
          </div>
        </div>

        {/* 4 Cards Grid (Image 3 & Image 5 reference) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
          >
            {currentSteps.map((step) => (
              <div
                key={step.num}
                className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#041a10]/90 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl font-extrabold text-emerald-400 tracking-tighter">
                      {step.num}
                    </span>
                    <span className="rounded-full bg-slate-800/90 border border-slate-700 px-3 py-1 text-[10px] font-mono font-bold tracking-wider text-emerald-300 uppercase">
                      {step.badge}
                    </span>
                  </div>

                  {/* Illustration graphic */}
                  <div className="mb-5">
                    {step.illustration}
                  </div>

                  {/* Card Title & Desc */}
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Footer Badge Tag */}
                <div className="mt-6 pt-4 border-t border-slate-800/90">
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-mono text-[11px] font-bold text-white truncate max-w-[170px]">
                        {step.tag}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                        {step.subtag}
                      </p>
                    </div>
                    <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA for Active Role */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">
                {activeTab === "seller" ? "Ready to sell industrial materials?" : "Ready to procure verified circular feedstock?"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                {activeTab === "seller" 
                  ? "List your facility lots in under 3 minutes with automated pricing benchmarks."
                  : "Filter 240+ live loads and bid with full landed cost and Scope 3 emissions verified."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeTab === "seller" ? (
              <Link
                to="/dashboard/seller"
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-105"
              >
                Go to Seller Portal <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/marketplace"
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-105"
              >
                Browse Order Book <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
