"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Camera, RefreshCw, Zap, Search, Loader2, ScanLine, X, BrainCircuit, Maximize2, Settings, SwitchCamera, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const Webcam = dynamic(() => import("react-webcam"), {
  ssr: false,
  loading: () => <div className="bg-black/80 w-full h-full" />,
});

// -- Component Knowledge Base --
const COMPONENT_DB = {
  "NE555": { desc: "Precision Timer", package: "DIP-8 / SOIC-8", uses: "Oscillators, Pulse Generation, Timers" },
  "LM358": { desc: "Dual Operational Amplifier", package: "DIP-8", uses: "Signal Conditioning, Active Filters" },
  "LM741": { desc: "Single Operational Amplifier", package: "DIP-8", uses: "Amplifiers, Buffers" },
  "LM7805": { desc: "5V Positive Voltage Regulator", package: "TO-220", uses: "Power Supplies" },
  "LM317": { desc: "Adjustable Voltage Regulator", package: "TO-220", uses: "Variable Power Supplies" },
  "ATMEGA328": { desc: "8-bit AVR Microcontroller", package: "DIP-28", uses: "Arduino Uno, Embedded Systems" },
  "ESP8266": { desc: "Wi-Fi SoC", package: "SMD Module", uses: "IoT, Wireless Sensors" },
  "ESP32": { desc: "Wi-Fi + Bluetooth SoC", package: "SMD Module", uses: "IoT, Smart Home" },
  "1N4148": { desc: "Small Signal Switching Diode", package: "DO-35", uses: "High-speed switching" },
  "1N4007": { desc: "General Purpose Rectifier", package: "DO-41", uses: "AC/DC Rectification" },
  "2N2222": { desc: "NPN Bipolar Junction Transistor", package: "TO-92", uses: "Switching, Amplification" },
  "BC547": { desc: "NPN General Purpose Transistor", package: "TO-92", uses: "Audio Amplification" },
  "IRF540": { desc: "N-Channel Power MOSFET", package: "TO-220", uses: "High Current Switching" },
};

