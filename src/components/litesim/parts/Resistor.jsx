import React from 'react';

const Resistor = ({ component }) => {
    return (
        <g>
            {/* Body Zigzag */}
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
