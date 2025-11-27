'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-black z-[-1]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
            </div>

            <div className="glass-panel p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] max-w-lg w-full backdrop-blur-xl relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-black rounded-full flex items-center justify-center border border-white/10 shadow-xl">
                    <span className="text-4xl">⚡</span>
                </div>

                <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink mb-2 mt-8">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>

                <p className="text-gray-400 mb-8 leading-relaxed">
                    The circuit you're looking for seems to be disconnected or doesn't exist.
                    Let's get you back to the main grid.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-neon-blue text-black font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2 group">
                            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Return Home
                        </button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
