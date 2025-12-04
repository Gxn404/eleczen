/**
 * Converts internal Component/Wire state to SPICE Netlist
 */

export const generateNetlist = (components, wires) => {
    let netlist = "ElecZen Circuit Simulation\n";

    // 1. Node Identification (Union-Find)
    const parent = new Map();
    const find = (i) => {
        if (parent.get(i) === i) return i;
        const root = find(parent.get(i));
        parent.set(i, root);
        return root;
    };
    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) parent.set(rootI, rootJ);
    };

    // Initialize ports
    components.forEach(c => {
        const ports = getPortsForComponent(c);
        ports.forEach(p => {
            const key = `${c.id}:${p}`;
            parent.set(key, key);
        });
    });

    // Merge nets
    wires.forEach(w => {
        const u = `${w.fromComp}:${w.fromPort}`;
        const v = `${w.toComp}:${w.toPort}`;
        if (parent.has(u) && parent.has(v)) {
            union(u, v);
        }
    });

    // Assign Net Names
    const rootToNetName = new Map();
    let netCount = 1;

    // Find Ground
    let groundRoot = null;
    const battery = components.find(c => c.type === 'battery');
    if (battery) {
        groundRoot = find(`${battery.id}:neg`);
        rootToNetName.set(groundRoot, "0");
    }

    // Assign names
    for (const key of parent.keys()) {
        const root = find(key);
        if (!rootToNetName.has(root)) {
            rootToNetName.set(root, `${netCount++}`);
        }
    }

    const getNet = (compId, portId) => {
        const key = `${compId}:${portId}`;
        if (!parent.has(key)) return "0"; // Default to ground if floating? Or error?
        return rootToNetName.get(find(key));
    };

    // 2. Generate SPICE Lines
    const usedModels = new Set();

    components.forEach(c => {
        const name = c.id.replace(/-/g, '_'); // SPICE names shouldn't have dashes
        const nodes = getPortsForComponent(c).map(p => getNet(c.id, p));
        const modelName = c.properties?.model;

        if (modelName) usedModels.add(modelName);

        switch (c.type) {
            case 'resistor':
                netlist += `R${name} ${nodes[0]} ${nodes[1]} ${c.properties?.resistance || 1000}\n`;
                break;
            case 'battery':
                netlist += `V${name} ${nodes[0]} ${nodes[1]} ${c.properties?.voltage || 9}\n`;
                break;
            case 'led':
                // Use custom model if provided, else default DLED
                netlist += `D${name} ${nodes[0]} ${nodes[1]} ${modelName || 'DLED'}\n`;
                if (!modelName) usedModels.add('DLED');
                break;
            case 'switch':
                const rVal = c.state?.on ? 0.001 : 1e9;
                netlist += `R${name} ${nodes[0]} ${nodes[1]} ${rVal}\n`;
                break;
            case 'transistor': // BJT NPN
                netlist += `Q${name} ${nodes[1]} ${nodes[0]} ${nodes[2]} ${modelName || 'NPN_GENERIC'}\n`;
                if (!modelName) usedModels.add('NPN_GENERIC');
                break;
            case 'mosfet': // NMOS
                netlist += `M${name} ${nodes[1]} ${nodes[0]} ${nodes[2]} ${nodes[2]} ${modelName || 'NMOS_GENERIC'}\n`;
                if (!modelName) usedModels.add('NMOS_GENERIC');
                break;
            case 'capacitor':
                netlist += `C${name} ${nodes[0]} ${nodes[1]} ${c.properties?.capacitance || '1u'}\n`;
                break;
            case 'inductor':
                netlist += `L${name} ${nodes[0]} ${nodes[1]} ${c.properties?.inductance || '1m'}\n`;
                break;
            case 'subckt': // Generic subcircuit instance
                // X<name> <nodes...> <subcktName>
                netlist += `X${name} ${nodes.join(' ')} ${modelName}\n`;
                break;
        }
    });

    // 3. Add Models
    // Inject models from store
    usedModels.forEach(mName => {
        const model = globalModelStore.getModel(mName);
        if (model) {
            netlist += `${model.raw}\n`;
        } else {
            const subckt = globalModelStore.getSubckt(mName);
            if (subckt) {
                netlist += `.subckt ${subckt.name} ${subckt.nodes.join(' ')}\n`;
                subckt.lines.forEach(l => netlist += `${l}\n`);
                netlist += `.ends\n`;
            }
        }
    });

    // Inject Globals
    const globals = globalModelStore.getAllGlobals();
    globals.forEach(g => {
        netlist += `${g}\n`;
    });

    // Fallback defaults if not in store (and not custom)
    if (usedModels.has('DLED') && !globalModelStore.getModel('DLED')) {
        netlist += `.model DLED D (IS=1e-14 N=2 RS=10)\n`;
    }
    if (usedModels.has('NPN_GENERIC') && !globalModelStore.getModel('NPN_GENERIC')) {
        netlist += `.model NPN_GENERIC NPN (IS=1e-14 BF=100)\n`;
    }
    if (usedModels.has('NMOS_GENERIC') && !globalModelStore.getModel('NMOS_GENERIC')) {
        netlist += `.model NMOS_GENERIC NMOS (KP=0.1 VTO=2.0)\n`;
    }

    netlist += `
.tran 0.1 10
.end
`;

    return { netlist, nodeMap: rootToNetName, parent, find };
};

export const getPortsForComponent = (comp) => {
    switch (comp.type) {
        case 'resistor': return ['p1', 'p2'];
        case 'battery': return ['pos', 'neg'];
        case 'led': return ['anode', 'cathode'];
        case 'switch': return ['in', 'out'];
        case 'transistor': return ['base', 'collector', 'emitter'];
        case 'mosfet': return ['gate', 'drain', 'source'];
        case 'capacitor': return ['p1', 'p2'];
        case 'inductor': return ['p1', 'p2'];
        default: return [];
    }
};
