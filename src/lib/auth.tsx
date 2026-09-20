import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "buyer" | "seller" | "admin";

export interface AppUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    businessName?: string;
    location?: string;
    phone?: string;
    bio?: string;
    active: boolean;
}

interface AuthContextValue {
    user: AppUser | null;
    session: Session | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error?: string }>;
    register: (name: string, email: string, password: string, role: UserRole, businessName?: string) => Promise<{ error?: string; message?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(id: string): Promise<AppUser | null> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
    if (error || !data) return null;
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        businessName: data.business_name ?? undefined,
        location: data.location ?? undefined,
        phone: data.phone ?? undefined,
        bio: data.bio ?? undefined,
        active: data.active ?? true,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async (supabaseUser: SupabaseUser | null) => {
        if (!supabaseUser) {
            setUser(null);
            setSession(null);
            setLoading(false);
            return;
        }
        const profile = await fetchProfile(supabaseUser.id);
        setUser(profile);
        setLoading(false);
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            loadUser(data.session?.user ?? null);
        });

        // Listen for auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            loadUser(newSession?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ error?: string }> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        const profile = data.user ? await fetchProfile(data.user.id) : null;
        if (!profile) {
            await supabase.auth.signOut();
            return { error: "Your account profile is not ready. Ask an administrator to run the latest Supabase schema." };
        }
        if (!profile.active) {
            await supabase.auth.signOut();
            return { error: "This account is inactive. Contact an administrator." };
        }
        return {};
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        role: UserRole,
        businessName?: string
    ): Promise<{ error?: string; message?: string }> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role, business_name: businessName ?? null },
            },
        });
        if (error) return { error: error.message };

        if (!data.user) return { error: "Supabase did not create the account. Please try again." };
        if (!data.session) {
            return { message: "Account created. Check your email to confirm it, then sign in." };
        }
        return { message: "Account created successfully." };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const refreshUser = async () => {
        if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            setUser(profile);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
