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
  Wrench,
  Microchip,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const tools = [
  {
    category: "AI & ML Powered",
    icon: Microchip,
    color: "text-neon-pink",
    items: [
      {
        name: "Component Scanner",
        description: "Identify components instantly using AI Vision & OCR technology.",
        icon: Camera,
        href: "/tools/scanner",
        color: "text-neon-pink",
        bg: "bg-neon-pink/10",
        border: "border-neon-pink/20",
        gradient: "from-neon-pink/20 to-transparent"
      },
      {
        name: "Smart Search",
        description: "Find exact alternatives, datasheets & specs using semantic search.",
        icon: Search,
        href: "/tools/smart-search",
        color: "text-neon-blue",
        bg: "bg-neon-blue/10",
        border: "border-neon-blue/20",
        gradient: "from-neon-blue/20 to-transparent"
      },
      {
        name: "Circuit Recognizer",
        description: "Convert hand-drawn schematics into digital circuits automatically.",
        icon: Grid,
        href: "/tools/recognizer",
        color: "text-neon-purple",
        bg: "bg-neon-purple/10",
        border: "border-neon-purple/20",
        gradient: "from-neon-purple/20 to-transparent"
      },
    ],
  },
  {
    category: "Essential Calculators",
    icon: Wrench,
    color: "text-neon-green",
    items: [
      {
        name: "Ohm's Law",
        description: "Calculate Voltage, Current, Resistance & Power relationships.",
        icon: Zap,
        href: "/tools/ohm",
        color: "text-neon-green",
        bg: "bg-neon-green/10",
        border: "border-neon-green/20",
        gradient: "from-neon-green/20 to-transparent"
      },
      {
        name: "Resistor Codes",
        description: "Decode 4, 5, & 6 band resistor color codes visually.",
        icon: Activity,
        href: "/tools/resistor",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
        gradient: "from-yellow-400/20 to-transparent"
      },
      {
        name: "Capacitor Decoder",
        description: "Read capacitor codes and convert units instantly.",
        icon: Battery,
        href: "/tools/capacitor",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
        gradient: "from-orange-400/20 to-transparent"
      },
    ],
  },
];

export const metadata = {
  title: "Engineering Tools & Calculators | ElecZen",
  description:
    "Access a suite of AI-powered electronics tools including Component Scanner, Circuit Recognizer, and essential calculators for Ohm's Law and Resistor Codes.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden selection:bg-neon-blue/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumbs className="mb-12" />

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight animate-fade-in-up">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-cyan-400 to-white">Tools</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100 leading-relaxed">
            A powerful suite of AI-driven utilities and essential calculators designed for modern electronics engineers.
          </p>
        </div>

        <div className="space-y-32">
          {tools.map((section, idx) => (
            <div key={section.category} className="animate-fade-in-up" style={{ animationDelay: `${200 + (idx * 200)}ms` }}>
              <div className="flex items-center gap-6 mb-12">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${section.color}`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-wide">
                  {section.category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((tool) => (
                  <Link href={tool.href} key={tool.name} className="group block h-full">
                    <div
                      className={`h-full glass-panel rounded-3xl p-8 border ${tool.border} bg-gradient-to-br ${tool.gradient} hover:scale-[1.02] transition-all duration-500 relative overflow-hidden flex flex-col group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
                    >
                      {/* Background Icon */}
                      <div
                        className={`absolute -bottom-12 -right-12 p-6 opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-125`}
                      >
                        <tool.icon className={`w-48 h-48 ${tool.color}`} />
                      </div>

                      <div className="relative z-10">
                        <div
                          className={`w-16 h-16 rounded-2xl ${tool.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg border border-white/5`}
                        >
                          <tool.icon className={`w-8 h-8 ${tool.color}`} />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 min-h-[40px]">
                          {tool.description}
                        </p>

                        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors">
                          <span>Launch Tool</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300 text-neon-blue" />
                        </div>
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
