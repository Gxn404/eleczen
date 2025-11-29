import Link from "next/link";
import {
  Camera,
  Zap,
  Cpu,
  Activity,
  Search,
  Grid,
  Battery,
  Radio,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    category: "AI & ML Powered",
    items: [
      {
        name: "Component Scanner",
        description: "Identify components using AI Vision & OCR",
        icon: Camera,
        href: "/tools/scanner",
        color: "text-neon-pink",
        bg: "bg-neon-pink/10",
        border: "border-neon-pink/20",
      },
      {
        name: "Smart Search",
        description: "Find alternatives & specs with AI",
        icon: Search,
        href: "/tools/smart-search",
        color: "text-neon-blue",
        bg: "bg-neon-blue/10",
        border: "border-neon-blue/20",
      },
      {
        name: "Circuit Recognizer",
        description: "Convert hand-drawn circuits to schematic",
        icon: Grid,
        href: "/tools/recognizer",
        color: "text-neon-purple",
        bg: "bg-neon-purple/10",
        border: "border-neon-purple/20",
      },
    ],
  },
  {
    category: "Essential Calculators",
    items: [
      {
        name: "Ohm's Law",
        description: "Calculate Voltage, Current, Resistance",
        icon: Zap,
        href: "/tools/ohm",
        color: "text-neon-green",
        bg: "bg-neon-green/10",
        border: "border-neon-green/20",
      },
      {
        name: "Resistor Codes",
        description: "Decode 4, 5, & 6 band resistors",
        icon: Activity,
        href: "/tools/resistor",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
      },
      {
        name: "Capacitor Decoder",
        description: "Read capacitor codes instantly",
        icon: Battery,
        href: "/tools/capacitor",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
      },
    ],
  },
];

export const metadata = {
  title: "Engineering Tools & Calculators | ElecZen",
  description:
    "Access a suite of AI-powered electronics tools including Component Scanner, Circuit Recognizer, and essential calculators for Ohm's Law and Resistor Codes.",
};

import Breadcrumbs from "@/components/Breadcrumbs";

// ... existing imports ...

export default function ToolsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs className="mb-8" />
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Engineering <span className="text-neon-blue">Tools</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A suite of AI-powered and essential tools for modern electronics
            engineers.
          </p>
        </div>

        <div className="space-y-20">
          {tools.map((section) => (
            <div key={section.category}>
              <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {section.category}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((tool) => (
                  <Link href={tool.href} key={tool.name} className="group block h-full">
                    <div
                      className={`h-full glass-panel rounded-3xl p-8 border ${tool.border} hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col`}
                    >
                      <div
                        className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-15 transition-opacity transform group-hover:scale-110 duration-500`}
                      >
                        <tool.icon className={`w-32 h-32 ${tool.color}`} />
                      </div>

                      <div
                        className={`w-16 h-16 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                      >
                        <tool.icon className={`w-8 h-8 ${tool.color}`} />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-400 text-base leading-relaxed flex-1">
                        {tool.description}
                      </p>

                      <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                        <span>Launch Tool</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