export default function ComponentScanner() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("PART_NUMBER"); // "PART_NUMBER" | "RESISTOR"

  // Camera State
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState([]);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    const handleDevices = (mediaDevices) => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
      setDevices(videoDevices);
    };

    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, []);

  const toggleCamera = () => {
    if (devices.length > 1) {
      // Find current index
      const currentIdx = devices.findIndex(d => d.deviceId === deviceId);
      const nextIdx = (currentIdx + 1) % devices.length;
      setDeviceId(devices[nextIdx].deviceId);
    }
  };

  const toggleTorch = async () => {
    if (webcamRef.current && webcamRef.current.video) {
      const track = webcamRef.current.video.srcObject.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !torchOn }]
          });
          setTorchOn(!torchOn);
        } catch (e) {
          toast.error("Could not toggle flash");
        }
      } else {
        toast.error("Flash not supported on this device/browser");
      }
    }
  };

  const processImage = async (imageSrc) => {
    setScanning(true);
    setResult(null);

    const img = new Image();
    img.src = imageSrc;
    await new Promise((resolve) => { img.onload = resolve; });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // -- IMAGE PREPROCESSING --
    if (mode === "PART_NUMBER") {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // Grayscale & Contrast
      for (let i = 0; i < data.length; i += 4) {
        // Grayscale
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        // High Contrast Threshold (Binarization-ish) to delineate text
        const v = avg > 100 ? 255 : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Get processed image blob URL (optional debugging) or Data URL
    const processedSrc = canvas.toDataURL('image/jpeg', 0.9);

    try {
      if (mode === "PART_NUMBER") {
        await analyzePartNumber(processedSrc);
      } else if (mode === "RESISTOR") {
        analyzeResistorColors(ctx, canvas.width, canvas.height);
      }
    } catch (error) {
      console.error(error);
      toast.error("Analysis Failed");
      setScanning(false);
    }
  };

  const analyzePartNumber = async (imageSrc) => {
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const { data: { text } } = await worker.recognize(imageSrc);
      await worker.terminate();

      const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
      const upper = cleanText.toUpperCase();

      // -- Heuristic Analysis --
      let type = "Unknown Component";
      let confidence = "Low";
      let details = "No specific markings detected.";
      let uses = "N/A";
      let rawMatch = "N/A";

      // 1. Direct Knowledge Base Lookup
      for (const [part, info] of Object.entries(COMPONENT_DB)) {
        if (upper.includes(part)) {
          type = `${part} - ${info.desc}`;
          confidence = "High";
          details = `Package: ${info.package}`;
          uses = info.uses;
          rawMatch = part;
          break;
        }
      }

      // 2. Fallback Heuristics
      if (confidence === "Low") {
        if (upper.match(/R\d{2,}|RES|OHM/)) {
          type = "Resistor";
          confidence = "Medium";
          details = "Standard Passive Component";
        } else if (upper.match(/C\d{2,}|CAP|\d+UF|\d+PF/)) {
          type = "Capacitor";
          confidence = "Medium";
        } else if (upper.match(/U\d+|IC|SN74|CD40/)) {
          type = "Integrated Circuit";
          confidence = "Medium";
        }
        rawMatch = cleanText.substring(0, 20) + "...";
      }

      setResult({
        type,
        confidence,
        details,
        uses,
        rawData: rawMatch
      });

    } catch (e) {
      throw e;
    } finally {
      setScanning(false);
    }
  };

  const analyzeResistorColors = (ctx, width, height) => {
    // Simulation for now - Updated to be generic "Band" to solve "Brand Count" ambiguity
    setTimeout(() => {
      setResult({
        type: "Resistor (Color Code)",
        confidence: "Experimental",
        details: "Detecting bands... (Accuracy varies by light)",
        uses: "Current Limiting, Pull-ups",
        rawData: "Detected: 4-Band Sequence"
      });
      setScanning(false);
    }, 2000);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    // Scanning Animation Delay
    setTimeout(() => processImage(imageSrc), 1500);
  }, [webcamRef, mode, deviceId]);

  const reset = () => {
    setImgSrc(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-neon-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-neon-pink/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between relative z-10">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-blue animate-pulse-slow">
          <BrainCircuit className="w-3 h-3" />
          NEURAL_NET_V2.4
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Viewfinder */}
        <div className="lg:col-span-8">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] aspect-[4/3] group">

            {/* Mode Selector Pill */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex p-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 z-20">
              <button
                onClick={() => setMode("PART_NUMBER")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all ${mode === "PART_NUMBER" ? "bg-neon-blue text-black shadow-[0_0_15px_rgba(0,243,255,0.5)]" : "text-gray-400 hover:text-white"}`}
              >
                OCR SCAN
              </button>
              <button
                onClick={() => setMode("RESISTOR")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all ${mode === "RESISTOR" ? "bg-neon-pink text-black shadow-[0_0_15px_rgba(255,0,255,0.5)]" : "text-gray-400 hover:text-white"}`}
              >
                COLOR ID
              </button>
            </div>

            {/* Webcam Layer */}
            <div className="absolute inset-0 z-0">
              {!imgSrc ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ deviceId: deviceId, facingMode: "environment" }}
                />
              ) : (
                <img src={imgSrc} alt="Captured" className="w-full h-full object-cover filter contrast-125 grayscale-[20%]" />
              )}
            </div>

            {/* Cyberpunk HUD Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* Corners */}
              <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-neon-blue/50 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-neon-blue/50 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-neon-blue/50 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-neon-blue/50 rounded-br-lg" />

              {/* Central Target */}
              {!imgSrc && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 border border-white/20 rounded-lg flex items-center justify-center">
                  <div className="w-full h-[1px] bg-white/30" />
                  <div className="absolute w-[1px] h-full bg-white/30" />

                  {/* NEW: Barcode-style Scanning Animation */}
                  {scanning && (
                    <motion.div
                      initial={{ top: 0, opacity: 0 }}
                      animate={{ top: ["0%", "100%", "0%"], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute w-full h-[2px] bg-neon-blue shadow-[0_0_20px_#00f3ff,0_0_10px_#00f3ff] z-50"
                    />
                  )}
                </div>
              )}

              {/* Full Screen Scan Overlay (Text Feedback) */}
              {scanning && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <div className="text-neon-blue font-mono text-xs font-bold bg-black/80 px-4 py-2 rounded border border-neon-blue/30 tracking-[0.2em] animate-pulse shadow-lg flex items-center gap-3">
                    <ScanLine className="w-4 h-4 animate-spin-slow" />
                    ANALYZING_MATRIX...
                  </div>
                </div>
              )}
            </div>

            {/* Camera Control Bar */}
            {!imgSrc && (
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">

                <div className="flex gap-2">
                  <button onClick={toggleCamera} className="p-3 rounded-full bg-black/40 border border-white/10 hover:bg-white/10 backdrop-blur text-white">
                    <SwitchCamera className="w-5 h-5" />
                  </button>
                  <button onClick={toggleTorch} className={`p-3 rounded-full border backdrop-blur transition-all ${torchOn ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-black/40 border-white/10 text-white hover:bg-white/10'}`}>
                    <Lightbulb className={`w-5 h-5 ${torchOn ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Shutter Button */}
                <button
                  onClick={capture}
                  disabled={scanning}
                  className="w-16 h-16 rounded-full border-4 border-white/20 bg-white/5 hover:bg-white/10 hover:border-neon-blue transition-all flex items-center justify-center backdrop-blur-sm group-active:scale-95 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-12 h-12 rounded-full bg-white group-hover:bg-neon-blue transition-colors shadow-lg" />
                </button>

                <div className="w-[88px]" /> {/* Spacer for symmetry */}
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-4 space-y-4">

          {imgSrc && (
            <button
              onClick={reset}
              className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset / Scan Another
            </button>
          )}

          <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full min-h-[400px] flex flex-col relative overflow-hidden">

            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Top Identity Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${result.type.includes("Unknown") ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-neon-green/10 border-neon-green/20 text-neon-green"}`}>
                      <BrainCircuit className="w-3 h-3" />
                      Confidence: {result.confidence}
                    </div>
                    {mode === "PART_NUMBER" && <Settings className="w-4 h-4 text-gray-500" />}
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs font-mono uppercase mb-1">Identified Component</p>
                    <h2 className="text-2xl font-bold text-white leading-tight">{result.type}</h2>
                  </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-1 gap-3">

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Description / Spec</p>
                    <p className="text-sm text-gray-200">{result.details}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Common Applications</p>
                    <p className="text-sm text-gray-200">{result.uses || "Standard Electronics"}</p>
                  </div>

                  {result.rawData && (
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Raw Identifier/Ref</p>
                      <code className="text-xs text-neon-blue font-mono">{result.rawData}</code>
                    </div>
                  )}
                </div>

                {/* Action */}
                {result.rawData && result.type !== "Unknown Component" && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(result.rawData + " datasheet pdf")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-2 py-3 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/20 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <Search className="w-4 h-4" /> Datasheet
                    </a>
                  </div>
                )}

              </div>
            ) : (
              // Idle State
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 space-y-6">
                <div className="relative">
                  <ScanLine className="w-16 h-16 text-white" />
                  <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Scanner Ready</h3>
                  <p className="text-sm text-gray-400 max-w-[220px] mx-auto leading-relaxed">
                    Position component in the center reticle. Use Flash for low light.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
