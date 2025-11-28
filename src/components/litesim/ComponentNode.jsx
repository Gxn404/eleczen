import React, { useRef } from 'react';
import { getComponentDef } from './parts';

const ComponentNode = ({ component, isSelected, onMouseDown, showLabels = true }) => {
    const { type, x, y, rotation, state } = component;
    const CompDef = getComponentDef(type);

    if (!CompDef) return null;

    return (
        <g
            transform={`translate(${x}, ${y}) rotate(${rotation})`}
            onMouseDown={(e) => onMouseDown(e, component.id)}
            style={{ cursor: 'grab' }}
        >
            {/* Selection Halo */}
            {isSelected && (
                <rect
                    x="-30" y="-30" width="60" height="60"
                    fill="none" stroke="#0ff" strokeWidth="1" strokeDasharray="4 2"
                    rx="5"
                    className="animate-pulse"
                />
            )}

            <CompDef component={component} showLabels={showLabels} />

            {/* Render Ports for interaction */}
            {CompDef.ports.map(port => (
                <circle
                    key={port.id}
                    cx={port.x} cy={port.y} r="6" // Larger hit area
                    fill="white"
                    fillOpacity="0"
                    stroke="transparent"
                    className="hover:fill-opacity-100 hover:fill-white hover:stroke-cyan-500 cursor-crosshair transition-all duration-200"
                    data-port-id={port.id}
                    data-comp-id={component.id}
                />
            ))}
        </g>
    );
};

export default ComponentNode;
