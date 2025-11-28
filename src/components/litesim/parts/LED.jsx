import React from 'react';

const LED = ({ component }) => {
    const active = component?.state?.active;
    const color = component?.properties?.color || component?.state?.color || '#f00'; // Default red

    return (
        <g>
            {/* Glow Filter defs could be global, but inline for now or simple opacity */}
            {active && (
                <circle cx="0" cy="-10" r="15" fill={color} opacity="0.4" filter="blur(4px)" />
            )}

            {/* Bulb */}
            <path d="M -10 0 L -10 -20 A 10 10 0 1 1 10 -20 L 10 0 Z" fill={active ? color : '#300'} stroke={active ? color : '#500'} strokeWidth="2" />

            {/* Legs */}
            <path d="M -5 0 L -5 20" stroke="#888" strokeWidth="2" />
            <path d="M 5 0 L 5 20" stroke="#888" strokeWidth="2" />

            {/* Anode/Cathode markers */}
            <text x="-12" y="15" fill="#444" fontSize="8">+</text>
        </g>
    );
};

LED.ports = [
    { id: 'anode', x: -5, y: 20 },
    { id: 'cathode', x: 5, y: 20 }
];

export default LED;
