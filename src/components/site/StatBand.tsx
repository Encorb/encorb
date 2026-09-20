import { cn } from "@/lib/utils";

export type Stat = { value: string; label: string; note?: string };

export function StatBand({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 divide-border border-border md:grid-cols-4 md:divide-x",
        className,
      )}
    >
      {stats.map((s) => (
        <div key={s.label} className="px-4 py-6 md:px-6">
          <dd className="tabular text-2xl text-circuit md:text-3xl">{s.value}</dd>
          <dt className="mt-2 text-sm text-foreground/90">{s.label}</dt>
          {s.note ? <p className="mt-1 text-xs text-muted-foreground">{s.note}</p> : null}
        </div>
      ))}
    </dl>
  );
}
