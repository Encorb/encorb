import { Link } from "@tanstack/react-router";
import { ShieldCheck, ShieldAlert, MapPin, Repeat } from "lucide-react";
import type { Listing } from "@/lib/mock-data";
import { MaterialCard3D } from "./MaterialCard3D";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

/**
 * Canonical listing card shape — reused verbatim by the real exchange in a
 * later phase. Phase 1: mock data, non-transactable.
 */
export function ListingCard({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <article
      className={cn(
        "panel group flex flex-col overflow-hidden transition-all duration-500 ease-[var(--ease-desk)] hover:border-circuit/50 hover:shadow-[var(--shadow-desk)]",
        className,
      )}
    >
      <MaterialCard3D
        family={listing.family}
        label={listing.grade}
        density={10}
        className="h-32 rounded-none border-0 border-b border-border"
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-eyebrow">{listing.id}</p>
            <h3 className="mt-1 text-lg leading-tight text-foreground">{listing.material}</h3>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]",
              listing.verified
                ? "border-verdigris/40 bg-verdigris/10 text-verdigris"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {listing.verified ? (
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {listing.verified ? "Verified" : "Pending"}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">{listing.grade}</p>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
          <div>
            <dt className="text-eyebrow">Volume</dt>
            <dd className="tabular mt-1 text-foreground">{listing.tonnage}</dd>
          </div>
          <div>
            <dt className="text-eyebrow">Ref. price</dt>
            <dd className="tabular mt-1 text-circuit">{listing.referencePrice}</dd>
          </div>
          <div>
            <dt className="text-eyebrow">Location</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-foreground/90">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {listing.location}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow">Cadence</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-foreground/90">
              <Repeat className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {listing.cadence}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-[11px] text-muted-foreground">Illustrative — not transactable</span>
          <Link
            to="/contact"
            onClick={() => trackEvent("cta_click", { cta: "listing_interest", listing: listing.id })}
            className="text-sm font-medium text-circuit underline-offset-4 hover:underline"
          >
            Register interest
          </Link>
        </div>
      </div>
    </article>
  );
}
