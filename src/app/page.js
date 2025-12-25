"use client";

import Link from "next/link";
import {
    Plus, Search, Zap, BookOpen, Cpu, ArrowRight,
    Grid, Camera, Activity, Layers
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const QuickActionCard = ({ href, icon: Icon, title, description, color }) => {
    const colorMap = {
        purple: "text-neon-purple bg-neon-purple/10 border-neon-purple/20 group-hover:bg-neon-purple/20 group-hover:shadow-[0_0_20px_rgba(188,19,254,0.3)]",
        pink: "text-neon-pink bg-neon-pink/10 border-neon-pink/20 group-hover:bg-neon-pink/20 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]",
        blue: "text-neon-blue bg-neon-blue/10 border-neon-blue/20 group-hover:bg-neon-blue/20 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]",
        green: "text-neon-green bg-neon-green/10 border-neon-green/20 group-hover:bg-neon-green/20 group-hover:shadow-[0_0_20px_rgba(10,255,10,0.3)]",
    };

    const gradientMap = {
        purple: "from-[#0A0A0A] to-neon-purple/5 hover:to-neon-purple/10",
        pink: "from-[#0A0A0A] to-neon-pink/5 hover:to-neon-pink/10",
        blue: "from-[#0A0A0A] to-neon-blue/5 hover:to-neon-blue/10",
        green: "from-[#0A0A0A] to-neon-green/5 hover:to-neon-green/10",
    };

    const borderColorMap = {
        purple: "group-hover:border-neon-purple/50",
        pink: "group-hover:border-neon-pink/50",
        blue: "group-hover:border-neon-blue/50",
        green: "group-hover:border-neon-green/50",
    };

    return (
        <Link href={href} className="block h-full">
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`group h-full bg-gradient-to-br ${gradientMap[color] || gradientMap.blue} backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 transition-all duration-300 ${borderColorMap[color] || borderColorMap.blue}`}
            >
                <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 transition-all duration-300 border ${colorMap[color] || colorMap.blue}`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-white transition-colors">{title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4 sm:mb-6 flex-grow font-medium">{description}</p>

                    <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-white transition-colors mt-auto">
                        Try Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

const InsightCard = ({ title, date, read, category }) => (
    <Link href="/blog" className="block">
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-[#0A0A0A] backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/30 hover:bg-[#111] transition-all group relative overflow-hidden"
        >
            <div className="flex gap-4 relative z-10">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-neon-blue/30 transition-colors">
                    <Activity className="w-6 h-6 text-gray-400 group-hover:text-neon-blue transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded-full border border-neon-blue/20">{category}</span>
                    </div>
                    <h4 className="font-bold text-gray-100 text-sm mb-2 line-clamp-2 group-hover:text-white transition-colors">{title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <span>{date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{read} read</span>
                    </div>
                </div>
            </div>
        </motion.div>
    </Link>
);

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 pb-12 relative overflow-hidden">
            {/* Background Ambient Glow - Made slightly brighter */}
            <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-neon-purple/15 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-neon-blue/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8"
                >
                    <div className="lg:col-span-3 space-y-8 sm:space-y-12">
                        {/* Header */}
                        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-3">
                                    Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">Back</span>
                                </h1>
                                <p className="text-gray-300 text-base sm:text-lg font-medium">Your creative workspace is ready. What will you build today?</p>
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] border border-white/10 text-xs font-semibold text-gray-300 shadow-lg">
                                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#0aff0a]" />
                                    System Online
                                </div>
                            </div>
                        </motion.div>

                        {/* Projects Section */}
                        <section className="space-y-4 sm:space-y-6">
                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                                    <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-neon-blue" /> Active Projects
                                </h2>
                                <Link href="/projects" className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                                    View all <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
                                {/* New Project Card */}
                                <motion.div
                                    variants={itemVariants}
                                    className="md:col-span-2"
                                >
                                    <div className="h-full bg-gradient-to-br from-[#0A0A0A] to-neon-blue/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-neon-blue/50 transition-all group relative overflow-hidden flex flex-col items-center justify-center text-center shadow-lg hover:shadow-neon-blue/10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-neon-blue/20 group-hover:border-neon-blue/50">
                                            <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 relative z-10 text-white">New Circuit</h3>
                                        <p className="text-sm text-gray-300 mb-6 sm:mb-8 relative z-10 font-medium max-w-[200px]">Start designing from scratch with our powerful editor.</p>

                                        <Link href="/design" className="relative z-10 w-full py-3 sm:py-4 bg-neon-blue text-black rounded-xl font-bold text-sm sm:text-base transition-all hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2">
                                            <Plus className="w-5 h-5" /> Create Now
                                        </Link>
                                    </div>
                                </motion.div>

                                {/* Empty State / Recent Projects Placeholder */}
                                <motion.div
                                    variants={itemVariants}
                                    className="md:col-span-3 bg-[#0A0A0A] backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col items-center justify-center text-center min-h-[250px] sm:min-h-[300px]"
                                >
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#111] rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/5">
                                        <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-200">No recent circuits</h3>
                                    <p className="text-gray-400 max-w-xs mx-auto font-medium text-sm sm:text-base">Your workspace is empty. Create your first project to see it here.</p>
                                </motion.div>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section>
                            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">Quick Actions</h2>
                            </motion.div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                                <QuickActionCard
                                    href="/tools/resistor"
                                    icon={Cpu}
                                    title="Resistor Decoder"
                                    description="Calculate resistance values instantly."
                                    color="purple"
                                />
                                <QuickActionCard
                                    href="/tools/scan"
                                    icon={Camera}
                                    title="Scan Component"
                                    description="AI-powered component identification."
                                    color="pink"
                                />
                                <QuickActionCard
                                    href="/encyclopedia"
                                    icon={Search}
                                    title="Encyclopedia"
                                    description="Search our vast component library."
                                    color="blue"
                                />
                                <QuickActionCard
                                    href="/projects"
                                    icon={Grid}
                                    title="Community"
                                    description="Explore projects from other makers."
                                    color="green"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6 sm:space-y-8">
                        <motion.div variants={itemVariants} className="bg-[#0A0A0A] backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                                    <BookOpen className="w-5 h-5 text-neon-pink" /> Latest Insights
                                </h2>
                                <Link href="/blog" className="text-xs font-bold text-neon-blue hover:text-white transition-colors uppercase tracking-wider">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <InsightCard
                                    title="Understanding MOSFETs in Power Electronics"
                                    date="Nov 28"
                                    read="5 min"
                                    category="Electronics"
                                />
                                <InsightCard
                                    title="Getting Started with ESP32 Development"
                                    date="Nov 27"
                                    read="8 min"
                                    category="Tutorial"
                                />
                                <InsightCard
                                    title="PCB Design Best Practices for 2025"
                                    date="Nov 25"
                                    read="12 min"
                                    category="Design"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-neon-purple/20 to-[#0A0A0A] backdrop-blur-md rounded-2xl p-6 border border-neon-purple/20">
                            <h3 className="text-lg font-bold mb-2 text-white">Pro Tip</h3>
                            <p className="text-sm text-gray-200 mb-4 font-medium leading-relaxed">
                                Use keyboard shortcuts to speed up your design workflow. Press <kbd className="px-2 py-1 rounded bg-white/20 text-white font-mono text-xs border border-white/10">?</kbd> to view all shortcuts.
                            </p>
                        </motion.div>
                    </aside>
                </motion.div>
            </div>
        </div>
    );
}
