'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[100]">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Container */}
        <div className="relative w-24 h-24">
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-neon-blue/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Spinning Gradient Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-neon-blue"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner Pulsing Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                filter: [
                  "drop-shadow(0 0 10px rgba(0, 243, 255, 0.5))",
                  "drop-shadow(0 0 20px rgba(0, 243, 255, 0.8))",
                  "drop-shadow(0 0 10px rgba(0, 243, 255, 0.5))",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Zap className="w-10 h-10 text-neon-blue fill-neon-blue" />
            </motion.div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold tracking-wider text-white">
            ELEC<span className="text-neon-blue">ZEN</span>
          </h2>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-neon-blue"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
