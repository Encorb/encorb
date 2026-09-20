import { useEffect, useState } from "react";

export type MotionProfile = {
  /** true once mounted on the client */
  hydrated: boolean;
  reducedMotion: boolean;
  /** viewport < 768px */
  isMobile: boolean;
  /** low core count / low memory / mobile → skip heavy WebGL */
  lowPower: boolean;
  /** safe to run pinned, scrubbed GSAP + WebGL sequences */
  cinematic: boolean;
};

const initial: MotionProfile = {
  hydrated: false,
  reducedMotion: false,
  isMobile: false,
  lowPower: false,
  cinematic: false,
};

export function useMotionProfile(): MotionProfile {
  const [profile, setProfile] = useState<MotionProfile>(initial);

  useEffect(() => {
    const compute = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;
      const nav = navigator as Navigator & { deviceMemory?: number };
      const cores = nav.hardwareConcurrency ?? 4;
      const memory = nav.deviceMemory ?? 4;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const lowPower = cores <= 4 || memory <= 3 || (coarse && isMobile);
      setProfile({
        hydrated: true,
        reducedMotion,
        isMobile,
        lowPower,
        cinematic: !reducedMotion && !isMobile && !lowPower,
      });
    };
    compute();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", compute);
    window.addEventListener("resize", compute);
    return () => {
      mq.removeEventListener("change", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return profile;
}
