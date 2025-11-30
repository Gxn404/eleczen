"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Camera, RefreshCw, Zap, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Webcam = dynamic(() => import("react-webcam"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/50 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
});

export default function ComponentScanner() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    handleScan(imageSrc);
  }, [webcamRef]);

  const handleScan = async (imageSrc) => {
    setScanning(true);
    setResult(null);

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(imageSrc);
      await worker.terminate();

      // Simple heuristic to identify components from text
      const cleanText = text.toUpperCase();
      let identification = "Unknown Component";
      let details = "Could not confidently identify the component.";

      if (
        cleanText.includes("RES") ||
        cleanText.match(/\d+K/) ||
        cleanText.match(/\d+R/)
      ) {
        identification = "Resistor Detected";
        details = "Found patterns matching resistor markings.";
      } else if (
        cleanText.includes("CAP") ||
        cleanText.includes("µF") ||
        cleanText.match(/\d+V/)
      ) {
        identification = "Capacitor Detected";
        details = "Found voltage or capacitance ratings.";
      } else if (
        cleanText.includes("IC") ||
        cleanText.match(/LM\d+/) ||
        cleanText.match(/NE\d+/)
      ) {
        identification = "IC Chip Detected";
        details = "Found potential IC part numbers.";
      }

      setResult({
        rawText: text,
        identification,
        details,
      });
      toast.success("Scan Complete!");
    } catch (error) {
      console.error(error);
      toast.error("Scan Failed");
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setImgSrc(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Camera className="text-neon-pink" /> Component Scanner
          </h1>
          <p className="text-gray-400">
            Point your camera at a component to identify it using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Camera/Image Section */}
          <div className="glass-panel rounded-2xl p-4 border border-white/10 overflow-hidden relative min-h-[300px] flex items-center justify-center bg-black/50">
            {!imgSrc
              ? <div className="relative w-full h-full">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full rounded-xl object-cover"
                  videoConstraints={{ facingMode: "environment" }}
                />
                <div className="absolute inset-0 border-2 border-neon-pink/50 rounded-xl pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-neon-pink rounded-lg animate-pulse shadow-[0_0_20px_rgba(255,0,128,0.5)]" />
                </div>
              </div>
              : <img
                src={imgSrc}
                alt="Captured"
                className="w-full h-full rounded-xl object-cover"
              />}
          </div>

          {/* Controls & Results */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              {!imgSrc
                ? <button
                  onClick={capture}
                  disabled={scanning}
                  className="w-full py-4 rounded-xl bg-neon-pink text-black font-bold hover:bg-neon-pink/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,0,128,0.3)]"
                >
                  <Camera className="w-5 h-5" /> Capture & Scan
                </button>
                : <button
                  onClick={reset}
                  className="w-full py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" /> Scan Another
                </button>}
            </div>

            {scanning && (
              <div className="glass-panel rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-neon-pink animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white">Analyzing...</h3>
                <p className="text-gray-400">Running OCR & Pattern Matching</p>
              </div>
            )}

            {result && !scanning && (
              <div className="glass-panel rounded-2xl p-6 border border-neon-pink/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-32 h-32 text-neon-pink" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">
                  {result.identification}
                </h3>
                <p className="text-neon-pink text-sm mb-4 font-mono">
                  {result.details}
                </p>

                <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Raw OCR Text
                  </p>
                  <p className="text-gray-300 font-mono text-sm break-all">
                    {result.rawText || "No text detected"}
                  </p>
                </div>

                <button className="w-full py-2 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 transition-all text-sm font-medium flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Search Datasheet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
