import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Package,
  ArrowLeftRight,
  LayoutDashboard,
  Trash2,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
  Loader2,
  ShieldCheck,
  Building2,
  FileCheck
} from "lucide-react";
import {
  getAllProfiles,
  updateProfile,
  getListings,
  updateListing,
  deleteListing,
  getAllTransactions,
  type Profile,
  type Listing,
  type Transaction,
} from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "Admin Oversight & Compliance — Encorb USA" }] }),
  component: AdminDashboard,
});

type Tab = "overview" | "users" | "listings" | "transactions";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [profs, lsts, txns] = await Promise.all([
      getAllProfiles(),
      getListings(),
      getAllTransactions(),
    ]);
    setProfiles(profs);
    setListings(lsts);
    setTransactions(txns);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role !== "admin") {
      navigate({ to: user.role === "seller" ? "/dashboard/seller" : "/dashboard/buyer" });
      return;
    }
    refresh();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const totalRevenue = transactions.reduce((s, t) => s + (t.total || 0), 0);

  const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Exchange Oversight", icon: LayoutDashboard },
    { id: "users", label: "US Facilities & Users", icon: Users },
    { id: "listings", label: "Commodity Lots", icon: Package },
    { id: "transactions", label: "Escrow & Settlements", icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Header Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-3 py-0.5 text-xs font-bold text-purple-600">
                Administrator Access
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground mt-1">
              Encorb USA Platform Oversight
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Auditing US recycler onboarding, ISRI lot compliance, and FDIC escrow transactions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/10"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-sm no-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                tab === id
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Registered Facilities</span>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{profiles.length}</p>
                <p className="text-xs text-muted-foreground mt-1">US Buyers, Mills & MRFs</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Active Lots</span>
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{listings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Live auctions & contracts</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Total Trades</span>
                  <ArrowLeftRight className="h-5 w-5 text-purple-500" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{transactions.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Executed purchase orders</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-semibold uppercase">Settled Volume (USD)</span>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total traded commodity volume</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase">Verified Commercial Buyers</p>
                <p className="font-display text-3xl font-extrabold text-emerald-600 mt-2">
                  {profiles.filter((u) => u.role === "buyer").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Extruders, Mills & Converters</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase">Industrial Material Suppliers</p>
                <p className="font-display text-3xl font-extrabold text-blue-600 mt-2">
                  {profiles.filter((u) => u.role === "seller").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">MRFs, Scrap Yards & Scrap Yards</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase">Compliance Officers</p>
                <p className="font-display text-3xl font-extrabold text-purple-600 mt-2">
                  {profiles.filter((u) => u.role === "admin").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Platform Operations</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {tab === "users" && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Registered Facility Directory</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="min-w-full divide-y divide-border text-xs">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground font-semibold">
                    <th className="px-4 py-3 text-left">Facility Contact</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {profiles.map((p) => (
                    <tr key={p.id} className={`hover:bg-muted/20 ${!p.active ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-foreground">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                      <td className="px-4 py-3">
                        <span className="capitalize font-bold text-emerald-600">{p.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            p.active ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                          }`}
                        >
                          {p.active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.id !== user.id && (
                          <button
                            onClick={async () => {
                              await updateProfile(p.id, { active: !p.active });
                              toast.success("User status updated");
                              await refresh();
                            }}
                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            {p.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                            {p.active ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LISTINGS */}
        {tab === "listings" && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Exchange Material Lots</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="min-w-full divide-y divide-border text-xs">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground font-semibold">
                    <th className="px-4 py-3 text-left">Material Title</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Price (USD)</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-semibold text-foreground max-w-[200px] truncate">{l.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.seller_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {l.quantity.toLocaleString()} {l.unit}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        ${l.price}/{l.unit}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-600">
                          {l.is_auction ? "Auction" : "Fixed"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDeleteConfirm(l.id)}
                          className="text-rose-600 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTIONS */}
        {tab === "transactions" && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">All Exchange Settlements</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="min-w-full divide-y divide-border text-xs">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground font-semibold">
                    <th className="px-4 py-3 text-left">Contract ID</th>
                    <th className="px-4 py-3 text-left">Material Lot</th>
                    <th className="px-4 py-3 text-left">Buyer</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Volume</th>
                    <th className="px-4 py-3 text-left">Total (USD)</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-emerald-600 font-bold">{t.id}</td>
                      <td className="px-4 py-3 font-semibold text-foreground max-w-[160px] truncate">{t.listing_title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.buyer_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.seller_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {t.quantity.toLocaleString()} {t.unit}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        ${t.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize font-semibold text-emerald-600">{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Lot Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl text-foreground">
            <h3 className="font-display text-lg font-bold">Admin Delete Lot</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Are you sure you want to remove this lot from the exchange?
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
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

