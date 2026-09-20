import { useEffect, useState } from "react";

/**
 * Scroll-progress ring — the loop motif rendered as a filling torus outline.
 * Decorative: hidden from AT and static under reduced motion.
 */
export function LoopProgress() {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reduced) return null;
  const C = 2 * Math.PI * 20;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 right-6 z-40 hidden md:block"
    >
      <div className="relative grid h-14 w-14 place-items-center rounded-full border border-border bg-background/80 backdrop-blur">
        <svg viewBox="0 0 48 48" className="h-11 w-11 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="2"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="var(--color-circuit)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 120ms linear" }}
          />
        </svg>
        <span className="tabular absolute text-[10px] text-muted-foreground">
          {Math.round(progress * 100)}
        </span>
      </div>
    </div>
  );
}
