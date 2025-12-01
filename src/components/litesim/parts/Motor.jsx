import React from 'react';

const Motor = ({ component }) => {
    const active = component?.state?.active;
    const speed = component?.state?.speed || 0;

    return (
        <g>
            {/* Body */}
            <circle cx="0" cy="0" r="20" fill="#333" stroke="#666" strokeWidth="2" />

            {/* Shaft/Rotor */}
            <g className={active ? "animate-spin" : ""} style={{ animationDuration: active ? `${Math.max(100, 2000 - (speed * 20))}ms` : '0s' }}>
                <rect x="-2" y="-15" width="4" height="30" fill="#888" />
                <rect x="-15" y="-2" width="30" height="4" fill="#888" />
                <circle cx="0" cy="0" r="5" fill="#ccc" />
            </g>

            {/* Terminals */}
            <path d="M -10 20 L -10 25" stroke="#888" strokeWidth="2" />
            <path d="M 10 20 L 10 25" stroke="#888" strokeWidth="2" />
        </g>
    );
};

Motor.ports = [
    { id: 'pos', x: -10, y: 25 },
    { id: 'neg', x: 10, y: 25 }
];

export default Motor;
