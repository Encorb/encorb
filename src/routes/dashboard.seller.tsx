import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  User as UserIcon,
  LayoutDashboard,
  Building2,
  AlertCircle,
  Loader2,
  Gavel,
  DollarSign,
  MapPin,
  FileSpreadsheet,
  Truck,
  ShieldCheck,
  FileCheck,
  MessageSquare
} from "lucide-react";
import { DigitalBolModal } from "@/components/DigitalBolModal";
import { OrderChatModal } from "@/components/OrderChatModal";
import {
  getListingsBySeller,
  createListing,
  updateListing,
  deleteListing,
  getRequestsBySeller,
  updateRequest,
  createTransaction,
  createNotification,
  getTransactionsBySeller,
  getNotificationsByUser,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToSellerRequests,
  subscribeToNotifications,
  updateProfile,
  type Listing,
  type BuyerRequest,
  type Transaction,
  type Notification,
  type WasteCategory,
  type USRegion,
} from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/seller")({
  head: () => ({ meta: [{ title: "Seller & Facility Portal — Encorb USA" }] }),
  component: SellerDashboard,
});

type Tab = "overview" | "listings" | "add_listing" | "requests" | "transactions" | "notifications" | "profile";

const CATEGORIES: WasteCategory[] = [
  "Plastic",
  "Paper",
  "Metal",
  "Glass",
  "E-Waste",
  "Textile",
  "Reclaimed Timber",
  "Industrial",
  "Other",
];

const US_REGIONS: USRegion[] = [
  "Midwest",
  "Gulf Coast",
  "West Coast",
  "Northeast",
  "Southeast",
  "Southwest"
];

