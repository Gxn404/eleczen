import React from 'react';

const Battery = ({ component }) => {
    return (
        <g>
            {/* Body */}
            <rect x="-20" y="-30" width="40" height="60" rx="4" fill="#333" stroke="#0ff" strokeWidth="2" />
            {/* Terminals */}
            <path d="M -10 -30 L -10 -40" stroke="#888" strokeWidth="2" />
            <path d="M 10 -30 L 10 -40" stroke="#888" strokeWidth="2" />

            {/* Plus/Minus */}
            <text x="-15" y="-10" fill="#0ff" fontSize="12" fontFamily="monospace">+</text>
            <text x="5" y="-10" fill="#0ff" fontSize="12" fontFamily="monospace">-</text>

            {/* Label */}
            <text x="0" y="10" fill="#666" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {component?.properties?.voltage || 9}V
            </text>
        </g>
    );
};

Battery.ports = [
    { id: 'pos', x: -10, y: -40 },
    { id: 'neg', x: 10, y: -40 }
];

Battery.defaultSize = { width: 40, height: 60 };

export default Battery;
