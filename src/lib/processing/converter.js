import { parseSpice } from '../parser/spice.js';
import { parseKicad } from '../parser/kicad.js';
import { parseLtspice } from '../parser/ltspice.js';
import { generateEZC } from '../generator/component.js';
import { generateEZL } from '../generator/library.js';
import { generateSvg } from '../generator/svg.js';

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
        this.libraryName = libraryName;
        // 1. Parse all files
        for (const file of files) {
            if (file.name.endsWith('.sub') || file.name.endsWith('.mod') || file.name.endsWith('.cir')) {
                // Parse as SPICE model
                const { models, subckts } = parseSpice(file.content);
                models.forEach(m => this.addModel(m, 'spice'));
                subckts.forEach(s => this.addModel(s, 'subckt'));
            } else if (file.name.endsWith('.kicad_sym')) {
                const meta = parseKicad(file.content);
                meta.forEach(m => {
                    this.addSymbol(m);

                    // Try to match with base name
                    const baseName = m.name.replace(/[A-Z]$/, ''); // Remove last char if uppercase letter
                    if (baseName !== m.name && this.components.has(baseName)) {
                        // Create a copy for the base name to merge properties
                        const copy = { ...m, name: baseName };
                        this.addSymbol(copy);
                    }
                });
            } else if (file.name.endsWith('.asy') || file.name.endsWith('.sym')) {
                // LTspice symbol
                const symbols = parseLtspice(file.content);
                symbols.forEach(sym => {
                    // Use filename as name if symbol name is generic
                    if (sym.name === 'Unknown') {
                        sym.name = file.name.replace(/\.(asy|sym)$/, '');
                    }
                    this.addSymbol(sym);
                });
            }
        }

        // 2. Generate EZC for each component
        const components = [];
        const index = {};
        const categories = new Set();

        const hasAnySymbol = Array.from(this.components.values()).some(c => !!c.symbol);

        for (const [name, data] of this.components.entries()) {
            // Heuristic: skip simple models if they don't have a symbol 
            // and there are other components with symbols in the library.
            // This avoids creating separate components for internal models.
            if (hasAnySymbol && !data.symbol && data.model && data.model.kind === 'spice') {
                continue;
            }

            const { component, svg } = this.generateComponentEZC(name, data);
            components.push({ name, component });

            // Build index for library using the component's category
            index[name] = component.category;
            categories.add(component.category);
        }

        // 3. Generate EZL
        const library = {
            name: libraryName,
            version: "1.0.0",
            // includes: components.map(c => `${c.name}.ezc`), // Removed as per requirement
            categories: Array.from(categories),
            index: index,
            meta: {
                last_updated: new Date().toISOString().split('T')[0]
            },
            submodel: Array.from(this.components.values())
                .filter(c => c.model && c.model.data)
                .map(c => c.model.data)
                .join('\n\n')
        };

        const ezl = generateEZL(library);
        const ezc = components.map(c => generateEZC(c.component)).join('\n\n');
        return { ezc, ezl, svg };
    }

    addModel(model, kind) {
        const name = model.name;
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
            const footer = `.ends ${model.name}`;
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
        const name = symbol.name;
        if (!this.components.has(name)) {
            this.components.set(name, {});
        }
        const comp = this.components.get(name);

        // If this symbol has graphics (e.g. from LTspice), store it as the graphic source
        if (symbol.graphics && symbol.graphics.length > 0) {
            comp.symbol = {
                graphic: symbol,
                bbox: symbol.bbox
            };

            // Merge pins from graphic symbol
            if (!comp.pins) comp.pins = {};
            if (symbol.pins) {
                for (const [pinName, pinData] of Object.entries(symbol.pins)) {
                    comp.pins[pinName] = {
                        number: pinData.number,
                        direction: pinData.direction
                    };
                }
            }
        }

        // Merge properties (metadata) from any source (KiCad or LTspice)
        if (symbol.properties) {
            if (!comp.properties) comp.properties = {};
            Object.assign(comp.properties, symbol.properties);
        }
    }

    generateComponentEZC(name, data) {
        let svg ='';
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
                datasheet: "",
                include: `${this.libraryName || "ImportedLibrary"}.ezl`
            },
            pins: data.pins || {}
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

        // Final Category Heuristic based on description/name
        if (component.category === 'Uncategorized') {
            const text = (component.meta.description + " " + component.name).toLowerCase();
            if (text.includes('timer')) component.category = 'ICs/Timer';
            else if (text.includes('opamp') || text.includes('operational amplifier')) component.category = 'ICs/OpAmp';
            else if (text.includes('voltage regulator')) component.category = 'Power/Regulator';
            else if (text.includes('microcontroller') || text.includes('mcu')) component.category = 'ICs/Microcontroller';
        }

        // Generate SVG Preview
        if (data.symbol && data.symbol.graphic) {
            svg = generateSvg(data.symbol.graphic);
            component.meta.preview_image = `components/${component.name}/${component.name}.svg`;
        }

        // Return the DSL component object directly
        return component, svg;
    }
}
