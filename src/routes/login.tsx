import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Recycle, AlertCircle } from "lucide-react";
import { useAuth, type UserRole } from "@/lib/auth";

export const Route = createFileRoute("/login")({
    head: () => ({ meta: [{ title: "Login — Encorb" }] }),
    component: LoginPage,
});

const DEMO_ACCOUNTS = [
    { role: "Buyer", email: "buyer@gmail.com", password: "123456", color: "bg-green-50 text-green-700 border-green-200" },
    { role: "Seller", email: "encorbweb@gmail.com", password: "123456", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { role: "Admin", email: "admin@gmail.com", password: "encorb@@123", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

function LoginPage() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Already logged in
    if (user) {
        const to = user.role === "buyer" ? "/dashboard/buyer" : user.role === "seller" ? "/dashboard/seller" : "/dashboard/admin";
        navigate({ to });
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.error) { setError(result.error); return; }
        navigate({ to: "/dashboard" });
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center flex flex-col items-center">
                    <img src="/logo.png" alt="Encorb" className="h-12 md:h-16 w-auto object-contain mb-3" />
                    <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="mt-1 text-muted-foreground">Sign in to your Encorb account</p>
                </div>

                {/* Demo accounts */}
                <div className="mb-6 rounded-xl border border-border bg-white p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick demo login</p>
                    <div className="grid grid-cols-3 gap-2">
                        {DEMO_ACCOUNTS.map((a) => (
                            <button
                                key={a.role}
                                onClick={() => { setEmail(a.email); setPassword(a.password); setError(""); }}
                                className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-all hover:scale-105 ${a.color}`}
                            >
                                {a.role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-brand hover:underline">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
