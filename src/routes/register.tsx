import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, CheckCircle, Building2, ShieldCheck, ArrowRight, ArrowLeft, Lock, Mail, User, Phone, MapPin, Hash } from "lucide-react";
import { useAuth, type UserRole } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Commercial Registration & Facility Onboarding — Encorb USA" }] }),
  component: RegisterPage,
});

const FACILITY_TYPES_BUYER = [
  "Plastics Compounding & Extrusion",
  "Secondary Smelter & Metals Refining",
  "Paper & Packaging Mill",
  "Glass Beneficiation & Manufacturing",
  "Automotive & Industrial OEM",
  "Circular Commodity Trader / Converter",
  "Other Processing Facility",
];

const FACILITY_TYPES_SELLER = [
  "Material Recovery Facility (MRF)",
  "Industrial Scrap Metal Recycling Yard",
  "Commercial Manufacturing Scrap Generator",
  "Post-Industrial Waste Handler",
  "Demolition & Construction Recovery",
  "Circular Aggregator / Broker",
  "Other Supply Facility",
];

function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer" as UserRole,
    businessName: "",
    facilityType: "",
    ein: "",
    location: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    const to = user.role === "buyer" ? "/dashboard/buyer" : user.role === "seller" ? "/dashboard/seller" : "/dashboard/admin";
    navigate({ to });
    return null;
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Please provide your full legal name.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Please provide a valid business email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.businessName.trim()) {
      setError("Legal business or facility name is required for commercial onboarding.");
      return;
    }
    if (!form.location.trim()) {
      setError("Please specify your facility primary location (City, State / ZIP).");
      return;
    }

    setLoading(true);
    const result = await register(
      form.name,
      form.email,
      form.password,
      form.role,
      form.businessName,
      {
        location: form.location,
        ein: form.ein || undefined,
        facilityType: form.facilityType || (form.role === "buyer" ? FACILITY_TYPES_BUYER[0] : FACILITY_TYPES_SELLER[0]),
        phone: form.phone || undefined,
      }
    );
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage(result.message ?? "Commercial account verified. Directing to your operational dashboard...");
    setTimeout(() => {
      navigate({
        to: form.role === "buyer" ? "/dashboard/buyer" : "/dashboard/seller",
      });
    }, 1200);
  };

  const facilityOptions = form.role === "buyer" ? FACILITY_TYPES_BUYER : FACILITY_TYPES_SELLER;

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50/70 px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center flex flex-col items-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img src="/logo.png" alt="Encorb" className="h-12 md:h-16 w-auto object-contain mb-2" />
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            Commercial Account Registration
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            North American B2B Industrial Secondary Materials Exchange
          </p>

          {/* Stepper Progress */}
          <div className="mt-6 flex items-center justify-center gap-3 w-full max-w-sm">
            <div className={`flex items-center gap-2 text-xs font-bold ${step === 1 ? "text-emerald-700" : "text-muted-foreground"}`}>
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${step === 1 ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                1
              </span>
              Account & Role
            </div>
            <div className="h-0.5 w-12 bg-slate-200" />
            <div className={`flex items-center gap-2 text-xs font-bold ${step === 2 ? "text-emerald-700" : "text-muted-foreground"}`}>
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${step === 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                2
              </span>
              Facility & Verification
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs sm:text-sm text-rose-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {message && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs sm:text-sm text-emerald-800 font-medium">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" /> {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-5">
              {/* Role selector */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Your Facility Trading Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: "buyer" }))}
                    className={`rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${
                      form.role === "buyer"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20"
                        : "border-slate-200 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                      🛒 Commercial Buyer
                      {form.role === "buyer" && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Re-processors, compounders, mills, and manufacturers procuring feedstock.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: "seller" }))}
                    className={`rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${
                      form.role === "seller"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20"
                        : "border-slate-200 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                      🏭 Material Supplier
                      {form.role === "seller" && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Generators, MRFs, scrap yards, and processors listing secondary commodities.
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Authorized Contact Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. John Miller"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Commercial Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue to Facility Details <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-3 mb-2 flex items-center gap-2 text-xs text-emerald-800">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Encorb verifies all facilities and commercial tax identifiers for FDIC escrow & compliance.</span>
              </div>

              <div>
                <label htmlFor="reg-biz" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Legal Business / Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="reg-biz"
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                    placeholder="e.g. Apex Recycled Polymers LLC"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-type" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Facility Classification
                  </label>
                  <select
                    id="reg-type"
                    value={form.facilityType}
                    onChange={(e) => setForm((f) => ({ ...f, facilityType: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    <option value="">Select Facility Type...</option>
                    {facilityOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-ein" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Federal EIN / Tax ID Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="reg-ein"
                      type="text"
                      value={form.ein}
                      onChange={(e) => setForm((f) => ({ ...f, ein: e.target.value }))}
                      placeholder="e.g. 12-3456789"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-loc" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Facility Location (City, State) *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="reg-loc"
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. Houston, TX"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Dispatch / Operations Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="reg-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. +1 (713) 555-0192"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-700/20 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying & Creating Account…" : "Complete Account Setup & Access"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already verified on Encorb?{" "}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Sign in to Facility Dashboard
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          By registering, your organization agrees to Encorb's North American Commodity Settlement Rules and Escrow Terms.
        </p>
      </div>
    </div>
  );
}
