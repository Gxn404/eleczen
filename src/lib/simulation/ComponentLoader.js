import { supabase } from '@/lib/supabase';
import { parseEZC } from '@/lib/eleczen-dsl/parser';
import { globalModelStore } from '@/lib/litesim/modelStore';

/**
 * ComponentLoader
 * Fetches and loads .ezc components into the simulation environment.
 */
export class ComponentLoader {
    constructor(client = null) {
        this.cache = new Map(); // Name -> ComponentDef
        this.client = client || supabase;
    }

    /**
     * Loads a component by name.
     * Checks cache first, then fetches from Supabase.
     * @param {string} componentName 
     * @returns {Promise<Object>} The component definition.
     */
    async loadComponent(componentName) {
        if (this.cache.has(componentName)) {
            return this.cache.get(componentName);
        }

        try {
            // Fetch .ezc file
            const { data, error } = await this.client.storage
                .from('libraries')
                .download(`libraries/components/${componentName}/${componentName}.ezc`);

            if (error) throw error;

            const text = await data.text();
            const component = parseEZC(text);

            // Process and Register Model
            if (component.model && component.model.data) {
                // Remove EOF markers if present (simple cleanup)
                let modelData = component.model.data;
                modelData = modelData.replace(/<<EOF/g, '').replace(/EOF/g, '').trim();

                // Register in ModelStore
                // Use component name as the model name reference
                globalModelStore.registerModel(component.name, modelData);
            }

            // Cache and return
            this.cache.set(componentName, component);
            return component;

        } catch (err) {
            console.error(`Failed to load component ${componentName}:`, err);
            return null;
        }
    }

    /**
     * Converts an EZC component definition to a LiteSim component definition.
     * @param {Object} ezcComponent 
     */
    toLiteSimDef(ezcComponent) {
        if (!ezcComponent) return null;

        let ports = [];
        let symbolData = ezcComponent.symbol?.data || '';

        // Parse symbol to get pins and their coordinates
        if (symbolData) {
            try {
                // The data is now JSON stringified graphics/pins
                const symbol = JSON.parse(symbolData);

                // If it's an array (graphics items), we might need pins from elsewhere or if we stored pins in it
                // In ComponentProcessor we stored: graphic: symbol.graphics (array of items)
                // But we also need pins for coordinates!
                // Wait, ComponentProcessor stores pins in comp.pins, but those might not have x/y if we didn't put them there?
                // Actually parseKicadSymbol returns pins with x,y.
                // And ComponentProcessor puts them in comp.pins:
                // comp.pins[pinName] = { number, direction } -> MISSING X/Y!

                // We need to ensure X/Y are preserved in comp.pins OR in symbol data.
                // Let's assume we update ComponentProcessor to store full pin data including x,y in comp.pins
                // OR we use the symbol data which we just parsed.

                // If symbol is just the graphics array (as per current ComponentProcessor), we lost pin coordinates in the symbol block!
                // We need to fix ComponentProcessor to include pins in the symbol block or put x/y in the main pins block.

                // For now, let's assume we will fix ComponentProcessor to store { graphics, pins } in symbol.graphic

                if (symbol.pins) {
                    const scale = 0.1; // Match CustomComponent scale
                    Object.values(symbol.pins).forEach(pin => {
                        ports.push({
                            id: pin.name,
                            x: pin.x * scale,
                            y: pin.y * scale // KiCad Y might need inversion?
                        });
                    });
                }
            } catch (e) {
                console.error('Failed to parse symbol data', e);
            }
        }

        // Fallback if no ports found (e.g. no symbol data)
        if (ports.length === 0 && ezcComponent.pins) {
            // ezcComponent.pins is an object { name: { direction, number } }
            // We need to convert it to ports array.
            // Since we don't have coordinates, we'll just list them.
            // Ideally we should auto-layout, but for now just prevent crash.
            ports = Object.entries(ezcComponent.pins).map(([name, pin], index) => ({
                id: name,
                x: 0,
                y: index * 10 // Stack vertically with some spacing
            }));
        }

        return {
            type: ezcComponent.name,
            ports: ports,
            defaultSize: { width: 60, height: 60 },
            symbol: symbolData
        };
    }
}

export const globalComponentLoader = new ComponentLoader();
