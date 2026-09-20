# Circular Exchange

You are building Encorb — "The Circular Trade Desk" — a B2B marketplace for recovered metals, polymers, and glass. This is Phase 1 only: a public, unauthenticated marketing site. No login, no real data, no backend logic. Its only jobs are to (1) look like a serious, well-funded institutional trading platform, (2) tell the story of circular material trading through scroll, and (3) convert visitors into sign-ups.

Treat this like designing for a fintech exchange, not a recycling charity — the tone is materials trading desk, closer to a commodities exchange or Bloomberg terminal than a sustainability NGO. Think "WasteTrade" and "Recykal" as functional references, but sharper, darker, and more 3D/cinematic than either — this needs to feel more premium and more technically impressive than both.

1. Tech stack

Next.js (App Router) + TypeScript + Tailwind CSS for structure and styling.

Framer Motion for UI-level animation (fades, reveals, hover states, layout transitions).

GSAP + ScrollTrigger for the scroll-driven storytelling sequences (pinning, scrubbing, timeline choreography).

React Three Fiber (Three.js) + drei for the 3D elements (hero object, material specimens, the "loop" motif).

Lenis (or equivalent) for smooth/inertia scrolling, wired to GSAP ScrollTrigger's scroll proxy.

Server-rendered pages, semantic HTML5, no client-only rendering for core content (SEO requirement — see §7).

Mock/placeholder data only — no real API calls, no auth, no database.

2. Design language

