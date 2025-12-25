import { parseSpice } from '../parsers/spice.js';
import { parseKicadSymbol } from '../parsers/kicad-sym.js';
import { generateEZC } from '../eleczen-dsl/generator.js';
import { generateEZL } from '../eleczen-dsl/library-generator.js';
import { generateSvg } from './SvgGenerator.js';

export class ComponentProcessor {
    constructor() {
        this.components = new Map(); // name -> { model?, symbol?, metadata? }
    }

    /**
     * Process a list of files and return generated .ezc content and .ezl library.
     * @param {Array<{name: string, content: string}>} files 
     * @param {string} libraryName - Name of the library being processed
     * @returns {{components: Array<{name: string, component: Object}>, library: string}}
     */
    processLibrary(files, libraryName = "ImportedLibrary") {
        // 1. Parse all files
        for (const file of files) {
            if (file.name.endsWith('.sub') || file.name.endsWith('.mod') || file.name.endsWith('.cir')) {
                // Parse as SPICE model
                const { models, subckts } = parseSpice(file.content);
                models.forEach(m => this.addModel(m, 'spice'));
                subckts.forEach(s => this.addModel(s, 'subckt'));
            } else if (file.name.endsWith('.kicad_sym')) {
                // KiCad S-expression symbol
                const symbols = parseKicadSymbol(file.content);
                symbols.forEach(sym => this.addSymbol(sym));
            }
        }

        // 2. Generate EZC for each component
        const components = [];
        const index = {};
        const categories = new Set();

        for (const [name, data] of this.components.entries()) {
            const component = this.generateComponentEZC(name, data);
            components.push({ name, component });

            // Build index for library
            let category = "Uncategorized";
            if (data.model && data.model.type && ['NPN', 'PNP'].includes(data.model.type.toUpperCase())) {
                category = `Transistor/${data.model.type.toUpperCase()}`;
            }
            index[name] = category;
            categories.add(category);
        }

        // 3. Generate EZL
        const library = {
            name: libraryName,
            version: "1.0.0",
            description: `Imported from ${files.length} files`,
            includes: components.map(c => `${c.name}.ezc`),
            categories: Array.from(categories),
            index: index,
            metadata: {
                last_updated: new Date().toISOString().split('T')[0]
            }
        };

        const ezl = generateEZL(library);

        return { components, ezl };
    }

    addModel(model, kind) {
        const name = model.name.toUpperCase();
        if (!this.components.has(name)) {
            this.components.set(name, {});
        }
        const comp = this.components.get(name);

        let data = '';
        let pins = {};

        if (kind === 'subckt') {
            // Reconstruct subckt definition
            const header = `.subckt ${model.name} ${model.nodes.join(' ')}`;
            const body = model.lines.join('\n');
            const footer = '.ends';
            data = `${header}\n${body}\n${footer}`;

            // Map nodes to pins (generic numbering)
            model.nodes.forEach((node, i) => {
                pins[node] = { number: i + 1, direction: 'passive' };
            });
        } else {
            // Simple model
            data = model.raw;
        }

        comp.model = {
            kind: kind,
            data: data,
            pins: pins
        };
    }

    addSymbol(symbol) {
        const name = symbol.name.toUpperCase();
        if (!this.components.has(name)) {
            this.components.set(name, {});
        }
        const comp = this.components.get(name);
        comp.symbol = {
            graphic: symbol, // Store full symbol object (pins + graphics)
            bbox: symbol.bbox
        };

        // Store properties for metadata
        if (symbol.properties) {
            comp.properties = symbol.properties;
        }

        // Merge pins
        if (!comp.pins) comp.pins = {};

        // If symbol has pins, use them
        if (symbol.pins) {
            for (const [pinName, pinData] of Object.entries(symbol.pins)) {
                comp.pins[pinName] = {
                    number: pinData.number,
                    direction: pinData.direction
                };
            }
        }
    }

    generateComponentEZC(name, data) {
        // Create the component object structure for generator
        const component = {
            name: name,
            version: "1.0.0",
            kind: "integrated_circuit", // Default
            category: "Uncategorized",
            meta: {
                description: `Imported component ${name}`,
                keywords: [name],
                manufacturer: "Generic",
                datasheet: ""
            },
            pins: data.pins || {},
            model: data.model
            // symbol: data.symbol // REMOVED as per requirement
        };

        // Extract metadata from properties
        if (data.properties) {
            if (data.properties['Description']) {
                component.meta.description = data.properties['Description'].value;
            }
            if (data.properties['Datasheet'] && data.properties['Datasheet'].value !== '~') {
                component.meta.datasheet = data.properties['Datasheet'].value;
            }
            if (data.properties['ki_keywords']) {
                const keywords = data.properties['ki_keywords'].value.split(/\s+/);
                component.meta.keywords.push(...keywords);
            }
            if (data.properties['Manufacturer']) {
                component.meta.manufacturer = data.properties['Manufacturer'].value;
            }
        }

        // Heuristic: If model is NPN/PNP, set kind
        if (data.model && data.model.type) {
            if (['NPN', 'PNP'].includes(data.model.type.toUpperCase())) {
                component.kind = 'transistor';
                component.category = `Transistor/${data.model.type.toUpperCase()}`;
                component.meta.keywords.push('BJT', data.model.type.toUpperCase());
            }
        } else if (data.properties && data.properties['Reference']) {
            // RefDes Heuristics
            const ref = data.properties['Reference'].value.replace(/[0-9?]+$/, ''); // Strip numbers/question marks
            switch (ref) {
                case 'R':
                    component.kind = 'resistor';
                    component.category = 'Passive/Resistor';
                    break;
                case 'C':
                    component.kind = 'capacitor';
                    component.category = 'Passive/Capacitor';
                    break;
                case 'L':
                    component.kind = 'inductor';
                    component.category = 'Passive/Inductor';
                    break;
                case 'D':
                    component.kind = 'diode';
                    component.category = 'Discrete/Diode';
                    break;
                case 'Q':
                    component.kind = 'transistor';
                    component.category = 'Discrete/Transistor';
                    break;
                case 'U':
                    component.kind = 'integrated_circuit';
                    component.category = 'ICs';
                    break;
                case 'J':
                case 'P':
                    component.kind = 'connector';
                    component.category = 'Electromechanical/Connector';
                    break;
                case 'SW':
                    component.kind = 'switch';
                    component.category = 'Electromechanical/Switch';
                    break;
                default:
                    // Keep default
                    break;
            }
        }

        // Generate SVG Preview
        if (data.symbol && data.symbol.graphic) {
            const svg = generateSvg(data.symbol.graphic);
            component.meta.preview_image = svg;
        }

        // Return the DSL component object directly
        return component;
    }
}
