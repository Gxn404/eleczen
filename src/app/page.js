import Link from "next/link";
import {
    Plus,
    Search,
    Zap,
    BookOpen,
    Cpu,
    ArrowRight,
    Activity,
    Grid,
    TrendingUp,
    Clock,
    Users,
    Camera
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Welcome Section */}
                <div className="mb-16">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                                Welcome back
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl">
                                Continue where you left off or start something amazing
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Last login</p>
                                <p className="text-white font-medium">Today, 8:46 AM</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Projects</span>
                            </div>
                            <p className="text-3xl font-bold text-white">12</p>
                            <p className="text-xs text-gray-500 mt-1">+2 this week</p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Activity className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Components</span>
                            </div>
                            <p className="text-3xl font-bold text-white">48</p>
                            <p className="text-xs text-gray-500 mt-1">Used recently</p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Hours</span>
                            </div>
                            <p className="text-3xl font-bold text-white">24</p>
                            <p className="text-xs text-gray-500 mt-1">This month</p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-orange-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Streak</span>
                            </div>
                            <p className="text-3xl font-bold text-white">7</p>
                            <p className="text-xs text-gray-500 mt-1">Days active</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions - Redesigned */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/design/circuit/new" className="group">
                            <div className="relative bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-2xl p-6 border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Plus className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">New Circuit</h3>
                                    <p className="text-sm text-gray-400">Start designing from scratch</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/tools/scanner" className="group">
                            <div className="relative bg-gradient-to-br from-pink-900/20 to-pink-800/10 rounded-2xl p-6 border border-pink-800/30 hover:border-pink-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-900/20 hover:-translate-y-1 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Camera className="w-7 h-7 text-pink-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Scan Component</h3>
                                    <p className="text-sm text-gray-400">Identify parts with AI</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/encyclopedia" className="group">
                            <div className="relative bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 rounded-2xl p-6 border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20 hover:-translate-y-1 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Search className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Encyclopedia</h3>
                                    <p className="text-sm text-gray-400">Browse components</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/projects" className="group">
                            <div className="relative bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-2xl p-6 border border-purple-800/30 hover:border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 hover:-translate-y-1 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Grid className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Community</h3>
                                    <p className="text-sm text-gray-400">Explore projects</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity Section - Redesigned */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                            <Link href="/profile" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                View all <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Empty State - Redesigned */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 border border-gray-800 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-20 h-20 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                                    <Zap className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No recent circuits</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Your workspace is empty. Start your first project and begin building something amazing.
                                </p>
                                <Link href="/design/circuit/new">
                                    <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-900/50 inline-flex items-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        Create Circuit
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Section - Redesigned */}
                    <div className="space-y-6">
                        {/* Tool of the Day - Redesigned */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-2xl p-6 border border-purple-800/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-3 py-1 bg-purple-500/10 rounded-full">
                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Featured Tool</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                                        <Cpu className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Resistor Decoder</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Calculate resistance values from color bands instantly. Supports 4, 5, and 6 band resistors.
                                    </p>
                                </div>
                                <Link href="/tools/resistor">
                                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-600/50 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 group">
                                        Try Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Latest Insights - Redesigned */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-pink-400" />
                                Latest Insights
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { title: "Understanding MOSFETs in Power Electronics", date: "Nov 28", read: "5 min" },
                                    { title: "Getting Started with ESP32 Development", date: "Nov 27", read: "8 min" }
                                ].map((article, i) => (
                                    <Link key={i} href="/blog">
                                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer group">
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex-shrink-0"></div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                                        {article.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{article.date}</span>
                                                        <span>•</span>
                                                        <span>{article.read} read</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
