import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Search,
  Users2,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  Layers,
  Scale,
  CheckCircle2,
  Cpu,
  Truck,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Encorb Works — 5-Step Circular Commodity Process | Encorb" },
      {
        name: "description",
        content:
          "From waste identification to nationwide circular trade — discover how Encorb transforms industrial waste streams into measurable economic and environmental value.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const PROCESS_STEPS = [
  {
    num: "01",
    tag: "AI-Powered Assessment",
    title: "Assess & Analyze",
    desc: "We evaluate waste streams, identify recoverable materials, and analyze environmental and commercial potential with precision. Our circular scan detects purity levels, contamination tolerances, and yield viability.",
    detail: "Intake algorithms classify materials against ISRI standards to eliminate informational discounts.",
    icon: Search,
  },
  {
    num: "02",
    tag: "Verified Network",
    title: "Connect Verified Partners",
    desc: "Our platform matches commercial scrap generators with certified recyclers, compounders, and re-processors through an authenticated US trading network. Every counterparty is KYC and EIN verified.",
    detail: "Direct connection with no opaque middlemen, allowing transparent landed-cost bids.",
    icon: Users2,
  },
  {
    num: "03",
    tag: "Automated Compliance",
    title: "Compliance & Documentation",
    desc: "Structured documentation workflows ensure compliance with state EPA, RCRA, and interstate freight regulations — completely automated with digital Bills of Lading (BOL) and chain of custody.",
    detail: "Instant generation of shipping manifests, scale ticket verification, and COA matching.",
    icon: FileCheck,
  },
  {
    num: "04",
    tag: "FDIC-Insured Settlement",
    title: "Execute Circular Trade",
    desc: "Secure marketplace transactions protect both parties. Bids are locked into FDIC-insured escrow. Funds release automatically upon verified weighbridge scale-slip receipt at delivery.",
    detail: "Zero settlement friction, eliminating bad-debt risk and multi-month payment delays.",
    icon: ShieldCheck,
  },
  {
    num: "05",
    tag: "Real-Time Intelligence",
    title: "Optimize & Scale",
    desc: "Data-driven insights help industrial facilities optimize diversion rates, expand long-term off-take agreements, and scale sustainable profitability with exportable Scope 3 carbon reduction reports.",
    detail: "Downloadable ESG certificates for corporate reporting, audits, and sustainability disclosures.",
    icon: TrendingUp,
  },
];

const PLATFORM_FEATURES = [
  {
    num: "01",
    title: "Circular Waste Scan",
    desc: "Identify recoverable secondary materials, assess recycling potential, and uncover hidden revenue within factory waste streams through algorithmic analysis.",
    icon: Cpu,
  },
  {
    num: "02",
    title: "Verified Partner Matching",
    desc: "Connect with certified North American buyers and recyclers ranked by compliance, logistical proximity, and credit score through our intelligent matching engine.",
    icon: Scale,
  },
  {
    num: "03",
    title: "Compliance Intelligence",
    desc: "Stay aligned with environmental regulations and interstate trade policies through automated documentation across 50+ jurisdictions.",
    icon: Truck,
  },
];

const FAQS = [
  {
    q: "How does Encorb protect transaction funds?",
    a: "Every transaction is escrow-protected in FDIC-insured accounts. The buyer deposits payment upon offer acceptance, and funds are only disbursed to the seller once the material is delivered, weighed, and inspected.",
  },
  {
    q: "How are freight and shipping handled?",
    a: "Encorb provides integrated logistics options with national LTL and FTL carriers. Pre-negotiated freight rates and automated digital Bills of Lading (BOL) are calculated directly into total landed price.",
  },
  {
    q: "What types of materials can be traded on Encorb?",
    a: "We support over 139 commercial non-hazardous industrial materials across 9 core categories: Plastics (HDPE, PET, PP, LDPE), Metals (Aluminum, Copper, Stainless), Cardboard & Paper (OCC, DLK), Electronics, Glass, Rubber, Organics, and Construction salvage.",
  },
  {
    q: "How do I get my facility verified?",
    a: "Simply sign up through our commercial onboarding wizard, provide your company name, Federal EIN / Tax ID, facility classification, and dispatch location. Our compliance team verifies your status in under 24 hours.",
  },
];

export function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28 px-4 md:px-8 border-b border-slate-800">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-[1240px] relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 mb-6">
            <Sparkles className="h-4 w-4 text-emerald-400" /> Process & Architecture
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08]">
            How Encorb{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Works
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
            From initial waste identification to nationwide circular trade — Encorb transforms industrial secondary
            streams into measurable economic and environmental value through five robust, automated phases.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25"
            >
              Explore Live Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              Onboard Your Facility
            </Link>
          </div>
        </div>
      </section>

      {/* 5-Step Process Cards */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">The 5-Step Lifecycle</span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-foreground">
              End-to-End Circular Trade Engine
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Structured to replace manual phone brokerage with automated verification, logistics, and FDIC-backed escrow.
            </p>
          </div>

          <div className="space-y-8">
            {PROCESS_STEPS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all grid gap-6 lg:grid-cols-12 items-center"
                >
                  <div className="lg:col-span-1 flex items-center lg:flex-col justify-between">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-emerald-600">{s.num}</span>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-bold text-slate-700 mb-2">
                      {s.tag}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{s.desc}</p>
                  </div>

                  <div className="lg:col-span-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Operational Guarantee</p>
                    <p className="text-xs text-emerald-950 mt-1 leading-relaxed">{s.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Core Capabilities</span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
              Powering the Future of Smart Circular Trade
            </h2>
            <p className="mt-4 text-base text-slate-300">
              Encorb is a secure digital marketplace connecting verified waste generators and certified re-processors through structured workflows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PLATFORM_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.num} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-emerald-400 font-extrabold text-xl">{feat.num}</span>
                      <div className="h-10 w-10 rounded-xl bg-slate-800 text-emerald-400 grid place-items-center">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-white mb-2">{feat.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-[860px] px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Common Questions</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-bold text-base text-foreground cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-emerald-600" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-50 border-t border-border">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Ready to Streamline Your Secondary Material Procurement?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Create your commercial facility account today and connect directly with North American generators and processors.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-700/20"
            >
              Register Facility Now
            </Link>
            <Link
              to="/marketplace"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Browse Live Materials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
