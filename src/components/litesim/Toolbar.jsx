"use client";
import React from 'react';

const TOOLS = [
    { type: 'battery', label: 'Battery', icon: '🔋' },
    { type: 'led', label: 'LED', icon: '💡' },
    { type: 'resistor', label: 'Resistor', icon: '〰️' },
    { type: 'switch', label: 'Switch', icon: '🔌' },
    { type: 'motor', label: 'Motor', icon: '⚙️' },
    { type: 'transistor', label: 'Transistor', icon: '🔽' },
    { type: 'breadboard', label: 'Breadboard', icon: '🎛️' },
];

const Toolbar = () => {
    const handleDragStart = (e, type) => {
        e.dataTransfer.setData('componentType', type);
    };

    return (
        <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur border border-cyan-900/50 p-2 rounded-xl flex flex-col gap-2 shadow-lg shadow-cyan-900/20">
            {TOOLS.map(tool => (
                <div
                    key={tool.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tool.type)}
                    className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded hover:bg-cyan-900 cursor-grab active:cursor-grabbing transition-colors group relative"
                >
                    <span className="text-2xl">{tool.icon}</span>

                    {/* Tooltip */}
                    <span className="absolute left-full ml-2 px-2 py-1 bg-black text-xs text-cyan-400 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                        {tool.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Toolbar;
