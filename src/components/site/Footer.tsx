import { Link } from "@tanstack/react-router";
import { Linkedin, Twitter, Github, ShieldCheck, Award, FileText, CheckCircle2 } from "lucide-react";

const COLUMNS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Exchange Platform",
    links: [
      { to: "/marketplace", label: "Live Auctions & Marketplace" },
      { to: "/materials", label: "Material Specifications" },
      { to: "/pricing", label: "Index & Reference Pricing" },
      { to: "/register", label: "Facility Registration" },
    ],
  },
  {
    title: "Trust & Compliance",
    links: [
      { to: "/security", label: "Escrow & Security" },
      { to: "/faq", label: "FAQ & Verification" },
      { to: "/contact", label: "Talk to the Desk" },
      { to: "/security", label: "EPA & ISRI Standards" },
    ],
  },
  {
    title: "Company & Desk",
    links: [
      { to: "/about", label: "About Encorb" },
      { to: "/resources", label: "Resource Center" },
      { to: "/contact", label: "Contact Operations" },
    ],
  },
];

const BADGES = [
  { label: "RCRA-Aligned", note: "Hazardous & Solid Handling Profiles", icon: ShieldCheck },
  { label: "ISRI Standards", note: "Standardized Grade Specifications", icon: Award },
  { label: "FDIC Escrow", note: "Guaranteed Trade Settlement", icon: CheckCircle2 },
  { label: "Bill of Lading (BOL)", note: "Automated Freight Audit Trail", icon: FileText },
];

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 text-slate-200 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 h-64 w-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo-2.png"
                alt="Encorb"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
              The digital commodity exchange for North American circular materials, recovered metals, polymers, and paper. Lab-verified specifications, FDIC escrow security, and integrated Bill of Lading (BOL) logistics.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { Icon: Linkedin, label: "Encorb on LinkedIn" },
                { Icon: Twitter, label: "Encorb on X" },
                { Icon: Github, label: "Encorb on GitHub" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link
                      to={l.to}
                      className="text-sm font-medium text-slate-300 transition-all hover:text-white hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Compliance Badges Grid */}
        <div className="mt-14 grid gap-4 border-t border-slate-800/80 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b) => (
            <div key={b.label} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-slate-700">
              <b.icon className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">{b.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{b.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Copyright */}
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800/60 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Encorb Commodity Exchange LLC. All rights reserved.</p>
          <p className="max-w-md text-slate-400">
            Reference commodity prices shown across this site are indicative benchmarks based on North American regional exchange data.
          </p>
        </div>
      </div>
    </footer>
  );
}

