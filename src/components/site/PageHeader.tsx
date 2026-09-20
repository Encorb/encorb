import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "var(--gradient-deep)" }}
        aria-hidden="true"
      />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <p className="text-eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{lede}</p>
        {children ? <div className="mt-9 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

export function Section({
  eyebrow,
  title,
  lede,
  children,
  id,
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
      {eyebrow || title ? (
        <div className="max-w-3xl">
          {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
          {title ? (
            <h2 className="mt-3 font-display text-3xl leading-tight text-foreground md:text-4xl">
              {title}
            </h2>
          ) : null}
          {lede ? <p className="mt-4 text-muted-foreground md:text-lg">{lede}</p> : null}
        </div>
      ) : null}
      <div className={eyebrow || title ? "mt-10" : ""}>{children}</div>
    </section>
  );
}
