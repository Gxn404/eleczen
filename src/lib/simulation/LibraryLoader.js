import { supabase } from '@/lib/supabase';
import { parseEZL } from '@/lib/eleczen-dsl/library-parser';
import { globalComponentLoader } from './ComponentLoader';

/**
 * LibraryLoader
 * Fetches and loads .ezl libraries and their components.
 */
export class LibraryLoader {
    constructor(client = null, componentLoader = null) {
        this.loadedLibraries = new Set();
        this.client = client || supabase;
        this.componentLoader = componentLoader || globalComponentLoader;
    }

    /**
     * Loads a library by name.
     * Fetches .ezl, parses it, and pre-loads included components.
     * @param {string} libraryName 
     */
    async loadLibrary(libraryName) {
        if (this.loadedLibraries.has(libraryName)) {
            console.log(`Library ${libraryName} already loaded.`);
            return;
        }

        try {
            console.log(`Loading library: ${libraryName}...`);

            // Fetch .ezl file
            const { data, error } = await this.client.storage
                .from('libraries')
                .download(`libraries/${libraryName}.ezl`);

            if (error) throw error;

            const text = await data.text();
            const library = parseEZL(text);

            console.log(`Library parsed: ${library.name} (v${library.version})`);

            // Load included components
            if (library.includes && library.includes.length > 0) {
                console.log(`Loading ${library.includes.length} components from library...`);

                const loadPromises = library.includes.map(async (includePath) => {
                    // includePath is typically "ComponentName.ezc"
                    // We assume the component name matches the filename without extension
                    const componentName = includePath.replace('.ezc', '');
                    await this.componentLoader.loadComponent(componentName);
                });

                await Promise.all(loadPromises);
            }

            this.loadedLibraries.add(libraryName);
            console.log(`Library ${libraryName} loaded successfully.`);
            return library;

        } catch (err) {
            console.error(`Failed to load library ${libraryName}:`, err);
            return null;
        }
    }
}

export const globalLibraryLoader = new LibraryLoader();
