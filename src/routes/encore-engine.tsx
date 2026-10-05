import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Cpu,
  Scan,
  FlaskConical,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  BookOpen,
  ChevronRight,
  TrendingUp,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/encore-engine")({
  head: () => ({
    meta: [
      { title: "Encore Engine — Powered by Circular Intelligence | Encorb" },
      {
        name: "description",
        content:
          "Transform waste into measurable global value with the Encore Engine. Automated circular waste scan, recyclability analysis, green sourcing, and compliance intelligence.",
      },
    ],
  }),
  component: EncoreEnginePage,
});

const SOLUTIONS = [
  {
    num: "01",
    icon: Scan,
    title: "Circular Waste Scan",
    desc: "Identify recoverable materials, assess reuse potential, and uncover hidden value streams within your industrial waste ecosystem. Our circular waste scan evaluates composition, environmental impact, and economic recovery potential.",
    capabilities: [
      "Material Identification & Chemical Profiling",
      "Waste Stream Volume & Run-Rate Evaluation",
      "Commercial Recovery Opportunity Mapping",
    ],
    metric: "85% Recovery Target",
  },
  {
    num: "02",
    icon: FlaskConical,
    title: "Recyclability Analysis",
    desc: "Our recyclability analysis evaluates material composition, recovery efficiency, and processing feasibility. We help industrial facilities determine the most sustainable recycling pathways and maximize net landed value.",
    capabilities: [
      "ISRI & ASTM Material Specification Matching",
      "Contamination & Yield Rate Optimization",
      "Direct Secondary Smelter & Extruder Pathways",
    ],
    metric: "90% Process Feasibility",
  },
  {
    num: "03",
    icon: Leaf,
    title: "Green Sourcing",
    desc: "Encorb enables manufacturers and compounders to source verified sustainable feedstock through an authenticated network of waste generators. Supporting ESG-mandated procurement without supply risk.",
    capabilities: [
      "Verified Counterparty Directory & EIN Checks",
      "Certified PCR / PIR Circular Feedstock Lots",
      "Guaranteed Chain-of-Custody Tracking",
    ],
    metric: "100% Traceable Loads",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Compliance Intelligence",
    desc: "Stay aligned with environmental regulations and interstate waste trade policies through structured digital documentation and automated compliance verification across 50+ North American jurisdictions.",
    capabilities: [
      "Automated Digital Bill of Lading (BOL) Generation",
      "RCRA / State EPA Environmental Compliance Verification",
      "FDIC-Insured Escrow Settlement Infrastructure",
    ],
    metric: "90% Secure Documentation",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Waste Discovery & Assessment",
    desc: "Submit your material streams through our intelligent intake system. Our algorithms evaluate material classification, moisture, purity, and volume in real time.",
    icon: Search,
  },
  {
    step: "02",
    title: "Verified Partner Matching",
    desc: "Our matching engine pairs you with qualified, compliance-verified recyclers and buyers who meet exact ISRI technical specs and proximity criteria.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Secure Trade Facilitation",
    desc: "Execute domestic or cross-border trades with confidence. Auto-generated digital BOLs, weigh ticket verification, and FDIC escrow protect both parties.",
    icon: Lock,
  },
  {
    step: "04",
    title: "Impact Tracking & Reporting",
    desc: "Monitor your circular performance with real-time analytics. Export Scope 3 diversion reports, carbon reduction metrics, and certificate ledgers.",
    icon: BarChart,
  },
];

const INSIGHTS = [
  {
    tag: "Circular Economy",
    date: "March 2026",
    title: "Transforming Industrial Waste into Scalable Commercial Value",
    summary: "How modern secondary material processors are shifting from disposal cost centers to high-margin commodity profit centers.",
  },
  {
    tag: "Compliance & Regulation",
    date: "March 2026",
    title: "The New Regulatory Landscape for Cross-Border & Interstate Waste Trade",
    summary: "Navigating state EPAs, RCRA manifests, and digital chain-of-custody documentation under tightening ESG scrutiny.",
  },
  {
    tag: "Circular Trade",
    date: "March 2026",
    title: "Building Direct Counterparty Partnerships for Resilient Circular Supply Chains",
    summary: "Why leading OEMs and plastics compounders are bypassing traditional scrap brokers for automated exchange platforms.",
  },
];

