import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { CTAButton } from "@/components/site/CTAButton";
import { cn } from "@/lib/utils";

/**
 * OPEN DECISION (Phase 1): this page is built as a tiered-plan layout, but the
 * commercial model is not settled. A transaction/fee-based model (basis points
 * on settled tonnage, possibly with a listing floor) may replace these tiers
 * entirely. Keep copy generic enough that swapping to fee tables is a content
 * change, not a rebuild.
 */

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Plans | Encorb Circular Trade Desk" },
      {
        name: "description",
        content:
          "Indicative Encorb plan tiers for sellers and buyers of recovered materials — desk access, verification depth and settlement support. Commercial model under evaluation.",
      },
      { property: "og:title", content: "Encorb Pricing" },
      {
        property: "og:description",
        content: "Indicative plan tiers for desk access, verification depth and settlement support.",
      },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Observer",
    price: "Free",
    cadence: "",
    blurb: "See the book, benchmark reference levels, no listing rights.",
    features: [
      "Read-only order book access",
      "Indicative reference pricing",
      "Grade library and spec sheets",
      "Weekly market note",
    ],
    cta: "Register interest",
    featured: false,
  },
  {
    name: "Desk",
    price: "USD 1,450",
    cadence: "/ month",
    blurb: "For active sellers and buyers running spot and recurring volume.",
    features: [
      "Unlimited graded listings",
      "Standard verification workflow",
      "Ranked matching via EnCore Engine",
      "Auditable settlement records",
      "Logistics and landed-cost view",
    ],
    cta: "Talk to the desk",
    featured: true,
  },
  {
    name: "Institutional",
    price: "Custom",
    cadence: "",
    blurb: "Multi-site groups, traders and processors with compliance obligations.",
    features: [
      "Multi-entity accounts and permissions",
      "Priority assay and site attestation",
      "Custom grade specifications",
      "Per-counterparty audit exports",
      "Named desk coverage",
    ],
    cta: "Contact sales",
    featured: false,
  },
];

function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Access to the desk, priced plainly"
        lede="Indicative plan tiers for the preview period. Encorb takes no hidden broker margin on material — what you pay for is access, verification depth and settlement support."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "panel flex flex-col p-7",
                p.featured && "border-circuit/50 shadow-[var(--shadow-glow)]",
              )}
            >
              {p.featured ? (
                <span className="text-eyebrow mb-4 inline-block text-circuit">Most common</span>
              ) : null}
              <h2 className="font-display text-2xl text-foreground">{p.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="tabular text-3xl text-foreground">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.cadence}</span>
              </p>
              <ul className="mt-7 flex-1 space-y-3 border-t border-border pt-6 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-verdigris" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CTAButton
                  to="/contact"
                  variant={p.featured ? "primary" : "secondary"}
                  event={`pricing_${p.name.toLowerCase()}`}
                  className="w-full"
                >
                  {p.cta}
                </CTAButton>
              </div>
            </div>
          ))}
        </div>

        <div className="panel mt-10 p-6">
          <h2 className="text-eyebrow">Note on the commercial model</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Plan pricing shown here is indicative for the preview period. Encorb is also evaluating a
            transaction-fee model priced on settled tonnage; if adopted, subscription tiers may be
            replaced or reduced to a floor. Nothing on this page is a binding offer.
          </p>
        </div>
      </Section>
    </>
  );
}
