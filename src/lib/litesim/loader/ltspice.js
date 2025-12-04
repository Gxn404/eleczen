/**
 * LTspice Compatibility Adapter
 * Handles LTspice specific extensions and symbol mappings.
 */

export const LTSpiceAdapter = {
    /**
     * Parses LTspice specific attributes or directives.
     */
    parseAttribute: (attr) => {
        // Handle 'ako' (A Kind Of) inheritance
        if (attr.toLowerCase().startsWith('ako:')) {
            return { type: 'inheritance', parent: attr.split(':')[1] };
        }
        return null;
    },

    /**
     * Maps LTspice symbol name to internal model type.
     * @param {string} symbolName 
     * @returns {object}
     */
    mapSymbol: (symbolName) => {
        const name = symbolName.toLowerCase();

        // Standard LTspice symbols
        if (name === 'res') return { type: 'resistor' };
        if (name === 'cap') return { type: 'capacitor' };
        if (name === 'ind') return { type: 'inductor' };
        if (name === 'diode') return { type: 'diode' };
        if (name === 'zener') return { type: 'diode', model: 'zener' };
        if (name === 'led') return { type: 'diode', model: 'led' };

        // Transistors
        if (name === 'nmos') return { type: 'mosfet', polarity: 'n' };
        if (name === 'pmos') return { type: 'mosfet', polarity: 'p' };
        if (name === 'npn') return { type: 'bjt', polarity: 'n' };
        if (name === 'pnp') return { type: 'bjt', polarity: 'p' };

        // Sources
        if (name === 'voltage') return { type: 'voltage_source' };
        if (name === 'current') return { type: 'current_source' };

        // Special
        if (name === 'opamp') return { type: 'subckt', modelName: 'UniversalOpamp2' };

        return null;
    }
};
