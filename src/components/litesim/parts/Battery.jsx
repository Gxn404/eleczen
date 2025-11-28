import React from 'react';

const Battery = ({ component }) => {
    return (
        <g>
            {/* Body */}
            <rect x="-20" y="-30" width="40" height="60" rx="4" fill="#333" stroke="rgba(0, 0, 0, 1)" strokeWidth="1" />
            <rect x="-20" y="-30" width="40" height="20" rx="4" fill="#9e4d00ff" />
            {/* Terminals */}
            <path d="M -10 -30 L -10 -40" stroke="#888" strokeWidth="2" />
            <path d="M 10 -30 L 10 -40" stroke="#888" strokeWidth="2" />

            {/* Plus/Minus */}
            <text x="-15" y="-15" fill="rgba(255, 255, 255, 1)" fontSize="12" fontFamily="monospace">+</text>
            <text x="5" y="-15" fill="rgba(255, 255, 255, 1)" fontSize="12" fontFamily="monospace">-</text>

            {/* Label */}
            <text x="0" y="10" fill="#ffffffff" fontSize="10" textAnchor="middle" fontFamily="monospace">
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
