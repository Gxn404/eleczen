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

        attrs += ` stroke="#3d0000ff" stroke-width="${strokeWidth}"`;

        // Fill
        let fill = 'none';
        if (item.fill) {
            if (item.fill.type === 'background') fill = '#ffeaa4ff'; // Cornsilk
            else if (item.fill.type === 'outline') fill = 'none';
            else if (item.fill.type === 'solid') fill = 'black';
        }
        attrs += ` fill="${fill}"`;

        return attrs;
    };

    // Draw Graphics
    if (graphics) {
        graphics.forEach(item => {
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
                if (item.start && item.end) {
                    svgContent += `<line x1="${item.start.x}" y1="${item.start.y}" x2="${item.end.x}" y2="${item.end.y}" ${attrs} />`;
                }
            } else if (item.type === 'polyline' && item.points) {
                const pointsStr = item.points.map(p => `${p.x},${p.y}`).join(' ');
                svgContent += `<polyline points="${pointsStr}" ${attrs} />`;
            } else if (item.type === 'text') {
                const fontSize = 1.27;
                const escapedText = item.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                svgContent += `<text x="${item.x}" y="${item.y}" font-size="${fontSize}" fill="black" text-anchor="middle" dominant-baseline="middle">${escapedText}</text>`;
            }
        });
    }

    // Draw Properties (Text)
    if (properties) {
        Object.values(properties).forEach(prop => {
            if (prop.visible && prop.value) {
                const escapedText = prop.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const fontSize = 1.27;
                let transform = '';
                if (prop.rot) {
                    transform = `transform="rotate(${prop.rot} ${prop.x} ${prop.y})"`;
                }
                svgContent += `<text x="${prop.x}" y="${prop.y}" font-size="${fontSize}" fill="black" text-anchor="middle" dominant-baseline="middle" ${transform}>${escapedText}</text>`;
            }
        });
    }

    // Draw Pins
    if (pins) {
        Object.values(pins).forEach(pin => {
            svgContent += `<circle cx="${pin.x}" cy="${pin.y}" r="0.254" fill="#3d0000ff" />`;
        });
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" width="100" height="100">${svgContent}</svg>`;
}
