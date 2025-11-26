import { ArrowRight, BookOpen, Cpu, Layers, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-neon-purple/10 rounded-full blur-[100px] opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-gray-300">v2.0 Now Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-gradient-x">
              Circuit Design
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Design, simulate, and share electronic circuits in real-time. Access
            a massive component encyclopedia and learn from community experts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/design/circuit">
              <button className="px-8 py-4 rounded-xl bg-neon-blue text-black font-bold text-lg hover:bg-neon-blue/90 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-2">
                Start Designing <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/encyclopedia">
              <button className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md">
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
            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-blue/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-neon-blue" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Real-time Simulation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Test your circuits instantly with our advanced SPICE-based
                simulation engine. Visualize voltage and current flow in
                real-time.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-purple/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-neon-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-8 h-8 text-neon-purple" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Component Encyclopedia
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Access detailed specifications, pinouts, and models for
                thousands of electronic components. Never check a datasheet
                again.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-pink/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-neon-pink/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-neon-pink" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Community Blog
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Learn from the best. Read tutorials, project breakdowns, and
                deep dives into electronics theory from community experts.
              </p>
            </div>
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
