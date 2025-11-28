import React from 'react';

const Transistor = ({ state }) => {
    return (
        <g>
            {/* Body */}
            <circle cx="0" cy="0" r="15" fill="#222" stroke="#666" />
            <path d="M -5 -10 L -5 10" stroke="#888" strokeWidth="2" /> {/* Base plate */}

            {/* Legs */}
            <path d="M -5 0 L -15 0" stroke="#888" strokeWidth="2" /> {/* Base */}
            <path d="M -5 -5 L 10 -10" stroke="#888" strokeWidth="2" /> {/* Collector */}
            <path d="M -5 5 L 10 10" stroke="#888" strokeWidth="2" /> {/* Emitter */}

            {/* Arrow */}
            <path d="M 5 8 L 10 10 L 7 5" fill="#888" />

            {/* Labels */}
            <text x="-20" y="4" fill="#666" fontSize="8">B</text>
            <text x="12" y="-12" fill="#666" fontSize="8">C</text>
            <text x="12" y="15" fill="#666" fontSize="8">E</text>
        </g>
    );
};

Transistor.ports = [
    { id: 'base', x: -15, y: 0 },
    { id: 'collector', x: 10, y: -10 },
    { id: 'emitter', x: 10, y: 10 }
];

export default Transistor;
