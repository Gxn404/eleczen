import { parseLibContent } from './parser.js';

export class ModelStore {
    constructor() {
        this.models = new Map();
        this.subckts = new Map();
        this.globals = new Set();
        this.libraries = new Set();
    }

    /**
     * Adds a library content to the store.
     * @param {string} content - The raw content of the .lib or .mod file.
     * @param {string} source - The source name (e.g., filename).
     */
    addLibrary(content, source = 'user') {
        const { models, subckts, globals } = parseLibContent(content);

        models.forEach(m => {
            this.models.set(m.name.toUpperCase(), { ...m, source });
        });

        subckts.forEach(s => {
            this.subckts.set(s.name.toUpperCase(), { ...s, source });
        });

        if (globals) {
            globals.forEach(g => {
                this.globals.add(g);
            });
        }

        this.libraries.add(source);
    }

    /**
     * Retrieves a model by name.
     * @param {string} name 
     * @returns {object|undefined}
     */
    getModel(name) {
        return this.models.get(name.toUpperCase());
    }

    /**
     * Retrieves a subcircuit by name.
     * @param {string} name 
     * @returns {object|undefined}
     */
    getSubckt(name) {
        return this.subckts.get(name.toUpperCase());
    }

    /**
     * Returns all available models.
     */
    getAllModels() {
        return Array.from(this.models.values());
    }

    /**
     * Returns all available subcircuits.
     */
    getAllSubckts() {
        return Array.from(this.subckts.values());
    }

    /**
     * Returns all global directives.
     */
    getAllGlobals() {
        return Array.from(this.globals);
    }
}

// Singleton instance for global access if needed
export const globalModelStore = new ModelStore();
