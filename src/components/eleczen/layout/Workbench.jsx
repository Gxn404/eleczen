"use client";
import React from 'react';
import NavbarPanel from '../panels/NavbarPanel';
import ComponentPanel from '../panels/ComponentPanel';
import InspectorPanel from '../panels/InspectorPanel';
import ConsolePanel from '../panels/ConsolePanel';
import CanvasPanel from '../panels/CanvasPanel';
import ModalManager from '../modals/ModalManager';
import { usePreventDevTools } from '@/hooks/usePreventDevTools';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const ResizeHandle = ({ className = "" }) => (
    <PanelResizeHandle className={`w-1 bg-white/5 hover:bg-cyan-500/50 transition-colors data-[resize-handle-active]:bg-cyan-500 ${className}`} />
);

const ResizeHandleHorizontal = ({ className = "" }) => (
    <PanelResizeHandle className={`h-1 bg-white/5 hover:bg-cyan-500/50 transition-colors data-[resize-handle-active]:bg-cyan-500 ${className}`} />
);

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
                <PanelGroup direction="horizontal">
                    {/* Left: Component Panel (Inventory) */}
                    <Panel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col border-r border-white/10 bg-white/5 backdrop-blur-md z-40 shadow-2xl">
                        <ComponentPanel />
                    </Panel>

                    <ResizeHandle />

                    {/* Center: Canvas & Console */}
                    <Panel className="flex flex-col relative">
                        <PanelGroup direction="vertical">
                            {/* Canvas Area */}
                            <Panel className="bg-transparent relative overflow-hidden">
                                <CanvasPanel />
                            </Panel>

                            <ResizeHandleHorizontal />

                            {/* Bottom: Console Panel */}
                            <Panel defaultSize={35} minSize={16} maxSize={50} className="border-t border-white/10 bg-black/40 backdrop-blur-xl z-40">
                                <ConsolePanel />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <ResizeHandle />

                    {/* Right: Inspector Panel (Properties) */}
                    <Panel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col border-l border-white/10 bg-white/5 backdrop-blur-md z-40 shadow-2xl">
                        <InspectorPanel />
                    </Panel>
                </PanelGroup>
            </div>

            {/* Modal Layer */}
            <ModalManager />
        </div>
    );
};

export default Workbench;
