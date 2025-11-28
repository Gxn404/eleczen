"use client";
import React, { useState, useEffect } from 'react';
import { useLiteSimStore } from '@/lib/litesim/state';
import { saveCircuitAction } from '@/app/actions/circuit';

const NavbarPanel = () => {
    const { isRunning, setIsRunning, runSimulation, clearCanvas, components, wires } = useLiteSimStore();
    const [activeMenu, setActiveMenu] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Simulation Loop
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                runSimulation();
            }, 100); // 10Hz simulation
        }
        return () => clearInterval(interval);
    }, [isRunning, runSimulation]);

    const handleSaveToCloud = async () => {
        const name = prompt("Enter circuit name:", "My Circuit");
        if (!name) return;

        setIsSaving(true);
        const data = { components, wires };
        const result = await saveCircuitAction(name, data);
        setIsSaving(false);

        if (result.success) {
            alert(`Circuit saved to Notion! ID: ${result.id}`);
        } else {
            alert(`Failed to save: ${result.error}`);
        }
        setActiveMenu(null);
    };

    const handleExportJSON = () => {
        const data = JSON.stringify({ components, wires }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `circuit-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setActiveMenu(null);
    };

    const handleExportPNG = () => {
        // Simple placeholder for PNG export - requires canvas access which is tricky from here
        // For now, we'll just alert
        alert("PNG Export requires canvas ref access. Coming soon!");
        setActiveMenu(null);
    };

    return (
        <div className="w-full h-full flex items-center justify-between px-4" onClick={() => setActiveMenu(null)}>
            <div className="flex items-center gap-4">
                {/* File Menu */}
                <div className="relative">
                    <button
                        className="text-sm text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}
                    >
                        File
                    </button>
                    {activeMenu === 'file' && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded shadow-xl z-50 py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" onClick={clearCanvas}>New (Clear)</button>
                            <div className="border-t border-gray-800 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" onClick={handleSaveToCloud} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save to Cloud (Notion)'}
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" onClick={handleExportJSON}>Export JSON</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" onClick={handleExportPNG}>Export PNG</button>
                        </div>
                    )}
                </div>

                {/* Edit Menu */}
                <div className="relative">
                    <button
                        className="text-sm text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}
                    >
                        Edit
                    </button>
                    {activeMenu === 'edit' && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded shadow-xl z-50 py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-500 cursor-not-allowed">Undo (Ctrl+Z)</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-500 cursor-not-allowed">Redo (Ctrl+Y)</button>
                        </div>
                    )}
                </div>

                {/* View Menu */}
                <div className="relative">
                    <button
                        className="text-sm text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'view' ? null : 'view'); }}
                    >
                        View
                    </button>
                    {activeMenu === 'view' && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded shadow-xl z-50 py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">Zoom In (+)</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">Zoom Out (-)</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">Fit to Screen</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${isRunning
                        ? 'bg-red-900/50 text-red-400 hover:bg-red-900/80 border border-red-900'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500'
                        }`}
                >
                    {isRunning ? 'Stop Sim' : 'Run Sim'}
                </button>
            </div>
        </div>
    );
};

export default NavbarPanel;
