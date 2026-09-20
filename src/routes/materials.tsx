import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Layers, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { MaterialCard3D } from "@/components/site/MaterialCard3D";
import { CTAButton } from "@/components/site/CTAButton";
import { materialFamilies } from "@/lib/mock-data";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Materials & Specifications | Metals, Polymers, Glass | Encorb" },
      {
        name: "description",
        content:
          "Recovered material classes traded on Encorb: ISRI-graded metals, specified polymer regrinds and flake, and colour-sorted furnace-ready cullet.",
      },
      { property: "og:title", content: "Materials & Grades on Encorb" },
      {
        property: "og:description",
        content:
          "Copper #1, HDPE natural regrind, PET clear bales, flint cullet — every grade defined by spec, not adjectives.",
      },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-[1400px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> ISRI Standardized Commodity Catalog
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl">
            Three classes. Forty-one grades. One universal vocabulary.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            A grade is a contract, not a description. Encorb standardises how recovered metals, polymers, and glass are specified so both sides price the exact same material.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton to="/marketplace" event="materials_launch_comparator">
              Launch Material Spec Comparator
            </CTAButton>
            <CTAButton to="/contact" variant="secondary" event="materials_list_material">
              List a Material Stream
            </CTAButton>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 space-y-16">
        {materialFamilies.map((family, i) => (
          <motion.div
            key={family.key}
            id={family.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  <Layers className="h-3.5 w-3.5" /> Class {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
                  {family.name}
                </h2>
                <p className="mt-4 text-muted-foreground md:text-lg leading-relaxed">{family.blurb}</p>
                <div className="mt-6 rounded-2xl overflow-hidden border border-border bg-slate-900/5 p-2">
                  <MaterialCard3D
                    family={family.key}
                    label={`${family.name} specimen group`}
                    density={18}
                    className="h-64"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    {family.name} grades traded on Encorb with their specifications
                  </caption>
                  <thead>
                    <tr className="border-b border-border bg-muted/60">
                      <th scope="col" className="px-5 py-3.5 font-bold uppercase text-xs tracking-wider text-slate-500">
                        Grade
                      </th>
                      <th scope="col" className="px-5 py-3.5 font-bold uppercase text-xs tracking-wider text-slate-500">
                        Specification Standard
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {family.grades.map((g) => (
                      <tr key={g.name} className="border-b border-border/70 last:border-0 hover:bg-muted/30 transition-colors">
                        <th scope="row" className="px-5 py-4 align-top font-bold text-foreground">
                          {g.name}
                        </th>
                        <td className="px-5 py-4 align-top text-muted-foreground font-mono text-xs">{g.spec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 to-slate-950 text-white p-8 md:p-12 shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <ShieldCheck className="h-4 w-4" /> Custom Specifications
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Trading a material grade that isn't listed?
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Our technical desk adds custom ISRI & ASTM grade specifications on demand. Send us your spec sheet for verification.
            </p>
          </div>
          <CTAButton to="/contact" size="lg" event="materials_footer_talk">
            Talk to the Technical Desk <ArrowRight className="h-4 w-4 ml-1" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

