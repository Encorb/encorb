import React, { useState, useMemo, useRef, useEffect } from "react";
import { ROUTING_DB, type LocationItem } from "@/lib/routing-calculator";
import { MapPin, Search, Check, ChevronDown, X, Building, Navigation } from "lucide-react";

// Standard US State Names & Abbreviations
export const US_STATE_MAP: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico"
};

const ALL_STATES_LIST = Object.entries(US_STATE_MAP)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Common/Major industrial recycling hubs for quick filter
const POPULAR_HUBS = [
  "Houston, TX",
  "Chicago, IL",
  "Columbus, OH",
  "Atlanta, GA",
  "Los Angeles, CA",
  "Indianapolis, IN",
  "Philadelphia, PA",
  "Boston, MA",
];

interface LocationPickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function LocationPicker({
  id = "location-picker",
  value,
  onChange,
  placeholder = "Search City or State (e.g. Boston, MA or Texas)...",
  required = false,
  className = "",
  autoFocus = false,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"search" | "browse">("search");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search state when external value changes
  useEffect(() => {
    setSearch(value);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered cities list based on search and optional state filter
  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = ROUTING_DB.locations;

    if (selectedStateFilter !== "ALL") {
      list = list.filter((l) => l.state === selectedStateFilter);
    }

    if (!query) {
      return list.slice(0, 50);
    }

    // Match by city name, state abbreviation, or full state name
    return list
      .filter((loc) => {
        const cityMatch = loc.city.toLowerCase().includes(query);
        const stateCodeMatch = loc.state.toLowerCase() === query || loc.state.toLowerCase().startsWith(query);
        const fullState = US_STATE_MAP[loc.state]?.toLowerCase() || "";
        const fullStateMatch = fullState.includes(query);
        const combined = `${loc.city}, ${loc.state}`.toLowerCase();
        const combinedMatch = combined.includes(query);

        return cityMatch || stateCodeMatch || fullStateMatch || combinedMatch;
      })
      .slice(0, 50);
  }, [search, selectedStateFilter]);

  // Matching states list based on search
  const matchingStates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return ALL_STATES_LIST.filter(
      (s) => s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [search]);

  const handleSelect = (city: string, state: string) => {
    const formatted = `${city}, ${state}`;
    setSearch(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearch("");
    onChange("");
    setSelectedStateFilter("ALL");
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input Field */}
      <div className="relative">
        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-emerald-600 pointer-events-none" />
        <input
          id={id}
          type="text"
          required={required}
          autoFocus={autoFocus}
          value={search}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-16 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all font-medium placeholder:text-muted-foreground/60 shadow-sm"
          autoComplete="off"
        />

        <div className="absolute right-2.5 top-2 flex items-center gap-1">
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Clear location"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Suggestions Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[380px] flex flex-col">
          {/* Header Controls: Search mode vs Browse State -> City */}
          <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Building className="h-3.5 w-3.5 text-emerald-600" />
              <span>US Facility Directory</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                ({filteredLocations.length} matches)
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab("search")}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  activeTab === "search" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Auto-Suggest
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("browse")}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  activeTab === "browse" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                State & City
              </button>
            </div>
          </div>

          {/* State Filter Bar in Browse Mode */}
          {activeTab === "browse" && (
            <div className="p-2.5 bg-slate-50 border-b border-slate-100">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Select State First:
              </label>
              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="ALL">All US States (50 States & Territories)</option>
                {ALL_STATES_LIST.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Hub Chips if search is empty and on search tab */}
          {!search.trim() && activeTab === "search" && (
            <div className="p-3 border-b border-slate-100 bg-emerald-50/30">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Popular Industrial Exchange Hubs
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_HUBS.map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => {
                      const [c, s] = hub.split(", ");
                      if (c && s) handleSelect(c, s);
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition"
                  >
                    <Navigation className="h-2.5 w-2.5 text-emerald-600" />
                    {hub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching States suggestion if typing state name */}
          {matchingStates.length > 0 && activeTab === "search" && (
            <div className="p-2 bg-slate-50/70 border-b border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-1">
                Filter by State:
              </p>
              <div className="flex flex-wrap gap-1">
                {matchingStates.map((st) => (
                  <button
                    key={st.code}
                    type="button"
                    onClick={() => {
                      setSelectedStateFilter(st.code);
                      setActiveTab("browse");
                    }}
                    className="rounded-md bg-emerald-100/60 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-xs font-semibold hover:bg-emerald-200 transition"
                  >
                    View All {st.name} Cities →
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cities List View */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {filteredLocations.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs font-semibold text-slate-600">No matching US cities found</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  You can still use "{search}" as your custom facility address.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  Use "{search}"
                </button>
              </div>
            ) : (
              filteredLocations.map((loc, idx) => {
                const isSelected = value === `${loc.city}, ${loc.state}`;
                const stateFullName = US_STATE_MAP[loc.state] || loc.state;

                return (
                  <button
                    key={`${loc.city}-${loc.state}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(loc.city, loc.state)}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 font-medium flex items-center justify-between transition group ${
                      isSelected ? "bg-emerald-50 text-emerald-800" : "text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 transition">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{loc.city}</span>
                          <span className="rounded bg-slate-100 text-slate-700 px-1.5 py-0.2 text-[10px] font-extrabold uppercase">
                            {loc.state}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {stateFullName} • US Census Coordinates ({loc.lat.toFixed(2)}, {loc.lon.toFixed(2)})
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer status */}
          <div className="p-2 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between px-3">
            <span>Powered by 3,058+ US Census Gazetteer Locations</span>
            <span className="text-emerald-700 font-medium">Click to select</span>
          </div>
        </div>
      )}
    </div>
  );
}
