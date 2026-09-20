import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the Encorb Desk | Register Trading Interest" },
      {
        name: "description",
        content:
          "Register the recovered material you hold or the feedstock you need. The Encorb desk onboards counterparties in phases as material classes open.",
      },
      { property: "og:title", content: "Contact the Encorb Desk" },
      {
        property: "og:description",
        content: "Register trading interest for recovered metals, polymers and glass.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the desk"
        lede="Tell us what you trade and at what cadence. Encorb onboards counterparties in phases — registering now decides your place in the queue for your material class."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <LeadForm />

          <aside className="space-y-6">
            <div className="panel p-6">
              <h2 className="font-display text-lg text-foreground">Direct lines</h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-circuit" aria-hidden="true" />
                  <span className="text-muted-foreground">desk@encorb.com</span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-circuit" aria-hidden="true" />
                  <span className="text-muted-foreground">Houston, TX · Chicago, IL · Atlanta, GA</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-circuit" aria-hidden="true" />
                  <span className="text-muted-foreground">
                    Trading Desk: 07:00–18:00 CST (Mon–Fri)
                  </span>
                </li>
              </ul>
            </div>

            <div className="panel p-6">
              <h2 className="text-eyebrow">Enterprise Onboarding</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                All counterparties undergo standard ISRI/KYC verification. Once registered, your trading account gains immediate access to live auctions, spot RFQs, and automated Bill of Lading generation.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
