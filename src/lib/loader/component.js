/**
 * Component Loader - Loads components from database and parses EZC/EZL files
 */

import { supabase } from '../../../supabase/supabase';

class ComponentLoader {
    constructor() {
        this.cache = new Map(); // componentName -> parsed component data
        this.svgCache = new Map(); // componentName -> SVG string
    }

    /**
     * Load a component by name from the database
     * @param {string} componentName 
     * @returns {Promise<Object|null>} Parsed component data
     */
    async loadComponent(componentName) {
        // Check cache first
        if (this.cache.has(componentName)) {
            return this.cache.get(componentName);
        }

        try {
            // 1. Find component in library_index
            const { data: indexData, error: indexError } = await supabase
                .from('library_index')
                .select('*, libraries(*)')
                .eq('name', componentName)
                .single();

            if (indexError || !indexData) {
                // console.warn(`Component ${componentName} not found in index, using fallback`);
            }

            // 2. Get the file path
            let ezcPath = indexData?.source_file;

            if (indexData && !ezcPath && indexData.libraries?.file_path) {
                // Fallback to library path, handling extension replacement if needed
                ezcPath = indexData.libraries.file_path.replace('.ezl', '.ezc');
            }

            if (!ezcPath) {
                ezcPath = `components/${componentName}/${componentName}.ezc`;
            }

            // 3. Get signed URL for the EZC file
            const { data: signedData, error: urlError } = await supabase.storage
                .from('libraries')
                .createSignedUrl(ezcPath, 60);

            if (urlError) {
                console.warn(`Error generating signed URL for ${componentName}:`, urlError);
                return null;
            }

            // 4. Fetch EZC content
            const ezcResponse = await fetch(signedData.signedUrl);

            if (!ezcResponse.ok) {
                console.error(`Failed to fetch EZC: ${ezcResponse.status}`);
                return null;
            }

            const ezcContent = await ezcResponse.text();

            // 5. Parse the EZC content
            const component = this.parseEZC(ezcContent, componentName);

            // 6. Try to load SVG preview (with caching)
            const svgPath = ezcPath.replace('.ezc', '.svg');
            const { data: { publicUrl: svgUrl } } = supabase.storage
                .from('libraries')
                .getPublicUrl(svgPath);

            try {
                const svgResponse = await fetch(svgUrl, {
                    cache: 'force-cache',
                    headers: {
                        'Cache-Control': 'public, max-age=3600'
                    }
                });

                if (svgResponse.ok) {
                    const svgContent = await svgResponse.text();
                    this.svgCache.set(componentName, svgContent);
                    component.svgPreview = svgContent;
                }
            } catch (e) {
                // SVG is optional
                console.log(`No SVG preview for ${componentName}`);
            }

            // Cache the result
            this.cache.set(componentName, component);
            return component;

        } catch (error) {
            console.error('Error loading component:', error);
            return null;
        }
    }

    /**
     * Parse EZC content to extract component data
     * @param {string} ezcContent - The EZC file content
     * @param {string} componentName - Component name to extract
     * @returns {Object} Parsed component data
     */
    parseEZC(ezcContent, componentName) {
        const component = {
            name: componentName,
            kind: 'component',
            category: 'Uncategorized',
            version: '1.0.0',
            pins: {},
            meta: {},
            properties: {}
        };

        // Extract component block for this specific component
        const componentRegex = new RegExp(`component\\s+"${componentName}"\\s*\\{([^}]+)\\}`, 's');
        const match = ezcContent.match(componentRegex);

        if (!match) {
            // Try to match any component if specific name not found
            const anyComponentMatch = ezcContent.match(/component\s+"([^"]+)"\s*\{([^}]+)\}/s);
            if (anyComponentMatch) {
                component.name = anyComponentMatch[1];
                return this.parseComponentBlock(anyComponentMatch[2], component);
            }
            return component;
        }

        return this.parseComponentBlock(match[1], component);
    }

    /**
     * Parse a component block content
     */
    parseComponentBlock(blockContent, component) {
        // Extract kind
        const kindMatch = blockContent.match(/kind\s+"([^"]+)"/);
        if (kindMatch) component.kind = kindMatch[1];

        // Extract category
        const categoryMatch = blockContent.match(/category\s+"([^"]+)"/);
        if (categoryMatch) component.category = categoryMatch[1];

        // Extract version
        const versionMatch = blockContent.match(/version\s+"([^"]+)"/);
        if (versionMatch) component.version = versionMatch[1];

        // Extract pins block
        const pinsMatch = blockContent.match(/pins\s*\{([^}]+)\}/s);
        if (pinsMatch) {
            const pinsContent = pinsMatch[1];
            const pinMatches = [...pinsContent.matchAll(/"([^"]+)"\s*:\s*\{([^}]+)\}/g)];

            pinMatches.forEach(match => {
                const pinName = match[1];
                const pinData = match[2];

                const numberMatch = pinData.match(/number\s+(\d+)/);
                const directionMatch = pinData.match(/direction\s+"([^"]+)"/);

                component.pins[pinName] = {
                    number: numberMatch ? parseInt(numberMatch[1]) : 0,
                    direction: directionMatch ? directionMatch[1] : 'passive'
                };
            });
        }

        // Extract meta block
        const metaMatch = blockContent.match(/meta\s*\{([^}]+)\}/s);
        if (metaMatch) {
            const metaContent = metaMatch[1];

            const descMatch = metaContent.match(/description\s+"([^"]+)"/);
            if (descMatch) component.meta.description = descMatch[1];

            const mfgMatch = metaContent.match(/manufacturer\s+"([^"]+)"/);
            if (mfgMatch) component.meta.manufacturer = mfgMatch[1];

            const datasheetMatch = metaContent.match(/datasheet\s+"([^"]+)"/);
            if (datasheetMatch) component.meta.datasheet = datasheetMatch[1];
        }

        return component;
    }

    /**
     * Convert parsed component to LiteSim format for Canvas
     */
    toLiteSimDef(component) {
        const ports = [];

        // Convert pins to ports with positions
        // Default to simple horizontal layout
        const pinCount = Object.keys(component.pins).length;
        const spacing = 20;

        Object.entries(component.pins).forEach(([pinName, pinData], index) => {
            ports.push({
                id: pinName,
                x: (index - (pinCount - 1) / 2) * spacing,
                y: 0,
                direction: pinData.direction
            });
        });

        return {
            type: component.kind,
            name: component.name,
            category: component.category,
            ports: ports,
            defaultSize: { width: 40, height: 40 },
            svgPreview: component.svgPreview
        };
    }

    /**
     * Get all available components from the database
     */
    async getAllComponents() {
        try {
            const { data, error } = await supabase
                .from('libraries')
                .select('name, type, category, source_file')
                .order('name');

            if (error) {
                console.error('Error fetching components:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Error in getAllComponents:', error);
            return [];
        }
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
        this.svgCache.clear();
    }
}

// Export singleton instance
export const globalComponentLoader = new ComponentLoader();
