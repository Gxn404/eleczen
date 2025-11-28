"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                // Redirect to verify page with email param after short delay
                setTimeout(() => {
                    router.push(`/verify-email?email=${encodeURIComponent(email)}&mode=reset`);
                }, 2000);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 relative z-10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="mb-6">
                    <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-gray-400">Enter your email to receive a verification code</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all hover:bg-white/10"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.3)] text-sm font-bold text-black bg-gradient-to-r from-neon-blue to-cyan-400 hover:from-white hover:to-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Verification Code"}
                    </button>
                </form>
            </div>
        </div>
    );
}
