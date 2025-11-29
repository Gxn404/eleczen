"use client";

import { Activity, Cpu, Search, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";

export default function EncyclopediaListing() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchComponents();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <Breadcrumbs className="mb-6" />
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue neon-text tracking-tight">
          Component Encyclopedia
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The comprehensive database of electronic components, symbols, and
          specifications.
        </p>

        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-5 border border-white/10 rounded-2xl leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-neon-green focus:border-transparent sm:text-lg transition-all duration-300 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)]"
            placeholder="Search for components (e.g., Resistor, 555 Timer)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400">
          <span>Trending:</span>
          {["555 Timer", "Arduino Uno", "ESP32", "LM358", "10k Resistor"].map((term) => (
            <button
              key={term}
              onClick={() => setSearchTerm(term)}
              className="hover:text-neon-green transition-colors underline decoration-dotted underline-offset-4"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {loading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="glass-panel h-64 rounded-xl animate-pulse bg-white/5"
            ></div>
          ))}
        </div>
        : components.length === 0
          ? <div className="text-center py-20 glass-panel rounded-xl">
            <Cpu className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl text-gray-400">No components found.</h2>
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms.
            </p>
          </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {components.map((comp) => (
              <Link href={`/encyclopedia/${comp._id}`} key={comp._id}>
                <div className="glass-panel rounded-xl p-6 h-full hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(10,255,10,0.2)] border border-white/5 hover:border-neon-green/30 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10 group-hover:border-neon-green/50 transition-colors">
                      {/* Placeholder icon based on category if no symbol */}
                      <Zap className="h-6 w-6 text-neon-green" />
                    </div>
                    <span className="text-xs font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded">
                      {comp.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-green transition-colors">
                    {comp.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {comp.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>}
    </div>
  );
}
