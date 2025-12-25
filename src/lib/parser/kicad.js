/**
 * Parses KiCad v6+ symbol content (.kicad_sym).
 * @param {string} content - The raw symbol file content.
 * @returns {Array} Parsed symbols.
 */
export function parseKicad(content) {
    const tokens = tokenize(content);
    const root = parseSExpression(tokens);

    if (!root) {
        throw new Error('Invalid KiCad symbol library file');
    }

    const symbols = [];

    // Case 1: Full library file (kicad_symbol_lib ...)
    if (root[0] === 'kicad_symbol_lib') {
        for (let i = 1; i < root.length; i++) {
            const item = root[i];
            if (Array.isArray(item) && item[0] === 'symbol') {
                const parsed = processSymbol(item);
                if (parsed) symbols.push(parsed);
            }
        }
    }
    // Case 2: Single symbol file (symbol ...) - e.g. exported symbol
    else if (root[0] === 'symbol') {
        const parsed = processSymbol(root);
        if (parsed) symbols.push(parsed);
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
    const name = symbolExpr[1].replace(/^"(.*)"$/, '$1');
    let properties = {};

    // Helper to recursively extract pins and graphics
    function traverse(expr) {
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

    return {
        name,
        properties
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
