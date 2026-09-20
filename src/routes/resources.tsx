import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { CTAButton } from "@/components/site/CTAButton";
import { resourceArticles } from "@/lib/mock-data";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources | Grading, Specs & Regulation Guides | Encorb" },
      {
        name: "description",
        content:
          "Guides on ISRI grading, polymer specifications, cullet furnace-readiness and cross-border waste shipment regulation for recovered material traders.",
      },
      { property: "og:title", content: "Encorb Resources" },
      {
        property: "og:description",
        content: "Practical guides on grading, specifications and regulation for recovered material desks.",
      },
    ],
  }),
  component: ResourcesPage,
});

const REGULATIONS = [
  { name: "RCRA (US)", body: "Defines hazardous vs non-hazardous solid waste handling. Determines what may be listed and how it must be transported and documented." },
  { name: "EU Waste Shipment Regulation", body: "Governs intra-EU and export movements of recovered material, including green-listed streams and notification duties." },
  { name: "Basel Convention", body: "Controls transboundary movement of hazardous and certain plastic waste streams; prior informed consent applies." },
  { name: "ISRI specifications", body: "The industry grade dictionary for recovered metals — the reference Encorb lists metals against." },
];

function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="How this market actually works"
        lede="Grading discipline, specification literacy and regulatory sequencing decide margin in recovered materials. These guides are written for desks, not for newsletters."
      >
        <CTAButton to="/materials" variant="secondary" event="resources_view_grades">
          Browse the grade library
        </CTAButton>
      </PageHeader>

      <Section eyebrow="Guides" title="Guide index">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.map((a) => (
            <li key={a.slug}>
              <article className="panel group flex h-full flex-col p-6 transition-colors duration-500 hover:border-circuit/50">
                <div className="flex items-center justify-between">
                  <span className="text-eyebrow text-circuit">{a.kicker}</span>
                  <span className="tabular text-xs text-muted-foreground">{a.minutes} min</span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-snug text-foreground">{a.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-circuit">
                  Publishing soon
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted-foreground">
          Guide bodies land with the next release; titles above are the confirmed editorial plan.
        </p>
      </Section>

      <Section
        eyebrow="Regulations explainer"
        title="The four frameworks that shape every deal"
        lede="This is orientation, not legal advice. Encorb surfaces the constraints that apply to a listing, but the obligation stays with the counterparties."
      >
        <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {REGULATIONS.map((r) => (
            <div key={r.name} className="bg-surface/70 p-6">
              <dt className="font-display text-lg text-foreground">{r.name}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{r.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
