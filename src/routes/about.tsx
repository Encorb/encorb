import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Target, Users, TrendingUp, Sparkles, Building2 } from "lucide-react";
import { StatBand } from "@/components/site/StatBand";
import { CTAButton } from "@/components/site/CTAButton";
import { team } from "@/lib/mock-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Encorb | The Circular Economy Thesis" },
      {
        name: "description",
        content:
          "Why Encorb exists: recovered material is a commodity, not waste. Our mission, the circular-economy thesis and the desk behind the exchange.",
      },
      { property: "og:title", content: "About Encorb" },
      {
        property: "og:description",
        content: "Recovered material is a commodity, not waste. The thesis behind the circular trade desk.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Branded Header Hero */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-[1400px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Market Infrastructure Mission
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl">
            Recovered material is a high-value commodity, not waste.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Encorb was founded by commodity traders and software engineers who watched perfectly usable industrial secondary materials get discounted purely because nobody could prove what they were. That is a market-infrastructure problem, not an environmental one.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16 space-y-20">
        {/* Thesis Section */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Core Thesis</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground md:text-4xl">
              Circularity fails on specification, not sentiment
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Target,
                h: "The discount is informational",
                b: "Recovered material trades below virgin equivalents partly for real quality reasons and largely because buyers cannot verify quality cheaply. Close the information gap and the discount narrows.",
              },
              {
                icon: ShieldCheck,
                h: "Grades are binding contracts",
                b: "Every mature commodity market runs on shared specification language. Recovered materials mostly do not. Encorb standardises the vocabulary before it standardises the price.",
              },
              {
                icon: TrendingUp,
                h: "Trust must be exportable",
                b: "Procurement, finance, and regulators all need the exact same record. An audit trail that only exists inside a broker's inbox is not scalable infrastructure.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.h}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{c.h}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.b}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Band */}
        <section className="rounded-3xl border border-border bg-muted/30 p-8 shadow-sm">
          <StatBand
            stats={[
              { value: "2024", label: "Founded", note: "Houston, TX & Chicago, IL" },
              { value: "9+", label: "Material Categories Traded" },
              { value: "50", label: "US States Logistics Network" },
              { value: "$48M+", label: "Traded Circular Volume Target", note: "North American Facilities" },
            ]}
          />
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center justify-center gap-1.5">
              <Users className="h-4 w-4" /> The Trade Desk
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground md:text-4xl">
              Traders, Engineers & Logistics Specialists
            </h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <li key={m.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-display text-xl font-extrabold shadow-md">
                  {m.name.charAt(0)}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{m.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mt-1">{m.role}</p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Banner */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 text-white p-8 md:p-12 shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">Building in circular materials?</h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              We work closely with re-processors, industrial scrap generators, brand-side procurement teams, and compliance auditors.
            </p>
          </div>
          <CTAButton to="/contact" size="lg" event="about_footer_talk">
            Talk to the Trade Desk
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

