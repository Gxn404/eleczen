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

    // Include block
    if (library.includes && library.includes.length > 0) {
        lines.push('');
        for (const inc of library.includes) {
            lines.push(`    include "${inc}"`);
        }
    }

    // Categories block
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
    if (library.metadata && Object.keys(library.metadata).length > 0) {
        lines.push('');
        lines.push('    metadata');
        for (const [key, value] of Object.entries(library.metadata)) {
            lines.push(`        ${key} "${value}"`);
        }
        lines.push('    end');
    }

    lines.push('end');
    return lines.join('\n');
}
