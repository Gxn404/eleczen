import React from 'react';

const Wire = ({ wire, fromPos, toPos, active }) => {
    // Simple straight line for now, or bezier
    // "Orthogonal" routing would go here later

    const path = `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`;

    return (
        <g>
            {/* Base Wire */}
            <path d={path} stroke="#444" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d={path} stroke={active ? "#0ff" : "#666"} strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Current Animation */}
            {active && (
                <path
                    d={path}
                    stroke="#fff"
                    strokeWidth="2"
                    strokeDasharray="4 8"
                    fill="none"
                    className="animate-dash" // Define this in globals.css
                />
            )}
        </g>
    );
};

export default Wire;