Palette: deep charcoal/near-black base (#0B0D0C–#111412 range), one saturated "circuit" accent color (a copper/verdigris green or amber — pick one and use it consistently for CTAs, the price ticker, and active states), off-white text (#F4F1EA range, not pure white). Avoid generic "eco green on white" — this is not a sustainability brochure.

Typography: a confident geometric/grotesk sans for headings (tight tracking, large scale), a clean humanist sans for body copy. Numerals should look "market data" — tabular figures for prices/tonnages.

Motif: the circular economy loop, rendered literally — an infinity/torus form that recurs as a 3D hero object, a scroll-progress ring, and a section divider. Materials (metals, polymers, glass) should appear as abstracted 3D specimens (ingots, pellets/regrind chunks, cullet shards) rather than stock photography.

Motion character: slow, weighty, mechanical-precision easing (think custom cubic-bezier, not bouncy). Scroll should feel like moving through stages of a process, not a bouncy landing page.

Reference www.wastetrade.com for information density and trust signals, but push the visual execution far further into 3D/cinematic territory — Encorb should look like the more advanced, more expensive platform.

3. Global structure

Sticky header: logo, nav (Exchange, Materials, Security & Compliance, Pricing, About, Resources), a live price strip (ticker-style, horizontally scrolling reference prices for recovered grades — mock data, clearly labeled "indicative"), and two CTAs: List a material (secondary) / Browse the exchange (primary).

Footer: sitemap, compliance badges (RCRA, ISRI, SOC 2 — "roadmap" labeled where not yet true), social links, legal.

A persistent but unobtrusive scroll-progress indicator (ties into the loop motif — e.g., the torus fills in as the user scrolls the homepage).

prefers-reduced-motion must be respected globally: swap scroll-scrubbed/3D sequences for simple crossfades when set.

4. Pages to build

PagePurposeMust includeHomeFull immersive scroll narrative (see §5)Hero, 3-step flow, EnCore Engine explainer, materials preview, compliance strip, final CTAExchange / How it worksShow marketplace value pre-loginSeller walkthrough, buyer walkthrough, sample listing cards (mock data, clearly non-transactable)MaterialsDetail material familiesMetals / Polymers / Glass, grades, specs, example grades (e.g. Copper #1, HDPE regrind, PET bales, Flint cullet)Security & ComplianceInstitutional trustRCRA, ISRI grading, verification process, audit-trail explainer, SOC 2 (labeled roadmap)PricingPlans / fee modelBuild as a tiered-plan layout for now (flag it as an open decision in a code comment — fee-based model may replace it)AboutStory & missionTeam, mission, circular-economy thesisResourcesSEO/education hubGuide index (mock articles), regulations explainerFAQReduce frictionAccordion, buyer/seller/compliance questionsContactLead captureForm (mock submit handler → console.log / toast, no real backend)

5. Home page — scroll storytelling sequence

Build this as a sequence of pinned/scrubbed sections, each a distinct "beat." Use GSAP ScrollTrigger to pin each section for a scroll distance, animate its 3D/2D content as the user scrolls through it, then release into the next.

Hero. Full-viewport 3D scene: a rotating torus/loop form built from abstracted material fragments (metal, polymer, glass) that slowly assemble into the loop on load. Headline establishes what Encorb is in one line ("The circular trade desk for recovered materials"), subhead, primary CTA, live price strip visible at the base of the hero.

The problem (linear economy). A short "take-make-waste" beat — materials shown as a straight line, breaking apart / falling off the end. Minimal, weighty, a few seconds of scroll.

The shift (the loop). The straight line bends into the loop from beat 2 — this is the visual thesis of the whole company. This should be the most polished single moment on the site.

3-step flow. List → Match → Settle (or your best 3-word version of the marketplace flow) as a horizontally-scrubbed sequence, one 3D material object per step.

EnCore Engine. Explain the matching/verification engine as a diagram-like sequence — inputs (listings, verification, logistics) converging to a match. Keep this abstract/systemic, not literal.

Materials preview. Three material families (Metals / Polymers / Glass) presented as distinct 3D specimen groups, each linking to the Materials page.

Compliance strip. RCRA / ISRI / audit-trail / SOC 2(roadmap) as a calm, credibility-establishing band — less motion here, this beat should feel like a deep breath after the busier sequences.

Sample listings. A row of mock listing cards (material, grade, tonnage, location, reference price, cadence, verification badge) — same shape as the real listing cards in Priority 2, so the design carries forward.

Final CTA. Restate the value prop, two CTAs (List a material / Browse the exchange / Talk to the desk), loop motif closes/completes one final time.

6. Components to build (reusable across pages)

PriceTicker — horizontally scrolling strip, mock data, clear "indicative, non-binding" microcopy.

MaterialCard3D — a small 3D specimen render used in materials previews and listing cards.

ListingCard — material, grade, tonnage/volume, location, reference price, cadence, verification badge (mock data; build this now so Priority 2 can reuse it directly).

LoopProgress — the scroll-progress ring tied to page scroll.

ScrollSection — a wrapper handling GSAP ScrollTrigger pin/scrub boilerplate so each home-page beat isn't hand-rolled.

StatBand — for compliance/trust stats.

CTAButton (primary/secondary variants), Accordion (FAQ), LeadForm (Contact).

7. Non-negotiable technical requirements

Responsive, verified at 375px, 768px, 1024px, 1440px — no horizontal scroll at any breakpoint. On mobile, replace pinned/scrubbed 3D sequences with simpler scrubbed 2D/CSS or static-with-fade equivalents — do not force full WebGL scroll-jacking on small/low-power devices.

Accessibility: WCAG 2.1 AA — 4.5:1 text contrast against the dark background, visible focus states on every interactive element, full keyboard navigation (including through the scroll sequences — don't trap keyboard users inside a pinned section), alt text on all imagery, prefers-reduced-motion fallback as noted in §3.

SEO — server-rendered content (don't hide real copy behind client-only Three.js canvases with no DOM fallback), semantic headings, meta + OG tags per page, sitemap.xml, and Core Web Vitals in mind: lazy-load 3D scenes below the fold, keep the hero scene's poly count/texture size modest, code-split heavy libraries.

Analytics hooks — fire a tracked event on every CTA click and at defined scroll-depth milestones (e.g., each home-page beat entering view). Stub this as a single trackEvent(name, props) function so real analytics can be wired in later.

Performance degradation path — detect low-end devices/reduced-motion and fall back gracefully (fewer particles/objects, static hero image instead of WebGL) rather than shipping a laggy experience.

8. Explicitly out of scope for this build

Do not implement: authentication/accounts, the real marketplace/listings database, offer/transaction flows, user dashboards, or the emissions calculator. Where the design references these (sample listings, "List a material" CTA), route to a placeholder page or a sign-up-interest form — real functionality lands in later phases per the client's build brief.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e5326962-d923-4ba8-9c3f-ed6253d072b7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
