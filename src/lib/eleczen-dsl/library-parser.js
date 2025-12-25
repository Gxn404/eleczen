/**
 * Parses an .ezl string into a library object.
 * @param {string} input - The .ezl formatted string.
 * @returns {Object} The parsed library object.
 */
export function parseEZL(input) {
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
        if (token.type === 'IDENTIFIER') {
            consume();
            return token.value;
        }
        throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
    }

    function parseBlockBody(blockName) {
        const obj = {};
        const arr = []; // For categories or includes if they were blocks (but includes are top level usually)

        while (peek() && peek().value !== 'end') {
            const token = peek();

            if (blockName === 'categories') {
                // List of strings
                if (token.type === 'STRING') {
                    arr.push(consume().value);
                } else {
                    consume(); // skip unknown
                }
            } else if (blockName === 'index') {
                // "comp" : "cat"
                const key = consume('STRING').value;
                consume('COLON');
                const val = consume('STRING').value;
                obj[key] = val;
            } else {
                // Standard key value
                const key = consume('IDENTIFIER').value;
                obj[key] = parseValue();
            }
        }
        consume('IDENTIFIER'); // consume 'end'
        return blockName === 'categories' ? arr : obj;
    }

    // Root parsing
    const library = { includes: [] };

    // Expect: library "name"
    const typeToken = consume('IDENTIFIER');
    if (typeToken.value !== 'library') throw new Error('Expected "library" keyword');

    const nameToken = consume('STRING');
    library.name = nameToken.value;

    while (peek() && peek().value !== 'end') {
        const token = peek();
        if (token.type === 'IDENTIFIER') {
            const key = token.value;

            if (['categories', 'index', 'metadata'].includes(key)) {
                consume();
                library[key] = parseBlockBody(key);
            } else if (key === 'include') {
                consume();
                library.includes.push(parseValue());
            } else {
                consume();
                library[key] = parseValue();
            }
        } else {
            throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
        }
    }

    consume('IDENTIFIER'); // consume 'end'

    return library;
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

        if (char === ':') { tokens.push({ type: 'COLON', line }); current++; continue; }

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

        // Identifiers
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
