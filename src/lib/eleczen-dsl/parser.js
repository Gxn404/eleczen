/**
 * Parses an .ezc string into a component object using the new Ruby-like syntax.
 * @param {string} input - The .ezc formatted string.
 * @returns {Object} The parsed component object.
 */
export function parseEZC(input) {
    const tokens = tokenize(input);
    let current = 0;

    function peek() {
        return tokens[current];
    }

    function consume(type) {
        const token = tokens[current];
        if (token && (type === undefined || token.type === type)) {
            current++;
            return token;
        }
        throw new Error(`Expected token type ${type}, got ${token ? token.type : 'EOF'} at line ${token ? token.line : 'end'}`);
    }

    function parseValue() {
        const token = peek();
        if (token.type === 'STRING') {
            consume();
            return token.value;
        }
        if (token.type === 'NUMBER') {
            consume();
            return Number(token.value);
        }
        if (token.type === 'IDENTIFIER') {
            consume();
            // Treat identifier as a string value (e.g. kind integrated_circuit)
            return token.value;
        }
        if (token.type === 'HEREDOC') {
            consume();
            return token.value;
        }
        if (token.type === 'LBRACKET') {
            consume();
            const arr = [];
            while (peek().type !== 'RBRACKET') {
                arr.push(parseValue());
                if (peek().type === 'COMMA') consume();
            }
            consume('RBRACKET');
            return arr;
        }
        throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
    }

    function parseBlockBody(blockName) {
        const obj = {};

        // In this syntax, blocks end with 'end' keyword
        while (peek() && peek().value !== 'end') {
            const keyToken = consume('IDENTIFIER');
            const key = keyToken.value;

            // Handle specific block logic
            if (blockName === 'pins' && key === 'pin') {
                // pin "name" direction dir order num
                const pinName = parseValue(); // Expect string
                const pinData = {};

                while (peek() && peek().type === 'IDENTIFIER' && peek().value !== 'pin' && peek().value !== 'end') {
                    const attr = consume('IDENTIFIER').value;
                    pinData[attr] = parseValue();
                }

                if (!obj.pins) obj.pins = {}; // Actually pins block structure in JS usually map
                // But here we are parsing 'pins' block, so obj IS the pins block content
                // Let's adjust: obj will be map of name -> data
                obj[pinName] = pinData;

            } else {
                // Standard property: key value
                // Check if next token is a value or a block start (if nested blocks allowed)
                // Spec doesn't show nested blocks inside meta/model except maybe data <<EOF

                // If value is <<EOF, it's a HEREDOC value
                obj[key] = parseValue();
            }
        }
        consume('IDENTIFIER'); // consume 'end'
        return obj;
    }

    // Root parsing
    const component = {};

    // Expect: component "name"
    const typeToken = consume('IDENTIFIER');
    if (typeToken.value !== 'component') throw new Error('Expected "component" keyword');

    const nameToken = consume('STRING');
    component.name = nameToken.value;

    // Parse body until 'end'
    while (peek() && peek().value !== 'end') {
        const token = peek();
        if (token.type === 'IDENTIFIER') {
            const key = token.value;

            // Check if it's a block start
            if (['meta', 'pins', 'model', 'symbol', 'footprint', 'tests'].includes(key)) {
                consume(); // consume block name
                component[key] = parseBlockBody(key);
            } else {
                // Top level property: version "1.0.0"
                consume(); // consume key
                component[key] = parseValue();
            }
        } else {
            throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
        }
    }

    consume('IDENTIFIER'); // consume 'end'

    return component;
}

function tokenize(input) {
    const tokens = [];
    let current = 0;
    let line = 1;

    while (current < input.length) {
        let char = input[current];

        if (/\s/.test(char)) {
            if (char === '\n') line++;
            current++;
            continue;
        }

        if (char === '[') { tokens.push({ type: 'LBRACKET', line }); current++; continue; }
        if (char === ']') { tokens.push({ type: 'RBRACKET', line }); current++; continue; }
        if (char === ',') { tokens.push({ type: 'COMMA', line }); current++; continue; }

        // Strings
        if (char === '"') {
            let value = '';
            char = input[++current];
            while (char !== '"' && current < input.length) {
                value += char;
                char = input[++current];
            }
            current++;
            tokens.push({ type: 'STRING', value, line });
            continue;
        }

        // Heredoc <<EOF
        if (char === '<' && input[current + 1] === '<') {
            current += 2;
            let marker = '';
            while (input[current] !== '\n' && input[current] !== ' ' && current < input.length) {
                marker += input[current++];
            }
            // Skip newline after marker
            while (input[current] === '\n' || input[current] === '\r' || input[current] === ' ') {
                if (input[current] === '\n') line++;
                current++;
            }

            let value = '';
            const start = current;
            const endMarker = marker.trim();

            while (current < input.length) {
                if (input.substring(current, current + endMarker.length) === endMarker) {
                    break;
                }
                if (input[current] === '\n') line++;
                value += input[current++];
            }

            tokens.push({ type: 'HEREDOC', value: value.trim(), line });
            current += endMarker.length;
            continue;
        }

        // Numbers
        if (/[0-9]/.test(char)) {
            let value = '';
            while (/[0-9.]/.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({ type: 'NUMBER', value, line });
            continue;
        }

        // Identifiers (keywords like component, end, version, etc.)
        if (/[a-zA-Z_]/.test(char)) {
            let value = '';
            while (/[a-zA-Z0-9_\-\/\.]/.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({ type: 'IDENTIFIER', value, line });
            continue;
        }

        throw new Error(`Unknown character: ${char} at line ${line}`);
    }

    return tokens;
}
