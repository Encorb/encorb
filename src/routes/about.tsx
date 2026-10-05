import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Rocket,
  ShieldCheck,
  Globe2,
  Cpu,
  ChevronDown,
  ArrowRight,
  Mail,
  Phone,
  Layers,
  BarChart3,
  FileCheck2,
  Droplets,
  Award,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Transforming Waste into Sustainable Global Value | Encorb" },
      {
        name: "description",
        content:
          "Encorb is a next-generation circular trade platform connecting verified waste generators and re-processors. We help businesses unlock material value, ensure compliance, and transition toward a smarter, more profitable circular economy.",
      },
    ],
  }),
  component: AboutPage,
});

const CORE_VALUES = [
  {
    icon: Rocket,
    title: "Sustainable Innovation",
    desc: "We innovate with purpose — developing smarter systems that transform waste into measurable economic and environmental value. By combining technology, regulatory intelligence, and strategic insight, we redefine how industries approach circular trade and resource recovery.",
    badge: "Purpose-Driven Tech",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Transparency",
    desc: "Trust is the foundation of circular trade. We ensure every transaction is structured, compliant, and transparent — connecting verified partners through responsible processes that reduce risk and strengthen global collaboration.",
    badge: "FDIC Escrow & KYC",
  },
  {
    icon: Globe2,
    title: "Global Collaboration",
    desc: "We bring together waste generators, recyclers, and sustainability leaders across borders to create shared value. Through partnership and open exchange, we enable industries to transition toward a smarter, more connected circular economy.",
    badge: "50+ Jurisdictions",
  },
  {
    icon: Cpu,
    title: "Operational Excellence",
    desc: "We uphold the highest standards in compliance, documentation, and marketplace performance. Every workflow is designed for reliability, security, and long-term scalability — ensuring sustainable profitability for all stakeholders.",
    badge: "Automated BOL",
  },
];

const FAQS = [
  {
    q: "How does Encorb ensure secure waste transactions?",
    a: "We verify counterparties, structure automated digital Bill of Lading (BOL) documentation workflows, and align every transaction with regulatory standards. Funds sit in FDIC-insured escrow until weigh tickets and Certificate of Analysis (COA) are confirmed.",
  },
  {
    q: "Who can join the Encorb marketplace?",
    a: "Waste generators, industrial recyclers, re-processors, scrap yards, compounders, mills, and sustainability-focused enterprises can join after completing our commercial verification and EIN compliance checks.",
  },
  {
    q: "Does Encorb support cross-border and nationwide trade?",
    a: "Yes. Our platform is designed to facilitate compliant domestic and international secondary materials trade with structured documentation, ISRI specification standards, and regulatory alignment.",
  },
  {
    q: "How does Encorb help maximize material value?",
    a: "Through recyclability assessments, transparent order-book pricing, landed cost calculators, and verified direct connections, we remove intermediary markups and help facilities recover greater economic value from their waste streams.",
  },
];

function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28 px-4 md:px-8 border-b border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-[1240px] relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 mb-6">
            <Sparkles className="h-4 w-4 text-emerald-400" /> Empowering Industries | Our Mission
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08]">
            Transforming Waste into{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Sustainable Global Value
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
            Encorb is a next-generation circular trade platform connecting verified waste generators and re-processors
            across borders. We help businesses unlock material value, ensure compliance, and transition toward a smarter,
            more profitable circular economy.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25"
            >
              Visit Live Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              See How Encorb Works
            </Link>
          </div>

          {/* Quote Strip */}
          <div className="mt-14 rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 backdrop-blur max-w-3xl">
            <p className="text-base sm:text-lg italic text-slate-200 font-serif leading-relaxed">
              "Waste is not the end of a product's journey — it's the beginning of its next value cycle."
            </p>
            <p className="mt-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              — Circular Trade & Sustainability Experts • 50+ Global Partners Network
            </p>
          </div>
        </div>
      </section>

      {/* 2. Platform Value at a Glance & Live Impact */}
      <section className="py-16 bg-slate-50/80 border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Platform Value at a Glance</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Measurable Outcomes from Real Facilities
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Let users instantly see active deals, recovered materials, climate impact, and downloadable proof of impact.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center mb-3 mx-auto sm:mx-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">128</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Active Deals</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Live in verification</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 grid place-items-center mb-3 mx-auto sm:mx-0">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">1,842</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Closed Deals</p>
              <p className="text-[11px] text-blue-600 font-medium mt-1">Settled & dispatched</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 grid place-items-center mb-3 mx-auto sm:mx-0">
                <Droplets className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">1.8B L</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Water Saved</p>
              <p className="text-[11px] text-cyan-600 font-medium mt-1">Across reuse & recycling</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center mb-3 mx-auto sm:mx-0">
                <Award className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">426</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Impact Certificates</p>
              <p className="text-[11px] text-amber-600 font-medium mt-1">Verified Scope 3 reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Driving Sustainable Impact */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Our Foundation</span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-foreground">
              Core Values Driving Sustainable Impact
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We anchor every transaction in transparency, environmental rigor, and commercial viability.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {CORE_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-bold text-slate-700">
                        {val.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">{val.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Why Encorb Matters (Connect, Enable, Measure, Prove) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Why Encorb Matters</span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
              Circular Trade Made Simple
            </h2>
            <p className="mt-4 text-base text-slate-300">
              Find value in waste streams, move materials with trust and compliance, and track climate impact in one unified platform.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <span className="font-mono text-emerald-400 font-extrabold text-2xl">01</span>
              <h4 className="font-bold text-lg text-white mt-3">Connect</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Connect waste generators with verified, compliance-vetted reprocessors and industrial recyclers across the nation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <span className="font-mono text-emerald-400 font-extrabold text-2xl">02</span>
              <h4 className="font-bold text-lg text-white mt-3">Enable</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Smarter trade with automated Bill of Lading (BOL), certified weigh slips, and FDIC-insured escrow protection built in.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <span className="font-mono text-emerald-400 font-extrabold text-2xl">03</span>
              <h4 className="font-bold text-lg text-white mt-3">Measure</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Quantify Scope 3 emissions avoided, tons diverted from landfill, and water preserved for verifiable ESG reporting.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <span className="font-mono text-emerald-400 font-extrabold text-2xl">04</span>
              <h4 className="font-bold text-lg text-white mt-3">Prove</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Export verified impact certificates, chain-of-custody documentation, and ledger-backed sustainability audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-[860px] px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Got Questions?</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border bg-card transition-all overflow-hidden"
                >
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

      {/* 6. Contact / Inquiry Form */}
      <section className="py-20 bg-slate-50 border-t border-border">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Get In Touch</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                Let's Build a Smarter Circular Future
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Whether you generate industrial secondary scrap or require verified feedstock for production, our trade desk and engineering team are ready to assist.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Email Address</p>
                    <a href="mailto:info@encorb.com" className="text-sm font-bold text-foreground hover:text-emerald-600">
                      info@encorb.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Desk Phone</p>
                    <p className="text-sm font-bold text-foreground">+1 (713) 555-0192</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Platform Scope</p>
                    <p className="text-sm font-bold text-foreground">United States & Cross-Border North American Network</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              {contactSubmitted ? (
                <div className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-display text-xl font-bold text-foreground">Inquiry Received</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    Thank you! Our circular commodities desk will review your material requirements and connect with you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <h3 className="font-display text-xl font-bold text-foreground">Send Us an Inquiry</h3>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Vance"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@company.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Tell us about your waste stream or project
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Material type, monthly tonnage, processing requirements, or facility location..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-700/20 cursor-pointer"
                  >
                    Submit Material Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
