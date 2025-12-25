/**
 * Parses KiCad v6+ symbol content (.kicad_sym).
 * @param {string} content - The raw symbol file content.
 * @returns {Array} Parsed symbols.
 */
export function parseKicadSymbol(content) {
    const tokens = tokenize(content);
    const root = parseSExpression(tokens);

    if (!root || root[0] !== 'kicad_symbol_lib') {
        throw new Error('Invalid KiCad symbol library file');
    }

    const symbols = [];

    // Iterate over children of root to find (symbol ...)
    for (let i = 1; i < root.length; i++) {
        const item = root[i];
        if (Array.isArray(item) && item[0] === 'symbol') {
            const parsed = processSymbol(item);
            if (parsed) symbols.push(parsed);
        }
    }

    return symbols;
}

/**
 * Processes a single symbol S-expression.
 * @param {Array} symbolExpr - The S-expression array for the symbol.
 * @returns {Object} The parsed symbol object.
 */
function processSymbol(symbolExpr) {
    // (symbol "Name" ...)
    const name = symbolExpr[1];
    const cleanName = name.replace(/^"(.*)"$/, '$1');

    const pins = {};
    const graphics = [];
    let properties = {};

    // Helper to recursively extract pins and graphics
    function traverse(expr, contextMatrix = { x: 0, y: 0, rot: 0, mirrorX: 1, mirrorY: 1 }) {
        if (!Array.isArray(expr)) return;

        const type = expr[0];

        if (type === 'property') {
            // (property "Key" "Value" (at x y rot) (effects ...))
            const key = expr[1].replace(/^"(.*)"$/, '$1');
            const val = expr[2].replace(/^"(.*)"$/, '$1');

            let x = 0, y = 0, rot = 0, visible = true;

            for (let j = 3; j < expr.length; j++) {
                const prop = expr[j];
                if (Array.isArray(prop)) {
                    if (prop[0] === 'at') {
                        x = parseFloat(prop[1]);
                        y = parseFloat(prop[2]);
                        rot = parseFloat(prop[3] || 0);
                    } else if (prop[0] === 'effects') {
                        // (effects (font ...) (hide yes))
                        for (let k = 1; k < prop.length; k++) {
                            const eff = prop[k];
                            if (Array.isArray(eff) && eff[0] === 'hide' && eff[1] === 'yes') {
                                visible = false;
                            }
                        }
                    }
                }
            }

            properties[key] = { value: val, x, y, rot, visible };
        } else if (type === 'pin') {
            // (pin type shape (at x y rot) ...)
            const pinData = parsePin(expr);
            if (pinData) {
                // Apply context transformation if needed (though pins are usually absolute in symbol def, 
                // but units might have offsets - usually handled by KiCad structure differently)
                pins[pinData.name] = pinData;
            }
        } else if (['rectangle', 'polyline', 'circle', 'arc', 'text'].includes(type)) {
            const graphicItem = parseGraphicItem(expr, type);
            if (graphicItem) {
                graphics.push(graphicItem);
            }
        } else if (type === 'symbol') {
            // Nested symbol (e.g. units or derived symbols)
            // (symbol "Name_1_1" (extends "Name") ...)
            // For now, we recurse to find pins/graphics defined in this unit
            for (let i = 1; i < expr.length; i++) {
                traverse(expr[i]);
            }
        } else {
            // Recurse for other containers
            for (let i = 1; i < expr.length; i++) {
                if (Array.isArray(expr[i])) {
                    traverse(expr[i]);
                }
            }
        }
    }

    // Start traversal
    for (let i = 2; i < symbolExpr.length; i++) {
        traverse(symbolExpr[i]);
    }

    // Bounding box calculation (simplified)
    const bbox = calculateBoundingBox(pins, graphics, properties);

    return {
        name: cleanName,
        properties,
        pins,
        graphics, // Structured graphics
        bbox
    };
}

function parsePin(pinExpr) {
    // (pin type shape (at x y rot) (length len) (name "name" ...) (number "num" ...))

    let type = pinExpr[1];
    let x = 0, y = 0, rot = 0;
    let length = 0;
    let name = '';
    let number = '';

    // Map KiCad types to our types
    const typeMap = {
        'input': 'in',
        'output': 'out',
        'bidirectional': 'bidirectional',
        'tri_state': 'bidirectional',
        'passive': 'passive',
        'power_in': 'in',
        'power_out': 'out',
        'open_collector': 'out',
        'open_emitter': 'out',
        'unspecified': 'passive'
    };
    let direction = typeMap[type] || 'passive';

    for (let i = 2; i < pinExpr.length; i++) {
        const item = pinExpr[i];
        if (Array.isArray(item)) {
            if (item[0] === 'at') {
                x = parseFloat(item[1]);
                y = parseFloat(item[2]); // KiCad Y is inverted relative to many canvas systems, but we keep raw here
                rot = parseFloat(item[3] || 0);
            } else if (item[0] === 'length') {
                length = parseFloat(item[1]);
            } else if (item[0] === 'name') {
                name = item[1].replace(/^"(.*)"$/, '$1');
            } else if (item[0] === 'number') {
                number = item[1].replace(/^"(.*)"$/, '$1');
            }
        }
    }

    if (!name && !number) return null;

    return {
        name: name || number,
        number: number,
        direction: direction,
        x, y, rot, length
    };
}

