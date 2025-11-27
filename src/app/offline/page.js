"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function Offline() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 animate-pulse">
        <WifiOff className="w-12 h-12 text-gray-400" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">You are offline</h1>
      <p className="text-gray-400 max-w-md mb-8">
        It seems you've lost your internet connection. Don't worry, you can
        still access pages you've visited previously.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-8 py-3 rounded-full bg-neon-blue text-black font-bold hover:bg-white transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
