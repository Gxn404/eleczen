/**
 * Generates an SVG string from a KiCad symbol object.
 * @param {Object} symbol - The parsed KiCad symbol object (containing pins, graphics, and properties).
 * @returns {string} The SVG string.
 */
export function generateSvg(symbol) {
    if (!symbol) return '';

    const { pins, graphics, bbox, properties } = symbol;

    // Calculate viewBox with some padding
    const padding = 2.54; // 100 mils
    const x = bbox.x - padding;
    const y = bbox.y - padding;
    const width = bbox.width + (padding * 2);
    const height = bbox.height + (padding * 2);

    let svgContent = '';

    // Helper to get stroke/fill attributes
    const getAttributes = (item) => {
        let attrs = '';

        // Stroke
        let strokeWidth = 0.254; // default
        if (item.stroke && item.stroke.width !== undefined) strokeWidth = item.stroke.width;
        if (strokeWidth === 0) strokeWidth = 0.1;

        // Professional color palette
        attrs += ` stroke="#00031eff" stroke-width="${strokeWidth}"`;
        
        // Fill - improved handling
        let fill = 'none';
        if (item.fill) {
            if (item.fill.type === 'background') fill = '#ffeaa4'; // Cornsilk
            else if (item.fill.type === 'outline') fill = 'none';
            else if (item.fill.type === 'solid') fill = '#f5f5f5'; // Light gray
            else if (typeof item.fill === 'string') fill = item.fill;
            else if (item.type === 'rectangle') {
                // Default fill for shapes that might be bodies
                fill = '#80c0ffff';
             }
        }
        attrs += ` fill="${fill}"`;
        return attrs;
    };

    // Draw Graphics
    if (graphics) {
        const shapes = [];
        graphics.forEach(g => {
            if (g.type == 'rectangle') {
                shapes.unshift(g);
            } else {
                shapes.push(g);
            }
        });
    
        shapes.forEach(item => {
            const attrs = getAttributes(item);

            if (item.type === 'rectangle') {
                const x1 = item.start.x;
                const y1 = item.start.y;
                const x2 = item.end.x;
                const y2 = item.end.y;
                const rx = Math.min(x1, x2);
                const ry = Math.min(y1, y2);
                const rw = Math.abs(x2 - x1);
                const rh = Math.abs(y2 - y1);
                svgContent += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" ${attrs} />`;
            } else if (item.type === 'circle') {
                svgContent += `<circle cx="${item.center.x}" cy="${item.center.y}" r="${item.radius}" ${attrs} />`;
            } else if (item.type === 'arc') {
                // SVG Arc: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                const start = item.startPoint;
                const end = item.endPoint;
                const rx = item.radiusX;
                const ry = item.radiusY;

                // Heuristic for flags: usually sweep flag 0 for LTspice arcs if drawn counter-clockwise?
                svgContent += `<path d="M ${start.x} ${start.y} A ${rx} ${ry} 0 0 0 ${end.x} ${end.y}" ${attrs} />`;
            } else if (item.type === 'polyline' && item.points) {
                const pointsStr = item.points.map(p => `${p.x},${p.y}`).join(' ');
                svgContent += `<polyline points="${pointsStr}" ${attrs} />`;
            } else if (item.type === 'text') {
                const fontSize = 2; // Larger for better readability
                const escapedText = item.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                svgContent += `<text x="${item.x}" y="${item.y}" font-size="${fontSize}" fill="#333333" text-anchor="middle" dominant-baseline="middle">${escapedText}</text>`;
            }
        });
    }

    // Draw Properties (Text)
    if (properties) {
        Object.values(properties).forEach(prop => {
            if (prop.visible && prop.value) {
                const escapedText = prop.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                let fontSize = 2.0; // Increased for better visibility
                if (prop.size) fontSize = prop.size * 0.5; // Scale appropriately

                let transform = '';
                if (prop.rot) {
                    transform = `transform="rotate(${prop.rot} ${prop.x} ${prop.y})"`;
                }

                let anchor = "middle";
                if (prop.align) {
                    if (prop.align.includes('Left')) anchor = "end";
                    if (prop.align.includes('Right')) anchor = "start";
                }

                svgContent += `<text x="${prop.x}" y="${prop.y}" font-size="2" font-family="monospace" font-weight="bold" fill="#333333" text-anchor="${anchor}" dominant-baseline="middle" ${transform}>${escapedText}</text>`;
            }
        });
    }

    // Draw Pins
    if (pins) {
        Object.values(pins).forEach(pin => {
            // Calculate pin stub line based on alignment
            // Pins that are outside the component body need a line connecting to the edge
            let bodyX = pin.x;
            let bodyY = pin.y;
            let connX = pin.x;
            let connY = pin.y;
            let stubLength = 2.54; // Standard stub length (100 mils)

            if (pin.align === 'LEFT') {
                connX = pin.x - stubLength; // Extend left
            } else if (pin.align === 'RIGHT') {
                connX = pin.x + stubLength; // Extend right
            } else if (pin.align === 'TOP') {
                connY = pin.y - stubLength; // Extend up
            } else if (pin.align === 'BOTTOM') {
                connY = pin.y + stubLength; // Extend down
            }

            // Draw pin stub line
            if (bodyX !== connX || bodyY !== connY) {
                svgContent += `<line x1="${bodyX}" y1="${bodyY}" x2="${connX}" y2="${connY}" stroke="#00031eff" stroke-width="0.254" />`;
            }

            // Pin connection point at the END of the stub (away from body)
            // Small square marker at connection point
            const markerSize = 0.4;
            svgContent += `<rect x="${connX - markerSize / 2}" y="${connY - markerSize / 2}" width="${markerSize}" height="${markerSize}" fill="#00031eff" stroke="none" />`;

            // Draw Pin Name
            if (pin.name && pin.name !== '~') {
                let tx = pin.x; 
                let ty = pin.y - 0.6;
                let anchor = "middle";
                let baseline = "bottom";

                // Adjust based on alignment
                if (pin.align === 'LEFT') { tx = pin.x + 0.8; ty = pin.y - 0.8; anchor = "start"; baseline = "middle"; }
                else if (pin.align === 'RIGHT') { tx = pin.x - 0.8; ty = pin.y - 0.8; anchor = "end"; baseline = "middle"; }
                else if (pin.align === 'TOP') { tx = pin.x + 0.8; ty = pin.y + 0.8; anchor = "start"; baseline = "hanging"; }
                else if (pin.align === 'BOTTOM') { tx = pin.x + 0.8; ty = pin.y - 0.8; anchor = "start"; baseline = "bottom"; }

                // Pin labels
                svgContent += `<text x="${tx}" y="${ty}" font-size="1.5" font-family="monospace" fill="#00031eff" font-weight="bold" text-anchor="${anchor}" dominant-baseline="${baseline}">${pin.name.toUpperCase()}</text>`;
            }
        });
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" width="100" height="100">${svgContent}</svg>`;
}
