/**
 * Analytics stub. Wire a real provider (Segment / PostHog / GA4) here later —
 * every CTA click and scroll-depth milestone already routes through this.
 */
export type TrackProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const payload = { name, ts: Date.now(), path: window.location.pathname, ...props };
  // eslint-disable-next-line no-console
  console.info("[encorb:track]", payload);
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer?.push({ event: name, ...props });
}

export function trackScrollBeat(beat: string, index: number) {
  trackEvent("home_beat_view", { beat, index });
}
