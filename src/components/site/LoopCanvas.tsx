import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionProfile } from "@/hooks/use-motion-profile";

const LoopScene = lazy(() => import("@/components/three/LoopScene"));

/**
 * Client-only, in-view-gated wrapper for the WebGL loop motif.
 * Low-power / reduced-motion / mobile devices get a static CSS loop plate
 * instead of a laggy canvas. Copy always lives in the DOM beside it.
 */
export function LoopCanvas({
  morph = 1,
  assemble = 1,
  className,
  label,
  eager = false,
}: {
  morph?: number;
  assemble?: number;
  className?: string;
  label: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);
  const { reducedMotion, lowPower, isMobile, hydrated } = useMotionProfile();
  const allow3D = hydrated && !reducedMotion && !lowPower;
  const count = isMobile ? 42 : 96;

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setVisible(true), {
      rootMargin: "300px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cn("relative isolate overflow-hidden", className)}
    >
      {/* Static fallback / underlay: the loop as pure CSS */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center transition-opacity duration-700"
        style={{ opacity: allow3D && visible ? 0.35 : 1 }}
      >
        <div
          className="aspect-square w-[58%] max-w-[520px] rounded-full"
          style={{
            border: "1px solid color-mix(in oklab, var(--circuit) 35%, transparent)",
            boxShadow:
              "0 0 120px -20px color-mix(in oklab, var(--circuit) 40%, transparent), inset 0 0 80px -30px color-mix(in oklab, var(--verdigris) 45%, transparent)",
          }}
        />
      </div>

      {allow3D && visible ? (
        <Suspense fallback={null}>
          <LoopScene morph={morph} assemble={assemble} count={count} />
        </Suspense>
      ) : null}
    </div>
  );
}
