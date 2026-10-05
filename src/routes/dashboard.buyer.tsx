import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  Bell,
  User as UserIcon,
  Package,
  Loader2,
  Truck,
  FileText,
  DollarSign,
  CreditCard,
  MapPin,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Scale,
  MessageSquare
} from "lucide-react";
import { DigitalBolModal } from "@/components/DigitalBolModal";
import { OrderChatModal } from "@/components/OrderChatModal";
import {
  getRequestsByBuyer,
  getTransactionsByBuyer,
  getNotificationsByUser,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
  updateProfile,
  type BuyerRequest,
  type Transaction,
  type Notification,
} from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/buyer")({
  head: () => ({ meta: [{ title: "Buyer Dashboard — Encorb USA" }] }),
  component: BuyerDashboard,
});

type Tab = "overview" | "requests" | "transactions" | "logistics" | "notifications" | "profile";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  cancelled: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  pickup_scheduled: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  in_transit: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  delivered: "bg-teal-500/10 text-teal-600 border-teal-500/20",
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

function BuyerDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    business_name: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [bolModalData, setBolModalData] = useState<any | null>(null);
  const [activeChatOrder, setActiveChatOrder] = useState<any | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const handleUrlTab = () => {
      const params = new URLSearchParams(window.location.search);
      const queryTab = params.get("tab") as Tab | null;
      if (
        queryTab &&
        ["overview", "requests", "transactions", "logistics", "notifications", "profile"].includes(queryTab)
      ) {
        setTab(queryTab);
      }
    };
    handleUrlTab();
    window.addEventListener("popstate", handleUrlTab);
    return () => window.removeEventListener("popstate", handleUrlTab);
  }, []);

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.replaceState(null, "", url.toString());
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const [reqs, txns, notifs] = await Promise.all([
        getRequestsByBuyer(user.id),
        getTransactionsByBuyer(user.id),
        getNotificationsByUser(user.id),
      ]);
      setRequests(reqs || []);
      setTransactions(txns || []);
      setNotifications(notifs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role !== "buyer") {
      navigate({ to: user.role === "seller" ? "/dashboard/seller" : "/dashboard/admin" });
      return;
    }
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      location: user.location ?? "",
      bio: user.bio ?? "",
      business_name: user.business_name ?? "",
    });
    refresh();

    // Realtime notifications
    const unsub = subscribeToNotifications(user.id, (n) => {
      setNotifications((prev) => [n, ...prev]);
    });
    return () => {
      unsub();
    };
  }, [user]);

  if (!user || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const pendingReqs = requests.filter((r) => r.status === "pending").length;
  const activeTxns = transactions.filter((t) => !["completed", "cancelled"].includes(t.status)).length;
  const totalSpend = transactions.reduce((acc, t) => acc + (t.total || 0), 0);
  const unread = notifications.filter((n) => !n.read).length;

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(user.id, {
      name: profileData.name,
      phone: profileData.phone,
      location: profileData.location,
      bio: profileData.bio,
      business_name: profileData.business_name,
    });
    await refreshUser();
    setProfileSaved(true);
    toast.success("Profile saved successfully");
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "requests", label: "RFQs & Bids", icon: Clock, badge: pendingReqs },
    { id: "transactions", label: "Orders & Escrow", icon: CheckCircle, badge: activeTxns },
    { id: "logistics", label: "Freight & BOL Tracking", icon: Truck },
    { id: "notifications", label: "Alerts", icon: Bell, badge: unread },
    { id: "profile", label: "Facility Profile", icon: UserIcon },
  ];

  const isNewUser =
    (typeof window !== "undefined" && localStorage.getItem(`encorb_is_new_user_${user.id}`) === "true") ||
    (transactions.length === 0 && requests.length === 0);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600">
                {isNewUser ? "New Member • Verified Buyer" : "Verified Commercial Buyer"}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground mt-1">
              {isNewUser ? "Welcome" : "Welcome back"}, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {user.business_name || "Commercial Recycling & Processing Facility"} • {user.location || "United States"}
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm self-start md:self-auto"
          >
            Browse Live Marketplace <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-sm no-scrollbar">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
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
            {/* Top Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Pending Requests</span>
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{pendingReqs}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting seller response</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Active Orders</span>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{activeTxns}</p>
                <p className="text-xs text-muted-foreground mt-1">In escrow / transit</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Total Traded (USD)</span>
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">
                  ${totalSpend.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Across all completed orders</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Escrow Protection</span>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-display text-2xl font-extrabold text-emerald-600">100% Guaranteed</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {transactions.length === 0 ? "Ready for your first settlement" : "FDIC-insured settlement"}
                </p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-foreground">Active Orders & Freight Dispatches</h3>
                <button
                  onClick={() => switchTab("transactions")}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  View All ({transactions.length})
                </button>
              </div>

              {transactions.length === 0 ? (
                <EmptyState
                  icon={Package}
                  label="No active transactions yet"
                  action={
                    <Link
                      to="/marketplace"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                    >
                      Explore live lots
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-border/80 bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-600">{t.id}</span>
                          <StatusBadge status={t.status} />
                        </div>
                        <p className="font-bold text-sm text-foreground mt-1">{t.listing_title}</p>
                        <p className="text-xs text-muted-foreground">
                          Seller: {t.seller_name} • Route: {t.location || "Domestic US"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                        <div>
                          <p className="font-display font-extrabold text-foreground text-base">
                            ${t.total.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.quantity.toLocaleString()} {t.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => setTab("logistics")}
                          className="rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                        >
                          Track Load
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REQUESTS & BIDS */}
        {tab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Purchase Inquiries & Active Bids</h2>
              <span className="text-xs text-muted-foreground">{requests.length} Total Submissions</span>
            </div>

            {requests.length === 0 ? (
              <EmptyState icon={Clock} label="You haven't submitted any purchase orders or RFQs yet." />
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                          <StatusBadge status={r.status} />
                        </div>
                        <Link
                          to="/listing/$id"
                          params={{ id: r.listing_id }}
                          className="font-display font-bold text-base text-foreground hover:text-emerald-600 transition-colors mt-1 block"
                        >
                          {r.listing_title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">Seller: {r.seller_name}</p>
                        {r.message && (
                          <p className="mt-2 text-xs text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                            <strong>Note:</strong> {r.message}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Requested Volume</span>
                        <p className="font-display font-extrabold text-foreground text-sm">
                          {r.quantity.toLocaleString()} {r.unit || "units"}
                        </p>
                        {r.offered_price && (
                          <p className="text-xs text-emerald-600 font-bold mt-0.5">
                            Offer: ${r.offered_price}/{r.unit || "unit"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>Submitted on {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <div className="flex items-center gap-3">
                        {r.status === "accepted" && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveChatOrder({
                                id: r.id,
                                title: r.listing_title,
                                buyerName: user.name,
                                sellerName: r.seller_name,
                                status: r.status,
                                quantity: r.quantity,
                                unit: r.unit,
                              })
                            }
                            className="flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-500 transition"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Chat with Supplier
                          </button>
                        )}
                        <Link
                          to="/listing/$id"
                          params={{ id: r.listing_id }}
                          className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                        >
                          View Lot <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRANSACTIONS & ESCROW */}
        {tab === "transactions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Commercial Orders & Settlement</h2>
              <span className="text-xs text-muted-foreground">{transactions.length} Total Orders</span>
            </div>

            {transactions.length === 0 ? (
              <EmptyState icon={Package} label="No completed or active orders found." />
            ) : (
              <div className="space-y-4">
                {transactions.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">{t.id}</span>
                          <StatusBadge status={t.status} />
                          {t.bol_number && (
                            <span className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                              {t.bol_number}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-base text-foreground mt-1">
                          {t.listing_title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Supplier: <strong>{t.seller_name}</strong> • Destination Route: {t.location || "US Domestic"}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">Settlement Value</span>
                        <p className="font-display text-2xl font-extrabold text-foreground">
                          ${t.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.quantity.toLocaleString()} {t.unit} @ ${t.price}/{t.unit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        Order Placed: {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveChatOrder({
                              id: t.id,
                              title: t.listing_title,
                              buyerName: user.name,
                              sellerName: t.seller_name,
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
                          Message Supplier
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
                              buyerName: user?.name || "Corporate Scrap Buyer",
                              sellerName: t.seller_name || "Encorb Verified Generator",
                              originLocation: t.location || "Houston, TX",
                              destinationLocation: "Designated Receiving Mill Terminal",
                              carrierName: t.carrier_name || "Schneider National Logistics",
                              trackingNumber: t.bol_number || `ENC-BOL-${t.id.substring(0, 6)}`,
                              status: t.status,
                              createdDate: new Date(t.created_at).toLocaleDateString("en-US")
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted"
                        >
                          <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                          View e-BOL & Scale Slip
                        </button>
                        <button
                          onClick={() => setTab("logistics")}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 font-bold text-slate-950 hover:bg-emerald-400"
                        >
                          Logistics Progress
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LOGISTICS & BOL TRACKING */}
        {tab === "logistics" && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Freight & Dispatch Tracking</h2>

            {transactions.length === 0 ? (
              <EmptyState icon={Truck} label="No active shipments currently in transit." />
            ) : (
              <div className="space-y-6">
                {transactions.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                      <div>
                        <span className="text-xs font-mono text-emerald-600 font-bold">{t.id}</span>
                        <h3 className="font-display font-bold text-base text-foreground mt-0.5">
                          {t.listing_title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Carrier: <strong>{t.carrier_name || "FreightQuote Dedicated"}</strong> • BOL: {t.bol_number || "Pending"}
                        </p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>

                    {/* Progress step visual */}
                    <div className="py-6">
                      <div className="grid grid-cols-5 gap-2 text-center text-xs">
                        {[
                          { title: "Order Confirmed", done: true },
                          { title: "COA Inspection", done: (t.tracking_step || 1) >= 2 },
                          { title: "Carrier Dispatched", done: (t.tracking_step || 1) >= 3 },
                          { title: "In-Transit", done: (t.tracking_step || 1) >= 4 },
                          { title: "Delivered & Verified", done: t.status === "completed" || (t.tracking_step || 1) >= 5 },
                        ].map((step, idx) => (
                          <div key={step.title} className="flex flex-col items-center">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                                step.done
                                  ? "bg-emerald-500 text-slate-950 shadow-md"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.done ? "✓" : idx + 1}
                            </div>
                            <span className={`text-[11px] font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                              {step.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3.5 rounded-xl border border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span>Dispatch Hub: <strong>{t.location}</strong></span>
                        <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle className="h-3 w-3" /> NTEP Weigh Scale Certificate Attached
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveChatOrder({
                              id: t.id,
                              title: t.listing_title,
                              buyerName: user.name,
                              sellerName: t.seller_name,
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
                          Dispatch Chat
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
                              buyerName: user?.name || "Corporate Scrap Buyer",
                              sellerName: t.seller_name || "Encorb Verified Generator",
                              originLocation: t.location || "Houston, TX",
                              destinationLocation: "Designated Receiving Mill Terminal",
                              carrierName: t.carrier_name || "Schneider National Logistics",
                              trackingNumber: t.bol_number || `ENC-BOL-${t.id.substring(0, 6)}`,
                              status: t.status,
                              createdDate: new Date(t.created_at).toLocaleDateString("en-US")
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 font-bold text-foreground hover:bg-muted transition"
                        >
                          <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                          Inspect Electronic BOL & Weigh Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {tab === "notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Notifications & Alerts</h2>
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
              <EmptyState icon={Bell} label="No notifications yet." />
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

        {/* TAB 6: FACILITY PROFILE */}
        {tab === "profile" && (
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Commercial Buyer Profile</h2>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 text-2xl font-extrabold font-display">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{user.name}</h3>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 mt-1 inline-block">
                    Verified Commercial Buyer
                  </span>
                </div>
              </div>

              {profileSaved && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-600 font-bold">
                  <CheckCircle className="h-4 w-4" /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Business / Facility Name</label>
                    <input
                      type="text"
                      value={profileData.business_name}
                      onChange={(e) => setProfileData((p) => ({ ...p, business_name: e.target.value }))}
                      placeholder="e.g., EcoExtrusions Ohio LLC"
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full rounded-xl border border-input bg-muted/50 p-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Plant / Receiving Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g., Columbus, OH (Zip 43215)"
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-medium focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Facility Description & Material Needs</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Describe your processing capacities, extrusion lines, or monthly feedstock requirements..."
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-medium focus:border-emerald-600 focus:outline-none resize-none"
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
                    className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-sm"
                  >
                    Save Facility Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

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
            role: "buyer",
          }}
        />
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  label,
  action,
}: {
  icon: typeof Clock;
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <Icon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
      <p className="font-semibold text-foreground text-sm">{label}</p>
      {action}
    </div>
  );
}

