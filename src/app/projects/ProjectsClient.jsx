"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageSquare, Share2, Eye, CircuitBoard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECTS = [
    {
        id: 1,
        title: "Arduino Weather Station",
        author: "Alex Chen",
        image:
            "https://images.unsplash.com/photo-1555664424-778a69022365?w=800&auto=format&fit=crop&q=60",
        likes: 124,
        views: 1205,
        tags: ["Arduino", "IoT", "Sensors"],
    },
    {
        id: 2,
        title: "DIY Bluetooth Speaker",
        author: "Sarah Jones",
        image:
            "https://images.unsplash.com/photo-1558403194-611308249627?w=800&auto=format&fit=crop&q=60",
        likes: 89,
        views: 850,
        tags: ["Audio", "Bluetooth", "PCB"],
    },
    {
        id: 3,
        title: "Solar Charge Controller",
        author: "Mike Ross",
        image:
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60",
        likes: 256,
        views: 3400,
        tags: ["Power", "Solar", "MPPT"],
    },
    {
        id: 4,
        title: "Home Automation Hub",
        author: "Emily White",
        image:
            "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=60",
        likes: 167,
        views: 1900,
        tags: ["ESP32", "Home Assistant", "WiFi"],
    },
];

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

export default function ProjectsClient() {
    const [projects, setProjects] = useState(PROJECTS);
    const [filter, setFilter] = useState("All");

    const categories = ["All", "Arduino", "ESP32", "Power", "Audio"];

    const handleLike = (id) => {
        setProjects(
            projects.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)),
        );
    };

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => p.tags.some(tag => tag.includes(filter)));

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 relative"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none" />

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight relative z-10">
                    Community <span className="text-neon-pink neon-text-subtle">Projects</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 relative z-10">
                    Discover amazing projects built by the ElecZen community.
                </p>

                {/* Filter Pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${filter === cat
                                ? "bg-neon-pink/20 text-neon-pink border-neon-pink/50 shadow-[0_0_20px_rgba(255,0,128,0.3)]"
                                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-purple-600 text-white font-bold hover:shadow-[0_0_25px_rgba(255,0,128,0.4)] transition-all border border-white/10 relative z-10 flex items-center gap-2 mx-auto"
                >
                    <CircuitBoard className="w-5 h-5" />
                    Submit Your Project
                </motion.button>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <Link href={`/design?project_id=${project.id}`} key={project.id} className="block h-full">
                            <motion.div
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-neon-pink/30 transition-all group relative bg-gradient-to-b from-white/5 to-transparent h-full cursor-pointer"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                                {/* Image Section */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    {/* Action Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                                        <span className="px-6 py-2 rounded-full bg-neon-pink text-white text-sm font-bold shadow-[0_0_20px_rgba(255,0,128,0.4)] transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            Open Project
                                        </span>
                                    </div>

                                    {/* Tags on Image */}
                                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-neon-pink text-xs font-bold border border-neon-pink/20"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-pink transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                                            {project.author[0]}
                                        </span>
                                        by <span className="text-gray-300">{project.author}</span>
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleLike(project.id);
                                                }}
                                                className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors group/like relative z-20"
                                            >
                                                <Heart className="w-4 h-4 group-hover/like:fill-red-500 transition-all" />
                                                <span className="text-xs font-medium">{project.likes}</span>
                                            </button>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Eye className="w-4 h-4" />
                                                <span className="text-xs font-medium">{project.views}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => e.preventDefault()}
                                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full relative z-20"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => e.preventDefault()}
                                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full relative z-20"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
