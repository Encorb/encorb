import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/site/CTAButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/mock-data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Buying, Selling & Compliance | Encorb" },
      {
        name: "description",
        content:
          "Answers for buyers, sellers and compliance teams: how grades are verified, whether prices are binding, what it costs and how audit trails work on Encorb.",
      },
      { property: "og:title", content: "Encorb FAQ" },
      {
        property: "og:description",
        content: "Buyer, seller and compliance questions about the circular trade desk.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Branded Header Hero */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-[1400px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 mb-4">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl">
            Questions the Encorb desk gets asked most.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Organized by buyer, seller, and compliance workflows. If your specific technical or logistics question isn't answered here, our trade desk provides direct assistance.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.5fr] lg:gap-16 items-start">
          {/* Side Info Box */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sticky top-28">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Still need clarification?</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Compliance, logistics, and commercial inquiries go straight to a dedicated account desk specialist—never an automated ticket queue.
            </p>
            <div className="mt-6">
              <CTAButton to="/contact" event="faq_talk_to_desk">
                Talk to the Desk <ArrowRight className="h-4 w-4 ml-1" />
              </CTAButton>
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-12">
            {faqs.map((group) => (
              <div key={group.group} className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                  {group.group}
                </span>
                <Accordion type="single" collapsible className="mt-4 space-y-3">
                  {group.items.map((item, i) => (
                    <AccordionItem
                      key={item.q}
                      value={`${group.group}-${i}`}
                      className="rounded-2xl border border-border/80 bg-background px-5 py-1 shadow-2xs"
                    >
                      <AccordionTrigger className="text-left font-display text-base font-bold text-foreground hover:text-emerald-600 md:text-lg py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground md:text-base leading-relaxed pb-4 pt-1">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

