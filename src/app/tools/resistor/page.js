'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';

const COLORS = [
    { name: 'Black', value: 0, multiplier: 1, tolerance: null, hex: '#000000', text: 'text-white' },
    { name: 'Brown', value: 1, multiplier: 10, tolerance: 1, hex: '#8B4513', text: 'text-white' },
    { name: 'Red', value: 2, multiplier: 100, tolerance: 2, hex: '#FF0000', text: 'text-white' },
    { name: 'Orange', value: 3, multiplier: 1000, tolerance: null, hex: '#FFA500', text: 'text-black' },
    { name: 'Yellow', value: 4, multiplier: 10000, tolerance: null, hex: '#FFFF00', text: 'text-black' },
    { name: 'Green', value: 5, multiplier: 100000, tolerance: 0.5, hex: '#008000', text: 'text-white' },
    { name: 'Blue', value: 6, multiplier: 1000000, tolerance: 0.25, hex: '#0000FF', text: 'text-white' },
    { name: 'Violet', value: 7, multiplier: 10000000, tolerance: 0.1, hex: '#EE82EE', text: 'text-black' },
    { name: 'Gray', value: 8, multiplier: null, tolerance: 0.05, hex: '#808080', text: 'text-white' },
    { name: 'White', value: 9, multiplier: null, tolerance: null, hex: '#FFFFFF', text: 'text-black' },
    { name: 'Gold', value: null, multiplier: 0.1, tolerance: 5, hex: '#FFD700', text: 'text-black' },
    { name: 'Silver', value: null, multiplier: 0.01, tolerance: 10, hex: '#C0C0C0', text: 'text-black' },
];

export default function ResistorPage() {
    const [bands, setBands] = useState([1, 0, 2, 10]); // Brown, Black, Red, Gold (1k 5%)

    const calculateResistance = () => {
        const digit1 = COLORS[bands[0]].value;
        const digit2 = COLORS[bands[1]].value;
        const multiplier = COLORS[bands[2]].multiplier;
        const tolerance = COLORS[bands[3]].tolerance;

        const val = (digit1 * 10 + digit2) * multiplier;

        // Format value
        let displayVal = val;
        let unit = 'Ω';
        if (val >= 1000000) {
            displayVal = val / 1000000;
            unit = 'MΩ';
        } else if (val >= 1000) {
            displayVal = val / 1000;
            unit = 'kΩ';
        }

        return { value: displayVal, unit, tolerance };
    };

    const result = calculateResistance();

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Activity className="text-yellow-400 w-10 h-10" /> Resistor Color Code
                    </h1>
                    <p className="text-gray-400">
                        Select color bands to calculate resistance value.
                    </p>
                </div>

                <div className="glass-panel rounded-3xl p-8 border border-white/10 mb-12">
                    {/* Resistor Visual */}
                    <div className="h-48 flex items-center justify-center relative mb-12">
                        {/* Wire */}
                        <div className="absolute w-full h-2 bg-gray-400" />

                        {/* Body */}
                        <div className="relative w-96 h-24 bg-[#e8dcc5] rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-b-4 border-black/10">
                            {/* Bands */}
                            <div className="flex gap-8 z-10">
                                {bands.map((bandIdx, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-32 -my-4 shadow-lg"
                                        style={{ backgroundColor: COLORS[bandIdx].hex }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Result Display */}
                    <div className="text-center mb-12">
                        <div className="inline-block px-8 py-4 rounded-2xl bg-black/40 border border-white/10">
                            <span className="text-4xl md:text-6xl font-bold text-white font-mono">
                                {result.value} {result.unit}
                            </span>
                            <span className="text-xl md:text-2xl text-gray-400 ml-4">
                                ±{result.tolerance}%
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['1st Digit', '2nd Digit', 'Multiplier', 'Tolerance'].map((label, i) => (
                            <div key={i} className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase text-center">{label}</label>
                                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar p-1 bg-black/20 rounded-xl">
                                    {COLORS.map((color, colorIdx) => {
                                        // Filter invalid options for bands
                                        if (i < 2 && color.value === null) return null;
                                        if (i === 2 && color.multiplier === null) return null;
                                        if (i === 3 && color.tolerance === null) return null;

                                        return (
                                            <button
                                                key={color.name}
                                                onClick={() => {
                                                    const newBands = [...bands];
                                                    newBands[i] = colorIdx;
                                                    setBands(newBands);
                                                }}
                                                className={`
                          px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-between
                          ${bands[i] === colorIdx ? 'ring-2 ring-white scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'}
                        `}
                                                style={{ backgroundColor: color.hex, color: color.hex === '#000000' ? 'white' : 'black' }}
                                            >
                                                <span>{color.name}</span>
                                                {bands[i] === colorIdx && <div className="w-2 h-2 rounded-full bg-current" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
