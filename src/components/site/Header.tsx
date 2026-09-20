/**
 * New Header — light theme, auth-aware.
 * Shows Login/Register when logged out; user avatar + role + logout when logged in.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getNotificationsByUser } from "@/lib/store";

const NAV = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/materials", label: "Materials" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

function Wordmark() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 group shrink-0"
      aria-label="Encorb — Circular Materials Exchange, home"
    >
      <img
        src="/logo.png"
        alt="Encorb"
        className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
      />
    </Link>
  );
}

function getDashboardPath(role: string) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "seller") return "/dashboard/seller";
  return "/dashboard/buyer";
}

function getRoleBadgeColor(role: string) {
  if (role === "admin") return "bg-purple-100 text-purple-700";
  if (role === "seller") return "bg-blue-100 text-blue-700";
  return "bg-green-100 text-green-700";
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      getNotificationsByUser(user.id).then((notifs: any[]) => {
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      });
    } else {
      setUnreadCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-slate-200/90 bg-white/95 backdrop-blur-md shadow-md shadow-slate-900/5 py-2"
          : "border-slate-200/60 bg-white/90 backdrop-blur py-2"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-emerald-600 focus:px-3 focus:py-1.5 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-20 md:h-24 max-w-[1400px] items-center gap-8 px-4 md:px-8">
        <Wordmark />

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-2 lg:flex ml-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ "data-active": "true" }}
              className="rounded-xl px-4 py-2 text-base font-bold text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-700 data-[active=true]:text-emerald-700 data-[active=true]:bg-emerald-50 data-[active=true]:font-extrabold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {/* Notifications */}
              <Link
                to={getDashboardPath(user.role)}
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Dashboard */}
              <Link
                to={getDashboardPath(user.role)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-brand" />
                Dashboard
              </Link>

              {/* User pill */}
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs font-semibold leading-none text-foreground">{user.name}</p>
                  <span
                    className={cn(
                      "mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize",
                      getRoleBadgeColor(user.role)
                    )}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground border border-border hover:bg-muted transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-dark transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div id="mobile-nav" className="border-t border-border bg-white lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-[1400px] flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm font-medium text-foreground/85 hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <Link
                    to={getDashboardPath(user.role)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4 text-brand" />
                    Dashboard ({user.name})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
