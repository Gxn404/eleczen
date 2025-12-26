"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, RotateCcw, Copy, Check, ChevronLeft, Info } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const COLORS = [
  { name: "Black", value: 0, multiplier: 1, tolerance: null, hex: "#000000", text: "text-white" },
  { name: "Brown", value: 1, multiplier: 10, tolerance: 1, hex: "#593110", text: "text-white" },
  { name: "Red", value: 2, multiplier: 100, tolerance: 2, hex: "#D90429", text: "text-white" },
  { name: "Orange", value: 3, multiplier: 1000, tolerance: null, hex: "#FB8500", text: "text-black" },
  { name: "Yellow", value: 4, multiplier: 10000, tolerance: null, hex: "#FFB703", text: "text-black" },
  { name: "Green", value: 5, multiplier: 100000, tolerance: 0.5, hex: "#06D6A0", text: "text-white" },
  { name: "Blue", value: 6, multiplier: 1000000, tolerance: 0.25, hex: "#118AB2", text: "text-white" },
  { name: "Violet", value: 7, multiplier: 10000000, tolerance: 0.1, hex: "#7209B7", text: "text-white" },
  { name: "Gray", value: 8, multiplier: null, tolerance: 0.05, hex: "#6C757D", text: "text-white" },
  { name: "White", value: 9, multiplier: null, tolerance: null, hex: "#F8F9FA", text: "text-black" },
  { name: "Gold", value: null, multiplier: 0.1, tolerance: 5, hex: "#FFD166", text: "text-black" },
  { name: "Silver", value: null, multiplier: 0.01, tolerance: 10, hex: "#C0C0C0", text: "text-black" },
];

export default function ResistorPage() {
  const [bands, setBands] = useState([1, 0, 2, 10]); // Brown, Black, Red, Gold (1k 5%)
  const [copied, setCopied] = useState(false);

  const calculateResistance = () => {
    const digit1 = COLORS[bands[0]].value;
    const digit2 = COLORS[bands[1]].value;
    const multiplier = COLORS[bands[2]].multiplier;
    const tolerance = COLORS[bands[3]].tolerance;

    const baseVal = (digit1 * 10 + digit2) * multiplier;

    const formatValue = (v) => {
      let displayVal = v;
      let unit = "Ω";
      if (v >= 1000000) {
        displayVal = v / 1000000;
        unit = "MΩ";
      } else if (v >= 1000) {
        displayVal = v / 1000;
        unit = "kΩ";
      }
      return { val: Number(displayVal.toFixed(3)), unit, raw: v };
    };

    const main = formatValue(baseVal);

    // Calculate Range
    const toleranceVal = baseVal * (tolerance / 100);
    const min = formatValue(baseVal - toleranceVal);
    const max = formatValue(baseVal + toleranceVal);

    return { ...main, tolerance, min, max };
  };

  const result = calculateResistance();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.val} ${result.unit} ±${result.tolerance}%`);
    setCopied(true);
    toast.success("Copied value to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px]" />
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* Left Column: Controls & Visual */}
        <div className="lg:col-span-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Resistor Decoder</h1>
              <p className="text-gray-400">Calculate resistance from color bands</p>
            </div>
          </div>

          {/* Resistor Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-16 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center min-h-[320px] bg-gradient-to-br from-white/5 to-transparent"
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-neon-blue/5 blur-3xl animate-pulse-slow" />

            {/* The Wire */}
            <div className="absolute w-full h-3 bg-gradient-to-b from-gray-400 via-gray-200 to-gray-500 shadow-lg" />

            {/* Resistor Body */}
            <div className="relative w-96 h-28 bg-[#f2e6d5] rounded-full flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_-10px_20px_rgba(0,0,0,0.1),inset_0_5px_10px_rgba(255,255,255,0.4)] z-10">
              {/* Body Gradient for 3D effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/40 pointer-events-none" />

              {/* Color Bands */}
              <div className="flex gap-12 z-10 relative">
                {bands.map((bandIdx, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.05 }}
                    className="w-6 h-40 -my-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] ring-1 ring-black/5 backdrop-brightness-110"
                    style={{ backgroundColor: COLORS[bandIdx].hex }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Color Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["Band 1", "Band 2", "Multiplier", "Tolerance"].map((label, colIndex) => (
              <div key={label} className="glass-panel p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</h3>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[bands[colIndex]].hex }}
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                  {COLORS.map((color, colorIdx) => {
                    // Filter invalid options
                    if (colIndex < 2 && color.value === null) return null;
                    if (colIndex === 2 && color.multiplier === null) return null;
                    if (colIndex === 3 && color.tolerance === null) return null;

                    const isSelected = bands[colIndex] === colorIdx;

                    return (
                      <button
                        key={color.name}
                        onClick={() => {
                          const newBands = [...bands];
                          newBands[colIndex] = colorIdx;
                          setBands(newBands);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                          ${isSelected
                            ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'}
                        `}
                      >
                        <div
                          className={`
                             w-4 h-4 rounded-full shadow-sm ring-1 ring-black/20 group-hover:scale-110 transition-transform
                             ${color.name === 'White' ? 'border border-gray-300' : ''}
                           `}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="flex-1 text-left">{color.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-neon-green" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden h-full flex flex-col"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Activity className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Resistance Value</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-6xl font-bold text-white tracking-tighter drop-shadow-lg">{result.val}</span>
                <span className="text-3xl text-neon-blue font-medium">{result.unit}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-gray-400">Tolerance</span>
                  <span className="text-white font-mono font-bold">±{result.tolerance}%</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 block mb-1 text-sm">Range</span>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-mono">{result.min.val}{result.min.unit}</span>
                    <div className="h-[1px] flex-1 bg-white/20 mx-3" />
                    <span className="text-white font-mono">{result.max.val}{result.max.unit}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={handleCopy}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-cyan-500 text-black font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copied" : "Copy Values"}
                </button>

                <button
                  onClick={() => setBands([1, 0, 2, 10])}
                  className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset to Default
                </button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
