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
    components.forEach(c => {
        const name = c.id.replace(/-/g, '_'); // SPICE names shouldn't have dashes
        const nodes = getPortsForComponent(c).map(p => getNet(c.id, p));

        switch (c.type) {
            case 'resistor':
                // R<name> <n1> <n2> <value>
                netlist += `R${name} ${nodes[0]} ${nodes[1]} ${c.properties?.resistance || 1000}\n`;
                break;
            case 'battery':
                // V<name> <pos> <neg> <value>
                netlist += `V${name} ${nodes[0]} ${nodes[1]} ${c.properties?.voltage || 9}\n`;
                break;
            case 'led':
                // D<name> <anode> <cathode> DLED
                // We need a model for LED
                netlist += `D${name} ${nodes[0]} ${nodes[1]} DLED\n`;
                break;
            case 'switch':
                // S<name> <n1> <n2> <ctrl1> <ctrl2> SW_MODEL
                // For simple switch, we can model as Resistor that changes value, 
                // OR use a voltage controlled switch if we had a control node.
                // Since this is interactive, we might just swap R value in netlist?
                // SPICE doesn't support interactive "click" switches easily without control source.
                // We will model as a Resistor for now: Low R (On) / High R (Off)
                const rVal = c.state?.on ? 0.001 : 1e9;
                netlist += `R${name} ${nodes[0]} ${nodes[1]} ${rVal}\n`;
                break;
            case 'transistor': // BJT NPN
                // Q<name> <C> <B> <E> NPN_MODEL
                netlist += `Q${name} ${nodes[1]} ${nodes[0]} ${nodes[2]} NPN_GENERIC\n`;
                break;
            case 'mosfet': // NMOS
                // M<name> <D> <G> <S> <B> NMOS_MODEL
                // Assuming Body connected to Source for 3-terminal
                netlist += `M${name} ${nodes[1]} ${nodes[0]} ${nodes[2]} ${nodes[2]} NMOS_GENERIC\n`;
                break;
            case 'capacitor':
                // C<name> <n1> <n2> <value>
                netlist += `C${name} ${nodes[0]} ${nodes[1]} ${c.properties?.capacitance || '1u'}\n`;
                break;
            case 'inductor':
                // L<name> <n1> <n2> <value>
                netlist += `L${name} ${nodes[0]} ${nodes[1]} ${c.properties?.inductance || '1m'}\n`;
                break;
        }
    });

    // 3. Add Models
    netlist += `
.model DLED D (IS=1e-14 N=2 RS=10)
.model NPN_GENERIC NPN (IS=1e-14 BF=100)
.model NMOS_GENERIC NMOS (KP=0.1 VTO=2.0)
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
