"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useLiteSimStore } from '@/lib/litesim/state';
import ComponentNode from './ComponentNode';
import Wire from './Wire';
import { getComponentDef } from './parts';

const Canvas = () => {
    const {
        components, wires, selection,
        addComponent, updateComponentPosition, addWire,
        setSelection, removeSelection, runSimulation
    } = useLiteSimStore();

    const svgRef = useRef(null);
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const [drag, setDrag] = useState(null); // { type: 'pan' | 'comp', id, startX, startY, origX, origY }
    const [wiring, setWiring] = useState(null); // { fromComp, fromPort, currX, currY }

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(runSimulation, 100);
        return () => clearInterval(interval);
    }, [runSimulation]);

    // Coordinate conversion
    const screenToWorld = (sx, sy) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const pt = svgRef.current.createSVGPoint();
        pt.x = sx;
        pt.y = sy;
        return pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    };

    const handleMouseDown = (e) => {
        // Check if clicked on a port
        if (e.target.dataset.portId) {
            const compId = e.target.dataset.compId;
            const portId = e.target.dataset.portId;
            const pt = screenToWorld(e.clientX, e.clientY);
            setWiring({ fromComp: compId, fromPort: portId, currX: pt.x, currY: pt.y });
            e.stopPropagation();
            return;
        }

        // Pan start
        setDrag({ type: 'pan', startX: e.clientX, startY: e.clientY, origX: view.x, origY: view.y });
    };

    const handleCompMouseDown = (e, id) => {
        e.stopPropagation();
        const pt = screenToWorld(e.clientX, e.clientY);
        const comp = components.find(c => c.id === id);
        setSelection('component', id);
        setDrag({ type: 'comp', id, startX: pt.x, startY: pt.y, origX: comp.x, origY: comp.y });
    };

    const handleMouseMove = (e) => {
        if (wiring) {
            const pt = screenToWorld(e.clientX, e.clientY);
            setWiring(prev => ({ ...prev, currX: pt.x, currY: pt.y }));
            return;
        }

        if (!drag) return;

        if (drag.type === 'pan') {
            const dx = e.clientX - drag.startX;
            const dy = e.clientY - drag.startY;
            setView(prev => ({ ...prev, x: drag.origX + dx, y: drag.origY + dy }));
        } else if (drag.type === 'comp') {
            const pt = screenToWorld(e.clientX, e.clientY);
            const dx = pt.x - drag.startX;
            const dy = pt.y - drag.startY;
            // Snap to grid (10px)
            let newX = Math.round((drag.origX + dx) / 10) * 10;
            let newY = Math.round((drag.origY + dy) / 10) * 10;
            updateComponentPosition(drag.id, newX, newY);
        }
    };

    const handleMouseUp = (e) => {
        if (wiring) {
            // Check if dropped on a port
            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (target && target.dataset.portId) {
                const toComp = target.dataset.compId;
                const toPort = target.dataset.portId;
                if (toComp !== wiring.fromComp) {
                    addWire(wiring.fromComp, wiring.fromPort, toComp, toPort);
                }
            }
            setWiring(null);
        }
        setDrag(null);
    };

    const handleWheel = (e) => {
        // Simple zoom
        const newZoom = Math.max(0.1, Math.min(5, view.zoom - e.deltaY * 0.001));
        setView(prev => ({ ...prev, zoom: newZoom }));
    };

    // Handle Drop from Toolbar
    const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('componentType');
        if (type) {
            const pt = screenToWorld(e.clientX, e.clientY);
            // Snap
            const x = Math.round(pt.x / 10) * 10;
            const y = Math.round(pt.y / 10) * 10;
            addComponent(type, x, y);
        }
    };

    return (
        <div
            className="w-full h-full bg-black overflow-hidden relative"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
        >
            {/* Grid Background (CSS pattern) */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                    backgroundSize: `${20 * view.zoom}px ${20 * view.zoom}px`,
                    backgroundPosition: `${view.x}px ${view.y}px`
                }}
            />

            <svg
                ref={svgRef}
                className="w-full h-full touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                viewBox={`0 0 ${1000} ${1000}`} // ViewBox is tricky with pan/zoom, better to use transform group
            >
                <g transform={`translate(${view.x}, ${view.y}) scale(${view.zoom})`}>
                    {/* Wires */}
                    {wires.map(wire => {
                        const c1 = components.find(c => c.id === wire.fromComp);
                        const c2 = components.find(c => c.id === wire.toComp);
                        if (!c1 || !c2) return null;

                        const def1 = getComponentDef(c1.type);
                        const def2 = getComponentDef(c2.type);
                        const p1 = def1.ports.find(p => p.id === wire.fromPort);
                        const p2 = def2.ports.find(p => p.id === wire.toPort);

                        // Transform local port coords to world
                        // Simple rotation logic omitted for brevity, assuming 0 rotation for now
                        const w1 = { x: c1.x + p1.x, y: c1.y + p1.y };
                        const w2 = { x: c2.x + p2.x, y: c2.y + p2.y };

                        return <Wire key={wire.id} wire={wire} fromPos={w1} toPos={w2} active={false} />;
                    })}

                    {/* Wiring Line */}
                    {wiring && (
                        <path
                            d={`M ${wiring.currX} ${wiring.currY} L ${
                                // Find start pos
                                (() => {
                                    const c = components.find(c => c.id === wiring.fromComp);
                                    const def = getComponentDef(c.type);
                                    const p = def.ports.find(p => p.id === wiring.fromPort);
                                    return `${c.x + p.x} ${c.y + p.y}`;
                                })()
                                }`}
                            stroke="#0ff" strokeWidth="2" strokeDasharray="5 5"
                        />
                    )}

                    {/* Components */}
                    {components.map(comp => (
                        <ComponentNode
                            key={comp.id}
                            component={comp}
                            isSelected={selection?.id === comp.id}
                            onMouseDown={handleCompMouseDown}
                        />
                    ))}
                </g>
            </svg>

            {/* Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700" onClick={() => setView({ x: 0, y: 0, zoom: 1 })}>Reset View</button>
                <button className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700" onClick={() => useLiteSimStore.getState().clearCanvas()}>Clear</button>
                <button className="bg-cyan-900 text-cyan-100 p-2 rounded hover:bg-cyan-800" onClick={() => {
                    // Export JSON
                    const state = useLiteSimStore.getState();
                    const data = JSON.stringify({ components: state.components, wires: state.wires }, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'circuit.json';
                    a.click();
                }}>Export JSON</button>
            </div>
        </div>
    );
};

export default Canvas;
