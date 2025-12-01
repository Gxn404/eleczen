import React from 'react';

const Switch = ({ component }) => {
    const on = component?.state?.on;

    return (
        <g>
            {/* Base */}
            <rect x="-15" y="-10" width="30" height="20" fill="#222" rx="2" />

            {/* Terminals */}
            <path d="M -20 0 L -15 0" stroke="#888" strokeWidth="2" />
            <path d="M 15 0 L 20 0" stroke="#888" strokeWidth="2" />

            {/* Lever */}
            <path
                d={on ? "M -10 0 L 10 0" : "M -10 0 L 8 -8"}
                stroke={on ? "#0f0" : "#f00"} strokeWidth="2"
                className="transition-all duration-300 ease-in-out"
            />

            {/* Click Area (invisible) */}
            <rect x="-15" y="-15" width="30" height="30" fill="transparent" style={{ cursor: 'pointer' }} />
        </g>
    );
};

Switch.ports = [
    { id: 'in', x: -20, y: 0 },
    { id: 'out', x: 20, y: 0 }
];

export default Switch;
