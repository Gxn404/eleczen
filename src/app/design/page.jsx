import React from 'react';
import Canvas from '@/components/litesim/Canvas';
import Toolbar from '@/components/litesim/Toolbar';

export const metadata = {
    title: 'Eleczen LiteSim 0.1',
    description: 'Experimental browser-based electronics playground.',
};

export default function DesignPage() {
    return (
        <main className="w-screen h-screen overflow-hidden bg-black text-white font-sans selection:bg-cyan-500/30">
            <Canvas />
            <Toolbar />

            {/* Branding Overlay */}
            <div className="absolute top-4 right-4 pointer-events-none opacity-50">
                <h1 className="text-xl font-bold tracking-tighter text-cyan-500">LITESIM <span className="text-xs font-normal text-white">0.1</span></h1>
            </div>
        </main>
    );
}
