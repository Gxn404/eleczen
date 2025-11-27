"use client";

import { useState, useEffect } from "react";
import { Zap, RefreshCw } from "lucide-react";

export default function OhmsLawPage() {
  const [values, setValues] = useState({ v: "", i: "", r: "", p: "" });
  const [activeField, setActiveField] = useState(null);

  const calculate = (target, val) => {
    const newValues = { ...values, [target]: val };
    const v = parseFloat(newValues.v);
    const i = parseFloat(newValues.i);
    const r = parseFloat(newValues.r);
    const p = parseFloat(newValues.p);

    // Logic: If 2 values are present, calculate others
    // This is a simplified version, ideally we track which 2 were input last
    if (!isNaN(v) && !isNaN(r) && target !== "i" && target !== "p") {
      newValues.i = (v / r).toFixed(4);
      newValues.p = ((v * v) / r).toFixed(4);
    } else if (!isNaN(v) && !isNaN(i) && target !== "r" && target !== "p") {
      newValues.r = (v / i).toFixed(4);
      newValues.p = (v * i).toFixed(4);
    } else if (!isNaN(i) && !isNaN(r) && target !== "v" && target !== "p") {
      newValues.v = (i * r).toFixed(4);
      newValues.p = (i * i * r).toFixed(4);
    } else if (!isNaN(p) && !isNaN(r) && target !== "v" && target !== "i") {
      newValues.v = Math.sqrt(p * r).toFixed(4);
      newValues.i = Math.sqrt(p / r).toFixed(4);
    }

    setValues(newValues);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    calculate(name, value);
  };

  const reset = () => {
    setValues({ v: "", i: "", r: "", p: "" });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Zap className="text-neon-green w-10 h-10" /> Ohm's Law Calculator
          </h1>
          <p className="text-gray-400">
            Enter any two values to calculate the rest.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neon-blue uppercase tracking-wider">
                Voltage (V)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="v"
                  value={values.v}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-mono text-white focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  Volts
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-neon-pink uppercase tracking-wider">
                Current (I)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="i"
                  value={values.i}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-mono text-white focus:outline-none focus:border-neon-pink transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  Amps
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider">
                Resistance (R)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="r"
                  value={values.r}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-mono text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  Ω
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-neon-purple uppercase tracking-wider">
                Power (P)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="p"
                  value={values.p}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-mono text-white focus:outline-none focus:border-neon-purple transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  Watts
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
            <button
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset Values
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
