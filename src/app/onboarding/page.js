import { ArrowRight, BookOpen, Cpu, Layers, Zap } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": "ElecZen",
                "url": "https://eleczen.app",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://eleczen.app/encyclopedia?search={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "name": "ElecZen",
                "url": "https://eleczen.app",
                "logo": "https://eleczen.app/eleczen_512.png",
                "sameAs": [
                    "https://twitter.com/eleczen",
                    "https://github.com/eleczen"
                ]
            }
        ]
    };

    return (
        <div className="flex flex-col min-h-screen">
            <JsonLd data={jsonLd} />
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-black pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] opacity-50 animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-neon-purple/10 rounded-full blur-[100px] opacity-30" />
                    <div className="absolute top-1/3 left-10 w-64 h-64 bg-neon-green/10 rounded-full blur-[80px] opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in-up hover:bg-white/10 transition-colors cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                        </span>
                        <span className="text-sm text-gray-300 font-medium">v2.0 Now Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-gradient-x neon-text-subtle">
                            Circuit Design
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        Design, simulate, and share electronic circuits in real-time. Access
                        a massive component encyclopedia and learn from community experts.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Link href="/design">
                            <button className="px-8 py-4 rounded-xl bg-neon-blue text-black font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] flex items-center gap-2 group">
                                Start Designing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/encyclopedia">
                            <button className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 hover:border-neon-purple/50 transition-all backdrop-blur-md">
                                Browse Components
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-black/50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link href="/design" className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-blue/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,243,255,0.2)]">
                            <div className="w-14 h-14 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-neon-blue/20">
                                <Zap className="w-8 h-8 text-neon-blue" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">
                                Real-time Simulation
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                Test your circuits instantly with our advanced SPICE-based
                                simulation engine. Visualize voltage and current flow in
                                real-time.
                            </p>
                        </Link>

                        <Link href="/encyclopedia" className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-purple/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(188,19,254,0.2)]">
                            <div className="w-14 h-14 rounded-xl bg-neon-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-neon-purple/20">
                                <Cpu className="w-8 h-8 text-neon-purple" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-purple transition-colors">
                                Component Encyclopedia
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                Access detailed specifications, pinouts, and models for
                                thousands of electronic components. Never check a datasheet
                                again.
                            </p>
                        </Link>

                        <Link href="/blog" className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-pink/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,0,255,0.2)]">
                            <div className="w-14 h-14 rounded-xl bg-neon-pink/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-neon-pink/20">
                                <BookOpen className="w-8 h-8 text-neon-pink" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-pink transition-colors">
                                Community Blog
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                Learn from the best. Read tutorials, project breakdowns, and
                                deep dives into electronics theory from community experts.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Ready to build the impossible?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join thousands of engineers, students, and hobbyists creating the
                        next generation of electronics.
                    </p>
                    <Link href="/login">
                        <button className="px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition-all shadow-xl hover:scale-105 transform duration-200">
                            Join ElecZen Free
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
