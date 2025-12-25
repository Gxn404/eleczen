import React, { useState, useEffect, useMemo } from 'react';
import { globalModelStore } from '@/lib/litesim/modelStore';
import { supabase } from '../../../supabase/supabase';

const CATEGORIES = [
    { id: 'all', label: 'All Components' },
    { id: 'passive', label: 'Passives' },
    { id: 'semicon', label: 'Semiconductors' },
    { id: 'source', label: 'Sources' },
    { id: 'ic', label: 'Integrated Circuits' },
    { id: 'mech', label: 'Electromechanical' }
];

const STANDARD_COMPONENTS = [
    { type: 'resistor', name: 'Resistor', category: 'passive', symbol: 'R' },
    { type: 'capacitor', name: 'Capacitor', category: 'passive', symbol: 'C' },
    { type: 'inductor', name: 'Inductor', category: 'passive', symbol: 'L' },
    { type: 'diode', name: 'Diode', category: 'semicon', symbol: 'D' },
    { type: 'led', name: 'LED', category: 'semicon', symbol: 'D' },
    { type: 'transistor', name: 'NPN Transistor', category: 'semicon', symbol: 'Q' },
    { type: 'mosfet', name: 'N-MOSFET', category: 'semicon', symbol: 'M' },
    { type: 'battery', name: 'Voltage Source', category: 'source', symbol: 'V' },
    { type: 'switch', name: 'Switch', category: 'mech', symbol: 'S' },
];

export const LibraryChooser = ({ isOpen, onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [models, setModels] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const loadItems = async () => {
                // 1. Standard Components
                let items = [...STANDARD_COMPONENTS];

                // 2. Local Store Models
                const storeModels = globalModelStore.getAllModels().map(m => ({
                    ...m,
                    category: 'semicon',
                    source: 'local',
                    symbol: m.type.charAt(0).toUpperCase()
                }));
                const storeSubckts = globalModelStore.getAllSubckts().map(s => ({
                    ...s,
                    type: 'subckt',
                    category: 'ic',
                    source: 'local',
                    symbol: 'X'
                }));
                items = [...items, ...storeModels, ...storeSubckts];

                // 3. Supabase Library Index
                const { data, error } = await supabase
                    .from('library_index')
                    .select('*')
                    .limit(100); // Limit for now

                if (data) {
                    const remoteItems = data.map(d => ({
                        name: d.name,
                        type: d.type === 'subckt' ? 'ic' : d.type, // Map types
                        category: d.type === 'subckt' ? 'ic' : 'semicon', // Simplified mapping
                        source: 'library',
                        symbol: d.type === 'subckt' ? 'X' : 'Q', // Simplified symbol mapping
                        params: d.parameters,
                        nodes: d.pins
                    }));
                    items = [...items, ...remoteItems];
                }

                setModels(items);
            };
            loadItems();
        }
    }, [isOpen]);

    const filteredItems = useMemo(() => {
        return models.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === 'all' || item.category === category;
            return matchesSearch && matchesCategory;
        });
    }, [models, search, category]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-[800px] h-[600px] rounded-xl shadow-2xl flex overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                {/* Sidebar */}
                <div className="w-48 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Categories</h3>
                    <div className="space-y-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${category === cat.id
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            ✕
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-4 content-start">
                        {filteredItems.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedItem(item)}
                                onDoubleClick={() => onSelect(item)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedItem === item
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                    }`}
                            >
                                <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.type}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview Panel */}
                {selectedItem && (
                    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Preview</h3>
                        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder for symbol preview */}
                            <span className="text-6xl font-serif text-gray-400">{selectedItem.symbol || '?'}</span>
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">{selectedItem.source === 'library' ? 'LIB' : 'STD'}</div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="text-sm">
                                <span className="text-gray-500">Type:</span> <span className="font-medium dark:text-gray-300 ml-2">{selectedItem.type}</span>
                            </div>
                            {selectedItem.params && (
                                <div className="text-xs text-gray-500 font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                                    {Object.entries(selectedItem.params).map(([k, v]) => (
                                        <div key={k}>{k}: {v}</div>
                                    ))}
                                </div>
                            )}
                            {selectedItem.nodes && (
                                <div className="text-xs text-gray-500">
                                    Nodes: {selectedItem.nodes.join(', ')}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => onSelect(selectedItem)}
                            className="mt-auto w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
                        >
                            Place Component
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
