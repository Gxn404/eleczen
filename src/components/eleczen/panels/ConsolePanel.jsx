import React from 'react';

const ConsolePanel = () => {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center border-b border-gray-800">
                <button className="px-4 py-2 text-xs font-medium text-cyan-400 border-b-2 border-cyan-500 bg-cyan-950/20">
                    Console
                </button>
                <button className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-300">
                    SPICE Log
                </button>
                <button className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-300">
                    Waveforms
                </button>
            </div>
            <div className="flex-1 p-2 font-mono text-xs text-gray-400 overflow-auto">
                <div>&gt; System initialized.</div>
                <div>&gt; Ready.</div>
            </div>
        </div>
    );
};

export default ConsolePanel;
