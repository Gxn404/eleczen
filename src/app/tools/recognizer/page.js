'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Grid, RefreshCw, Zap, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CircuitRecognizerPage() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        handleScan();
    }, [webcamRef]);

    const handleScan = async () => {
        setScanning(true);
        setResult(null);

        // Simulate AI Processing
        setTimeout(() => {
            setResult({
                components: ["Resistor (10kΩ)", "NPN Transistor (BC547)", "Capacitor (10µF)", "Battery (9V)"],
                topology: "Common Emitter Amplifier",
                confidence: 0.89
            });
            setScanning(false);
            toast.success("Circuit Analyzed!");
        }, 2500);
    };

    const reset = () => {
        setImgSrc(null);
        setResult(null);
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <Grid className="text-neon-purple" /> Circuit Diagram Recognizer
                    </h1>
                    <p className="text-gray-400">Convert hand-drawn sketches into digital schematics using AI.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="glass-panel rounded-2xl p-4 border border-white/10 overflow-hidden relative min-h-[400px] flex items-center justify-center bg-black/50">
                            {!imgSrc ? (
                                <div className="relative w-full h-full">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full rounded-xl object-cover"
                                    />
                                    <div className="absolute inset-0 border-2 border-dashed border-neon-purple/50 rounded-xl pointer-events-none flex items-center justify-center">
                                        <p className="text-neon-purple/70 font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                                            Align Circuit Here
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <img src={imgSrc} alt="Captured" className="w-full h-full rounded-xl object-cover" />
                            )}
                        </div>

                        <div className="glass-panel rounded-2xl p-6 border border-white/10">
                            {!imgSrc ? (
                                <button
                                    onClick={capture}
                                    disabled={scanning}
                                    className="w-full py-4 rounded-xl bg-neon-purple text-white font-bold hover:bg-neon-purple/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                >
                                    <Grid className="w-5 h-5" /> Capture & Analyze
                                </button>
                            ) : (
                                <button
                                    onClick={reset}
                                    className="w-full py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" /> Scan Another
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="glass-panel rounded-2xl p-8 border border-white/10 relative min-h-[400px]">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Zap className="text-neon-yellow w-5 h-5" /> Analysis Result
                        </h2>

                        {scanning ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <Loader2 className="w-16 h-16 text-neon-purple animate-spin" />
                                <div className="space-y-2 text-center">
                                    <p className="text-white font-medium">Processing Image...</p>
                                    <p className="text-sm text-gray-500">Identifying symbols and connections</p>
                                </div>
                            </div>
                        ) : result ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
                                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Detected Topology</p>
                                    <p className="text-2xl font-bold text-white">{result.topology}</p>
                                    <p className="text-xs text-neon-purple mt-1">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Components Found</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {result.components.map((comp, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-neon-green" />
                                                <span className="text-gray-200 text-sm">{comp}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" /> Export to KiCad / Eagle
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                                <Grid className="w-16 h-16 mb-4 opacity-20" />
                                <p>No circuit analyzed yet.</p>
                                <p className="text-sm">Capture an image to begin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
