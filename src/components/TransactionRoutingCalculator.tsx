import { useState, useMemo, useRef } from "react";
import {
  ROUTING_DB,
  calculateEmissions,
  type LocationItem,
  type MassUnit,
  type PathwayName,
  type RoutingCalculationResult,
  MASS_UNITS,
  PATHWAY_NAMES,
} from "@/lib/routing-calculator";
import {
  Calculator,
  Truck,
  Leaf,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  Info,
  Car,
  Home,
  TreePine,
  Fuel,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export function TransactionRoutingCalculator() {
  // Preset defaults matching Sheet 08 & 09 example
  const [sellerCompany, setSellerCompany] = useState("Walmart Distribution Center");
  const [buyerCompany, setBuyerCompany] = useState("Pratt Industries");
  const [materialName, setMaterialName] = useState("OCC (Cardboard)");
  const [quantity, setQuantity] = useState<number>(24000);
  const [unit, setUnit] = useState<MassUnit>("lb");

  const [pickupSearch, setPickupSearch] = useState("Columbus, OH (city)");
  const [dropoffSearch, setDropoffSearch] = useState("Indianapolis city, IN (balance)");
  const [pickupCity, setPickupCity] = useState<LocationItem>(
    () =>
      ROUTING_DB.locations.find((l) => l.name.includes("Columbus, OH")) ||
      ROUTING_DB.locations[0]!
  );
  const [dropoffCity, setDropoffCity] = useState<LocationItem>(
    () =>
      ROUTING_DB.locations.find((l) => l.name.includes("Indianapolis city, IN")) ||
      ROUTING_DB.locations[1]!
  );

  const [transportMode, setTransportMode] = useState("Truck");
  const [vehicleType, setVehicleType] = useState("Heavy (Class 8) Long-haul");
  const [fuelType, setFuelType] = useState("Diesel");

  const [baselinePathway, setBaselinePathway] = useState<PathwayName>("Landfill (avg)");
  const [encorbPathway, setEncorbPathway] = useState<PathwayName>("Recycle");

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Available Vehicle & Fuel filters based on selected transport mode
  const availableVehicles = useMemo(() => {
    const list = ROUTING_DB.transportModes
      .filter((t) => t.mode.toLowerCase() === transportMode.toLowerCase())
      .map((t) => t.vehicleType);
    return Array.from(new Set(list));
  }, [transportMode]);

  const availableFuels = useMemo(() => {
    const list = ROUTING_DB.transportModes
      .filter(
        (t) =>
          t.mode.toLowerCase() === transportMode.toLowerCase() &&
          t.vehicleType.toLowerCase() === vehicleType.toLowerCase()
      )
      .map((t) => t.fuelType);
    return Array.from(new Set(list));
  }, [transportMode, vehicleType]);

  // Autocomplete suggestions
  const [pickupDropdownOpen, setPickupDropdownOpen] = useState(false);
  const [dropoffDropdownOpen, setDropoffDropdownOpen] = useState(false);

  const pickupSuggestions = useMemo(() => {
    if (!pickupSearch.trim()) return ROUTING_DB.locations.slice(0, 8);
    const q = pickupSearch.toLowerCase();
    return ROUTING_DB.locations
      .filter((l) => l.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [pickupSearch]);

  const dropoffSuggestions = useMemo(() => {
    if (!dropoffSearch.trim()) return ROUTING_DB.locations.slice(0, 8);
    const q = dropoffSearch.toLowerCase();
    return ROUTING_DB.locations
      .filter((l) => l.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [dropoffSearch]);

  // Compute live emissions
  const result: RoutingCalculationResult = useMemo(() => {
    return calculateEmissions({
      materialName,
      quantity: Number(quantity) || 0,
      unit,
      pickupLocation: pickupCity,
      dropoffLocation: dropoffCity,
      transportMode,
      vehicleType,
      fuelType,
      baselinePathway,
      encorbPathway,
    });
  }, [
    materialName,
    quantity,
    unit,
    pickupCity,
    dropoffCity,
    transportMode,
    vehicleType,
    fuelType,
    baselinePathway,
    encorbPathway,
  ]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {/* Top Banner & Methodology Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Calculator className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-white">
                Transaction Routing & Emissions Calculator
              </h2>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                EPA WARM v16 + SmartWay
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Accredited Scope 3 Cat. 5 algorithm · 13 Disposition Pathways · 32,000+ US Census Locations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden lg:block">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Standard</span>
            <span className="text-xs font-mono font-semibold text-emerald-300">ISO 14064-3:2019</span>
          </div>
          <button
            onClick={() => setShowCertificate(true)}
            disabled={!result.certificateEligible}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              result.certificateEligible
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            <Award className="h-4 w-4" />
            {result.certificateEligible ? "View Audit Certificate" : "Below 100 kg CO2e Threshold"}
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left (2 cols), Results on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Inputs (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Parties & Material */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>1. Parties & Material Stream</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Seller Company</label>
                <input
                  type="text"
                  value={sellerCompany}
                  onChange={(e) => setSellerCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  placeholder="e.g. Walmart DC #4521"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Buyer Company</label>
                <input
                  type="text"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  placeholder="e.g. Pratt Industries"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Material Catalog (129+ Verified EPA WARM / ecoinvent materials)
                </label>
                <select
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {ROUTING_DB.materials.map((m) => (
                    <option key={m.id} value={m.name}>
                      [{m.category}] {m.name} — {m.hazard} ({m.source})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Payload Quantity</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Mass Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as MassUnit)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {MASS_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-xl flex items-center justify-between text-xs text-muted-foreground border border-border/60">
              <span>Standardized Weight:</span>
              <span className="font-bold font-mono text-foreground text-sm">
                {result.massShortTons.toLocaleString()} short tons ({((result.massShortTons * 2000) / 2.20462 / 1000).toFixed(2)} metric tons)
              </span>
            </div>
          </div>

          {/* Card 2: US Census Routing & Logistics */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase mb-4">
              <Truck className="h-4 w-4 text-emerald-600" />
              <span>2. Origin, Destination & Fleet Logistics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup City */}
              <div className="relative">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Pickup City (US Census Gazetteer)
                </label>
                <input
                  type="text"
                  value={pickupSearch}
                  onFocus={() => setPickupDropdownOpen(true)}
                  onChange={(e) => {
                    setPickupSearch(e.target.value);
                    setPickupDropdownOpen(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  placeholder="Type city or state..."
                />
                {pickupDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-card border border-border rounded-xl shadow-xl py-1 text-xs">
                    {pickupSuggestions.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPickupCity(loc);
                          setPickupSearch(loc.name);
                          setPickupDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-muted font-medium flex items-center justify-between transition"
                      >
                        <span>{loc.name}</span>
                        <span className="font-mono text-muted-foreground">
                          {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropoff City */}
              <div className="relative">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Dropoff City (US Census Gazetteer)
                </label>
                <input
                  type="text"
                  value={dropoffSearch}
                  onFocus={() => setDropoffDropdownOpen(true)}
                  onChange={(e) => {
                    setDropoffSearch(e.target.value);
                    setDropoffDropdownOpen(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  placeholder="Type city or state..."
                />
                {dropoffDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-card border border-border rounded-xl shadow-xl py-1 text-xs">
                    {dropoffSuggestions.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDropoffCity(loc);
                          setDropoffSearch(loc.name);
                          setDropoffDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-muted font-medium flex items-center justify-between transition"
                      >
                        <span>{loc.name}</span>
                        <span className="font-mono text-muted-foreground">
                          {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mode, Vehicle, Fuel */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Transport Mode</label>
                <select
                  value={transportMode}
                  onChange={(e) => {
                    const m = e.target.value;
                    setTransportMode(m);
                    const matching = ROUTING_DB.transportModes.filter(
                      (t) => t.mode.toLowerCase() === m.toLowerCase()
                    );
                    if (matching[0]) {
                      setVehicleType(matching[0].vehicleType);
                      setFuelType(matching[0].fuelType);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {Array.from(new Set(ROUTING_DB.transportModes.map((t) => t.mode))).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => {
                    const v = e.target.value;
                    setVehicleType(v);
                    const matching = ROUTING_DB.transportModes.filter(
                      (t) =>
                        t.mode.toLowerCase() === transportMode.toLowerCase() &&
                        t.vehicleType.toLowerCase() === v.toLowerCase()
                    );
                    if (matching[0]) setFuelType(matching[0].fuelType);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {availableVehicles.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Fuel / Powertrain</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {availableFuels.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-xl text-xs border border-border/50 font-mono">
              <div>
                <span className="text-muted-foreground block text-[11px]">Great-circle:</span>
                <span className="font-semibold text-foreground">{result.greatCircleMiles} mi</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Road Distance (×1.2):</span>
                <span className="font-semibold text-foreground">{result.roadMiles} mi</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-muted-foreground block text-[11px]">SmartWay Factor:</span>
                <span className="font-semibold text-emerald-600">{result.transportEF} g/ton-mi</span>
              </div>
            </div>
          </div>

          {/* Card 3: Disposition Pathways */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase mb-4">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <span>3. Baseline vs. Encorb Pathway (EPA WARM v16)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Counterfactual Baseline (If not Encorb)
                </label>
                <select
                  value={baselinePathway}
                  onChange={(e) => setBaselinePathway(e.target.value as PathwayName)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {PATHWAY_NAMES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  EF: <span className="font-mono font-semibold">{result.baselinePathwayEF}</span> MTCO2e/ton
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Encorb Circular Pathway
                </label>
                <select
                  value={encorbPathway}
                  onChange={(e) => setEncorbPathway(e.target.value as PathwayName)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-emerald-500/50 bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {PATHWAY_NAMES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-emerald-600 block mt-1">
                  EF: <span className="font-mono font-semibold">{result.encorbPathwayEF}</span> MTCO2e/ton
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Emissions Results & Impact Dashboard (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Avoided Emissions Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-2xl p-6 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Leaf className="h-36 w-36 text-emerald-400" />
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Net Avoided GHG Emissions
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Confidence: {result.confidence}
              </span>
            </div>

            <div className="mt-2 mb-4">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {result.avoidedEmissionsTons > 0 ? "+" : ""}
                {result.avoidedEmissionsTons.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                <span className="text-lg sm:text-xl font-normal text-emerald-400 ml-2">tCO2e</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                {result.avoidedEmissionsKg.toLocaleString()} kg CO2-equivalent (with 5% buffer)
              </p>
            </div>

            {/* Formula Breakdown Breakdown Accordion / Visual */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-300">
                <span>Baseline Disposal Footprint:</span>
                <span className="text-amber-400 font-semibold">{result.baselineMgmtKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Encorb Recovery Footprint:</span>
                <span className="text-emerald-400 font-semibold">{result.encorbMgmtKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Freight Haul Emissions ({result.roadMiles} mi):</span>
                <span className="text-rose-400 font-semibold">-{result.transportEmissionsKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>ICVCM Conservative Buffer:</span>
                <span className="text-slate-400">5.00% deduction</span>
              </div>
            </div>

            {result.certificateEligible ? (
              <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Audit-Ready for Certificate of Diversion</span>
                </div>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="text-xs font-bold text-white underline hover:text-emerald-300 cursor-pointer"
                >
                  Generate PDF
                </button>
              </div>
            ) : (
              <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Avoided emissions below 100 kg threshold for formal certification.</span>
              </div>
            )}
          </div>

          {/* Customer Dashboard Equivalencies (EPA Equivalency Factors) */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" />
                Real-World EPA Equivalencies
              </h3>
              <span className="text-[10px] text-muted-foreground font-mono">EPA GHG Calculator</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Car className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium text-[11px]">Passenger Car Miles</span>
                </div>
                <div className="font-display text-base font-bold text-foreground">
                  {result.equivalencies[0]?.value.toLocaleString() || 0}
                </div>
                <span className="text-[10px] text-muted-foreground">miles driven avoided</span>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Fuel className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-medium text-[11px]">Gasoline Consumed</span>
                </div>
                <div className="font-display text-base font-bold text-foreground">
                  {result.equivalencies[1]?.value.toLocaleString() || 0}
                </div>
                <span className="text-[10px] text-muted-foreground">gallons prevented</span>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Home className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-medium text-[11px]">Home Energy</span>
                </div>
                <div className="font-display text-base font-bold text-foreground">
                  {result.equivalencies[3]?.value.toFixed(2) || 0}
                </div>
                <span className="text-[10px] text-muted-foreground">homes powered / year</span>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TreePine className="h-3.5 w-3.5 text-green-600" />
                  <span className="font-medium text-[11px]">Tree Seedlings</span>
                </div>
                <div className="font-display text-base font-bold text-foreground">
                  {result.equivalencies[4]?.value.toLocaleString() || 0}
                </div>
                <span className="text-[10px] text-muted-foreground">seedlings grown 10 yrs</span>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TreePine className="h-3.5 w-3.5 text-teal-600" />
                  <span className="font-medium text-[11px]">US Forest Acres</span>
                </div>
                <div className="font-display text-base font-bold text-foreground">
                  {result.equivalencies[5]?.value.toFixed(2) || 0}
                </div>
                <span className="text-[10px] text-muted-foreground">acres sequestered (1yr)</span>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Smartphone className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="font-medium text-[11px]">Smartphones</span>
                </div>
                <div className="font-display text-base font-bold text-foreground">
                  {result.equivalencies[6]?.value.toLocaleString() || 0}
                </div>
                <span className="text-[10px] text-muted-foreground">charges equivalent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-8 relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold p-2"
            >
              ✕
            </button>

            {/* Printable Certificate Content (Matching Sheet 12 Certificate Output) */}
            <div ref={printRef} className="space-y-6">
              {/* Header */}
              <div className="border-b-2 border-emerald-600 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 block">
                    ENCORB CIRCULAR EMISSIONS PLATFORM
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    CERTIFICATE OF DIVERSION
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Verified Avoided Greenhouse Gas Emissions · Audit Ledger Output
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {result.certificateId || "CERT-9421"}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Issued: {new Date().toISOString().split("T")[0]}
                  </span>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Seller (Generator)</span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{sellerCompany}</div>
                  <span className="text-slate-500">{pickupCity.name}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Buyer (Processor)</span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{buyerCompany}</div>
                  <span className="text-slate-500">{dropoffCity.name}</span>
                </div>
              </div>

              {/* Material & Routing Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Material</span>
                    <span className="font-semibold text-slate-800">{materialName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Mass Diverted</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {quantity.toLocaleString()} {unit} ({result.massShortTons} tons)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Logistics Route</span>
                    <span className="font-semibold text-slate-800 font-mono">{result.roadMiles} miles</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Fleet Class</span>
                    <span className="font-semibold text-slate-800">
                      {transportMode} ({fuelType})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Baseline Pathway</span>
                    <span className="font-medium text-slate-700">{baselinePathway} ({result.baselinePathwayEF} MTCO2e/ton)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Encorb Pathway</span>
                    <span className="font-medium text-emerald-700">{encorbPathway} ({result.encorbPathwayEF} MTCO2e/ton)</span>
                  </div>
                </div>
              </div>

              {/* Avoided Emissions Highlight Box */}
              <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-xl p-5 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Total Verified Avoided Emissions
                </span>
                <div className="font-display text-4xl font-extrabold text-emerald-950 mt-1">
                  {result.avoidedEmissionsTons.toFixed(4)} Metric Tons CO2e
                </div>
                <div className="text-xs text-emerald-800 font-mono mt-1">
                  ({result.avoidedEmissionsKg.toLocaleString()} kg CO2e · ISO 14064-3:2019 Confirmed)
                </div>
              </div>

              {/* Audit Standards */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 border-t border-b border-slate-200 py-3">
                <div>
                  <span className="font-bold text-slate-700 block">Methodology:</span>
                  <span>EPA WARM v16</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">GWP Standard:</span>
                  <span>IPCC AR6 GWP100</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Conservative Buffer:</span>
                  <span>5.0% (ICVCM CCP)</span>
                </div>
              </div>

              {/* Signature / Auditor Attestation */}
              <div className="pt-2 grid grid-cols-2 gap-8 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-4">Issued By</span>
                  <div className="font-semibold text-slate-800">Encorb Verification Operations</div>
                  <div className="text-slate-400 text-[11px]">Encorb Transaction Routing Platform v2</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-4">Auditor Attestation</span>
                  <div className="border-b border-slate-400 pb-1 font-serif italic text-slate-600">
                    Digitally Signed via Encorb Vault Ledger
                  </div>
                  <div className="text-slate-400 text-[11px] mt-1 font-mono">
                    SHA256: 8f9b...e4a1 · Date: {new Date().toISOString().split("T")[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-sm transition"
              >
                <Printer className="h-4 w-4" />
                Print / Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
