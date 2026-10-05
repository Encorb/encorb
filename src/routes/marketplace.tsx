import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Package,
  Gavel,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Filter,
  DollarSign,
  Building2,
  ChevronRight,
  X,
  Sparkles,
  Scale
} from "lucide-react";
import {
  getListings,
  placeBid,
  US_STATES,
  type Listing,
  type WasteCategory,
  type USRegion
} from "@/lib/store";
import { MaterialCompareModal } from "@/components/MaterialCompareModal";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace & Live Auctions — Encorb USA" },
      { name: "description", content: "Explore verified US industrial recyclable materials, live scrap auctions, and fixed-price surplus lots." }
    ]
  }),
  component: Marketplace,
});

const CATEGORIES: WasteCategory[] = [
  "Plastic",
  "Paper",
  "Metal",
  "Glass",
  "E-Waste",
  "Textile",
  "Reclaimed Timber",
  "Industrial",
  "Other"
];

const US_REGIONS: USRegion[] = [
  "All",
  "Midwest",
  "Gulf Coast",
  "West Coast",
  "Northeast",
  "Southeast",
  "Southwest"
];

type ListingTypeFilter = "all" | "auctions" | "fixed_price";
type SortKey = "newest" | "price_asc" | "price_desc" | "qty_desc" | "ending_soon";

function Marketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ListingTypeFilter>("all");
  const [catFilter, setCatFilter] = useState<WasteCategory | "All">("All");
  const [regionFilter, setRegionFilter] = useState<USRegion>("All");
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("newest");

  // Quick Bid Modal State
  const [selectedBidListing, setSelectedBidListing] = useState<Listing | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Material Spec Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState<Listing[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (listing: Listing, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedForCompare((prev) => {
      const exists = prev.some((item) => item.id === listing.id);
      if (exists) {
        return prev.filter((item) => item.id !== listing.id);
      }
      if (prev.length >= 3) {
        toast.info("You can compare up to 3 lots simultaneously against ISRI benchmarks.");
        return prev;
      }
      toast.success(`Added "${listing.title.substring(0, 24)}..." to comparison.`);
      return [...prev, listing];
    });
  };

  const removeFromCompare = (id: string) => {
    setSelectedForCompare((prev) => prev.filter((item) => item.id !== id));
  };

  const fetchListings = () => {
    getListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings
  let filtered = listings.filter((l) => {
    // Text search
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      (l.specs?.purity && l.specs.purity.toLowerCase().includes(search.toLowerCase())) ||
      (l.specs?.isri_code && l.specs.isri_code.toLowerCase().includes(search.toLowerCase()));

    // Category
    const matchCat = catFilter === "All" || l.category === catFilter;

    // Type (Auctions vs Fixed Price)
    const matchType =
      typeFilter === "all" ||
      (typeFilter === "auctions" && l.is_auction) ||
      (typeFilter === "fixed_price" && !l.is_auction);

    // State
    const matchState =
      stateFilter === "All" ||
      (l.state && l.state === stateFilter) ||
      l.location.toLowerCase().includes(stateFilter.toLowerCase());

    return matchSearch && matchCat && matchType && matchState;
  });

  // Sort listings
  if (sort === "price_asc") {
    filtered = [...filtered].sort((a, b) => (a.is_auction ? (a.current_bid || a.price) : a.price) - (b.is_auction ? (b.current_bid || b.price) : b.price));
  } else if (sort === "price_desc") {
    filtered = [...filtered].sort((a, b) => (b.is_auction ? (b.current_bid || b.price) : b.price) - (a.is_auction ? (a.current_bid || a.price) : a.price));
  } else if (sort === "qty_desc") {
    filtered = [...filtered].sort((a, b) => b.quantity - a.quantity);
  } else if (sort === "ending_soon") {
    filtered = [...filtered].sort((a, b) => {
      if (!a.auction_end_time) return 1;
      if (!b.auction_end_time) return -1;
      return new Date(a.auction_end_time).getTime() - new Date(b.auction_end_time).getTime();
    });
  }

  const openBidModal = (e: React.MouseEvent, listing: Listing) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBidListing(listing);
    const minBid = (listing.current_bid || listing.price) + (listing.min_bid_increment || 100);
    setBidAmount(minBid);
  };

  const handleConfirmBid = async () => {
    if (!selectedBidListing) return;
    setIsSubmittingBid(true);

    const bidderId = user?.id || "guest-buyer-01";
    const bidderName = user?.name || "Verified Bidder (Demo)";

    const res = await placeBid(selectedBidListing.id, bidderId, bidderName, bidAmount);

    setIsSubmittingBid(false);
    if (res.success) {
      toast.success(res.message);
      setSelectedBidListing(null);
      fetchListings();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Page Header Bar ─────────────────────────────────────────── */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
                  US Circular Material Exchange
                </h1>
                <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600">
                  {filtered.length} Live Lots
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Verified North American industrial feedstocks, mill-spec bales, regrind polymers, and live scrap auctions.
              </p>
            </div>

            {/* Type selector tabs */}
            <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border shrink-0">
              <button
                onClick={() => setTypeFilter("all")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${typeFilter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                All Lots ({listings.length})
              </button>
              <button
                onClick={() => setTypeFilter("auctions")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${typeFilter === "auctions" ? "bg-emerald-500 text-slate-950 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Gavel className="h-3.5 w-3.5" />
                Live Auctions ({listings.filter((l) => l.is_auction).length})
              </button>
              <button
                onClick={() => setTypeFilter("fixed_price")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${typeFilter === "fixed_price" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Fixed Price ({listings.filter((l) => !l.is_auction).length})
              </button>
            </div>
          </div>

          {/* Search, Region, State & Sort Bar */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
            {/* Search input */}
            <div className="relative sm:col-span-5 lg:col-span-4">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keyword, ISRI code, polymer grade, city, or zip..."
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dedicated State Dropdown */}
            <div className="relative sm:col-span-4 lg:col-span-4">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none font-medium"
              >
                <option value="All">All 50 States (All Regions)</option>
                {US_STATES.filter((s) => s !== "All").map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative sm:col-span-2 lg:col-span-2">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-8 pr-3 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none font-medium"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price Low-High</option>
                <option value="price_desc">Price High-Low</option>
                <option value="qty_desc">Volume</option>
                <option value="ending_soon">Ending Soon</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Category:
            </span>
            {(["All", ...CATEGORIES] as (WasteCategory | "All")[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`rounded-full border px-3.5 py-1 text-xs font-semibold transition-all whitespace-nowrap ${catFilter === cat ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-sm" : "border-border bg-background text-muted-foreground hover:border-emerald-500/40 hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Listings Grid ───────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 flex-1 w-full">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center rounded-2xl border border-dashed border-border bg-card">
            <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
            <h2 className="font-display text-xl font-bold text-foreground">No material lots matched your criteria</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Try clearing your active filters or changing your search terms to discover available inventory.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCatFilter("All");
                setTypeFilter("all");
                setRegionFilter("All");
                setStateFilter("All");
              }}
              className="mt-6 rounded-xl bg-emerald-500 px-6 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((lot) => (
              <ListingCard
                key={lot.id}
                listing={lot}
                isCompared={selectedForCompare.some((item) => item.id === lot.id)}
                onToggleCompare={(e) => toggleCompare(lot, e)}
                onQuickBid={(e) => openBidModal(e, lot)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Floating Comparison Drawer Bar ────────────────────────────── */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-3.5 text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400 shrink-0">
                <Scale className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                  ISRI Benchmark Spec Comparator
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    {selectedForCompare.length}/3 Lots
                  </span>
                </p>
                <div className="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar">
                  {selectedForCompare.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-medium"
                    >
                      <span className="truncate max-w-[90px]">{item.title}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(item.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedForCompare([])}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
              >
                <Scale className="h-3.5 w-3.5" />
                Compare Lots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Side-by-Side ISRI Material Spec Comparison Modal ─────────── */}
      <MaterialCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedListings={selectedForCompare}
        onRemoveListing={removeFromCompare}
      />

      {/* ── Quick Bid Modal ──────────────────────────────────────────── */}
      {selectedBidListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-emerald-400" />
                <h3 className="font-display text-lg font-bold">Place Binding Bid</h3>
              </div>
              <button
                onClick={() => setSelectedBidListing(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex gap-3 items-center bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <img
                src={selectedBidListing.image_url}
                alt={selectedBidListing.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-white truncate">{selectedBidListing.title}</p>
                <p className="text-slate-400 mt-0.5">{selectedBidListing.location}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-slate-400">Current Bid:</span>
                  <span className="font-bold text-emerald-400">
                    ${(selectedBidListing.current_bid || selectedBidListing.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Your Bid Amount (USD $)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={(selectedBidListing.current_bid || selectedBidListing.price) + (selectedBidListing.min_bid_increment || 50)}
                  step={selectedBidListing.min_bid_increment || 50}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-base font-bold font-mono text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Minimum required bid:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ${((selectedBidListing.current_bid || selectedBidListing.price) + (selectedBidListing.min_bid_increment || 50)).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Quick raise presets */}
            <div className="mt-4 flex gap-2">
              {[100, 250, 500, 1000].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => setBidAmount((prev) => prev + inc)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950 py-1.5 text-xs font-semibold text-slate-300 hover:border-emerald-400 hover:text-emerald-400 transition-colors"
                >
                  +${inc}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedBidListing(null)}
                className="flex-1 rounded-xl border border-slate-700 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingBid}
                onClick={handleConfirmBid}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {isSubmittingBid ? "Submitting..." : "Confirm Binding Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LISTING CARD COMPONENT ─────────────────────────────────────────────── */
function ListingCard({
  listing: l,
  isCompared,
  onToggleCompare,
  onQuickBid
}: {
  listing: Listing;
  isCompared: boolean;
  onToggleCompare: (e: React.MouseEvent) => void;
  onQuickBid: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="relative group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/40">
      <Link
        to="/listing/$id"
        params={{ id: l.id }}
        className="flex flex-col flex-1"
      >
        {/* Media & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {l.image_url ? (
            <img
              src={l.image_url}
              alt={l.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Auction or Fixed badge */}
          {l.is_auction ? (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
              <Gavel className="h-3 w-3" /> Live Auction
            </div>
          ) : (
            <div className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              Fixed Contract
            </div>
          )}

          <div className="absolute top-2.5 right-2.5 rounded-full border border-border/80 bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm">
            {l.category}
          </div>

          {l.verified_seller && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3" /> Verified US Facility
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
              <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
              <span className="truncate">{l.location}</span>
            </div>

            <h3 className="font-display text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
              {l.title}
            </h3>

            {l.specs?.purity && (
              <p className="mt-1.5 text-[11px] font-mono text-emerald-600/90 line-clamp-1">
                {l.specs.purity}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground">
                  {l.quantity.toLocaleString()} {l.unit}
                </p>
                <p className="font-display text-base font-extrabold text-foreground">
                  ${l.is_auction ? (l.current_bid || l.price).toLocaleString() : l.price}
                  <span className="text-xs font-normal text-muted-foreground">
                    {l.unit ? `/${l.unit}` : ""}
                  </span>
                </p>
              </div>

              {l.is_auction ? (
                <button
                  type="button"
                  onClick={onQuickBid}
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
                >
                  Bid
                </button>
              ) : (
                <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  View
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Compare Checkbox Pill */}
      <button
        type="button"
        onClick={onToggleCompare}
        className={`absolute bottom-3 right-16 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-all ${
          isCompared
            ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400"
            : "bg-muted/90 text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title="Compare against ISRI specifications"
      >
        <Scale className="h-3 w-3" />
        {isCompared ? "Selected" : "Compare"}
      </button>
    </div>
  );
}

