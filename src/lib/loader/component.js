import { supabase } from '../../../supabase/supabase';
import { ComponentProcessor } from '../processing/converter';
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
