"use client";
import React, { useState } from 'react';
import { getComponentDef } from '../../litesim/parts';

const TOOLS = [
    { type: 'battery', label: 'Battery', category: 'Power' },
    { type: 'resistor', label: 'Resistor', category: 'Passive' },
    { type: 'capacitor', label: 'Capacitor', category: 'Passive' },
    { type: 'inductor', label: 'Inductor', category: 'Passive' },
    { type: 'led', label: 'LED', category: 'Output' },
    { type: 'switch', label: 'Switch', category: 'Input' },
    { type: 'motor', label: 'Motor', category: 'Output' },
    { type: 'transistor', label: 'NPN BJT', category: 'Active' },
    { type: 'mosfet', label: 'N-MOSFET', category: 'Active' },
    // { type: 'breadboard', label: 'Breadboard', category: 'Board' },
];

const ComponentPreview = ({ type }) => {
    const CompDef = getComponentDef(type);
    if (!CompDef) return <div className="text-2xl">❓</div>;

    // Dummy component state for preview
    const dummyComp = {
        id: 'preview',
        type,
        x: 0,
        y: 0,
        rotation: 0,
        state: { active: true, on: true }, // Show active state if possible
        properties: {}
    };

    return (
        <svg width="40" height="40" viewBox="-30 -30 60 60" className="pointer-events-none">
            <CompDef component={dummyComp} showLabels={false} />
        </svg>
    );
};

const ComponentPanel = () => {
    const [search, setSearch] = useState('');
    const [apiComponents, setApiComponents] = useState([]);

    React.useEffect(() => {
        const fetchComponents = async () => {
            try {
                const res = await fetch('/api/components');
                if (res.ok) {
                    const data = await res.json();
                    setApiComponents(data);
                }
            } catch (err) {
                console.error("Failed to fetch components:", err);
            }
        };
        fetchComponents();
    }, []);

    const handleDragStart = (e, type) => {
        e.dataTransfer.setData('componentType', type);
    };

    // Merge default tools with API components
    // For now, we'll just append them, or map them to existing categories
    const allTools = [
        ...TOOLS,
        ...apiComponents.map(c => ({
            type: c.slug || c.name.toLowerCase(), // Ensure this matches a registered component type or handle dynamic types
            label: c.name,
            category: c.category || 'Custom',
            isCustom: true
        }))
    ];

    const filteredTools = allTools.filter(t => t.label.toLowerCase().includes(search.toLowerCase()));

    // Group by category
    const categories = [...new Set(filteredTools.map(t => t.category))];

    return (
        <div className="w-full h-full flex flex-col bg-gray-950/80 backdrop-blur-xl border-r border-white/5">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-sm font-semibold text-cyan-400 mb-3 tracking-wide">COMPONENTS</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-600"
                    />
                    <div className="absolute right-2 top-2 text-gray-600">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {categories.map(cat => (
                    <div key={cat}>
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">{cat}</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {filteredTools.filter(t => t.category === cat).map(tool => (
                                <div
                                    key={tool.type}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, tool.type)}
                                    className="group relative flex flex-col items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-grab active:cursor-grabbing transition-all duration-300"
                                >
                                    <div className="mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">
                                        <ComponentPreview type={tool.type} />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-cyan-300 transition-colors">{tool.label}</span>

                                    {/* Drag Indicator */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_5px_#06b6d4]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComponentPanel;
