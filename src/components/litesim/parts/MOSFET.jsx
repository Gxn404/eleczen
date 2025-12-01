import React from 'react';

const MOSFET = ({ component }) => {
    return (
        <g>
            {/* Body */}
            <circle cx="0" cy="0" r="15" fill="#222" stroke="#666" />

            {/* Gate */}
            <path d="M -8 -10 L -8 10" stroke="#888" strokeWidth="2" />
            <path d="M -15 0 L -8 0" stroke="#888" strokeWidth="2" /> {/* Gate Leg */}

            {/* Channel (Broken line for enhancement mode) */}
            <path d="M -2 -10 L -2 -3" stroke="#888" strokeWidth="2" />
            <path d="M -2 -2 L -2 2" stroke="#888" strokeWidth="2" />
            <path d="M -2 3 L -2 10" stroke="#888" strokeWidth="2" />

            {/* Source/Drain Legs */}
            <path d="M -2 -7 L 10 -10" stroke="#888" strokeWidth="2" /> {/* Drain */}
            <path d="M -2 7 L 10 10" stroke="#888" strokeWidth="2" /> {/* Source */}

            {/* Substrate Arrow (NMOS pointing in) */}
            <path d="M 5 0 L -2 0" stroke="#888" strokeWidth="2" />
            <path d="M -2 0 L 1 -3 L 1 3 Z" fill="#888" />

            {/* Labels */}
            <text x="-20" y="4" fill="#666" fontSize="8">G</text>
            <text x="12" y="-12" fill="#666" fontSize="8">D</text>
            <text x="12" y="15" fill="#666" fontSize="8">S</text>
        </g>
    );
};

MOSFET.ports = [
    { id: 'gate', x: -15, y: 0 },
    { id: 'drain', x: 10, y: -10 },
    { id: 'source', x: 10, y: 10 }
];

export default MOSFET;
