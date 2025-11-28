"use client";
import React, { useState } from 'react';

const TOOLS = [
    { type: 'battery', label: 'Battery', icon: '🔋', category: 'Power' },
    { type: 'led', label: 'LED', icon: '💡', category: 'Output' },
    { type: 'resistor', label: 'Resistor', icon: '〰️', category: 'Passive' },
    { type: 'switch', label: 'Switch', icon: '🔌', category: 'Input' },
    { type: 'motor', label: 'Motor', icon: '⚙️', category: 'Output' },
    { type: 'transistor', label: 'Transistor', icon: '🔽', category: 'Active' },
    { type: 'breadboard', label: 'Breadboard', icon: '🎛️', category: 'Board' },
];

const ComponentPanel = () => {
    const [search, setSearch] = useState('');

    const handleDragStart = (e, type) => {
        e.dataTransfer.setData('componentType', type);
    };

    const filteredTools = TOOLS.filter(t => t.label.toLowerCase().includes(search.toLowerCase()));

    // Group by category
    const categories = [...new Set(filteredTools.map(t => t.category))];

    return (
        <div className="w-full h-full flex flex-col bg-gray-950/50">
            <div className="p-3 border-b border-gray-800">
                <input
                    type="text"
                    placeholder="Search components..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600"
                />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                {categories.map(cat => (
                    <div key={cat} className="mb-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">{cat}</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {filteredTools.filter(t => t.category === cat).map(tool => (
                                <div
                                    key={tool.type}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, tool.type)}
                                    className="flex flex-col items-center justify-center p-3 bg-gray-900/50 border border-gray-800 rounded hover:bg-gray-800 hover:border-cyan-900/50 cursor-grab active:cursor-grabbing transition-all group"
                                >
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{tool.icon}</span>
                                    <span className="text-xs text-gray-400 group-hover:text-cyan-400">{tool.label}</span>
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
