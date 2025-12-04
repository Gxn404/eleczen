import React from 'react';

const Inductor = ({ component }) => {
    return (
        <g>
            {/* Coils (Arcs) */}
            <path d="M -20 0 Q -15 -15 -10 0 Q -5 -15 0 0 Q 5 -15 10 0 Q 15 -15 20 0"
                fill="none" stroke="#d4a373" strokeWidth="2" />

            {/* Magnetic Field Glow */}
            {Math.abs(component?.state?.current || 0) > 1e-3 && (
                <path d="M -20 0 Q -15 -15 -10 0 Q -5 -15 0 0 Q 5 -15 10 0 Q 15 -15 20 0"
                    fill="none" stroke="#0ff" strokeWidth="4" filter="blur(3px)" opacity={Math.min(1, Math.abs(component.state.current) * 100)} />
            )}

            {/* Terminals */}
            <circle cx="-20" cy="0" r="2" fill="#888" />
            <circle cx="20" cy="0" r="2" fill="#888" />

            {/* Value Label */}
            <text x="0" y="20" fill="#aaa" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {component?.properties?.inductance || '1m'}H
            </text>
        </g>
    );
};

Inductor.ports = [
    { id: 'p1', x: -20, y: 0 },
    { id: 'p2', x: 20, y: 0 }
];

export default Inductor;
