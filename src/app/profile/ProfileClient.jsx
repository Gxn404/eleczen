"use client";

import { motion } from "framer-motion";
import { CircuitBoard, LogOut, Settings, User, Zap, Activity, Cpu } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
};

export default function ProfileClient({ session }) {
    const user = session?.user;

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-64px)] p-4 md:p-8 max-w-7xl mx-auto pt-24">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Hero Section */}
                <motion.div
                    variants={itemVariants}
                    className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
                >
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <motion.div
                            className="relative group"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-1 shadow-[0_0_30px_rgba(188,19,254,0.3)] group-hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-shadow duration-500">
                                <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gray-900">
                                            {user.name?.[0] || "U"}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 p-2 rounded-full shadow-lg">
                                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_#0aff0a]" />
                            </div>
                        </motion.div>

                        <div className="text-center md:text-left flex-1 space-y-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                                    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">{user.name}</span>
                                </h1>
                                <p className="text-gray-400 text-lg">{user.email}</p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md flex items-center gap-2">
                                    <User className="w-3 h-3 text-neon-blue" />
                                    Member since {new Date().getFullYear()}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-sm text-neon-purple backdrop-blur-md shadow-[0_0_15px_rgba(188,19,254,0.1)] flex items-center gap-2">
                                    <Zap className="w-3 h-3" />
                                    Pro Plan
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[160px]">
                            <Link href="/settings" className="w-full">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white font-medium"
                                >
                                    <Settings className="w-4 h-4" /> Settings
                                </motion.button>
                            </Link>

                            <motion.button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all font-medium"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Circuits Created", value: "12", icon: CircuitBoard, color: "text-neon-blue", border: "border-neon-blue/20" },
                        { label: "Components Used", value: "145", icon: Cpu, color: "text-neon-purple", border: "border-neon-purple/20" },
                        { label: "Community Posts", value: "3", icon: Activity, color: "text-neon-green", border: "border-neon-green/20" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className={`glass-panel p-6 rounded-2xl border ${stat.border} relative overflow-hidden group`}
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500`}>
                                <stat.icon className={`w-24 h-24 ${stat.color}`} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-gray-400 font-medium">{stat.label}</span>
                                </div>
                                <div className="text-4xl font-bold text-white tracking-tight">
                                    {stat.value}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Projects Section */}
                <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <CircuitBoard className="text-neon-green w-6 h-6" />
                            Saved Circuits
                        </h2>
                        <button className="text-sm text-gray-400 hover:text-white transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/5 rounded-2xl p-6 border border-white/10 border-dashed flex flex-col items-center justify-center text-gray-500 hover:text-neon-blue hover:border-neon-blue/50 hover:bg-neon-blue/5 transition-all cursor-pointer min-h-[220px] group"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
                                <span className="text-4xl font-light mb-1">+</span>
                            </div>
                            <span className="font-medium group-hover:text-white transition-colors">Create New Circuit</span>
                        </motion.div>

                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02, translateY: -5 }}
                                className="bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-neon-green/30 transition-all cursor-pointer group"
                            >
                                <div className="h-32 bg-gradient-to-br from-gray-900 to-black rounded-xl mb-4 flex items-center justify-center border border-white/5 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(10,255,10,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <CircuitBoard className="w-12 h-12 text-gray-700 group-hover:text-neon-green transition-colors duration-300" />
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white text-lg group-hover:text-neon-green transition-colors">
                                        Untitled Circuit {i}
                                    </h3>
                                    <div className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400 border border-white/5">
                                        Draft
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Last edited 2 days ago
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
