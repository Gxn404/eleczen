import React, { useState, useEffect, useRef } from 'react';
import { useLiteSimStore } from '@/lib/litesim/state';

const ConsolePanel = () => {
    const [activeTab, setActiveTab] = useState('console');
    const { logs, clearLogs } = useLiteSimStore();
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, activeTab]);

    return (
        <div className="w-full h-full flex flex-col bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pr-2">
                <div className="flex items-center">
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
                </div>
                <button
                    onClick={clearLogs}
                    className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                    title="Clear Logs"
                >
                    Clear
                </button>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 p-2 font-mono text-xs overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
                {activeTab === 'console' && (
                    <div className="space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className={`${log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-gray-400'}`}>
                                <span className="opacity-50 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                {log.message}
                            </div>
                        ))}
                        {logs.length === 0 && <div className="text-gray-700 italic">No logs...</div>}
                    </div>
                )}
                {activeTab === 'spice' && (
                    <div className="text-gray-500">
                        <div>&gt; eecircuit-engine active</div>
                        <div>&gt; SPICE Netlist generation enabled</div>
                        {/* Future: Show raw netlist here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsolePanel;
