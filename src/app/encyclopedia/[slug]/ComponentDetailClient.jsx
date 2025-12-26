"use client";

import { Activity, Download, ExternalLink, Zap, Image as ImageIcon, FileText, Cpu, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

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
            type: "spring", stiffness: 100
        },
    },
};

export default function ComponentDetailClient({ component }) {
    const [activeTab, setActiveTab] = useState("specs");

    if (!component) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden group">
                        {/* Ambient Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                            <Zap className="w-64 h-64 text-neon-green" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30 text-sm font-mono tracking-wide shadow-[0_0_15px_rgba(10,255,10,0.1)]">
                                    {component.category}
                                </span>
                                {component.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 text-gray-400 text-sm border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 neon-text-subtle tracking-tight">
                                {component.name}
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl font-light">
                                {component.description}
                            </p>
                        </div>
                    </motion.div>

                    {/* Details / Specs Tabs */}
                    <motion.div variants={itemVariants} className="glass-panel p-1 rounded-2xl border border-white/10 bg-black/40 inline-flex">
                        {['specs', 'description', 'simulation'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all relative ${activeTab === tab
                                        ? "text-black font-bold"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-neon-green rounded-xl shadow-[0_0_15px_rgba(10,255,10,0.4)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 capitalize">{tab}</span>
                            </button>
                        ))}
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10 min-h-[400px]">
                        {activeTab === 'specs' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                                    <Activity className="w-6 h-6 text-neon-blue" />
                                    Technical Specifications
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {component.specifications && Object.entries(component.specifications).map(([key, value], i) => (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-default"
                                        >
                                            <span className="text-gray-400 font-medium">{key}</span>
                                            <span className="text-white font-mono bg-black/30 px-2 py-1 rounded text-sm">{value}</span>
                                        </motion.div>
                                    ))}
                                    {(!component.specifications || Object.keys(component.specifications).length === 0) && (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                            <FileText className="w-12 h-12 mb-4 opacity-50" />
                                            <span>No specifications available for this component.</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'description' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h2 className="text-2xl font-bold text-white mb-4">Detailed Description</h2>
                                <div className="prose prose-invert max-w-none text-gray-300">
                                    <p>{component.description}</p>
                                    {/* Placeholder for more extended description if available */}
                                    <p className="mt-4 text-gray-400 text-sm italic">
                                        Additional functional details, application notes, and operational limits would appear here in a full production environment.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'simulation' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center justify-center h-full py-12"
                            >
                                <Cpu className="w-16 h-16 text-gray-600 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2">Simulation Model</h3>
                                <p className="text-gray-400 text-center max-w-md mb-8">
                                    Interactive SPICE simulation for this component is currently under development.
                                </p>
                                <button className="px-6 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/10">
                                    Request Model
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar Column */}
                <motion.div variants={itemVariants} className="space-y-8">
                    {/* Pinout Image */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-neon-purple" />
                            Pinout Diagram
                        </h3>
                        <div className="aspect-square rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/10 relative group">
                            <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
                            {component.pinoutImage ? (
                                <img
                                    src={component.pinoutImage}
                                    alt={`${component.name} pinout`}
                                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="text-center p-6 flex flex-col items-center">
                                    <Zap className="w-16 h-16 text-gray-800 mb-3" />
                                    <span className="text-gray-600 text-sm font-medium">No diagram available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resources Actions */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
                        <div className="space-y-3">
                            {component.datasheetUrl ? (
                                <a
                                    href={component.datasheetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-neon-green text-black font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(10,255,10,0.3)] hover:shadow-[0_0_30px_rgba(10,255,10,0.5)] group"
                                >
                                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                    Download Datasheet
                                </a>
                            ) : (
                                <button disabled className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/5 text-gray-500 font-bold border border-white/5 cursor-not-allowed">
                                    Datasheet Unavailable
                                </button>
                            )}

                            <button className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10 group">
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                Find Distributors
                            </button>
                        </div>
                    </div>

                    {/* Similar Components Placeholder */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Related</h3>
                            <Link href="/encyclopedia" className="text-xs text-neon-blue hover:text-white transition-colors flex items-center">
                                View All <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-white/5 group-hover:border-neon-blue/30">
                                        <Zap className="w-5 h-5 text-gray-600 group-hover:text-neon-blue transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-200 group-hover:text-white">Related Part {i}</div>
                                        <div className="text-xs text-gray-500">Category</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
