'use client';

import { useState } from 'react';
import { Search, Sparkles, ArrowRight, Cpu, Loader2 } from 'lucide-react';

// Mock AI Knowledge Base
const KNOWLEDGE_BASE = [
    {
        keywords: ["2n7000", "mosfet", "switch"],
        name: "2N7000 N-Channel MOSFET",
        description: "A popular small-signal N-channel MOSFET. Good for low-power switching.",
        alternatives: ["BS170", "VN2222", "2N7002 (SMD)"],
        specs: "60V, 200mA, Rds(on) ~5Ω"
    },
    {
        keywords: ["lm358", "opamp", "amplifier", "low power"],
        name: "LM358 Dual Op-Amp",
        description: "Industry standard dual operational amplifier. Single supply operation.",
        alternatives: ["LM324 (Quad)", "TL072 (Low Noise)", "NE5532 (Audio)"],
        specs: "3V-32V Supply, 1MHz Bandwidth"
    },
    {
        keywords: ["ne555", "timer", "oscillator", "pulse"],
        name: "NE555 Precision Timer",
        description: "The legendary timer IC. Used for delays, oscillation, and pulse generation.",
        alternatives: ["LMC555 (CMOS)", "NE556 (Dual)"],
        specs: "4.5V-16V, 200mA Output"
    },
    {
        keywords: ["1n4007", "diode", "rectifier"],
        name: "1N4007 Rectifier Diode",
        description: "Standard silicon rectifier diode. Robust and ubiquitous.",
        alternatives: ["1N4001", "1N5408 (3A)", "UF4007 (Fast)"],
        specs: "1000V, 1A"
    }
];

export default function SmartSearchPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        setResults([]);

        // Simulate AI Processing Delay
        setTimeout(() => {
            const q = query.toLowerCase();
            const matches = KNOWLEDGE_BASE.filter(item =>
                item.keywords.some(k => q.includes(k)) ||
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
            );

            setResults(matches);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Sparkles className="text-neon-blue w-10 h-10" /> Smart Component Search
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Ask for components by description, usage, or part number.
                        <br />
                        <span className="text-sm text-gray-500">Try "low power opamp" or "switch mosfet"</span>
                    </p>
                </div>

                <form onSubmit={handleSearch} className="mb-12 relative">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all text-lg shadow-[0_0_30px_rgba(0,243,255,0.1)] focus:shadow-[0_0_50px_rgba(0,243,255,0.2)]"
                            placeholder="Describe what you need..."
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-neon-blue text-black font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {results.map((item, idx) => (
                        <div
                            key={idx}
                            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-neon-blue/30 transition-all animate-fade-in-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue">
                                        <Cpu className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                        <p className="text-neon-blue text-sm font-mono">{item.specs}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                                    Match {(0.9 - idx * 0.1).toFixed(2) * 100}%
                                </span>
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {item.description}
                            </p>

                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Suggested Alternatives</h4>
                                <div className="flex flex-wrap gap-2">
                                    {item.alternatives.map((alt) => (
                                        <span key={alt} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 cursor-pointer transition-colors">
                                            {alt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {searched && !loading && results.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No AI matches found. Try different keywords.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
