import { useState } from "react";
import { toast } from "sonner";
import { CTAButton } from "./CTAButton";
import { trackEvent } from "@/lib/analytics";

type Role = "seller" | "buyer" | "other";

/** Mock submit only — Phase 1 has no backend. Logs and toasts. */
export function LeadForm() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setSubmitting(true);
    // eslint-disable-next-line no-console
    console.log("[encorb:lead-form:mock-submit]", data);
    trackEvent("lead_form_submit", { role: String(data["role"] ?? "unknown") });
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Request received", {
        description: "The desk will be in touch. (Preview build — nothing was sent.)",
      });
      e.currentTarget?.reset?.();
    }, 450);
  };

  const field = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-circuit";
  const label = "text-eyebrow block";

  return (
    <form onSubmit={onSubmit} className="panel p-6 md:p-8" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="lf-name">
            Full name
          </label>
          <input id="lf-name" name="name" required autoComplete="name" className={field} placeholder="Anneke Vos" />
        </div>
        <div>
          <label className={label} htmlFor="lf-company">
            Company
          </label>
          <input id="lf-company" name="company" required autoComplete="organization" className={field} placeholder="Vos Metals BV" />
        </div>
        <div>
          <label className={label} htmlFor="lf-email">
            Work email
          </label>
          <input id="lf-email" name="email" type="email" required autoComplete="email" className={field} placeholder="desk@company.com" />
        </div>
        <div>
          <label className={label} htmlFor="lf-role">
            I am a
          </label>
          <select id="lf-role" name="role" className={field} defaultValue={"seller" satisfies Role}>
            <option value="seller">Seller — I have material</option>
            <option value="buyer">Buyer — I need feedstock</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="lf-material">
          Material & volume
        </label>
        <input id="lf-material" name="material" className={field} placeholder="HDPE natural regrind, ~120 t / quarter" />
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="lf-message">
          Anything else
        </label>
        <textarea id="lf-message" name="message" rows={4} className={field} placeholder="Specs, cadence, destination ports…" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <CTAButton type="submit" event="lead_form_submit_click" variant="primary">
          {submitting ? "Sending…" : "Talk to the desk"}
        </CTAButton>
        <p className="text-xs text-muted-foreground">
          Preview build — submissions are not stored or sent anywhere.
        </p>
      </div>
    </form>
  );
}
