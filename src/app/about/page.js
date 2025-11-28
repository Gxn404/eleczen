import { Users, Target, Shield, Zap } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
    title: "About ElecZen | Our Mission & Team",
    description: "Learn about the mission behind ElecZen and the team building the future of electronics design.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs className="mb-8" />

                {/* Hero */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Empowering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text">
                            Next Generation
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        ElecZen is an open-source platform designed to democratize electronics engineering.
                        We combine powerful simulation tools with community-driven knowledge.
                    </p>
                </div>

                {/* Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-blue/50 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-neon-blue" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                        <p className="text-gray-400">
                            To provide accessible, professional-grade tools for everyone, from hobbyists to seasoned engineers.
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-purple/50 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-neon-purple" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Community First</h3>
                        <p className="text-gray-400">
                            We believe in the power of open collaboration. Share designs, ask questions, and grow together.
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-pink/50 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-neon-pink/10 flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-neon-pink" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Open Source</h3>
                        <p className="text-gray-400">
                            Transparency and trust are core to our values. Our code is open for inspection and contribution.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Meet the Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10 text-center group hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 mb-4 overflow-hidden border-2 border-white/10 group-hover:border-neon-blue/50 transition-colors">
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                                        <span className="text-2xl font-bold text-gray-500">M{i}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">Member {i}</h3>
                                <p className="text-neon-blue text-sm mb-3">Lead Engineer</p>
                                <p className="text-gray-400 text-sm">
                                    Passionate about circuit design and React.js.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
