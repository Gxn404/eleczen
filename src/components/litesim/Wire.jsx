import React from 'react';

const Wire = ({ wire, fromPos, toPos, path: customPath, active, isSelected, onMouseDown, onDoubleClick }) => {
    // Orthogonal routing fallback
    const midX = (fromPos.x + toPos.x) / 2;
    const defaultPath = `M ${fromPos.x} ${fromPos.y} L ${midX} ${fromPos.y} L ${midX} ${toPos.y} L ${toPos.x} ${toPos.y}`;
    const path = customPath || defaultPath;

    return (
        <g
            onMouseDown={(e) => { e.stopPropagation(); onMouseDown && onMouseDown(e, wire.id); }}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick && onDoubleClick(e, wire.id); }}
            style={{ cursor: 'pointer' }}
        >
            {/* Hit area (thicker invisible line) */}
            <path d={path} stroke="transparent" strokeWidth="15" fill="none" />

            {/* Selection Halo */}
            {isSelected && (
                <path d={path} stroke="#0ff" strokeWidth="6" strokeOpacity="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {/* Base Wire */}
            <path d={path} stroke="#444" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={path} stroke={active ? "#0ff" : "#666"} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* Current Animation */}
            {active && (
                <path
                    d={path}
                    stroke="#fff"
                    strokeWidth="2"
                    strokeDasharray="4 8"
                    fill="none"
                    className="animate-dash"
                />
            )}
        </g>
    );
};

export default Wire;
