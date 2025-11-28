import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { evaluateCircuit } from './engine';

export const useLiteSimStore = create(
    persist(
        (set, get) => ({
            components: [],
            wires: [],
            selection: null, // { type: 'component' | 'wire', id: string }

            addComponent: (type, x, y) => set(state => ({
                components: [
                    ...state.components,
                    {
                        id: `c_${Date.now()}`,
                        type,
                        x,
                        y,
                        rotation: 0,
                        state: {} // internal state (e.g. switch on/off)
                    }
                ]
            })),

            updateComponentPosition: (id, x, y) => set(state => ({
                components: state.components.map(c =>
                    c.id === id ? { ...c, x, y } : c
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
                // 1. Prevent self-loops (same component, same port - though different ports on same comp might be valid for shorting)
                if (fromComp === toComp && fromPort === toPort) return {};

                // 2. Prevent duplicates (undirected check)
                const exists = state.wires.some(w =>
                    (w.fromComp === fromComp && w.fromPort === fromPort && w.toComp === toComp && w.toPort === toPort) ||
                    (w.fromComp === toComp && w.fromPort === toPort && w.toComp === fromComp && w.toPort === fromPort)
                );
                if (exists) return {};

                return {
                    wires: [
                        ...state.wires,
                        { id: `w_${Date.now()}`, fromComp, fromPort, toComp, toPort }
                    ]
                };
            }),

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

            // Simulation Step
            runSimulation: () => {
                const state = get();
                const updates = evaluateCircuit(state.components, state.wires);

                // Merge updates into components
                set(prev => ({
                    components: prev.components.map(c =>
                        updates[c.id] ? { ...c, state: { ...c.state, ...updates[c.id] } } : c
                    )
                }));
            },

            clearCanvas: () => set({ components: [], wires: [], selection: null }),
        }),
        {
            name: 'eleczen-litesim-storage', // unique name
        }
    )
);
