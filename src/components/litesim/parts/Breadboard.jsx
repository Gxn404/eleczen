import React from 'react';

const Breadboard = ({ component }) => {
    // 10x4 mini breadboard
    // Just visual holes for now
    const rows = 4;
    const cols = 10;

    return (
        <g>
            <rect x="-105" y="-25" width="210" height="50" rx="4" fill="#ddd" />
            <rect x="-100" y="-20" width="200" height="40" rx="2" fill="#fff" />

            {/* Holes */}
            {Array.from({ length: cols }).map((_, c) => (
                Array.from({ length: rows }).map((_, r) => (
                    <circle
                        key={`${c}-${r}`}
                        cx={-90 + c * 20}
                        cy={-15 + r * 10}
                        r="2"
                        fill="#333"
                        opacity="0.5"
                    />
                ))
            ))}

            {/* Center Divider */}
            <path d="M -100 0 L 100 0" stroke="#eee" strokeWidth="2" />
        </g>
    );
};

Breadboard.ports = [
    // Define some ports if we want it to be functional, 
    // but for "Sim-Lite" maybe just use it as a background?
    // Let's add a few key ports for connectivity if needed.
    // For now, no ports, just visual.
];

export default Breadboard;
