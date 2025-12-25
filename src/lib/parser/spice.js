/**
 * SPICE Model Parser
 * Parses .lib, .mod, .model, and .subckt definitions.
 */

export const parseSpice = (content) => {
    const lines = content.split('\n');
    const models = [];
    const subckts = [];
    const globals = [];

    let currentBlock = null;
    let blockType = null; // 'model' or 'subckt'

    // Helper to clean line
    const clean = (line) => {
        // Remove comments starting with * (but not inside expressions if we were parsing them, simplified here)
        // Also remove ; comments
        let l = line.trim();
        if (l.startsWith('*')) return '';
        l = l.split(';')[0];
        return l.trim();
    };

    // Handle continuation lines (+)
    const mergedLines = [];
    lines.forEach(rawLine => {
        const line = clean(rawLine);
        if (!line) return;

        if (line.startsWith('+')) {
            if (mergedLines.length > 0) {
                mergedLines[mergedLines.length - 1] += ' ' + line.substring(1).trim();
            }
        } else {
            mergedLines.push(line);
        }
    });

    mergedLines.forEach(line => {
        const parts = line.split(/\s+/);
        const directive = parts[0].toLowerCase();

        if (directive === '.subckt') {
            // .subckt <name> <nodes...>
            const name = parts[1];
            const nodes = parts.slice(2);
            currentBlock = {
                name,
                nodes,
                lines: []
            };
            blockType = 'subckt';
        } else if (directive === '.ends') {
            if (currentBlock && blockType === 'subckt') {
                subckts.push(currentBlock);
                currentBlock = null;
                blockType = null;
            }
        } else if (currentBlock) {
            currentBlock.lines.push(line);
        } else if (directive === '.model') {
            // .model <name> <type> (<params>)
            // Example: .model 1N4148 D (Is=2.682n N=1.836 Rs=.5664 ...)
            if (parts.length < 3) return;

            const name = parts[1];
            const type = parts[2];

            // Extract everything after type
            const typeIndex = line.toLowerCase().indexOf(type.toLowerCase(), directive.length + name.length + 1);
            const paramsStr = line.substring(typeIndex + type.length).trim();

            const params = parseParams(paramsStr);

            models.push({
                name,
                type,
                params,
                raw: line
            });
        } else {
            if (directive.startsWith('.')) {
                globals.push(line);
            }
        }
    });

    return { models, subckts, globals };
};

const parseParams = (str) => {
    // Remove parens if wrapping the whole thing or just parts
    // Simplified param parser: looks for KEY=VALUE or KEY= VALUE
    // Also handles space separated values if positional (less common in .model, more in instance)

    let s = str.replace(/\(/g, ' ').replace(/\)/g, ' ');

    const params = {};
    // Regex to match key=value
    // Value can be number, or number with suffix (u, n, p, m, k, meg, g, t)
    // We will store as string or float? Let's try to parse float.

    const regex = /([a-zA-Z0-9_]+)\s*=\s*([0-9eE\.\-\+]+[a-zA-Z]*)/g;
    let match;
    while ((match = regex.exec(s)) !== null) {
        const key = match[1].toLowerCase();
        const valStr = match[2];
        params[key] = parseSpiceValue(valStr);
    }
    return params;
};

const parseSpiceValue = (valStr) => {
    if (!valStr) return 0;
    const suffixes = {
        't': 1e12,
        'g': 1e9,
        'meg': 1e6,
        'k': 1e3,
        'm': 1e-3,
        'u': 1e-6,
        'n': 1e-9,
        'p': 1e-12,
        'f': 1e-15
    };

    const lower = valStr.toLowerCase();
    for (const [suffix, mult] of Object.entries(suffixes)) {
        if (lower.endsWith(suffix)) {
            const num = parseFloat(lower.substring(0, lower.length - suffix.length));
            return num * mult;
        }
    }
    return parseFloat(valStr);
};
