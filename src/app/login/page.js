"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Github, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 relative z-10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4 border border-white/10 shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:scale-110 transition-transform duration-300 group"
          >
            <Zap className="w-8 h-8 text-neon-blue group-hover:text-white transition-colors" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to access your circuits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {success && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center animate-fade-in">
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-neon-blue hover:text-white transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all hover:bg-white/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.3)] text-sm font-bold text-black bg-gradient-to-r from-neon-blue to-cyan-400 hover:from-white hover:to-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <>
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
              <Github className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
              <span className="font-bold text-gray-400 group-hover:text-white transition-colors">
                G
              </span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-neon-blue hover:text-white transition-colors underline decoration-neon-blue/30 hover:decoration-white"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
