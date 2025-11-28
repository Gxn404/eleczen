"use client";
import React from 'react';
import { useLiteSimStore } from '@/lib/litesim/state';

const SettingsPanel = () => {
    const { settings, upgrades, updateSetting, toggleUpgrade, simulation } = useLiteSimStore();

    return (
        <div className="w-full h-full flex flex-col bg-gray-950/50 text-gray-300">
            <div className="p-3 border-b border-gray-800 font-medium text-sm text-cyan-400">
                Settings & Upgrades
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* General Settings */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">General</h3>
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-sm cursor-pointer hover:text-white">
                            <span>Snap to Grid</span>
                            <input
                                type="checkbox"
                                checked={settings.snapToGrid}
                                onChange={(e) => updateSetting('snapToGrid', e.target.checked)}
                                className="accent-cyan-500"
                            />
                        </label>
                        <label className="flex items-center justify-between text-sm cursor-pointer hover:text-white">
                            <span>Show Labels</span>
                            <input
                                type="checkbox"
                                checked={settings.showLabels}
                                onChange={(e) => updateSetting('showLabels', e.target.checked)}
                                className="accent-cyan-500"
                            />
                        </label>
                        <label className="flex items-center justify-between text-sm cursor-pointer hover:text-white">
                            <span>Animations</span>
                            <input
                                type="checkbox"
                                checked={settings.enableAnimations}
                                onChange={(e) => updateSetting('enableAnimations', e.target.checked)}
                                className="accent-cyan-500"
                            />
                        </label>
                    </div>
                </section>

                {/* Simulation Parameters */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Simulation</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Mode</span>
                            <span className="text-cyan-400 font-mono">{simulation.mode}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Time Step</span>
                            <span className="text-gray-300 font-mono">{simulation.parameters.timeStep}</span>
                        </div>
                    </div>
                </section>

                {/* Upgrades (Feature Flags) */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Upgrades (Modules)</h3>
                    <div className="space-y-3">
                        {upgrades.map(upgrade => (
                            <div key={upgrade.feature} className="bg-gray-900/50 border border-gray-800 rounded p-3 hover:border-cyan-900/50 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-white">{upgrade.feature}</span>
                                    <button
                                        onClick={() => toggleUpgrade(upgrade.feature)}
                                        className={`w-8 h-4 rounded-full relative transition-colors ${upgrade.enabled ? 'bg-cyan-600' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${upgrade.enabled ? 'left-4.5' : 'left-0.5'}`} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">{upgrade.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPanel;
