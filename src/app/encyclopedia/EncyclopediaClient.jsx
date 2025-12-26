"use client";

import { Activity, Cpu, Search, Zap, Filter, Grid, List } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            damping: 12
        },
    },
};

export default function EncyclopediaClient() {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Microcontrollers", "Sensors", "Power", "Discrete", "Connectors"];

    useEffect(() => {
        async function fetchComponents() {
            setLoading(true);
            try {
                const query = searchTerm
                    ? `?search=${encodeURIComponent(searchTerm)}`
                    : "";
                const res = await fetch(`/api/encyclopedia${query}`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    setComponents(data);
                } else if (data.success) {
                    setComponents(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch components", error);
            } finally {
                setLoading(false);
            }
        }

        const timeoutId = setTimeout(() => {
            fetchComponents();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const filteredComponents = activeCategory === "All"
        ? components
        : components.filter(c => c.category === activeCategory);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 relative"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />

                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-white to-neon-blue neon-text-subtle tracking-tight relative z-10">
                    Component Encyclopedia
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
                    The comprehensive database of electronic components, symbols, and specifications.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto mb-10 group z-20">
                    <div className="absolute inset-0 bg-neon-green/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                        <Search className="h-6 w-6 text-gray-400 group-focus-within:text-neon-green transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-14 pr-4 py-5 border border-white/10 rounded-2xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:bg-black/80 focus:ring-1 focus:ring-neon-green/50 focus:border-neon-green/50 sm:text-lg transition-all duration-300 backdrop-blur-md shadow-2xl relative z-10"
                        placeholder="Search components (e.g., 555 Timer, ATmega328)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Categories / Filters */}
                <div className="flex flex-wrap justify-center gap-3 relative z-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategory === cat
                                    ? "bg-neon-green/10 text-neon-green border-neon-green/50 shadow-[0_0_15px_rgba(10,255,10,0.2)]"
                                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Grid Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="glass-panel h-72 rounded-2xl animate-pulse bg-white/5 border border-white/5"
                        ></div>
                    ))}
                </div>
            ) : filteredComponents.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 glass-panel rounded-3xl border border-white/5"
                >
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Cpu className="h-10 w-10 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No components found</h2>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredComponents.map((comp) => (
                            <motion.div
                                key={comp._id}
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="h-full"
                            >
                                <Link href={`/encyclopedia/${comp._id}`} className="block h-full">
                                    <div className="glass-panel rounded-2xl p-6 h-full border border-white/5 hover:border-neon-green/30 group relative overflow-hidden transition-colors duration-300 bg-gradient-to-b from-white/5 to-transparent">
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 group-hover:border-neon-green/50 transition-colors flex items-center justify-center shadow-lg">
                                                <Zap className="h-6 w-6 text-gray-400 group-hover:text-neon-green transition-colors" />
                                            </div>
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5 group-hover:border-neon-green/20 group-hover:text-neon-green transition-colors">
                                                {comp.category || 'Component'}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-green transition-colors truncate relative z-10">
                                            {comp.name}
                                        </h3>

                                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-4 relative z-10">
                                            {comp.description}
                                        </p>

                                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5 relative z-10">
                                            <div className="text-xs text-secondary-foreground flex items-center gap-1 group-hover:text-white transition-colors">
                                                Read Datasheet <Activity className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