const UNITS = ["lbs", "Tons", "Bales", "Pallets", "Units", "Loads"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${
        STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

const BLANK_FORM = {
  title: "",
  category: "Plastic" as WasteCategory,
  description: "",
  quantity: 40000,
  unit: "lbs",
  price: 0.55,
  location: "Houston, TX",
  region: "Gulf Coast" as USRegion,
  is_auction: false,
  min_bid_increment: 50,
  specs_purity: "> 99.0% Clean",
  specs_isri: "ISRI Spec Grade",
  specs_freight: "FOB Origin Yard (Dry Van)",
};

const CATEGORY_IMAGES: Record<WasteCategory, string> = {
  Plastic: "/images/pvc-pipes.jpg",
  Paper: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80",
  Metal: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80",
  Glass: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
  "E-Waste": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  Textile: "https://images.unsplash.com/photo-1558171813-2f2b9fa0e3c9?w=800&q=80",
  "Reclaimed Timber": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&q=80",
  Industrial: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  Other: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
};

function SellerDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    businessName: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bolModalData, setBolModalData] = useState<any | null>(null);
  const [activeChatOrder, setActiveChatOrder] = useState<any | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [lsts, reqs, txns, notifs] = await Promise.all([
      getListingsBySeller(user.id),
      getRequestsBySeller(user.id),
      getTransactionsBySeller(user.id),
      getNotificationsByUser(user.id),
    ]);
    setListings(lsts);
    setRequests(reqs);
    setTransactions(txns);
    setNotifications(notifs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role !== "seller") {
      navigate({ to: user.role === "buyer" ? "/dashboard/buyer" : "/dashboard/admin" });
      return;
    }
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      location: user.location ?? "",
      bio: user.bio ?? "",
      businessName: user.businessName ?? "",
    });
    refresh();

    const unsubReqs = subscribeToSellerRequests(user.id, (req) => {
      setRequests((prev) => [req, ...prev]);
    });
    const unsubNotifs = subscribeToNotifications(user.id, (n) => {
      setNotifications((prev) => [n, ...prev]);
    });
    return () => {
      unsubReqs();
      unsubNotifs();
    };
  }, [user]);

  if (!user || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const activeListings = listings.filter((l) => l.status === "active").length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const activeTxns = transactions.filter((t) => !["completed", "cancelled"].includes(t.status)).length;
  const unread = notifications.filter((n) => !n.read).length;

  const initAddForm = (l?: Listing) => {
    if (l) {
      setForm({
        title: l.title,
        category: l.category,
        description: l.description,
        quantity: l.quantity,
        unit: l.unit,
        price: l.price,
        location: l.location,
        region: l.region || "Midwest",
        is_auction: !!l.is_auction,
        min_bid_increment: l.min_bid_increment || 50,
        specs_purity: l.specs?.purity || "> 99.0% Clean",
        specs_isri: l.specs?.isri_code || "Standard Commercial Grade",
        specs_freight: l.specs?.freight_terms || "FOB Origin Yard",
      });
      setEditListing(l);
    } else {
      setForm(BLANK_FORM);
      setEditListing(null);
    }
    setFormError("");
    setFormSuccess("");
    setTab("add_listing");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim()) {
      setFormError("Please enter a material lot title.");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Please enter a lot description.");
      return;
    }
    if (form.quantity <= 0) {
      setFormError("Quantity must be greater than 0.");
      return;
    }
    if (form.price <= 0) {
      setFormError("Unit price or starting bid must be greater than 0.");
      return;
    }
    if (!form.location.trim()) {
      setFormError("Please specify origin location (City, State / ZIP).");
      return;
    }

    setFormLoading(true);

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      quantity: form.quantity,
      unit: form.unit,
      price: form.price,
      location: form.location,
      region: form.region,
      is_auction: form.is_auction,
      min_bid_increment: form.min_bid_increment,
      current_bid: form.is_auction ? form.price : undefined,
      bid_count: 0,
      specs: {
        purity: form.specs_purity,
        isri_code: form.specs_isri,
        freight_terms: form.specs_freight,
      },
    };

    if (editListing) {
      await updateListing(editListing.id, payload);
      setFormSuccess("Material listing updated successfully!");
      toast.success("Listing updated");
    } else {
      await createListing({
        ...payload,
        seller_id: user.id,
        seller_name: user.name,
        seller_business: profileData.businessName || user.name,
        status: "active",
        image_url: CATEGORY_IMAGES[form.category],
        currency: "USD",
        verified_seller: true,
      });
      setFormSuccess("Material lot published to the US exchange!");
      toast.success("New listing live on US marketplace");
    }

    setFormLoading(false);
    setForm(BLANK_FORM);
    setEditListing(null);
    await refresh();
    setTimeout(() => {
      setFormSuccess("");
      setTab("listings");
    }, 1500);
  };

  const handleAcceptRequest = async (req: BuyerRequest) => {
    await updateRequest(req.id, { status: "accepted" });
    const listing = listings.find((l) => l.id === req.listing_id);
    const unitPrice = req.offered_price || listing?.price || 1;

    await createTransaction({
      request_id: req.id,
      listing_id: req.listing_id,
      listing_title: req.listing_title,
      buyer_id: req.buyer_id,
      buyer_name: req.buyer_name,
      seller_id: req.seller_id,
      seller_name: req.seller_name,
      category: listing?.category ?? "Other",
      quantity: req.quantity,
      unit: listing?.unit ?? "lbs",
      price: unitPrice,
      total: req.quantity * unitPrice,
      location: listing?.location || "US Facility",
      status: "confirmed",
      bol_number: `BOL-${Math.floor(100000 + Math.random() * 900000)}`,
      tracking_step: 2,
    });

    await createNotification({
      user_id: req.buyer_id,
      type: "request_accepted",
      title: "Purchase Order Accepted! 🎉",
      message: `Your inquiry for "${req.listing_title}" was accepted. A formal BOL and escrow contract have been generated.`,
      read: false,
    });

    toast.success("Request accepted and transaction initiated");
    await refresh();
  };

  const handleRejectRequest = async (req: BuyerRequest) => {
    await updateRequest(req.id, { status: "rejected" });
    await createNotification({
      user_id: req.buyer_id,
      type: "request_rejected",
      title: "Inquiry Declined",
      message: `Your inquiry for "${req.listing_title}" was declined by the supplier facility.`,
      read: false,
    });
    toast.info("Inquiry declined");
    await refresh();
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(user.id, {
      name: profileData.name,
      phone: profileData.phone,
      location: profileData.location,
      bio: profileData.bio,
      business_name: profileData.businessName,
    });
    await refreshUser();
    setProfileSaved(true);
    toast.success("Supplier profile updated");
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "listings", label: "Inventory Lots", icon: Package, badge: activeListings },
    { id: "add_listing", label: "Post New Material", icon: Plus },
    { id: "requests", label: "Inquiries & Bids", icon: Clock, badge: pendingRequests },
    { id: "transactions", label: "Sales & Contracts", icon: CheckCircle, badge: activeTxns },
    { id: "notifications", label: "Alerts", icon: Bell, badge: unread },
    { id: "profile", label: "Facility Setup", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Header Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600">
                Verified Material Supplier
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground mt-1">
              Supplier Command Center: {user.name.split(" ")[0]} 👋
            </h1>
            {profileData.businessName && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-emerald-600" /> {profileData.businessName} • {profileData.location || "United States"}
              </p>
            )}
          </div>

          <button
            onClick={() => initAddForm()}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus className="h-4 w-4" /> Post New Material Lot
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-sm no-scrollbar">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => (id !== "add_listing" ? setTab(id) : initAddForm())}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                tab === id
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {badge && badge > 0 ? (
                <span
                  className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    tab === id ? "bg-slate-950 text-emerald-400" : "bg-emerald-600 text-white"
                  }`}
                >
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Active Inventory Lots</span>
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{activeListings}</p>
                <p className="text-xs text-muted-foreground mt-1">Live on US marketplace</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Pending Inquiries</span>
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{pendingRequests}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting your approval</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Active Contracts</span>
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{activeTxns}</p>
                <p className="text-xs text-muted-foreground mt-1">In settlement & transit</p>
              </div>
            </div>

            {/* 4-Step Seller Lifecycle Guide (Image 3) */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-[#041a10] p-6 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                    Seller Playbook
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                    Your 4-Step Path from Scrap to Settled Sale
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                  Automated BOL + T+2 Payout
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-emerald-400 font-black text-lg">01</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300">LIST</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Post your material</h4>
                  <p className="text-xs text-slate-400 mt-1">List loads with ISRI specs, tonnage & pickup location. EIN verified in mins.</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                    Cu • ISRI Bare Bright • 18 t
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-emerald-400 font-black text-lg">02</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300">COMPARE</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Get verified offers</h4>
                  <p className="text-xs text-slate-400 mt-1">Buyers bid against reference price. You see landed net numbers.</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                    3 offers • Best $8,510/t
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-emerald-400 font-black text-lg">03</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300">CONFIRM</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Confirm the deal</h4>
                  <p className="text-xs text-slate-400 mt-1">Encorb auto-generates digital BOL & chain-of-custody without hassle.</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                    BOL + Chain of custody
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-emerald-400 font-black text-lg">04</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300">SHIP & PAY</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Ship and get paid</h4>
                  <p className="text-xs text-slate-400 mt-1">Freight dispatched. Funds release on weigh ticket confirmation (T+2).</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                    Weight-ticket verified • T+2
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Inquiries Box */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-foreground">
                  Incoming Purchase Inquiries & Bids
                </h3>
                <button
                  onClick={() => setTab("requests")}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  View All ({requests.length})
                </button>
              </div>

              {requests.filter((r) => r.status === "pending").length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="font-bold text-xs text-foreground">No pending buyer inquiries right now</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests
                    .filter((r) => r.status === "pending")
                    .slice(0, 3)
                    .map((r) => (
                      <RequestRow
                        key={r.id}
                        req={r}
                        onAccept={handleAcceptRequest}
                        onReject={handleRejectRequest}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {tab === "listings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Active Material Lots</h2>
              <button
                onClick={() => initAddForm()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" /> Post Material
              </button>
            </div>

            {listings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="font-bold text-foreground text-sm">No material lots listed yet</p>
                <button
                  onClick={() => initAddForm()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  <Plus className="h-4 w-4" /> Create First Lot
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-100">
                        <img
                          src={l.image_url}
                          alt={l.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute right-3 top-3">
                          <StatusBadge status={l.status} />
                        </div>
                        {l.is_auction && (
                          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                            Live Auction
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3 text-emerald-600" /> {l.location}
                        </p>
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {l.title}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-emerald-600">
                          {l.quantity.toLocaleString()} {l.unit} • ${l.price}/{l.unit}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {l.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-border mt-3">
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => initAddForm(l)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs font-bold hover:bg-muted"
                        >
                          <Edit3 className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            await updateListing(l.id, {
                              status: l.status === "active" ? "paused" : "active",
                            });
                            await refresh();
                          }}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs font-bold hover:bg-muted"
                        >
                          {l.status === "active" ? (
                            <>
                              <EyeOff className="h-3 w-3" /> Pause
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3" /> Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(l.id)}
                          className="flex items-center justify-center rounded-lg border border-rose-500/30 p-2 text-xs text-rose-600 hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <Link
                        to="/listing/$id"
                        params={{ id: l.id }}
                        className="mt-2 text-[11px] font-bold text-emerald-600 hover:underline block text-center"
                      >
                        Preview Public Lot
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADD / EDIT LISTING FORM */}
        {tab === "add_listing" && (
          <div className="max-w-3xl">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              {editListing ? "Edit Material Lot" : "Post New Industrial Material Lot"}
            </h2>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {formError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
                </div>
              )}
              {formSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 font-bold">
                  <CheckCircle className="h-4 w-4 shrink-0" /> {formSuccess}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Lot Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Post-Consumer HDPE #2 Regrind Flakes"
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as WasteCategory }))}
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">US Region *</label>
                    <select
                      value={form.region}
                      onChange={(e) => setForm((f) => ({ ...f, region: e.target.value as USRegion }))}
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                    >
                      {US_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Unit *</label>
                    <select
                      value={form.unit}
                      onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Total Available Quantity *</label>
                    <input
                      type="number"
                      min={1}
                      value={form.quantity || ""}
                      onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-mono font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      {form.is_auction ? "Starting Bid ($)" : "Fixed Price ($ / Unit)"} *
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      min={0.01}
                      value={form.price || ""}
                      onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-mono font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Auction Switch */}
                <div className="rounded-xl border border-border p-3 bg-muted/20 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground flex items-center gap-1.5">
                      <Gavel className="h-4 w-4 text-emerald-600" /> Enable Live Bidding / Auction Format
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Allows verified buyers to place competitive bids over a scheduled closing window.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.is_auction}
                    onChange={(e) => setForm((f) => ({ ...f, is_auction: e.target.checked }))}
                    className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Origin City & State / ZIP *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g., Houston, TX (Zip 77001)"
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">ISRI / Grade Code</label>
                    <input
                      type="text"
                      value={form.specs_isri}
                      onChange={(e) => setForm((f) => ({ ...f, specs_isri: e.target.value }))}
                      placeholder="e.g. ISRI #11 OCC"
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Purity Metric</label>
                    <input
                      type="text"
                      value={form.specs_purity}
                      onChange={(e) => setForm((f) => ({ ...f, specs_purity: e.target.value }))}
                      placeholder="e.g. > 99.2% Pure"
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Freight Terms</label>
                    <input
                      type="text"
                      value={form.specs_freight}
                      onChange={(e) => setForm((f) => ({ ...f, specs_freight: e.target.value }))}
                      placeholder="e.g. FOB Origin Yard"
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Description & Material Specs *</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe source feedstock, bale densities, moisture content, contamination thresholds, and dock loading hours..."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs focus:border-emerald-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTab("listings")}
                    className="flex-1 rounded-xl border border-border py-2.5 font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 rounded-xl bg-emerald-500 py-2.5 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {formLoading ? "Publishing..." : editListing ? "Save Lot Changes" : "Publish to US Exchange"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: REQUESTS & INCOMING BIDS */}
        {tab === "requests" && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              Buyer Purchase Inquiries & Bids
            </h2>

            {requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Clock className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="font-bold text-foreground text-sm">No incoming inquiries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <RequestRow
                    key={r.id}
                    req={r}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    onOpenChat={(req) =>
                      setActiveChatOrder({
                        id: req.id,
                        title: req.listing_title,
                        buyerName: req.buyer_name,
                        sellerName: user.name,
                        status: req.status,
                        quantity: req.quantity,
                        unit: req.unit,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRANSACTIONS & SALES */}
        {tab === "transactions" && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Sales & BOL Dispatch Contracts</h2>

            {transactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="font-bold text-foreground text-sm">No completed sales orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">{t.id}</span>
                          <StatusBadge status={t.status} />
                          {t.bol_number && (
                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                              {t.bol_number}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-base text-foreground mt-1">
                          {t.listing_title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Buyer: <strong>{t.buyer_name}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">Settlement Total</span>
                        <p className="font-display text-2xl font-extrabold text-foreground">
                          ${t.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.quantity.toLocaleString()} {t.unit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Contract Date: {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveChatOrder({
                              id: t.id,
                              title: t.listing_title,
                              buyerName: t.buyer_name || "Commercial Consignee",
                              sellerName: user.name,
                              status: t.status,
                              bolNumber: t.bol_number,
                              totalAmount: t.total,
                              quantity: t.quantity,
                              unit: t.unit,
                              location: t.location,
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Message Buyer & Dispatch
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setBolModalData({
                              id: t.id,
                              title: t.listing_title,
                              quantity: t.quantity,
                              unit: t.unit || "lbs",
                              totalAmount: t.total,
                              buyerName: t.buyer_name || "Commercial Consignee",
                              sellerName: user?.name || "Verified Generator Yard",
                              originLocation: t.location || "Houston, TX",
                              destinationLocation: "Consignee Designated Processing Terminal",
                              carrierName: t.carrier_name || "Encorb Freight Logistics",
                              trackingNumber: t.bol_number || `ENC-BOL-${t.id.substring(0, 6)}`,
                              status: t.status,
                              createdDate: new Date(t.created_at).toLocaleDateString("en-US")
                            })
                          }
                          className="flex items-center gap-1.5 font-bold text-emerald-600 hover:underline"
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          Print DOT Electronic BOL & Scale Manifest
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: NOTIFICATIONS */}
        {tab === "notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Supplier Notifications</h2>
              {unread > 0 && (
                <button
                  onClick={async () => {
                    await markAllNotificationsRead(user.id);
                    await refresh();
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Bell className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="font-bold text-foreground text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={async () => {
                      if (!n.read) {
                        await markNotificationRead(n.id);
                        await refresh();
                      }
                    }}
                    className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                      n.read ? "border-border bg-card" : "border-emerald-500/30 bg-emerald-500/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
                      <div className={!n.read ? "" : "ml-4"}>
                        <p className="font-bold text-sm text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SUPPLIER & FACILITY PROFILE */}
        {tab === "profile" && (
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Supplier Facility Profile</h2>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 text-2xl font-extrabold font-display">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{user.name}</h3>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 mt-1 inline-block">
                    Verified Industrial Supplier
                  </span>
                </div>
              </div>

              {profileSaved && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-600 font-bold">
                  <CheckCircle className="h-4 w-4" /> Facility profile updated!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-xl border border-input bg-background p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Facility / Business Name</label>
                    <input
                      type="text"
                      value={profileData.businessName}
                      onChange={(e) => setProfileData((p) => ({ ...p, businessName: e.target.value }))}
                      placeholder="e.g. Apex Industrial Recyclers LLC"
                      className="w-full rounded-xl border border-input bg-background p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full rounded-xl border border-input bg-muted/50 p-2.5 text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Direct Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-input bg-background p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Yard / Facility Address</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g., Houston, TX (Zip 77001)"
                    className="w-full rounded-xl border border-input bg-background p-2.5 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Facility Capabilities & Certifications</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Describe shredding capacities, optical sorting, baler specs, EPA & R2v3 certifications..."
                    className="w-full rounded-xl border border-input bg-background p-2.5 focus:border-emerald-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate({ to: "/" });
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Log Out of Session
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-slate-950 hover:bg-emerald-400 shadow-sm"
                  >
                    Save Facility Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl text-foreground">
            <h3 className="font-display text-lg font-bold">Delete material lot?</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              This will permanently delist this inventory lot from the US exchange.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteListing(deleteConfirm);
                  setDeleteConfirm(null);
                  toast.success("Lot removed");
                  await refresh();
                }}
                className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-500"
              >
                Delete Lot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Official Electronic Bill of Lading & Scale Ticket Modal ─── */}
      {bolModalData && (
        <DigitalBolModal
          isOpen={!!bolModalData}
          onClose={() => setBolModalData(null)}
          data={bolModalData}
        />
      )}

      {/* ── Real-Time Order Chat & Dispatch Messenger Modal ─── */}
      {activeChatOrder && (
        <OrderChatModal
          isOpen={!!activeChatOrder}
          onClose={() => setActiveChatOrder(null)}
          order={activeChatOrder}
          currentUser={{
            id: user.id,
            name: user.name,
            role: "seller",
          }}
        />
      )}
    </div>
  );
}

function RequestRow({
  req,
  onAccept,
  onReject,
  onOpenChat,
}: {
  req: BuyerRequest;
  onAccept: (r: BuyerRequest) => void;
  onReject: (r: BuyerRequest) => void;
  onOpenChat?: (r: BuyerRequest) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{req.id}</span>
            <StatusBadge status={req.status} />
          </div>
          <Link
            to="/listing/$id"
            params={{ id: req.listing_id }}
            className="font-display font-bold text-base text-foreground hover:text-emerald-600 transition-colors mt-1 block"
          >
            {req.listing_title}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            From Buyer: <strong>{req.buyer_name}</strong>
          </p>
          {req.message && (
            <p className="mt-2 text-xs text-foreground bg-muted/30 p-2.5 rounded-xl border border-border/60">
              <strong>Requirement:</strong> {req.message}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="text-xs text-muted-foreground block">Inquiry Volume</span>
          <p className="font-display font-extrabold text-foreground text-sm">
            {req.quantity.toLocaleString()} {req.unit || "units"}
          </p>
          {req.offered_price && (
            <p className="text-xs text-emerald-600 font-bold mt-0.5">
              Offer: ${req.offered_price}/{req.unit || "unit"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">
          Received {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>

        <div className="flex flex-wrap gap-2">
          {req.status === "accepted" && onOpenChat && (
            <button
              type="button"
              onClick={() => onOpenChat(req)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 font-bold text-emerald-600 hover:bg-emerald-500 hover:text-slate-950 transition"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Chat with Buyer
            </button>
          )}
          {req.status === "pending" && (
            <>
              <button
                onClick={() => onReject(req)}
                className="flex items-center gap-1 rounded-xl border border-rose-500/30 px-3 py-1.5 font-bold text-rose-600 hover:bg-rose-500/10"
              >
                <XCircle className="h-3.5 w-3.5" /> Decline
              </button>
              <button
                onClick={() => onAccept(req)}
                className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-1.5 font-bold text-slate-950 hover:bg-emerald-400"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Accept & Generate BOL
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

