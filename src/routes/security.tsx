import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, FileSearch, FlaskConical, Building2, Lock, History } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { StatBand } from "@/components/site/StatBand";
import { CTAButton } from "@/components/site/CTAButton";
import { complianceItems } from "@/lib/mock-data";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & Compliance | RCRA, ISRI, Audit Trail | Encorb" },
      {
        name: "description",
        content:
          "How Encorb establishes institutional trust: RCRA-aligned handling profiles, ISRI grade definitions, a four-stage verification process and append-only audit trails.",
      },
      { property: "og:title", content: "Security & Compliance at Encorb" },
      {
        property: "og:description",
        content:
          "Verification, grading discipline and auditable records — the trust architecture behind the circular trade desk.",
      },
    ],
  }),
  component: SecurityPage,
});

const VERIFICATION = [
  { Icon: FileSearch, title: "Document review", body: "Permits, waste classification, provenance and prior assay results are checked against the declared grade before a listing publishes." },
  { Icon: FlaskConical, title: "Sample draw & assay", body: "For lots above a value threshold, a physical sample is drawn and assayed by an independent laboratory." },
  { Icon: Building2, title: "Site attestation", body: "Recurring sellers are attested at facility level: processing capability, throughput and segregation practice." },
  { Icon: History, title: "Continuous re-verification", body: "Verification decays. Grade drift on recurring contracts triggers re-checks rather than silent tolerance." },
];

function SecurityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Security & Compliance"
        title="Trust that survives an audit, not just a pitch"
        lede="Recovered material trading fails on trust before it fails on price. Encorb is designed so every claim on a listing can be traced to a document, an assay or an attestation."
      >
        <CTAButton to="/contact" event="security_talk_compliance">
          Talk to compliance
        </CTAButton>
        <CTAButton to="/faq" variant="secondary" event="security_read_faq">
          Read the FAQ
        </CTAButton>
      </PageHeader>

      <Section>
        <StatBand
          className="panel"
          stats={[
            { value: "4", label: "Verification stages", note: "Document → assay → site → re-check" },
            { value: "100%", label: "Listings classification-declared", note: "RCRA-aligned" },
            { value: "Append-only", label: "Audit record model", note: "Exportable per counterparty" },
            { value: "Roadmap", label: "SOC 2 Type II", note: "Controls design in progress" },
          ]}
        />
      </Section>

      <Section
        eyebrow="Verification process"
        title="Four stages, in the order that fails fastest"
        lede="Cheap checks run first. Expensive checks only run on lots whose value justifies them — which is why verification does not stall the book."
      >
        <ol className="grid gap-6 md:grid-cols-2">
          {VERIFICATION.map(({ Icon, title, body }, i) => (
            <li key={title} className="panel p-6">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-circuit" aria-hidden="true" />
                <span className="tabular text-sm text-muted-foreground">
                  Stage {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Standards" title="What each badge actually means">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {complianceItems.map((c) => (
            <div key={c.title} className="bg-surface/70 p-6">
              <ShieldCheck className="h-5 w-5 text-verdigris" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg text-foreground">{c.title}</h3>
              {c.status === "roadmap" ? (
                <span className="text-eyebrow mt-2 inline-block text-circuit">Roadmap — not yet certified</span>
              ) : null}
              <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Audit trail" title="Every change is a record, not an edit">
        <div className="panel overflow-hidden">
          <ul className="divide-y divide-border">
            {[
              { t: "2026-04-02 09:14 UTC", e: "Listing ENC-4471 published", who: "Seller desk" },
              { t: "2026-04-02 11:02 UTC", e: "Documentation accepted — RCRA classification confirmed", who: "Encorb compliance" },
              { t: "2026-04-04 15:40 UTC", e: "Independent assay attached (Cu 99.94%)", who: "Third-party lab" },
              { t: "2026-04-07 08:21 UTC", e: "Verification badge granted", who: "Encorb compliance" },
              { t: "2026-04-19 16:55 UTC", e: "Settlement record sealed — export available", who: "Both counterparties" },
            ].map((row) => (
              <li key={row.t} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:gap-6">
                <span className="tabular shrink-0 text-xs text-muted-foreground">{row.t}</span>
                <span className="flex-1 text-sm text-foreground">{row.e}</span>
                <span className="text-eyebrow shrink-0">{row.who}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Illustrative trail using placeholder data.
        </p>
      </Section>
    </>
  );
}
