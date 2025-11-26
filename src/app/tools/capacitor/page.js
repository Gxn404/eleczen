'use client';

import { useState } from 'react';
import { Battery, ArrowRight } from 'lucide-react';

export default function CapacitorPage() {
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);

    const calculate = (val) => {
        setCode(val);
        if (val.length < 3) {
            setResult(null);
            return;
        }

        const digits = parseInt(val.substring(0, 2));
        const multiplier = parseInt(val.substring(2, 3));

        if (isNaN(digits) || isNaN(multiplier)) return;

        const picofarads = digits * Math.pow(10, multiplier);

        let display = `${picofarads} pF`;
        let nanofarads = picofarads / 1000;
        let microfarads = picofarads / 1000000;

        if (picofarads >= 1000000) {
            display = `${microfarads} µF`;
        } else if (picofarads >= 1000) {
            display = `${nanofarads} nF`;
        }

        setResult({
            pf: `${picofarads} pF`,
            nf: `${nanofarads} nF`,
            uf: `${microfarads} µF`,
            display
        });
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Battery className="text-orange-400 w-10 h-10" /> Capacitor Decoder
                    </h1>
                    <p className="text-gray-400">
                        Enter the 3-digit code found on ceramic capacitors (e.g., 104).
                    </p>
                </div>

                <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="w-32 h-32 rounded-full bg-orange-400/20 flex items-center justify-center border-4 border-orange-400/50 mb-6">
                            <input
                                type="text"
                                maxLength={3}
                                value={code}
                                onChange={(e) => calculate(e.target.value)}
                                className="w-full bg-transparent text-center text-4xl font-bold text-orange-400 focus:outline-none placeholder-orange-400/30 font-mono"
                                placeholder="104"
                            />
                        </div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Enter Code Above</p>
                    </div>

                    {result && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="text-center mb-8">
                                <p className="text-gray-400 text-sm mb-2">Calculated Value</p>
                                <p className="text-5xl font-bold text-white">{result.display}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Pico</p>
                                    <p className="text-white font-mono text-sm">{result.pf}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Nano</p>
                                    <p className="text-white font-mono text-sm">{result.nf}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Micro</p>
                                    <p className="text-white font-mono text-sm">{result.uf}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
