import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Lenis inertia scrolling wired into GSAP's ticker + ScrollTrigger scroll proxy.
 * Disabled entirely for prefers-reduced-motion so keyboard/AT users keep native scroll.
 */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // Any route change should land at the top and refresh scroll measurements.
  useEffect(() => {
    window.scrollTo(0, 0);
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  }, [pathname]);

  return null;
}
