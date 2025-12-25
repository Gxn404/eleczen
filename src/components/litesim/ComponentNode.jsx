import React, { useRef } from 'react';
import { getComponentDef } from './StandardParts';
import CustomComponent from './CustomComponent';

const ComponentNode = ({ component, isSelected, onMouseDown, showLabels = true }) => {
    const { type, x, y, rotation, state } = component;
    let CompDef = getComponentDef(type);
    let ports = CompDef?.ports;

    // Handle Custom Components
    if (!CompDef && component.customDef) {
        CompDef = CustomComponent;
        ports = component.customDef.ports;
    }

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

            {/* Burned Overlay */}
            {state?.burned && (
                <g className="animate-pulse">
                    <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="red">🔥</text>
                    <rect x="-25" y="-25" width="50" height="50" fill="rgba(0,0,0,0.5)" rx="5" />
                </g>
            )}

            {/* Render Ports for interaction */}
            {ports && ports.map(port => (
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
