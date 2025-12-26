"use client";

import Link from "next/link";
import {
    Plus,
    Search,
    Zap,
    BookOpen,
    Cpu,
    ArrowRight,
    Grid,
    Camera,
    Layers,
} from "lucide-react";
import { motion } from "framer-motion";

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

export default function Dashboard() {
    return (
        <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden selection:bg-neon-blue/30">
            {/* Background Ambience - Matches /tools page */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <div className="mb-16">
                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                        >
                            Welcome{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-cyan-400 to-white">
                                Back
                            </span>
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-gray-400 max-w-2xl leading-relaxed"
                        >
                            Your creative workspace is ready. What will you build today?
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Active Projects Section */}
                            <section>
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center gap-4 mb-8"
                                >
                                    <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                                        <Layers className="w-5 h-5 text-neon-blue" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Active Projects
                                    </h2>
                                    <Link
                                        href="/projects"
                                        className="ml-auto text-sm font-bold text-neon-blue hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        View All <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Create New Card */}
                                    <Link href="/design" className="group block h-full">
                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02 }}
                                            className="glass-panel h-full rounded-2xl p-6 hover:border-neon-blue/50 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10 flex flex-col h-full items-center justify-center text-center">
                                                <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-neon-blue/20">
                                                    <Plus className="w-8 h-8 text-neon-blue" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">
                                                    New Circuit
                                                </h3>
                                                <p className="text-sm text-gray-300 font-medium">
                                                    Start designing from scratch
                                                </p>
                                            </div>
                                        </motion.div>
                                    </Link>

                                    {/* Placeholder / Empty State */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[250px]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                                            <Zap className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-200 mb-1">
                                            No recent circuits
                                        </h3>
                                        <p className="text-sm text-gray-400 max-w-[200px] font-medium">
                                            Your latest projects will appear here for quick access
                                        </p>
                                    </motion.div>
                                </div>
                            </section>

                            {/* Quick Actions */}
                            <section>
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center gap-4 mb-8"
                                >
                                    <div className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                                        <Zap className="w-5 h-5 text-neon-purple" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Quick Actions
                                    </h2>
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        {
                                            href: "/tools/resistor",
                                            icon: Cpu,
                                            title: "Resistor Decoder",
                                            desc: "Calculate values instantly",
                                            color: "text-neon-purple",
                                            bg: "bg-neon-purple/10",
                                            border: "border-neon-purple/20",
                                        },
                                        {
                                            href: "/tools/scan",
                                            icon: Camera,
                                            title: "Scan Component",
                                            desc: "AI identification",
                                            color: "text-neon-pink",
                                            bg: "bg-neon-pink/10",
                                            border: "border-neon-pink/20",
                                        },
                                        {
                                            href: "/encyclopedia",
                                            icon: Search,
                                            title: "Encyclopedia",
                                            desc: "Search components",
                                            color: "text-neon-blue",
                                            bg: "bg-neon-blue/10",
                                            border: "border-neon-blue/20",
                                        },
                                        {
                                            href: "/projects",
                                            icon: Grid,
                                            title: "Community",
                                            desc: "Explore projects",
                                            color: "text-neon-green",
                                            bg: "bg-neon-green/10",
                                            border: "border-neon-green/20",
                                        },
                                    ].map((action, index) => (
                                        <Link
                                            href={action.href}
                                            key={action.title}
                                            className="group block h-full"
                                        >
                                            <motion.div
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:border-white/30 relative overflow-hidden h-full flex flex-col group-hover:shadow-lg border-white/10"
                                            >
                                                <div
                                                    className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mb-4 border ${action.border} group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    <action.icon
                                                        className={`w-6 h-6 ${action.color}`}
                                                    />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">
                                                    {action.title}
                                                </h3>
                                                <p className="text-sm text-gray-300 mb-6 flex-grow leading-relaxed font-medium">
                                                    {action.desc}
                                                </p>
                                                <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-white transition-colors mt-auto uppercase tracking-wider">
                                                    Open Tool{" "}
                                                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-8">
                            <motion.div
                                variants={itemVariants}
                                className="glass-panel rounded-2xl p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-neon-pink" /> Latest
                                        Insights
                                    </h2>
                                    <Link
                                        href="/blog"
                                        className="text-xs font-bold text-neon-blue hover:text-white uppercase tracking-wider transition-colors"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        {
                                            title: "Understanding MOSFETs in Power Electronics",
                                            date: "Nov 28",
                                            read: "5 min",
                                            cat: "Electronics",
                                        },
                                        {
                                            title: "Getting Started with ESP32 Development",
                                            date: "Nov 27",
                                            read: "8 min",
                                            cat: "Tutorial",
                                        },
                                        {
                                            title: "PCB Design Best Practices for 2025",
                                            date: "Nov 25",
                                            read: "12 min",
                                            cat: "Design",
                                        },
                                    ].map((post, i) => (
                                        <Link href="/blog" key={i} className="block group">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] uppercase font-bold text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded-full border border-neon-blue/20">
                                                        {post.cat}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-100 group-hover:text-white line-clamp-2 mb-2">
                                                    {post.title}
                                                </h4>
                                                <div className="text-xs text-gray-400 flex items-center gap-2 font-medium">
                                                    <span>{post.date}</span>
                                                    <span className="w-0.5 h-0.5 rounded-full bg-gray-500" />
                                                    <span>{post.read} read</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-neon-purple/10 to-transparent border-neon-purple/20"
                            >
                                <h3 className="text-lg font-bold text-white mb-2">Pro Tip</h3>
                                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                    Use keyboard shortcuts to speed up your design workflow. Press{" "}
                                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-xs">
                                        ?
                                    </kbd>{" "}
                                    to view all shortcuts.
                                </p>
                            </motion.div>
                        </aside>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
