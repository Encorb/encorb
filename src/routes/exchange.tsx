import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, SearchCheck, FileSignature, Truck, BadgeCheck, Scale } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { CTAButton } from "@/components/site/CTAButton";
import { ListingCard } from "@/components/site/ListingCard";
import { StatBand } from "@/components/site/StatBand";
import { sampleListings } from "@/lib/mock-data";

export const Route = createFileRoute("/exchange")({
  head: () => ({
    meta: [
      { title: "How the Encorb Exchange Works | Circular Materials Trading" },
      {
        name: "description",
        content:
          "Seller and buyer walkthroughs for the Encorb exchange: graded listings, verification, ranked matching and auditable settlement for recovered materials.",
      },
      { property: "og:title", content: "How the Encorb Exchange Works" },
      {
        property: "og:description",
        content:
          "From graded listing to settled lot — how recovered metals, polymers and glass move across the Encorb desk.",
      },
    ],
  }),
  component: ExchangePage,
});

const SELLER = [
  { Icon: ClipboardList, title: "Specify the lot", body: "Declare grade against ISRI or polymer/cullet specifications, plus tonnage, cadence, origin and handling classification." },
  { Icon: SearchCheck, title: "Pass verification", body: "Upload assay and documentation; the desk runs document review and, where lot value justifies it, sample draw and third-party assay." },
  { Icon: BadgeCheck, title: "Go live anonymously", body: "Your lot publishes at grade and region level. Identity is disclosed only when a negotiation opens." },
  { Icon: Scale, title: "Settle with a record", body: "Terms, weights and assay results resolve into an append-only record you can export for audit." },
];

const BUYER = [
  { Icon: SearchCheck, title: "Search by spec, not by seller", body: "Filter on chemistry, MFI, colour purity, contamination limits and cadence — the fields that actually decide usability." },
  { Icon: Scale, title: "Read the reference price", body: "Every grade carries an indicative reference level so you can benchmark an offer instead of guessing." },
  { Icon: FileSignature, title: "Open a negotiation", body: "Request documentation, sample or site attestation before you commit tonnage or capital." },
  { Icon: Truck, title: "Confirm landed cost", body: "Lane cost, port constraints and transfrontier feasibility are surfaced before you sign, not after." },
];

function Walkthrough({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: { Icon: typeof Scale; title: string; body: string }[];
}) {
  return (
    <div>
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl text-foreground md:text-3xl">{title}</h2>
      <ol className="mt-8 space-y-4">
        {steps.map(({ Icon, title: t, body }, i) => (
          <li key={t} className="panel flex gap-4 p-5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded border border-border bg-surface-raised">
              <Icon className="h-4 w-4 text-circuit" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground">
                <span className="tabular mr-2 text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ExchangePage() {
  return (
    <>
      <PageHeader
        eyebrow="Exchange · How it works"
        title="One desk, two sides, one specification language"
        lede="Encorb replaces broker phone calls and PDF spec sheets with a graded order book. Below is exactly what each side does — and what the desk does in between."
      >
        <CTAButton to="/contact" event="exchange_list_material">
          List a material
        </CTAButton>
        <CTAButton to="/materials" variant="secondary" event="exchange_view_materials">
          View material classes
        </CTAButton>
      </PageHeader>

      <Section>
        <StatBand
          className="panel"
          stats={[
            { value: "< 48h", label: "Target verification turnaround", note: "Design target" },
            { value: "41", label: "Graded specifications live", note: "Preview scope" },
            { value: "2", label: "Cadences supported", note: "Spot and recurring" },
            { value: "0", label: "Broker markups", note: "Transparent fee model" },
          ]}
        />
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Walkthrough eyebrow="Sellers" title="You hold material" steps={SELLER} />
          <Walkthrough eyebrow="Buyers" title="You need feedstock" steps={BUYER} />
        </div>
      </Section>

      <Section
        eyebrow="Sample order book"
        title="Listings, as they will appear"
        lede="These cards use placeholder data and are not transactable in this preview. The shape is final — real listings will occupy exactly this format."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleListings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Reference prices are indicative and non-binding. Nothing on this page constitutes an offer
          to buy or sell.
        </p>
      </Section>

      <Section>
        <div className="panel flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl text-foreground">Want early access to the book?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell the desk what you trade and we will onboard you when your material class opens.
            </p>
          </div>
          <CTAButton to="/contact" size="lg" event="exchange_footer_talk">
            Talk to the desk
          </CTAButton>
        </div>
      </Section>
    </>
  );
}
