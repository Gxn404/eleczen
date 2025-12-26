"use client";
import { useState } from 'react';

const ActivityPanel = ({ activeDevices = [], onSelectDevice, onOpenLibrary, onPickComponent }) => {
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [previewZoom, setPreviewZoom] = useState(1);

    // Mock jobs for now - will be connected to API later
    const [jobs, setJobs] = useState([
        // { id: 1, name: 'Importing LM358.lib', progress: 45, status: 'processing' }
    ]);

    const handleDeviceClick = (device) => {
        setSelectedDevice(device);
        onSelectDevice && onSelectDevice(device);
    };

    return (
        <aside className="flex flex-col h-full bg-gray-900 border-r border-gray-800 w-64">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-cyan-400 font-bold text-lg mb-2">DEVICES</h2>
                <div className="flex gap-2">
                    <button
                        onClick={onOpenLibrary}
                        className="flex-1 bg-cyan-900/50 hover:bg-cyan-800 text-cyan-100 text-xs py-1 px-2 rounded border border-cyan-700 transition-colors"
                    >
                        + LIBRARY
                    </button>
                    <button
                        onClick={onPickComponent}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded border border-gray-700"
                        title="Pick Component"
                    >
                        P
                    </button>
                </div>
            </div>

            {/* Preview Window (Proteus Style) */}
            <div className="h-48 bg-black border-b border-gray-800 relative overflow-hidden flex items-center justify-center">
                {selectedDevice ? (
                    <div className="text-center">
                        <div className="text-cyan-500 text-4xl mb-2">
                            {/* Placeholder for actual symbol render */}
                            {selectedDevice.icon || '⚡'}
                        </div>
                        <div className="text-gray-500 text-xs">{selectedDevice.name}</div>
                    </div>
                ) : (
                    <div className="text-gray-700 text-xs">No Preview</div>
                )}
                <div className="absolute bottom-1 right-1 text-[10px] text-gray-600">PREVIEW</div>
            </div>

            {/* Device List */}
            <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                    {activeDevices.map((device, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleDeviceClick(device)}
                            className={`
                                flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm
                                ${selectedDevice?.id === device.id ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-900/50' : 'text-gray-400 hover:bg-gray-800'}
                            `}
                        >
                            <span className="w-4 text-center">{device.icon || '•'}</span>
                            <span className="truncate font-mono">{device.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Job Status Panel */}
            {jobs.length > 0 && (
                <div className="border-t border-gray-800 bg-gray-900 p-2">
                    <div className="text-[10px] text-gray-500 mb-1 font-bold">BACKGROUND TASKS</div>
                    <div className="space-y-2">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-gray-800 rounded p-2 text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-300 truncate">{job.name}</span>
                                    <span className={job.status === 'error' ? 'text-red-400' : 'text-cyan-400'}>
                                        {job.progress}%
                                    </span>
                                </div>
                                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${job.status === 'error' ? 'bg-red-500' : 'bg-cyan-500'}`}
                                        style={{ width: `${job.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default ActivityPanel;
