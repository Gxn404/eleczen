import Link from "next/link";
import {
    Plus,
    Search,
    Zap,
    BookOpen,
    Cpu,
    ArrowRight,
    Activity,
    Grid
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome back, <span className="text-neon-blue">Engineer</span>
                </h1>
                <p className="text-gray-400">
                    Ready to design your next breakthrough?
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Link href="/design/circuit/new" className="group">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-blue/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-neon-blue" />
                        </div>
                        <h3 className="font-bold text-white mb-1">New Circuit</h3>
                        <p className="text-sm text-gray-400">Start a blank design</p>
                    </div>
                </Link>

                <Link href="/tools/scanner" className="group">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-pink/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-neon-pink/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <CameraIcon className="w-6 h-6 text-neon-pink" />
                        </div>
                        <h3 className="font-bold text-white mb-1">Scan Component</h3>
                        <p className="text-sm text-gray-400">Identify with AI</p>
                    </div>
                </Link>

                <Link href="/encyclopedia" className="group">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-green/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Search className="w-6 h-6 text-neon-green" />
                        </div>
                        <h3 className="font-bold text-white mb-1">Encyclopedia</h3>
                        <p className="text-sm text-gray-400">Find datasheets</p>
                    </div>
                </Link>

                <Link href="/projects" className="group">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-purple/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Grid className="w-6 h-6 text-neon-purple" />
                        </div>
                        <h3 className="font-bold text-white mb-1">Community</h3>
                        <p className="text-sm text-gray-400">Explore projects</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Continue Working */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-neon-blue" />
                            Recent Activity
                        </h2>
                        <Link href="/profile" className="text-sm text-neon-blue hover:text-white transition-colors">
                            View all
                        </Link>
                    </div>

                    {/* Placeholder for Recent Circuits */}
                    <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center">
                        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Zap className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No recent circuits</h3>
                        <p className="text-gray-400 mb-6">Start your first project today!</p>
                        <Link href="/design/circuit/new">
                            <button className="px-6 py-2 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue/30 transition-all">
                                Create Circuit
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Sidebar: Featured / Tool of the Day */}
                <div className="space-y-8">
                    {/* Tool of the Day */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu className="w-32 h-32 text-neon-purple" />
                        </div>
                        <h3 className="text-sm font-bold text-neon-purple uppercase tracking-wider mb-2">
                            Tool of the Day
                        </h3>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Resistor Decoder
                        </h2>
                        <p className="text-gray-400 mb-6 text-sm">
                            Quickly calculate resistance values from color bands. Supports 4, 5, and 6 band resistors.
                        </p>
                        <Link href="/tools/resistor">
                            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-purple/50 text-white transition-all flex items-center justify-center gap-2">
                                Try Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>

                    {/* Latest from Blog */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-neon-pink" />
                            Latest Insights
                        </h2>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-gray-800 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1 line-clamp-2">
                                                Understanding MOSFETs in Power Electronics
                                            </h4>
                                            <p className="text-xs text-gray-500">Nov 28 • 5 min read</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CameraIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    )
}
