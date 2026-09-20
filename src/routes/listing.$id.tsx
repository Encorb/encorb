import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin,
  Package,
  Building2,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Gavel,
  Clock,
  ShieldCheck,
  FileText,
  Truck,
  DollarSign,
  Scale,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import {
  getListingById,
  createRequest,
  placeBid,
  type Listing
} from "@/lib/store";
import { FreightEstimator } from "@/components/FreightEstimator";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/listing/$id")({
  head: () => ({ meta: [{ title: "Material Lot Details — Encorb USA" }] }),
  component: ListingDetail,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // Request / RFQ Modal State
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [reqQty, setReqQty] = useState(1000);
  const [offeredPrice, setOfferedPrice] = useState<number>(0);
  const [reqMsg, setReqMsg] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false);
  const [reqError, setReqError] = useState("");

  // Bid Modal State (for Auctions)
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  const fetchListing = () => {
    getListingById(id).then((data) => {
      setListing(data);
      if (data) {
        setOfferedPrice(data.price);
        setReqQty(Math.min(data.quantity, 10000));
        const minBid = (data.current_bid || data.price) + (data.min_bid_increment || 100);
        setBidAmount(minBid);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground bg-background px-4">
        <Package className="h-16 w-16 opacity-30" />
        <p className="font-semibold text-lg text-foreground">Material Lot Not Found</p>
        <Link to="/marketplace" className="mt-2 text-sm font-semibold text-emerald-600 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    setIsSubmittingBid(true);
    const res = await placeBid(listing.id, user.id, user.name, bidAmount);
    setIsSubmittingBid(false);

    if (res.success) {
      toast.success(res.message);
      setShowBidModal(false);
      fetchListing();
    } else {
      toast.error(res.message);
    }
  };

  const handleSendRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqError("");
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (reqQty <= 0) {
      setReqError("Please enter a valid requested quantity.");
      return;
    }

    setReqLoading(true);
    const result = await createRequest({
      listing_id: listing.id,
      listing_title: listing.title,
      buyer_id: user.id,
      buyer_name: user.name,
      seller_id: listing.seller_id,
      seller_name: listing.seller_name,
      quantity: reqQty,
      unit: listing.unit,
      offered_price: offeredPrice,
      message: reqMsg,
      status: "pending",
    });
    setReqLoading(false);

    if (!result) {
      setReqError("Failed to submit request. Please try again.");
      return;
    }

    setReqSuccess(true);
    toast.success("Purchase order inquiry submitted to seller!");
    setTimeout(() => {
      setShowRfqModal(false);
      setReqSuccess(false);
      setReqMsg("");
    }, 2000);
  };

  const minBidRequired = (listing.current_bid || listing.price) + (listing.min_bid_increment || 100);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Back breadcrumb */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column (Images & Technical Specs) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Visual Display */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm relative">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="h-[440px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[440px] items-center justify-center bg-muted">
                  <Package className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}

              <div className="absolute top-4 left-4 flex gap-2">
                {listing.is_auction ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white shadow-lg">
                    <Gavel className="h-3.5 w-3.5" /> Live Auction
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-900/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-lg">
                    Fixed Price Lot
                  </span>
                )}
                <span className="rounded-full bg-card/90 backdrop-blur-md border border-border px-3 py-1 text-xs font-bold text-foreground shadow">
                  {listing.category}
                </span>
              </div>
            </div>

            {/* Technical Specification Matrix */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Material Specifications & Lab Analysis
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  COA Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block mb-1">Standard / ISRI Code</span>
                  <p className="font-mono font-bold text-foreground text-sm">
                    {listing.specs?.isri_code || "Standard Commercial Grade"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block mb-1">Target Purity</span>
                  <p className="font-mono font-bold text-emerald-600 text-sm">
                    {listing.specs?.purity || "> 98.5% Pure Feedstock"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block mb-1">Contamination Limit</span>
                  <p className="font-mono font-semibold text-foreground">
                    {listing.specs?.contamination || "< 1.5% non-target material"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block mb-1">Moisture Threshold</span>
                  <p className="font-mono font-semibold text-foreground">
                    {listing.specs?.moisture || "< 1.0% Controlled"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block mb-1">Packaging / Form</span>
                  <p className="font-semibold text-foreground">
                    {listing.specs?.packaging || "Super Sacks / High-Density Bales"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block mb-1">Freight & Logistics</span>
                  <p className="font-semibold text-foreground">
                    {listing.specs?.freight_terms || "FOB Origin Yard (53' Dry Van / Flatbed)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display font-bold text-lg text-foreground mb-3">
                Lot Overview & Processing Details
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </div>

            {/* US Freight & Landed Cost Logistics Estimator */}
            <FreightEstimator listing={listing} />
          </div>

          {/* Right Column (Pricing, Bidding, Seller Facility) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price / Auction Action Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Lot Status: <strong className="text-emerald-600 uppercase">{listing.status}</strong></span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {listing.location}
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mt-1 mb-4 leading-tight">
                {listing.title}
              </h1>

              {/* Price / Bid Box */}
              <div className="rounded-xl bg-muted/50 p-4 border border-border mb-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      {listing.is_auction ? "Current High Bid" : "Unit Price"}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                        ${listing.is_auction ? (listing.current_bid || listing.price).toLocaleString() : listing.price}
                      </span>
                      <span className="text-sm text-muted-foreground font-semibold">
                        {listing.unit ? `/${listing.unit}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Available Volume</span>
                    <p className="font-display text-lg font-bold text-foreground mt-0.5">
                      {listing.quantity.toLocaleString()} {listing.unit}
                    </p>
                  </div>
                </div>

                {listing.is_auction && (
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Closes in 18h 42m
                    </span>
                    <span className="text-muted-foreground">
                      {listing.bid_count || 0} Bids Placed
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {listing.is_auction ? (
                  <button
                    type="button"
                    onClick={() => setShowBidModal(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:scale-[1.02]"
                  >
                    <Gavel className="h-4 w-4" /> Place Binding Bid
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowRfqModal(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:scale-[1.02]"
                  >
                    <DollarSign className="h-4 w-4" /> Request Purchase Order / Quote
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowRfqModal(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  Contact Seller & Inquire Sample
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <strong>FDIC Escrow Guarantee:</strong> Payment released only upon weigh-scale confirmation.
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <strong>Logistics Coordination:</strong> Automated dispatch & digital Bill of Lading (BOL).
                </p>
              </div>
            </div>

            {/* Seller Facility Profile */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                Verified Seller Facility
              </span>
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-display font-extrabold text-lg">
                  {listing.seller_name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground text-sm truncate">
                    {listing.seller_business || listing.seller_name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-emerald-600" /> {listing.location}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted/40 p-2">
                  <span className="text-muted-foreground text-[11px]">Facility Rating</span>
                  <p className="font-bold text-foreground">4.9 / 5.0 ★</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <span className="text-muted-foreground text-[11px]">Completed Trades</span>
                  <p className="font-bold text-foreground">48 Loads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Place Bid Modal ────────────────────────────────────────── */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-emerald-400" />
                <h3 className="font-display text-lg font-bold">Place Binding Auction Bid</h3>
              </div>
              <button
                onClick={() => setShowBidModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceBid} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Your Bid Amount (USD $)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={minBidRequired}
                    step={listing.min_bid_increment || 50}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-base font-bold font-mono text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>Minimum required bid:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    ${minBidRequired.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                {[100, 250, 500, 1000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setBidAmount((prev) => prev + inc)}
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950 py-1.5 text-xs font-semibold text-slate-300 hover:border-emerald-400 hover:text-emerald-400"
                  >
                    +${inc}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 rounded-xl border border-slate-700 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBid}
                  className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {isSubmittingBid ? "Submitting Bid..." : "Confirm Binding Bid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Request / RFQ Modal ────────────────────────────────────── */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl text-foreground">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-display text-lg font-bold">Submit Purchase Order / RFQ</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{listing.title}</p>
              </div>
              <button
                onClick={() => setShowRfqModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reqSuccess ? (
              <div className="flex flex-col items-center py-8 gap-3 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
                <p className="font-bold text-foreground text-lg">Inquiry Successfully Submitted!</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  The seller facility has been notified and will review your pricing and pickup window.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRfq} className="mt-4 space-y-4">
                {reqError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {reqError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Required Quantity ({listing.unit})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={listing.quantity}
                      value={reqQty}
                      onChange={(e) => setReqQty(Number(e.target.value))}
                      className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs font-bold font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Offered Price ($ / {listing.unit})
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs font-bold font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Special Logistics / Lab Specification Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={reqMsg}
                    onChange={(e) => setReqMsg(e.target.value)}
                    placeholder="Specify freight pickup dates, COA test parameters, container loading needs..."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:border-emerald-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRfqModal(false)}
                    className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reqLoading}
                    className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {reqLoading ? "Submitting RFQ..." : "Send Formal Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

