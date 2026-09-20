import { tickerItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Horizontally scrolling reference-price strip. Mock data — clearly labelled
 * indicative and non-binding. Pauses on hover/focus and for reduced motion.
 */
export function PriceTicker({ className }: { className?: string }) {
  const row = [...tickerItems, ...tickerItems];

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden border-y border-border bg-surface/70 backdrop-blur",
        className,
      )}
      aria-label="Indicative reference prices for recovered grades"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <div className="flex items-center">
        <span className="text-eyebrow z-20 shrink-0 border-r border-border bg-background/90 px-3 py-2 text-circuit">
          Indicative
        </span>
        <div className="relative flex-1 overflow-hidden">
          <ul
            className="animate-ticker flex w-max items-center gap-8 py-2 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            aria-hidden="false"
          >
            {row.map((item, i) => (
              <li key={`${item.code}-${i}`} className="flex items-baseline gap-2 text-xs">
                <span className="tabular text-muted-foreground">{item.code}</span>
                <span className="hidden text-foreground/70 sm:inline">{item.label}</span>
                <span className="tabular text-foreground">
                  {item.price.toLocaleString("en-US")}
                </span>
                <span className="tabular text-muted-foreground">{item.unit}</span>
                <span
                  className={cn(
                    "tabular",
                    item.change >= 0 ? "text-up" : "text-down",
                  )}
                >
                  {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="sr-only">
        All prices are indicative, non-binding reference levels using placeholder data.
      </p>
    </div>
  );
}
