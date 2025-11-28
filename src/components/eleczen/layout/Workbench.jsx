"use client";
import React from 'react';
import NavbarPanel from '../panels/NavbarPanel';
import ComponentPanel from '../panels/ComponentPanel';
import InspectorPanel from '../panels/InspectorPanel';
import ConsolePanel from '../panels/ConsolePanel';
import CanvasPanel from '../panels/CanvasPanel';
import { usePreventDevTools } from '@/hooks/usePreventDevTools';

const Workbench = () => {
    usePreventDevTools();

    return (
        <div className="h-screen w-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-gray-950 text-cyan-50 flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Top Navbar */}
            <div className="h-12 border-b border-white/10 bg-white/5 backdrop-blur-md z-50">
                <NavbarPanel />
            </div>

            {/* Main Workspace Grid */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Component Panel (Inventory) */}
                <div className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-md flex flex-col z-40 shadow-2xl">
                    <ComponentPanel />
                </div>

                {/* Center: Canvas & Console */}
                <div className="flex-1 flex flex-col relative">
                    {/* Canvas Area */}
                    <div className="flex-1 bg-transparent relative overflow-hidden">
                        <CanvasPanel />
                    </div>

                    {/* Bottom: Console Panel */}
                    <div className="h-48 border-t border-white/10 bg-black/40 backdrop-blur-xl z-40">
                        <ConsolePanel />
                    </div>
                </div>

                {/* Right: Inspector Panel (Properties) */}
                <div className="w-72 border-l border-white/10 bg-white/5 backdrop-blur-md flex flex-col z-40 shadow-2xl">
                    <InspectorPanel />
                </div>
            </div>

            {/* Modal Layer (Placeholder) */}
            {/* <div className="absolute inset-0 pointer-events-none z-[100]"></div> */}
        </div>
    );
};

export default Workbench;
