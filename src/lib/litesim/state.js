import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { evaluateCircuit } from './engine';

export const useLiteSimStore = create(
    persist(
        (set, get) => ({
            // New Schema Root
            meta: {
                projectName: "Untitled Project",
                author: "User",
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                version: "1.0.0",
                description: "ElecZen Circuit"
            },
            canvas: {
                width: 1920,
                height: 1080,
                gridSize: 10,
                zoomLevel: 1.0
            },
            components: [], // Now includes 'connections' and 'properties'
            wires: [], // Kept for rendering compatibility, synced with connections
            simulation: {
                mode: "DC",
                parameters: {
                    timeStep: "1ms",
                    totalTime: "100ms",
                    temperature: "25C"
                },
                results: []
            },
            modules: [],
            settings: {
                snapToGrid: true,
                showLabels: true,
                enableAnimations: true
            },
            upgrades: [
                { feature: "Analog Oscilloscope", description: "Virtual oscilloscope", enabled: false },
                { feature: "3D View", description: "3D visualization", enabled: false },
                { feature: "Component Marketplace", description: "Download components", enabled: true }
            ],

            selection: null,
            isRunning: false,

            addComponent: (type, x, y) => set(state => ({
                components: [
                    ...state.components,
                    {
                        id: `c_${Date.now()}`,
                        type,
                        x,
                        y,
                        rotation: 0,
                        state: { active: false },
                        properties: {},
                        connections: [] // New: Pin-based connections
                    }
                ],
                meta: { ...state.meta, lastModified: new Date().toISOString() }
            })),

            updateComponentPosition: (id, x, y) => set(state => ({
                components: state.components.map(c =>
                    c.id === id ? { ...c, x, y } : c
                )
            })),

            updateComponentProperty: (id, key, value) => set(state => ({
                components: state.components.map(c =>
                    c.id === id ? { ...c, properties: { ...c.properties, [key]: value } } : c
                )
            })),

            toggleComponentState: (id) => set(state => {
                const comps = state.components.map(c => {
                    if (c.id !== id) return c;
                    // Toggle logic
                    if (c.type === 'switch') {
                        return { ...c, state: { ...c.state, on: !c.state.on } };
                    }
                    return c;
                });
                return { components: comps };
            }),

            addWire: (fromComp, fromPort, toComp, toPort) => set(state => {
                // 1. Prevent self-loops
                if (fromComp === toComp && fromPort === toPort) return {};

                // 2. Prevent duplicates
                const exists = state.wires.some(w =>
                    (w.fromComp === fromComp && w.fromPort === fromPort && w.toComp === toComp && w.toPort === toPort) ||
                    (w.fromComp === toComp && w.fromPort === toPort && w.toComp === fromComp && w.toPort === fromPort)
                );
                if (exists) return {};

                return {
                    wires: [
                        ...state.wires,
                        { id: `w_${Date.now()}`, fromComp, fromPort, toComp, toPort, points: null }
                    ]
                };
            }),

            updateWirePoints: (id, points) => set(state => ({
                wires: state.wires.map(w => w.id === id ? { ...w, points } : w)
            })),

            removeSelection: () => set(state => {
                if (!state.selection) return {};
                if (state.selection.type === 'component') {
                    return {
                        components: state.components.filter(c => c.id !== state.selection.id),
                        wires: state.wires.filter(w => w.fromComp !== state.selection.id && w.toComp !== state.selection.id),
                        selection: null
                    };
                }
                if (state.selection.type === 'wire') {
                    return {
                        wires: state.wires.filter(w => w.id !== state.selection.id),
                        selection: null
                    };
                }
                return {};
            }),

            setSelection: (type, id) => set({ selection: { type, id } }),

            setIsRunning: (isRunning) => set({ isRunning }),

            updateSetting: (key, value) => set(state => ({
                settings: { ...state.settings, [key]: value }
            })),

            toggleUpgrade: (featureName) => set(state => ({
                upgrades: state.upgrades.map(u =>
                    u.feature === featureName ? { ...u, enabled: !u.enabled } : u
                )
            })),

            // Simulation Step
            runSimulation: () => {
                const state = get();
                if (!state.isRunning) return; // Only run if enabled

                const updates = evaluateCircuit(state.components, state.wires);

                // Merge updates into components
                if (updates && Object.keys(updates).length > 0) {
                    set(prev => ({
                        components: prev.components.map(c =>
                            updates[c.id] ? { ...c, state: { ...c.state, ...updates[c.id] } } : c
                        )
                    }));
                }
            },

            clearCanvas: () => set({ components: [], wires: [], selection: null }),

            // Modal State
            modal: { isOpen: false, type: null, data: null },
            // Export State
            exportRequest: null, // 'PNG', 'JSON', etc.
            requestExport: (type) => set({ exportRequest: type }),
            resolveExport: () => set({ exportRequest: null }),
        }),
        {
            name: 'eleczen-litesim-storage', // unique name
        }
    )
);
