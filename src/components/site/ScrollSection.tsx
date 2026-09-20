import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMotionProfile } from "@/hooks/use-motion-profile";
import { trackScrollBeat } from "@/lib/analytics";

type ScrollSectionProps = {
  id: string;
  beat?: string;
  index?: number;
  /** pin the section and drive progress 0→1 while scrolling through it */
  pin?: boolean;
  /** extra scroll distance for the pin, as a multiple of viewport height */
  scrub?: number;
  className?: string;
  children: ReactNode | ((progress: number) => ReactNode);
  "aria-label"?: string;
};

/**
 * Wraps GSAP ScrollTrigger pin/scrub boilerplate for each homepage beat.
 * On mobile / low-power / reduced-motion, the pin is skipped and children get a
 * simple in-view fade instead — content is always in the DOM for SEO and AT.
 */
export function ScrollSection({
  id,
  beat,
  index = 0,
  pin = false,
  scrub = 1.5,
  className,
  children,
  ...rest
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const { cinematic, hydrated } = useMotionProfile();
  const tracked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (!tracked.current && beat) {
              tracked.current = true;
              trackScrollBeat(beat, index);
            }
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [beat, index]);

  useEffect(() => {
    if (!hydrated) return;
    const el = ref.current;
    if (!el) return;
    if (!cinematic) {
      setProgress(1);
      return;
    }

    let kill = () => {};
    let cancelled = false;
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: el,
        start: pin ? "top top" : "top 80%",
        end: pin ? `+=${Math.round(scrub * 100)}%` : "bottom 40%",
        pin: pin ? el : false,
        pinSpacing: pin,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => setProgress(self.progress),
      });
      kill = () => st.kill();
    })();

    return () => {
      cancelled = true;
      kill();
    };
  }, [cinematic, hydrated, pin, scrub]);

  return (
    <section
      id={id}
      ref={ref}
      {...rest}
      data-beat={beat}
      className={cn(
        "relative w-full transition-opacity duration-700 ease-[var(--ease-desk)]",
        pin && cinematic ? "flex min-h-screen items-center overflow-hidden" : "py-20 md:py-28",
        inView || !hydrated ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {typeof children === "function" ? children(progress) : children}
    </section>
  );
}
