'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden bg-black text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-blue/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-pink/10 rounded-full blur-[100px] opacity-30" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] max-w-lg w-full backdrop-blur-xl relative z-10"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#0A0A0A] rounded-full flex items-center justify-center border border-white/10 shadow-xl group"
                >
                    <Zap className="w-10 h-10 text-neon-blue group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink mb-2 mt-8 drop-shadow-2xl"
                >
                    404
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-6"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-400 mb-8 leading-relaxed text-base sm:text-lg"
                >
                    The circuit you're looking for seems to be disconnected or doesn't exist.
                    Let's get you back to the main grid.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-8 py-3 rounded-xl bg-neon-blue text-black font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Return Home
                        </motion.button>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/5 text-white font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
}
