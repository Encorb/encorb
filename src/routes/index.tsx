import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Search,
  Shield,
  TrendingUp,
  Leaf,
  Gavel,
  Scale,
  Truck,
  FileCheck,
  Zap,
  Building2,
  ChevronRight,
  Clock,
  Sparkles,
  DollarSign,
  MapPin,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  LIVE_COMMODITY_INDICES,
  getListings,
  US_STATES,
  type Listing,
  type WasteCategory,
  type USRegion
} from "@/lib/store";

import { CircularTradeDesk } from "@/components/site/CircularTradeDesk";
import { HowItWorksSteps } from "@/components/site/HowItWorksSteps";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Encorb — B2B Circular Materials & Commodity Exchange" },
      { name: "description", content: "The digital exchange for North American circular materials. Live commodity auctions, verified material specifications, escrow security, and integrated domestic logistics." }
    ]
  }),
  component: LandingPage,
});

/* ─── LIVE COMMODITY MARQUEE TICKER ───────────────────────────────────────── */
function LiveCommodityTicker() {
  const items = [...LIVE_COMMODITY_INDICES, ...LIVE_COMMODITY_INDICES];

  return (
    <div className="border-b border-slate-800 bg-slate-950 text-white overflow-hidden py-2.5 px-4 text-xs font-mono relative">
      <div className="mx-auto flex max-w-[1400px] items-center">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider shrink-0 z-10 bg-slate-950 pr-4 border-r border-slate-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Live Commodity Index
        </div>
        <div className="relative flex-1 overflow-hidden ml-4">
          <div className="animate-ticker flex w-max items-center gap-8 group-hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 shrink-0">
                <span className="text-slate-400 font-semibold">{item.name}</span>
                <span className="font-bold text-white">
                  ${item.price.toFixed(item.price < 1 ? 2 : 0)}/{item.unit}
                </span>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${item.change24h >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {item.change24h >= 0 ? "+" : ""}{item.change24h}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CIRCULAR ROI & IMPACT CALCULATOR ─────────────────────────────────────── */
const MATERIAL_IMPACT_RATES: Record<string, { pricePerTon: number; co2PerTon: number; kwhPerTon: number; landfillYd3PerTon: number }> = {
  "OCC Corrugated Cardboard": { pricePerTon: 145, co2PerTon: 3.1, kwhPerTon: 4100, landfillYd3PerTon: 3.3 },
  "HDPE Post-Consumer Polymer": { pricePerTon: 1160, co2PerTon: 2.4, kwhPerTon: 5800, landfillYd3PerTon: 4.8 },
  "Aluminum 6063 Scrap": { pricePerTon: 1840, co2PerTon: 9.0, kwhPerTon: 14000, landfillYd3PerTon: 2.1 },
  "Bare Bright Copper": { pricePerTon: 7700, co2PerTon: 4.5, kwhPerTon: 8200, landfillYd3PerTon: 1.2 },
  "Reclaimed Hardwood Pallets": { pricePerTon: 320, co2PerTon: 1.8, kwhPerTon: 1900, landfillYd3PerTon: 5.5 },
  "Commercial Tire Shred (TDF)": { pricePerTon: 85, co2PerTon: 1.2, kwhPerTon: 3200, landfillYd3PerTon: 3.9 },
};

function CircularRoiCalculator() {
  const [selectedMat, setSelectedMat] = useState("HDPE Post-Consumer Polymer");
  const [tons, setTons] = useState(45);

  const rate = MATERIAL_IMPACT_RATES[selectedMat] || MATERIAL_IMPACT_RATES["HDPE Post-Consumer Polymer"];
  const estRevenue = tons * rate.pricePerTon;
  const estCo2 = (tons * rate.co2PerTon).toFixed(1);
  const estEnergy = (tons * rate.kwhPerTon).toLocaleString();
  const estLandfill = (tons * rate.landfillYd3PerTon).toFixed(0);

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative z-10">
        {/* Item 9 & 10: Center-aligned section header & enlarged title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm sm:text-base font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md animate-border-glow shadow-sm">
            <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" /> Environmental & Economic Intelligence
          </span>
          <h2 className="mt-5 font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight text-center">
            Calculate your diversion revenue &amp; carbon credits.
          </h2>
          <p className="mt-5 text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Quantify the economic value recovered and verified Scope 3 emissions reductions generated by your industrial material streams through Encorb.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Select Recyclable Commodity Stream
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {Object.keys(MATERIAL_IMPACT_RATES).map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setSelectedMat(mat)}
                  className={`text-left p-3.5 rounded-xl border text-xs font-semibold transition-all ${selectedMat === mat ? "border-emerald-400 bg-emerald-500/15 text-white shadow-sm ring-1 ring-emerald-400/50" : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"}`}
                >
                  {mat}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-300">
                  Monthly Volume (Short Tons)
                </label>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {tons} Short Tons ({ (tons * 2000).toLocaleString() } lbs)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={tons}
                onChange={(e) => setTons(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-2">
                <span>5 Tons (LTL)</span>
                <span>100 Tons (5 Full Vans)</span>
                <span>500 Tons (Multi-Facility)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>*Based on current US Gulf Coast & Midwest market benchmark pricing</span>
              <Link to="/marketplace" className="text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                View live bids <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 to-slate-950 p-6 shadow-lg">
              <div className="flex items-center justify-between text-emerald-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Est. Monthly Recovery</span>
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="font-display text-4xl font-extrabold text-white">
                ${estRevenue.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Direct trade value generated through competitive bidding.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">
              <div className="flex items-center justify-between text-teal-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">CO₂e Abatement</span>
                <Leaf className="h-5 w-5" />
              </div>
              <p className="font-display text-4xl font-extrabold text-white">
                {estCo2} <span className="text-base font-normal text-slate-400">MT</span>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Metric tons of greenhouse gases avoided vs virgin extraction.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">
              <div className="flex items-center justify-between text-blue-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Energy Conserved</span>
                <Zap className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl font-extrabold text-white">
                {estEnergy} <span className="text-sm font-normal text-slate-400">kWh</span>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Equivalent to powering {Math.round(Number(estEnergy.replace(/,/g, '')) / 900)} US homes for a month.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">
              <div className="flex items-center justify-between text-amber-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Landfill Diverted</span>
                <Scale className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl font-extrabold text-white">
                {estLandfill} <span className="text-sm font-normal text-slate-400">yd³</span>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Municipal industrial landfill volume conserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MAIN LANDING PAGE ────────────────────────────────────────────────────── */
function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<USRegion>("All");
  const [selectedState, setSelectedState] = useState<string>("All");

  const HERO_ROTATING_WORDS = [
    "Industrial Materials",
    "Recoverable Materials",
    "Secondary Materials",
    "Circular Commodities"
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HERO_ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/marketplace" });
  };

  const [auctionLots, setAuctionLots] = useState<Listing[]>([]);

  useEffect(() => {
    getListings().then((all) => {
      setAuctionLots(all.filter((l) => l.is_auction));
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 1. Real-Time Commodity Price Ticker Bar */}
      <LiveCommodityTicker />

      {/* 2. HERO SECTION — Modern Enterprise SaaS Look */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

        <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Top Pill — Item 3 & 4 */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm sm:text-base font-bold text-emerald-300 backdrop-blur-md tracking-wide animate-border-glow"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              North America's B2B Circular Commodity & Materials Exchange
            </motion.div>

            {/* Headline with entrance animation — Item 3 & 4 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl lg:leading-[1.1]"
            >
              <span>Transform </span>
              <span className="inline-block relative overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={HERO_ROTATING_WORDS[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block text-white"
                  >
                    {HERO_ROTATING_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span> into </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Certified Value.
              </span>
            </motion.h1>

            {/* Positioning Subtext with reveal animation — Item 3 & 4 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-xl leading-relaxed"
            >
              Encorb connects US manufacturers, recoverable material generators, and verified recyclers across all 50 states.
              Real-time auctions, verified lab specs, escrow security, and automated domestic Bill of Lading (BOL) logistics.
            </motion.p>

            {/* Instant Marketplace Search Bar with Region & State Filters — Item 5 */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              onSubmit={handleHeroSearch}
              className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-700/80 bg-slate-800/80 p-3 shadow-2xl backdrop-blur-md"
            >
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search material (e.g., HDPE Flakes, OCC #11, Copper Wire, GMA Pallets)..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  {/* Dedicated State Filter */}
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-300 focus:outline-none"
                  >
                    <option value="All">All 50 States (All Regions)</option>
                    {US_STATES.filter((s) => s !== "All").map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 shrink-0 shadow-lg shadow-emerald-500/25"
                  >
                    Search Lots <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Credibility metric pills — Item 6 */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> EPA & ISRI Compliant Specs</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Guaranteed Escrow Settlement</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Domestic Bill of Lading (BOL) Freight</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR STEPS — SELLER & BUYER WORKFLOW SELECTOR */}
      <HowItWorksSteps />

      {/* 4. CIRCULAR ROI & IMPACT CALCULATOR */}
      <CircularRoiCalculator />

      {/* 5. LIVE AUCTIONS & FEATURED COMMODITIES */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                <Gavel className="h-4 w-4" /> Real-Time Bidding Exchange
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
                Featured Live Material Auctions
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Direct bids on verified industrial lots with lab inspection certificates.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              View all 24+ live lots <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {auctionLots.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {auctionLots.map((lot) => (
                <Link
                  key={lot.id}
                  to="/listing/$id"
                  params={{ id: lot.id }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  {/* Image — Item 7 */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <img
                      src={lot.image_url}
                      alt={lot.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-bold text-white shadow-md">
                      <Clock className="h-3 w-3" /> Live Auction
                    </div>
                    <div className="absolute top-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
                      {lot.location}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="font-semibold uppercase tracking-wider text-emerald-600">{lot.category}</span>
                      <span>{lot.bid_count || 0} active bids</span>
                    </div>
                    <h3 className="font-display font-bold text-base text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {lot.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{lot.description}</p>

                    <div className="mt-4 pt-4 border-t border-border/80 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Lot Quantity</span>
                        <p className="font-bold text-foreground">{lot.quantity.toLocaleString()} {lot.unit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current High Bid</span>
                        <p className="font-display font-extrabold text-emerald-600 text-sm">
                          ${lot.current_bid?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs font-semibold text-slate-500">
                        Min raise: +${lot.min_bid_increment}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-colors group-hover:bg-emerald-400">
                        Place Bid <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Gavel className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground">No Active Auctions at This Moment</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                New auction lots are verified and listed weekly. Browse our standardized catalog or list your material stream.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  to="/marketplace"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  Explore Marketplace
                </Link>
                <Link
                  to="/materials"
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition"
                >
                  View Material Grades
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. INTERACTIVE MATERIAL GRADE EXPLORER */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              ISRI Standardized Specifications
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold text-foreground">
              Industrial Materials Traded on Encorb
            </h2>
            <p className="mt-4 text-muted-foreground">
              Lab-verified grading, contamination thresholds, and moisture controls for standard North American recycling feedstocks.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Post-Consumer & Industrial Polymers",
                desc: "HDPE #2 regrind flakes, PET bottle-grade flakes, LDPE film bales, and PP masterbatch compounds.",
                specs: "Purity > 99.2% • Moisture < 0.5%",
                price: "$0.45 – $0.62 / lb",
                img: "/images/pvc-pipes.jpg",
                cat: "Plastic"
              },
              {
                title: "Mill-Grade Corrugated Paper & OCC",
                desc: "Grade #11 double-wire export OCC bales, Sorted Office Waste (SOW), and unprinted bleached kraft.",
                specs: "Moisture < 10% • Prohibitives < 1.5%",
                price: "$135 – $165 / Ton",
                img: "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=800&q=80",
                cat: "Paper"
              },
              {
                title: "Ferrous & Non-Ferrous Metals",
                desc: "Bare bright #1 copper wire, 6063 clean aluminum extrusion, 304 stainless steel turnings, and HMS 1/2.",
                specs: "ISRI Millberry • Spark Emission Tested",
                price: "$0.68 – $3.95 / lb",
                img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                cat: "Metal"
              },
              {
                title: "Enterprise E-Scrap & ITAD",
                desc: "Server motherboards, telecom backplanes, populated telecom boards, and sorted gold-pin IC chips.",
                specs: "R2v3 Certified • Battery De-populated",
                price: "$1.90 – $3.20 / lb",
                img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
                cat: "E-Waste"
              },
              {
                title: "Reclaimed Timber & GMA Pallets",
                desc: "Grade A 48x40 heat-treated hardwood pallets, Douglas fir structural timbers, and industrial dunnage.",
                specs: "ISPM-15 HT Stamped • 4-Way Entry",
                price: "$6.50 – $8.50 / Unit",
                img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                cat: "Reclaimed Timber"
              },
              {
                title: "Industrial Drums & Poly Containers",
                desc: "55-gallon HMW-HDPE blue drums (triple rinsed), 275-gallon IBC composite totes, and commercial tire shred.",
                specs: "UN Rated • 200 kPa Pressure Tested",
                price: "$14.00 – $18.50 / Drum",
                img: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&q=80",
                cat: "Industrial"
              }
            ].map((m) => (
              <div
                key={m.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-emerald-500/40 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden rounded-xl bg-slate-100 mb-5 relative">
                    <img
                      src={m.img}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/80 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-white">
                      {m.cat}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-mono text-[11px] text-muted-foreground">{m.specs}</p>
                    <p className="font-bold text-emerald-600 mt-0.5">{m.price}</p>
                  </div>
                  <Link
                    to="/marketplace"
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THE CIRCULAR TRADE DESK & THE ENCORB PROCESS */}
      <CircularTradeDesk />


      {/* 8. FINAL CTA BANNER */}
      <section className="py-24 bg-gradient-to-b from-background to-emerald-500/5">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-sm">
            <Building2 className="h-8 w-8" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Ready to optimize your material stream across the USA?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            Join hundreds of US manufacturing plants, distribution hubs, and certified re-processors trading on Encorb.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/marketplace"
              className="flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-105"
            >
              Enter Live Marketplace <ArrowRight className="h-5 w-5" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-base font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Register Facility Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


