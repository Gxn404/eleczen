"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, RotateCcw, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const COLORS = [
  { name: "Black", value: 0, multiplier: 1, tolerance: null, hex: "#000000", text: "text-white" },
  { name: "Brown", value: 1, multiplier: 10, tolerance: 1, hex: "#8B4513", text: "text-white" },
  { name: "Red", value: 2, multiplier: 100, tolerance: 2, hex: "#FF0000", text: "text-white" },
  { name: "Orange", value: 3, multiplier: 1000, tolerance: null, hex: "#FFA500", text: "text-black" },
  { name: "Yellow", value: 4, multiplier: 10000, tolerance: null, hex: "#FFFF00", text: "text-black" },
  { name: "Green", value: 5, multiplier: 100000, tolerance: 0.5, hex: "#008000", text: "text-white" },
  { name: "Blue", value: 6, multiplier: 1000000, tolerance: 0.25, hex: "#0000FF", text: "text-white" },
  { name: "Violet", value: 7, multiplier: 10000000, tolerance: 0.1, hex: "#EE82EE", text: "text-black" },
  { name: "Gray", value: 8, multiplier: null, tolerance: 0.05, hex: "#808080", text: "text-white" },
  { name: "White", value: 9, multiplier: null, tolerance: null, hex: "#FFFFFF", text: "text-black" },
  { name: "Gold", value: null, multiplier: 0.1, tolerance: 5, hex: "#FFD700", text: "text-black" },
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

    const val = (digit1 * 10 + digit2) * multiplier;

    let displayVal = val;
    let unit = "Ω";
    if (val >= 1000000) {
      displayVal = val / 1000000;
      unit = "MΩ";
    } else if (val >= 1000) {
      displayVal = val / 1000;
      unit = "kΩ";
    }

    return { value: Number(displayVal.toFixed(2)), unit, tolerance };
  };

  const result = calculateResistance();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.value} ${result.unit} ±${result.tolerance}%`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Visual & Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-neon-blue/10 rounded-xl border border-neon-blue/20 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <Activity className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Resistor Calculator</h1>
              <p className="text-gray-400 text-sm">Decode color bands instantly</p>
            </div>
          </div>

          {/* Visual Representation */}
          <div className="glass-panel p-12 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center min-h-[300px]">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl" />

            {/* Wire */}
            <div className="absolute w-full h-2 bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 shadow-lg" />

            {/* Resistor Body */}
            <motion.div
              layout
              className="relative w-80 h-24 bg-[#e8dcc5] rounded-full flex items-center justify-center overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_-5px_15px_rgba(0,0,0,0.2)] z-10 border-b-4 border-black/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

              {/* Bands */}
              <div className="flex gap-10 z-10">
                {bands.map((bandIdx, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{ backgroundColor: COLORS[bandIdx].hex }}
                    className="w-5 h-32 -my-4 shadow-xl ring-1 ring-black/10"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Band Selectors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Digit 1", "Digit 2", "Multiplier", "Tolerance"].map((label, colIndex) => (
              <div key={label} className="glass-panel p-4 rounded-xl border border-white/5 bg-black/40">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">{label}</h3>
                <div className="flex flex-col gap-1.5 h-64 overflow-y-auto custom-scrollbar pr-1">
                  {COLORS.map((color, colorIdx) => {
                    // Filter logic
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
                                  flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold transition-all
                                  ${isSelected
                            ? 'bg-white/10 text-white shadow-lg border border-white/20'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'}
                               `}
                      >
                        <div
                          className="w-3 h-3 rounded-full shadow-sm border border-white/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="flex-1 text-left">{color.name}</span>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4"
        >
          <div className="glass-panel p-8 rounded-3xl border border-white/10 h-full flex flex-col relative overflow-hidden">

            {/* Result Header */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-400 mb-1">Total Resistance</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white tracking-tight">{result.value}</span>
                <span className="text-2xl text-neon-blue font-medium">{result.unit}</span>
              </div>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                Tolerance: <span className="text-white ml-2 font-bold">±{result.tolerance}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={handleCopy}
                className="w-full py-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue font-bold hover:bg-neon-blue/20 transition-all flex items-center justify-center gap-2 group"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                {copied ? "Copied!" : "Copy Result"}
              </button>
              <button
                onClick={() => setBands([1, 0, 2, 10])}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
