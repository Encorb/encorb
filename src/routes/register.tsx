import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Recycle, AlertCircle } from "lucide-react";
import { useAuth, type UserRole } from "@/lib/auth";

export const Route = createFileRoute("/register")({
    head: () => ({ meta: [{ title: "Register — Encorb" }] }),
    component: RegisterPage,
});

function RegisterPage() {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" as UserRole, businessName: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (user) {
        const to = user.role === "buyer" ? "/dashboard/buyer" : user.role === "seller" ? "/dashboard/seller" : "/dashboard/admin";
        navigate({ to });
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (form.role === "seller" && !form.businessName.trim()) { setError("Business name is required for sellers."); return; }
        setLoading(true);
        const result = await register(form.name, form.email, form.password, form.role, form.businessName || undefined);
        setLoading(false);
        if (result.error) { setError(result.error); return; }
        setMessage(result.message ?? "Account created. You can now sign in.");
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center flex flex-col items-center">
                    <img src="/logo.png" alt="Encorb" className="h-12 md:h-16 w-auto object-contain mb-3" />
                    <h1 className="font-display text-2xl font-bold text-foreground">Create your account</h1>
                    <p className="mt-1 text-muted-foreground">Join Encorb's waste marketplace</p>
                </div>

                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>
                    )}

                    {/* Role selector */}
                    <div className="mb-5">
                        <p className="mb-2 text-sm font-medium text-foreground">I want to…</p>
                        <div className="grid grid-cols-2 gap-3">
                            {(["buyer", "seller"] as UserRole[]).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, role: r }))}
                                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold capitalize transition-all ${form.role === r ? "border-brand bg-brand/5 text-brand" : "border-border text-muted-foreground hover:border-brand/40"}`}
                                >
                                    {r === "buyer" ? "🛒 Buy materials" : "🏭 Sell materials"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                            <input id="reg-name" type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                        </div>
                        {form.role === "seller" && (
                            <div>
                                <label htmlFor="reg-biz" className="mb-1.5 block text-sm font-medium text-foreground">Business Name</label>
                                <input id="reg-biz" type="text" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} placeholder="Your company name" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                            <input id="reg-email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                        </div>
                        <div>
                            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                            <input id="reg-password" type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account…" : "Create account"}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
                    </p>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    By registering you agree to Encorb's Terms of Service.
                </p>
            </div>
        </div>
    );
}
