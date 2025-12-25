/**
 * Parses LTspice symbol content (.asy).
 * @param {string} content - The raw symbol file content.
 * @returns {Array} Parsed symbols (usually just one per file).
 */
export function parseLtspice(content) {
    const lines = content.split(/\r?\n/);
    const symbols = [];

    // LTspice .asy files typically contain one symbol definition.
    // We will construct one symbol object.

    const symbol = {
        name: 'Unknown', // Will be set from filename usually, or maybe SYMATTR Value?
        pins: {},
        graphics: [],
        properties: {},
        bbox: { x: 0, y: 0, width: 0, height: 0 }
    };

    const SCALE = 2.54 / 16; // Convert LTspice units (approx 16 per grid) to KiCad units (2.54mm per grid)

    let lastPin = null;
    const windows = [];

    // Helper to scale coordinates
    const s = (val) => parseFloat(val) * SCALE;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(/\s+/);
        const type = parts[0];

        if (type === 'LINE') {
            // LINE <style> <x1> <y1> <x2> <y2>
            const x1 = s(parts[2]);
            const y1 = s(parts[3]);
            const x2 = s(parts[4]);
            const y2 = s(parts[5]);
            symbol.graphics.push({
                type: 'polyline',
                points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
                stroke: { width: 0.254 } // Default width
            });
        } else if (type === 'RECT' || type === 'RECTANGLE') {
            // RECT <style> <x1> <y1> <x2> <y2>
            const style = parts[1];
            const x1 = s(parts[2]);
            const y1 = s(parts[3]);
            const x2 = s(parts[4]);
            const y2 = s(parts[5]);
            symbol.graphics.push({
                type: 'rectangle',
                start: { x: x1, y: y1 },
                end: { x: x2, y: y2 },
                stroke: { width: 0.254 },
                fill: { type: style === 'Filled' ? 'solid' : 'none' }
            });
        } else if (type === 'CIRCLE') {
            // CIRCLE <style> <x1> <y1> <x2> <y2>
            const style = parts[1];
            const x1 = s(parts[2]);
            const y1 = s(parts[3]);
            const x2 = s(parts[4]);
            const y2 = s(parts[5]);
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const r = Math.abs(x2 - x1) / 2;
            symbol.graphics.push({
                type: 'circle',
                center: { x: cx, y: cy },
                radius: r,
                stroke: { width: 0.254 },
                fill: { type: style === 'Filled' ? 'solid' : 'none' }
            });
        } else if (type === 'ARC') {
            // ARC <style> <x1> <y1> <x2> <y2> <x3> <y3> <x4> <y4>
            const style = parts[1]; // Usually Normal, but could be Filled?
            const x1 = s(parts[2]);
            const y1 = s(parts[3]);
            const x2 = s(parts[4]);
            const y2 = s(parts[5]);
            const x3 = s(parts[6]);
            const y3 = s(parts[7]);
            const x4 = s(parts[8]);
            const y4 = s(parts[9]);

            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;

            symbol.graphics.push({
                type: 'arc',
                center: { x: cx, y: cy },
                radiusX: rx,
                radiusY: ry,
                startPoint: { x: x3, y: y3 },
                endPoint: { x: x4, y: y4 },
                stroke: { width: 0.254 },
                fill: { type: style === 'Filled' ? 'solid' : 'none' }
            });
        } else if (type === 'TEXT') {
            // TEXT <x> <y> <align> <string...>
            const x = s(parts[1]);
            const y = s(parts[2]);
            const align = parts[3];
            const text = parts.slice(4).join(' ');
            symbol.graphics.push({
                type: 'text',
                x: x,
                y: y,
                text: text,
                align: align
            });
        } else if (type === 'PIN') {
            // PIN <x> <y> <align> <off>
            const x = s(parts[1]);
            const y = s(parts[2]);
            const align = parts[3];
            lastPin = { x, y, direction: 'passive', number: '', name: '', align };
        } else if (type === 'PINATTR') {
            if (!lastPin) continue;
            const attr = parts[1];
            const val = parts.slice(2).join(' ');
            if (attr === 'PinName') {
                lastPin.name = val;
            } else if (attr === 'SpiceOrder') {
                lastPin.number = val;
            }
            if (lastPin.name) {
                symbol.pins[lastPin.name] = lastPin;
            }
        } else if (type === 'SYMATTR') {
            // SYMATTR <key> <value...>
            const key = parts[1];
            const val = parts.slice(2).join(' ');

            let propKey = key;
            if (key === 'Prefix') propKey = 'Reference';
            if (key === 'Value') propKey = 'Value';

            symbol.properties[propKey] = {
                value: val,
                visible: false,
                x: 0, y: 0, rot: 0
            };
        } else if (type === 'WINDOW') {
            // WINDOW <index> <x> <y> <align> <size>
            const idx = parseInt(parts[1]);
            const x = s(parts[2]);
            const y = s(parts[3]);
            const align = parts[4];
            const size = parseFloat(parts[5]);
            windows.push({ idx, x, y, align, size });
        }
    }

    // Apply WINDOWs
    windows.forEach(win => {
        let targetKey = null;
        if (win.idx === 0) targetKey = 'Reference';
        else if (win.idx === 3 || win.idx === 38 || win.idx === 39) targetKey = 'Value';

        if (targetKey && symbol.properties[targetKey]) {
            symbol.properties[targetKey].visible = true;
            symbol.properties[targetKey].x = win.x;
            symbol.properties[targetKey].y = win.y;
            symbol.properties[targetKey].align = win.align;
            symbol.properties[targetKey].size = win.size;
        }
    });

    // Calculate BBox
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const update = (x, y) => {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    };

    Object.values(symbol.pins).forEach(p => update(p.x, p.y));
    symbol.graphics.forEach(g => {
        if (g.points) g.points.forEach(p => update(p.x, p.y));
        if (g.start) update(g.start.x, g.start.y);
        if (g.end) update(g.end.x, g.end.y);
        if (g.center) {
            const rx = g.radiusX || g.radius;
            const ry = g.radiusY || g.radius;
            update(g.center.x - rx, g.center.y - ry);
            update(g.center.x + rx, g.center.y + ry);
        }
        if (g.startPoint) update(g.startPoint.x, g.startPoint.y);
        if (g.endPoint) update(g.endPoint.x, g.endPoint.y);
    });

    if (minX !== Infinity) {
        symbol.bbox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    } else {
        symbol.bbox = { x: 0, y: 0, width: 10, height: 10 };
    }

    symbols.push(symbol);
    return symbols;
}
