/**
 * Generates an .ezl string from a library object.
 * @param {Object} library - The library object.
 * @returns {string} The .ezl formatted string.
 */
export function generateEZL(library) {
    const lines = [];

    lines.push(`library "${library.name}"`);

    if (library.version) lines.push(`    version "${library.version}"`);
    if (library.author) lines.push(`    author "${library.author}"`);
    if (library.description) lines.push(`    description "${library.description}"`);

    // Submodel block
    if (library.submodel) {
        lines.push('');
        if (typeof library.submodel === 'string' && (library.submodel.includes('\n') || library.submodel.includes('"'))) {
            lines.push('    submodel <<EOF');
            const submodelLines = library.submodel.split('\n').map(l => l.trim() ? '        ' + l : l);
            lines.push(...submodelLines);
            lines.push('    EOF');
        } else {
            lines.push(`    submodel "${library.submodel}"`);
        }
    }
    if (library.categories && library.categories.length > 0) {
        lines.push('');
        lines.push('    categories');
        for (const cat of library.categories) {
            lines.push(`        "${cat}"`);
        }
        lines.push('    end');
    }

    // Index block
    if (library.index && Object.keys(library.index).length > 0) {
        lines.push('');
        lines.push('    index');
        for (const [comp, cat] of Object.entries(library.index)) {
            lines.push(`        "${comp}" : "${cat}"`);
        }
        lines.push('    end');
    }

    // Metadata block
    // Meta block
    if (library.meta && Object.keys(library.meta).length > 0) {
        lines.push('');
        lines.push('    meta');
        for (const [key, value] of Object.entries(library.meta)) {
            if (Array.isArray(value)) {
                const arrayStr = value.map(v => `"${v}"`).join(', ');
                lines.push(`        ${key} [${arrayStr}]`);
            } else {
                lines.push(`        ${key} "${value}"`);
            }
        }
        lines.push('    end');
    }

    lines.push('end');
    return lines.join('\n');
}