function parseGraphicItem(expr, type) {
    // Common parsing for graphics
    // rectangle: (rectangle (start x y) (end x y) (stroke ...) (fill ...))
    // polyline: (polyline (pts (xy x y) (xy x y) ...) (stroke ...) (fill ...))
    // circle: (circle (center x y) (radius r) (stroke ...) (fill ...))
    // arc: (arc (start x y) (mid x y) (end x y) (stroke ...) (fill ...))
    // text: (text "content" (at x y rot) (effects ...))

    const item = { type };

    for (let i = 1; i < expr.length; i++) {
        const prop = expr[i];
        if (!Array.isArray(prop)) continue;

        const propType = prop[0];

        if (propType === 'start') {
            item.start = { x: parseFloat(prop[1]), y: parseFloat(prop[2]) };
        } else if (propType === 'end') {
            item.end = { x: parseFloat(prop[1]), y: parseFloat(prop[2]) };
        } else if (propType === 'center') {
            item.center = { x: parseFloat(prop[1]), y: parseFloat(prop[2]) };
        } else if (propType === 'radius') {
            item.radius = parseFloat(prop[1]);
        } else if (propType === 'mid') {
            item.mid = { x: parseFloat(prop[1]), y: parseFloat(prop[2]) };
        } else if (propType === 'pts') {
            item.points = [];
            for (let j = 1; j < prop.length; j++) {
                if (prop[j][0] === 'xy') {
                    item.points.push({ x: parseFloat(prop[j][1]), y: parseFloat(prop[j][2]) });
                }
            }
        } else if (propType === 'at') {
            item.x = parseFloat(prop[1]);
            item.y = parseFloat(prop[2]);
            item.rot = parseFloat(prop[3] || 0);
        } else if (propType === 'stroke') {
            item.stroke = {};
            for (let j = 1; j < prop.length; j++) {
                if (prop[j][0] === 'width') item.stroke.width = parseFloat(prop[j][1]);
                if (prop[j][0] === 'type') item.stroke.type = prop[j][1];
                // color handling could be added here
            }
        } else if (propType === 'fill') {
            item.fill = {};
            for (let j = 1; j < prop.length; j++) {
                if (prop[j][0] === 'type') item.fill.type = prop[j][1];
                // color handling could be added here
            }
        } else if (type === 'text' && typeof prop === 'string') {
            // Text content is usually the second element of the main expr, not a sub-list property
            // But wait, in S-expr: (text "Value" (at ...) ...)
            // So expr[1] is "Value"
        }
    }

    if (type === 'text') {
        item.text = expr[1].replace(/^"(.*)"$/, '$1');
    }

    return item;
}

function calculateBoundingBox(pins, graphics, properties) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    const update = (x, y) => {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    };

    Object.values(pins).forEach(p => update(p.x, p.y));

    // Include visible properties in bbox
    // (Approximation: just the anchor point, as text size is hard to guess without font metrics)
    if (properties) {
        Object.values(properties).forEach(prop => {
            if (prop.visible && prop.value) {
                update(prop.x, prop.y);
                // Estimate width/height? Font size is usually 1.27mm
                // Let's add a small margin around the anchor
                update(prop.x + (prop.value.length * 1.0), prop.y + 1.27);
            }
        });
    }

    graphics.forEach(g => {
        if (g.start) update(g.start.x, g.start.y);
        if (g.end) update(g.end.x, g.end.y);
        if (g.center && g.radius) {
            update(g.center.x - g.radius, g.center.y - g.radius);
            update(g.center.x + g.radius, g.center.y + g.radius);
        }
        if (g.points) g.points.forEach(pt => update(pt.x, pt.y));
        if (g.type === 'text' && g.x !== undefined) update(g.x, g.y);
    });

    if (minX === Infinity) return { x: 0, y: 0, width: 100, height: 100 }; // Default

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}

// --- S-Expression Tokenizer & Parser ---

function tokenize(input) {
    const tokens = [];
    let current = 0;
    const len = input.length;

    while (current < len) {
        let char = input[current];

        // Skip whitespace
        if (/\s/.test(char)) {
            current++;
            continue;
        }

        // Parentheses
        if (char === '(' || char === ')') {
            tokens.push(char);
            current++;
            continue;
        }

        // Strings
        if (char === '"') {
            let value = '"';
            current++; // skip opening quote
            while (current < len) {
                char = input[current];
                if (char === '"') {
                    value += '"';
                    current++;
                    break;
                }
                if (char === '\\') {
                    current++;
                    if (current < len) value += input[current]; // simple escape handling
                } else {
                    value += char;
                }
                current++;
            }
            tokens.push(value);
            continue;
        }

        // Atoms / Identifiers / Numbers
        let value = '';
        while (current < len) {
            char = input[current];
            if (/\s/.test(char) || char === '(' || char === ')') {
                break;
            }
            value += char;
            current++;
        }
        tokens.push(value);
    }
    return tokens;
}

function parseSExpression(tokens) {
    if (tokens.length === 0) return null;
    let current = 0;

    function parse() {
        if (current >= tokens.length) return null;

        const token = tokens[current++];

        if (token === '(') {
            const list = [];
            while (tokens[current] !== ')' && current < tokens.length) {
                list.push(parse());
            }
            current++; // consume ')'
            return list;
        } else if (token === ')') {
            throw new Error('Unexpected )');
        } else {
            return token;
        }
    }

    return parse();
}
