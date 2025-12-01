import React from 'react';

const Resistor = ({ component }) => {
    return (
        <g>
            {/* Body Zigzag */}
            {component?.state?.power > 0.1 && (
                <path d="M -10 0 L -7 -5 L -3 5 L 0 -5 L 3 5 L 7 -5 L 10 0"
                    fill="none" stroke="#f00" strokeWidth="6" strokeOpacity={Math.min(1, component.state.power)} filter="blur(2px)" />
            )}
            <path d="M -20 0 L -10 0 L -7 -5 L -3 5 L 0 -5 L 3 5 L 7 -5 L 10 0 L 20 0"
                fill="none" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Terminals */}
            <circle cx="-20" cy="0" r="2" fill="#888" />
            <circle cx="20" cy="0" r="2" fill="#888" />

            {/* Value Label */}
            <text x="0" y="15" fill="#aaa" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {component?.properties?.resistance || 1000}Ω
            </text>
        </g>
    );
};

Resistor.ports = [
    { id: 'p1', x: -20, y: 0 },
    { id: 'p2', x: 20, y: 0 }
];

export default Resistor;
