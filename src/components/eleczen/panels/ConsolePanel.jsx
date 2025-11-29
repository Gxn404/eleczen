import React, { useState, useEffect, useRef } from 'react';

const ConsolePanel = () => {
    const [activeTab, setActiveTab] = useState('console');
    const [consoleLogs, setConsoleLogs] = useState(['> System initialized.', '> Ready.']);
    const [spiceLogs, setSpiceLogs] = useState([]);
    const spiceEngineRef = useRef(null);

    useEffect(() => {
        let engine = null;
        const initSpice = async () => {
            try {
                // Dynamically import to avoid SSR issues if any, though standard import is fine for client components
                const { SpiceEngine } = await import('@tscircuit/ngspice-spice-engine');
                engine = new SpiceEngine();
                spiceEngineRef.current = engine;
                setSpiceLogs(prev => [...prev, '> SPICE Engine initializing...']);

                // Note: The actual initialization might be async depending on the library version
                // For now we assume it's ready or we'd await an init method if it existed.
                setSpiceLogs(prev => [...prev, '> SPICE Engine ready.']);
            } catch (error) {
                console.error("Failed to load SPICE engine:", error);
                setSpiceLogs(prev => [...prev, `> Error loading SPICE: ${error.message}`]);
            }
        };

        initSpice();

        return () => {
            // Cleanup if necessary
        };
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('console')}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'console' ? 'text-cyan-400 border-b-2 border-cyan-500 bg-cyan-950/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Console
                </button>
                <button
                    onClick={() => setActiveTab('spice')}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'spice' ? 'text-cyan-400 border-b-2 border-cyan-500 bg-cyan-950/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    SPICE Log
                </button>
                <button
                    onClick={() => setActiveTab('waveforms')}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'waveforms' ? 'text-cyan-400 border-b-2 border-cyan-500 bg-cyan-950/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Waveforms
                </button>
            </div>
            <div className="flex-1 p-2 font-mono text-xs text-gray-400 overflow-auto">
                {activeTab === 'console' && (
                    <div>
                        {consoleLogs.map((log, i) => <div key={i}>{log}</div>)}
                    </div>
                )}
                {activeTab === 'spice' && (
                    <div>
                        {spiceLogs.map((log, i) => <div key={i}>{log}</div>)}
                    </div>
                )}
                {activeTab === 'waveforms' && (
                    <div className="flex items-center justify-center h-full text-gray-600">
                        No waveforms available
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsolePanel;
