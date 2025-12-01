"use client";
import React, { useState } from 'react';
import { useLiteSimStore } from '@/lib/litesim/state';
import SettingsPanel from './SettingsPanel';
import * as Tabs from '@radix-ui/react-tabs';

const InspectorPanel = () => {
    const { selection, components, updateComponentProperty, removeSelection } = useLiteSimStore();
    const [activeTab, setActiveTab] = useState('properties');

    const renderProperties = () => {
        if (!selection) {
            return (
                <div className="flex-1 p-4 text-gray-500 text-xs text-center flex items-center justify-center">
                    Select a component to view properties
                </div>
            );
        }

        if (selection.type === 'component') {
            const comp = components.find(c => c.id === selection.id);
            if (!comp) return null;

            return (
                <div className="flex-1 flex flex-col">
                    <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
                        <span className="font-medium text-sm text-cyan-400 uppercase tracking-wider">{comp.type}</span>
                        <button onClick={removeSelection} className="text-xs text-red-500 hover:text-red-400 px-2 py-1 rounded hover:bg-red-900/20 transition-colors">Delete</button>
                    </div>

                    <div className="p-4 space-y-4 overflow-y-auto">
                        {/* Common Properties */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase font-bold">Position</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-900/50 border border-gray-800 rounded p-2 flex justify-between">
                                    <span className="text-gray-500 text-xs">X</span>
                                    <span className="text-gray-300 text-sm font-mono">{Math.round(comp.x)}</span>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-800 rounded p-2 flex justify-between">
                                    <span className="text-gray-500 text-xs">Y</span>
                                    <span className="text-gray-300 text-sm font-mono">{Math.round(comp.y)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Specific Properties */}
                        {comp.type === 'resistor' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Resistance (Ω)</label>
                                <input
                                    type="number"
                                    value={comp.properties?.resistance || 1000}
                                    onChange={(e) => updateComponentProperty(comp.id, 'resistance', Number(e.target.value))}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                />
                            </div>
                        )}

                        {comp.type === 'battery' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Voltage (V)</label>
                                <input
                                    type="number"
                                    value={comp.properties?.voltage || 9}
                                    onChange={(e) => updateComponentProperty(comp.id, 'voltage', Number(e.target.value))}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                />
                            </div>
                        )}

                        {comp.type === 'led' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Color</label>
                                <select
                                    value={comp.properties?.color || '#f00'}
                                    onChange={(e) => updateComponentProperty(comp.id, 'color', e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                >
                                    <option value="#f00">Red</option>
                                    <option value="#0f0">Green</option>
                                    <option value="#00f">Blue</option>
                                    <option value="#ff0">Yellow</option>
                                    <option value="#fff">White</option>
                                </select>
                            </div>
                        )}

                        {comp.type === 'transistor' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Beta (hFE)</label>
                                <input
                                    type="number"
                                    value={comp.properties?.beta || 100}
                                    onChange={(e) => updateComponentProperty(comp.id, 'beta', Number(e.target.value))}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                />
                            </div>
                        )}

                        {comp.type === 'switch' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">State</label>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs ${comp.state?.on ? 'text-green-400' : 'text-red-400'}`}>
                                        {comp.state?.on ? 'CLOSED' : 'OPEN'}
                                    </span>
                                    <button
                                        onClick={() => updateComponentProperty(comp.id, 'initialState', !comp.properties?.initialState)}
                                        className="text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700"
                                    >
                                        Toggle Initial
                                    </button>
                                </div>
                            </div>
                        )}
                        {comp.type === 'mosfet' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Transconductance (K)</label>
                                <input
                                    type="number"
                                    value={comp.properties?.k || 0.1}
                                    onChange={(e) => updateComponentProperty(comp.id, 'k', Number(e.target.value))}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                />
                                <label className="text-xs text-gray-500 uppercase font-bold">Threshold (Vth)</label>
                                <input
                                    type="number"
                                    value={comp.properties?.vth || 2.0}
                                    onChange={(e) => updateComponentProperty(comp.id, 'vth', Number(e.target.value))}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-gray-800 font-medium text-sm text-gray-400 bg-gray-900/30">
                    Wire Selected
                </div>
                <div className="p-4">
                    <button onClick={removeSelection} className="w-full bg-red-900/20 text-red-500 border border-red-900/50 rounded py-1 text-sm hover:bg-red-900/40 transition-colors">Delete Wire</button>
                </div>
            </div>
        );
    };

    return (
        <Tabs.Root className="w-full h-full flex flex-col bg-gray-950/50 backdrop-blur-md" value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-gray-800 bg-gray-900/20">
                <Tabs.Trigger
                    value="properties"
                    className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 hover:text-white data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 transition-all"
                >
                    Properties
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="settings"
                    className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 hover:text-white data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 transition-all"
                >
                    Settings
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="properties" className="flex-1 flex flex-col outline-none">
                {renderProperties()}
            </Tabs.Content>

            <Tabs.Content value="settings" className="flex-1 flex flex-col outline-none">
                <SettingsPanel />
            </Tabs.Content>
        </Tabs.Root>
    );
};

export default InspectorPanel;
