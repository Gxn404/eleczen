"use client";
import React, { useState } from 'react';
import { useLiteSimStore } from '@/lib/litesim/state';
import SettingsPanel from './SettingsPanel';
import * as Tabs from '@radix-ui/react-tabs';

const InspectorPanel = () => {
    const { selection, components, updateComponentProperty, removeSelection, updateSetting } = useLiteSimStore();
    const [activeTab, setActiveTab] = useState('properties');

    const renderProperties = () => {
        if (!selection) {
            return (
                <div className="flex-1 p-8 text-gray-500 text-xs text-center flex flex-col items-center justify-center opacity-50">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M12 7v10M7 12h10" />
                    </svg>
                    Select a component to view properties
                </div>
            );
        }

        if (selection.type === 'component') {
            const comp = components.find(c => c.id === selection.id);
            if (!comp) return null;

            return (
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
                            <span className="font-semibold text-sm text-cyan-400 uppercase tracking-widest">{comp.type}</span>
                        </div>
                        <button
                            onClick={removeSelection}
                            className="text-[10px] text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/20 hover:bg-red-500/10 transition-all"
                        >
                            DELETE
                        </button>
                    </div>

                    <div className="p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">

                        {/* Status Indicators */}
                        {comp.state?.burned && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex items-center justify-between animate-pulse">
                                <div className="flex items-center space-x-2 text-red-400">
                                    <span>🔥</span>
                                    <span className="text-xs font-bold uppercase">Component Burned</span>
                                </div>
                                <button
                                    onClick={() => updateComponentProperty(comp.id, 'burned', false)} // Needs logic to actually reset state
                                    className="text-[10px] bg-red-500/20 hover:bg-red-500/40 text-red-200 px-2 py-1 rounded transition-colors"
                                >
                                    RESET
                                </button>
                            </div>
                        )}

                        {/* Common Properties */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Position</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-black/20 border border-white/5 rounded-lg p-2 flex justify-between items-center">
                                    <span className="text-gray-500 text-[10px]">X</span>
                                    <span className="text-cyan-300 text-xs font-mono">{Math.round(comp.x)}</span>
                                </div>
                                <div className="bg-black/20 border border-white/5 rounded-lg p-2 flex justify-between items-center">
                                    <span className="text-gray-500 text-[10px]">Y</span>
                                    <span className="text-cyan-300 text-xs font-mono">{Math.round(comp.y)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Specific Properties */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Parameters</label>

                            {comp.type === 'resistor' && (
                                <PropertyInput
                                    label="Resistance (Ω)"
                                    value={comp.properties?.resistance || 1000}
                                    onChange={(v) => updateComponentProperty(comp.id, 'resistance', Number(v))}
                                />
                            )}
                            {comp.type === 'capacitor' && (
                                <PropertyInput
                                    label="Capacitance (F)"
                                    value={comp.properties?.capacitance || '1u'}
                                    onChange={(v) => updateComponentProperty(comp.id, 'capacitance', v)}
                                    type="text"
                                />
                            )}
                            {comp.type === 'inductor' && (
                                <PropertyInput
                                    label="Inductance (H)"
                                    value={comp.properties?.inductance || '1m'}
                                    onChange={(v) => updateComponentProperty(comp.id, 'inductance', v)}
                                    type="text"
                                />
                            )}
                            {comp.type === 'battery' && (
                                <PropertyInput
                                    label="Voltage (V)"
                                    value={comp.properties?.voltage || 9}
                                    onChange={(v) => updateComponentProperty(comp.id, 'voltage', Number(v))}
                                />
                            )}
                            {comp.type === 'led' && (
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Color</label>
                                    <select
                                        value={comp.properties?.color || '#f00'}
                                        onChange={(e) => updateComponentProperty(comp.id, 'color', e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:border-cyan-500/50 outline-none transition-all appearance-none"
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
                                <PropertyInput
                                    label="Beta (hFE)"
                                    value={comp.properties?.beta || 100}
                                    onChange={(v) => updateComponentProperty(comp.id, 'beta', Number(v))}
                                />
                            )}
                            {comp.type === 'mosfet' && (
                                <>
                                    <PropertyInput
                                        label="Transconductance (K)"
                                        value={comp.properties?.k || 0.1}
                                        onChange={(v) => updateComponentProperty(comp.id, 'k', Number(v))}
                                    />
                                    <PropertyInput
                                        label="Threshold (Vth)"
                                        value={comp.properties?.vth || 2.0}
                                        onChange={(v) => updateComponentProperty(comp.id, 'vth', Number(v))}
                                    />
                                </>
                            )}
                            {comp.type === 'switch' && (
                                <div className="flex items-center justify-between bg-black/20 border border-white/10 rounded-lg p-3">
                                    <span className="text-xs text-gray-400">Initial State</span>
                                    <button
                                        onClick={() => updateComponentProperty(comp.id, 'initialState', !comp.properties?.initialState)}
                                        className={`text-[10px] px-3 py-1 rounded-full transition-colors ${comp.properties?.initialState ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                    >
                                        {comp.properties?.initialState ? 'CLOSED' : 'OPEN'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Limits (for Burn Logic) */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Safety Limits</label>
                            <PropertyInput
                                label="Max Voltage (V)"
                                value={comp.properties?.maxVoltage || ''}
                                placeholder="Infinity"
                                onChange={(v) => updateComponentProperty(comp.id, 'maxVoltage', v ? Number(v) : undefined)}
                            />
                            <PropertyInput
                                label="Max Current (A)"
                                value={comp.properties?.maxCurrent || ''}
                                placeholder="Infinity"
                                onChange={(v) => updateComponentProperty(comp.id, 'maxCurrent', v ? Number(v) : undefined)}
                            />
                            <PropertyInput
                                label="Max Power (W)"
                                value={comp.properties?.maxPower || ''}
                                placeholder="Infinity"
                                onChange={(v) => updateComponentProperty(comp.id, 'maxPower', v ? Number(v) : undefined)}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-white/10 font-medium text-sm text-gray-400 bg-white/5">
                    Wire Selected
                </div>
                <div className="p-4">
                    <button onClick={removeSelection} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg py-2 text-xs hover:bg-red-500/20 transition-colors">
                        Delete Wire
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Tabs.Root className="w-full h-full flex flex-col bg-gray-950/80 backdrop-blur-xl border-l border-white/5" value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-white/10 bg-black/20">
                <Tabs.Trigger
                    value="properties"
                    className="flex-1 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 transition-all"
                >
                    Properties
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="settings"
                    className="flex-1 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 transition-all"
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

const PropertyInput = ({ label, value, onChange, type = "number", placeholder }) => (
    <div className="space-y-1">
        <label className="text-xs text-gray-400">{label}</label>
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all"
        />
    </div>
);

export default InspectorPanel;
