import Link from 'next/link';
import { Camera, Zap, Cpu, Activity, Search, Grid, Battery, Radio } from 'lucide-react';

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
                border: "border-neon-pink/20"
            },
            {
                name: "Smart Search",
                description: "Find alternatives & specs with AI",
                icon: Search,
                href: "/tools/smart-search",
                color: "text-neon-blue",
                bg: "bg-neon-blue/10",
                border: "border-neon-blue/20"
            },
            {
                name: "Circuit Recognizer",
                description: "Convert hand-drawn circuits to schematic",
                icon: Grid,
                href: "/tools/recognizer",
                color: "text-neon-purple",
                bg: "bg-neon-purple/10",
                border: "border-neon-purple/20"
            }
        ]
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
                border: "border-neon-green/20"
            },
            {
                name: "Resistor Codes",
                description: "Decode 4, 5, & 6 band resistors",
                icon: Activity,
                href: "/tools/resistor",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
                border: "border-yellow-400/20"
            },
            {
                name: "Capacitor Decoder",
                description: "Read capacitor codes instantly",
                icon: Battery,
                href: "/tools/capacitor",
                color: "text-orange-400",
                bg: "bg-orange-400/10",
                border: "border-orange-400/20"
            }
        ]
    }
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Engineering <span className="text-neon-blue">Tools</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A suite of AI-powered and essential tools for modern electronics engineers.
                    </p>
                </div>

                <div className="space-y-16">
                    {tools.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span>{section.category}</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.items.map((tool) => (
                                    <Link href={tool.href} key={tool.name} className="group">
                                        <div className={`h-full glass-panel rounded-2xl p-6 border ${tool.border} hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}>
                                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                                <tool.icon className={`w-24 h-24 ${tool.color}`} />
                                            </div>

                                            <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <tool.icon className={`w-6 h-6 ${tool.color}`} />
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                                            <p className="text-gray-400 text-sm">{tool.description}</p>
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
