"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                alert("Check your email for the confirmation link! (Check spam folder if not found)");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
                router.refresh();
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center p-6">
            <GlassCard glow className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Sparkles className="mx-auto mb-4 text-[var(--accent-primary)]" size={48} />
                    <h1 className="text-3xl font-bold text-glow">QuantumPlanner</h1>
                    <p className="text-[var(--text-secondary)] mt-2">
                        {isSignUp ? "Create your account" : "Welcome back"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <NeonButton type="submit" className="w-full" disabled={loading}>
                        {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                    </NeonButton>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                    >
                        {isSignUp
                            ? "Already have an account? Sign in"
                            : "Don't have an account? Sign up"}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
}
