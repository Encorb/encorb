import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Layers, ShieldCheck, ArrowRight, Search, FileText } from "lucide-react";
import { CTAButton } from "@/components/site/CTAButton";
import {
  MATERIAL_TAXONOMY,
  MATERIAL_FAMILIES,
  REGULATED_MATERIALS,
  type TaxonomyMaterial
} from "@/lib/materials-taxonomy";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Standardized Material Taxonomy & ISRI Catalog | Encorb USA" },
      {
        name: "description",
        content:
          "Official North American non-hazardous recovered material taxonomy: ISRI specifications, SPI resin grades, packaging standards, and compliance ceilings.",
      },
      { property: "og:title", content: "Materials & Specifications on Encorb" },
      {
        property: "og:description",
        content: "Verified non-hazardous secondary materials taxonomy covering 10 industrial categories and ISRI grade codes.",
      },
    ],
  }),
  component: MaterialsPage,
});

export function MaterialsPage() {
  const [selectedFamily, setSelectedFamily] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showRegulated, setShowRegulated] = useState<boolean>(false);

  const filteredMaterials = useMemo(() => {
    let list = MATERIAL_TAXONOMY;
    if (selectedFamily !== "All") {
      list = list.filter((m) => m.family.toLowerCase() === selectedFamily.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.family.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.grade.toLowerCase().includes(q) ||
          m.specCode.toLowerCase().includes(q) ||
          m.notes.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedFamily, searchQuery]);

  // Group by family for categorized view
  const groupedByFamily = useMemo(() => {
    const groups: Record<string, TaxonomyMaterial[]> = {};
    for (const mat of filteredMaterials) {
      if (!groups[mat.family]) groups[mat.family] = [];
      groups[mat.family].push(mat);
    }
    return groups;
  }, [filteredMaterials]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-[1400px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Official North American Commodity Taxonomy
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl">
            10 Material Classes. Standardized Specifications. One Universal Vocabulary.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Every grade on Encorb is defined by ISRI circulars, ASTM standards, or SPI resin identification codes — eliminating ambiguity in industrial trade contracts.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <CTAButton to="/marketplace" event="materials_browse_marketplace">
              Browse Live Marketplace
            </CTAButton>
            <CTAButton to="/contact" variant="secondary" event="materials_request_spec">
              Request Custom Specification
            </CTAButton>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10 space-y-10">
        {/* Search & Family Filter Bar */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by grade (e.g. Copper, HDPE, OCC, ISRI 200)..."
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Count & Regulated Toggle */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing <strong className="text-foreground">{filteredMaterials.length}</strong> material grades
              </span>
              <button
                onClick={() => setShowRegulated(!showRegulated)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                  showRegulated
                    ? "bg-rose-500 text-white border-rose-600 shadow-sm"
                    : "bg-muted/50 text-foreground border-border hover:bg-muted"
                }`}
              >
                {showRegulated ? "Hide Excluded / Regulated" : "View Excluded / Regulated"}
              </button>
            </div>
          </div>

          {/* Family Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-border pt-4 text-xs font-medium scrollbar-thin">
            <button
              onClick={() => setSelectedFamily("All")}
              className={`rounded-lg px-3.5 py-1.5 whitespace-nowrap transition-colors font-bold ${
                selectedFamily === "All"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              All Categories ({MATERIAL_TAXONOMY.length})
            </button>
            {MATERIAL_FAMILIES.map((fam) => {
              const count = MATERIAL_TAXONOMY.filter((m) => m.family.toLowerCase() === fam.toLowerCase()).length;
              return (
                <button
                  key={fam}
                  onClick={() => setSelectedFamily(fam)}
                  className={`rounded-lg px-3.5 py-1.5 whitespace-nowrap transition-colors font-bold ${
                    selectedFamily === fam
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {fam} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Regulated Materials Notice Section */}
        {showRegulated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 shadow-md"
          >
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm uppercase tracking-wider mb-2">
              <ShieldCheck className="h-5 w-5" /> Excluded & Regulated Materials Notice
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Encorb USA strictly prohibits trading hazardous, toxic, or EPA Resource Conservation and Recovery Act (RCRA) regulated substances. Counterparties submitting excluded streams will be flagged and suspended.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-rose-500/20 rounded-xl overflow-hidden">
                <thead className="bg-rose-500/10 text-rose-900 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Material Stream</th>
                    <th className="px-4 py-3">Regulatory Restriction Reason</th>
                    <th className="px-4 py-3">Where It Typically Hides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-500/10">
                  {REGULATED_MATERIALS.map((reg) => (
                    <tr key={reg.id} className="hover:bg-rose-500/5 transition-colors">
                      <td className="px-4 py-3 font-bold text-foreground">{reg.material}</td>
                      <td className="px-4 py-3 text-muted-foreground">{reg.reason}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{reg.whereItHides}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Grouped Taxonomy Tables */}
        <div className="space-y-12">
          {Object.entries(groupedByFamily).map(([family, items]) => (
            <section key={family} className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-extrabold text-foreground">
                      {family}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {items.length} standardized specification {items.length === 1 ? "grade" : "grades"}
                    </p>
                  </div>
                </div>
                <CTAButton to="/contact" variant="secondary" size="sm" event={`materials_inquire_${family}`}>
                  Inquire Class
                </CTAButton>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold bg-muted/40">
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Grade Description</th>
                      <th className="px-4 py-3.5">Standard / Spec Code</th>
                      <th className="px-4 py-3.5">Standard Packaging</th>
                      <th className="px-4 py-3.5">Industry Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {items.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-xs text-emerald-600 whitespace-nowrap">
                          {m.category}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-foreground">
                          {m.grade}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-slate-700 whitespace-nowrap">
                          <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs font-semibold">
                            {m.specCode}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {m.packaging}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-xs leading-relaxed">
                          {m.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground">No Materials Match Your Query</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                We trade custom industrial specifications. Contact our materials desk to list or verify an uncataloged stream.
              </p>
              <div className="mt-5">
                <CTAButton to="/contact" event="materials_empty_inquire">
                  Contact Technical Desk
                </CTAButton>
              </div>
            </div>
          )}
        </div>

        {/* Footer Support CTA */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 to-slate-950 text-white p-8 md:p-12 shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <ShieldCheck className="h-4 w-4" /> Technical & Lab Verification
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Need custom lot testing or assay specification?
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Encorb provides third-party Certificates of Analysis (COA), melt-flow index testing, and moisture verification before settlement.
            </p>
          </div>
          <CTAButton to="/contact" size="lg" event="materials_footer_desk">
            Contact Technical Desk <ArrowRight className="h-4 w-4 ml-1" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
