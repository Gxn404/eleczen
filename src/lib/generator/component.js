/**
 * Generates an .ezc string from a component object using the new Ruby-like syntax.
 * @param {Object} component - The component object.
 * @returns {string} The .ezc formatted string.
 */
export function generateEZC(component) {
    const lines = [];

    lines.push(`component "${component.name}"`);

    if (component.version) lines.push(`    version "${component.version}"`);
    if (component.kind) lines.push(`    kind ${component.kind}`);
    if (component.category) lines.push(`    category "${component.category}"`);

    // Meta block
    if (component.meta && Object.keys(component.meta).length > 0) {
        lines.push('');
        lines.push('    meta');
        for (const [key, value] of Object.entries(component.meta)) {
            if (Array.isArray(value)) {
                const arrayStr = value.map(v => `"${v}"`).join(', ');
                lines.push(`        ${key} [${arrayStr}]`);
            } else if (value !== undefined && value !== null) {
                if (typeof value === 'string' && (value.includes('"') || value.includes('\n'))) {
                    lines.push(`        ${key} <<EOF`);
                    lines.push(value);
                    lines.push('EOF');
                } else {
                    lines.push(`        ${key} "${value}"`);
                }
            }
        }
        lines.push('    end');
    }

    // Pins block
    if (component.pins && Object.keys(component.pins).length > 0) {
        lines.push('');
        lines.push('    pins');
        for (const [name, pin] of Object.entries(component.pins)) {
            // pin {name} direction {dir} order {num}
            let line = `        pin "${name}"`;
            if (pin.direction) line += ` direction ${pin.direction}`;
            const order = pin.order || pin.number;
            if (order !== undefined) line += ` order ${order}`;
            lines.push(line);
        }
        lines.push('    end');
    }

    // Model block
    if (component.model) {
        lines.push('');
        lines.push('    model');
        if (component.model.kind) lines.push(`        kind ${component.model.kind}`);
        if (component.model.language) lines.push(`        language "${component.model.language}"`);
        if (component.model.data) {
            lines.push('        data <<EOF');
            lines.push(component.model.data.trimEnd());
            lines.push('        EOF');
        }
        lines.push('    end');
    }

    // Symbol block
    // Symbol block removed as per requirement
    /*
    if (component.symbol) {
        lines.push('');
        lines.push('    symbol');
        if (component.symbol.file) lines.push(`        file "${component.symbol.file}"`);
        if (component.symbol.graphic) {
            lines.push('        data <<EOF');
            const graphicContent = (typeof component.symbol.graphic === 'object')
                ? JSON.stringify(component.symbol.graphic, null, 2)
                : component.symbol.graphic;
            lines.push(graphicContent.trimEnd());
            lines.push('        EOF');
        }
        lines.push('    end');
    }
    */

    lines.push('end');
    return lines.join('\n');
}