export function EncoreEnginePage() {
  const [activeSolution, setActiveSolution] = useState(0);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28 px-4 md:px-8 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-[1240px] relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 mb-6">
            <Cpu className="h-4 w-4 text-emerald-400" /> Powered by Circular Intelligence
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08]">
            What is the{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Encore Engine?
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
            We enable businesses to transform industrial waste into measurable global value — connecting verified partners
            through secure, compliant, and data-driven circular trade algorithms.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25"
            >
              Explore Live Services <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Engine Key Metrics Strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 backdrop-blur">
              <p className="font-display text-4xl font-black text-emerald-400">85%</p>
              <p className="text-sm font-bold text-white mt-1">Value Recovery</p>
              <p className="text-xs text-slate-400 mt-0.5">Average yield uplift across industrial waste streams</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 backdrop-blur">
              <p className="font-display text-4xl font-black text-teal-400">90%</p>
              <p className="text-sm font-bold text-white mt-1">Compliance Rate</p>
              <p className="text-xs text-slate-400 mt-0.5">Automated BOL & regulatory documentation speed</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 backdrop-blur">
              <p className="font-display text-4xl font-black text-cyan-400">75+</p>
              <p className="text-sm font-bold text-white mt-1">Global Markets</p>
              <p className="text-xs text-slate-400 mt-0.5">Cross-border verified buyer and recycler network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Solutions Section */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Smart Waste Management Solutions</span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-foreground">
              Intelligent Modular Infrastructure
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We help businesses transform waste into measurable value through secure circular trade, compliance intelligence, and data-driven sustainability strategies.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {SOLUTIONS.map((sol, index) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.title}
                  className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                          {sol.num}
                        </span>
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-bold text-slate-700">
                        {sol.metric}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">{sol.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{sol.desc}</p>

                    <div className="space-y-2 border-t border-border pt-4">
                      {sol.capabilities.map((cap) => (
                        <div key={cap} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Process</span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
              How the Encore Engine Works
            </h2>
            <p className="mt-4 text-base text-slate-300">
              A streamlined four-step journey from raw waste discovery to circular value realization — built for speed, trust, and enterprise scale.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-emerald-400 font-extrabold text-2xl">{s.step}</span>
                      <div className="h-10 w-10 rounded-xl bg-slate-800 grid place-items-center text-emerald-400">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h4 className="font-bold text-base text-white">{s.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits / Impact Section */}
      <section className="py-20 bg-slate-50 border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Enterprise Benefits</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Why Encorb Matters for Circular Trade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-muted-foreground">01</span>
              <p className="font-display text-3xl font-extrabold text-emerald-600 mt-2">85%</p>
              <h4 className="font-bold text-sm text-foreground mt-1">Material Value Optimization</h4>
              <p className="text-xs text-muted-foreground mt-1">Closing information asymmetry to capture maximum landed value.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-muted-foreground">02</span>
              <p className="font-display text-3xl font-extrabold text-blue-600 mt-2">75%</p>
              <h4 className="font-bold text-sm text-foreground mt-1">Global Market Access</h4>
              <p className="text-xs text-muted-foreground mt-1">Instant counterparty discovery across vetted North American processors.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-muted-foreground">03</span>
              <p className="font-display text-3xl font-extrabold text-teal-600 mt-2">90%</p>
              <h4 className="font-bold text-sm text-foreground mt-1">Regulatory Compliance</h4>
              <p className="text-xs text-muted-foreground mt-1">Digital BOL, COA, and weigh ticket tracking for audits.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-muted-foreground">04</span>
              <p className="font-display text-3xl font-extrabold text-cyan-600 mt-2">80%</p>
              <h4 className="font-bold text-sm text-foreground mt-1">Sustainable Profitability</h4>
              <p className="text-xs text-muted-foreground mt-1">Eliminating landfill fees while creating high-margin secondary revenue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Economy Insights */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Knowledge Desk</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                Circular Economy Insights
              </h2>
            </div>
            <Link to="/resources" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
              View all publications <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {INSIGHTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground leading-snug">{item.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-1 text-xs font-bold text-emerald-600">
                  Read briefing <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border-t border-slate-800">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Unlock the Value in Your Industrial Secondary Streams?
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Join hundreds of verified North American processors and generators executing transparent circular trade on Encorb.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25"
            >
              Register Facility Account
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              Schedule Engine Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
