import React from 'react';

const CustomComponent = ({ component, showLabels }) => {
    const { symbol } = component.customDef || {};

    if (!symbol) {
        // Fallback if no symbol data
        return (
            <g>
                <rect x="-20" y="-20" width="40" height="40" fill="none" stroke="white" strokeWidth="2" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10">?</text>
            </g>
        );
    }

    // Parse KiCad graphic commands
    // This is a simplified parser for common shapes
    const shapes = [];
    const lines = symbol.split(/\r?\n/);

    lines.forEach((line, i) => {
        const parts = line.trim().split(/\s+/);
        const type = parts[0];

        // Coordinate scaling: KiCad units are often 50 or 100 per grid unit. 
        // We need to scale them to our grid (10px).
        // Let's assume 50 units = 10px (scale 0.2) or 100 units = 10px (scale 0.1).
        // Standard KiCad is 50 mil grid.
        const scale = 0.1;

        if (type === 'S') { // Rectangle
            // S x1 y1 x2 y2 unit convert thickness fill
            const x1 = parseInt(parts[1]) * scale;
            const y1 = parseInt(parts[2]) * scale;
            const x2 = parseInt(parts[3]) * scale;
            const y2 = parseInt(parts[4]) * scale;

            const x = Math.min(x1, x2);
            const y = Math.min(y1, y2); // KiCad Y is inverted? Usually Y goes up in KiCad?
            // KiCad Y axis: Up is negative? No, Up is positive in math, but in SVG Y is down.
            // KiCad V5/6: Y increases downwards.
            // Legacy: Y increases upwards.
            // Let's try inverting Y.

            const width = Math.abs(x2 - x1);
            const height = Math.abs(y2 - y1);

            shapes.push(
                <rect key={i} x={x} y={-Math.max(y1, y2)} width={width} height={height} fill="none" stroke="white" strokeWidth="2" />
            );
        } else if (type === 'C') { // Circle
            // C x y radius unit convert thickness fill
            const cx = parseInt(parts[1]) * scale;
            const cy = parseInt(parts[2]) * scale;
            const r = parseInt(parts[3]) * scale;

            shapes.push(
                <circle key={i} cx={cx} cy={-cy} r={r} fill="none" stroke="white" strokeWidth="2" />
            );
        } else if (type === 'P') { // Polyline
            // P count unit convert thickness x1 y1 ...
            const count = parseInt(parts[1]);
            const points = [];
            for (let j = 0; j < count; j++) {
                const px = parseInt(parts[5 + j * 2]) * scale;
                const py = parseInt(parts[6 + j * 2]) * scale;
                points.push(`${px},${-py}`);
            }

            shapes.push(
                <polyline key={i} points={points.join(' ')} fill="none" stroke="white" strokeWidth="2" />
            );
        }
        // Add more shapes (Arc A, Text T) as needed
    });

    return (
        <g>
            {shapes}
            {showLabels && (
                <text x="0" y="-30" textAnchor="middle" fill="#aaa" fontSize="10">
                    {component.type}
                </text>
            )}
        </g>
    );
};

// Static ports definition is not possible here as it depends on the instance
// But ComponentNode handles ports from the instance if available

export default CustomComponent;
