import { Matrix } from './math';
import { Models } from './models';

export const solveCircuit = (components, wires) => {
    // 1. Node Identification
    // Map every connected port to a unique Node ID.
    // Ground is Node 0.
    const nodeMap = new Map(); // "compId:portId" -> NodeIndex
    let nodeCount = 0;

    // Union-Find for Nets
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

    // Initialize all ports as their own nets
    components.forEach(c => {
        // We need to know the ports for each component type
        // This should come from a definition, but we'll infer or hardcode for now based on models
        const ports = getPortsForComponent(c);
        ports.forEach(p => {
            const key = `${c.id}:${p}`;
            parent.set(key, key);
        });
    });

    // Merge nets based on wires
    wires.forEach(w => {
        const u = `${w.fromComp}:${w.fromPort}`;
        const v = `${w.toComp}:${w.toPort}`;
        if (parent.has(u) && parent.has(v)) {
            union(u, v);
        }
    });

    // Assign Node Indices to Roots
    const rootToNodeIndex = new Map();
    // Check for Ground (convention: negative terminal of first battery is ground? Or explicit ground?)
    // For now, let's pick an arbitrary ground or floating reference. 
    // Better: If there's a battery, make its negative terminal Node 0 (Ground).
    let groundRoot = null;
    const battery = components.find(c => c.type === 'battery');
    if (battery) {
        groundRoot = find(`${battery.id}:neg`);
        rootToNodeIndex.set(groundRoot, -1); // -1 indicates Ground (reference, not in matrix)
    }

    // Assign indices
    for (const key of parent.keys()) {
        const root = find(key);
        if (root === groundRoot) continue;
        if (!rootToNodeIndex.has(root)) {
            rootToNodeIndex.set(root, nodeCount++);
        }
    }

    // Helper to get node index for a port
    const getNode = (compId, portId) => {
        const key = `${compId}:${portId}`;
        if (!parent.has(key)) return undefined; // Port not connected?
        const root = find(key);
        if (root === groundRoot) return undefined; // Ground is not a variable
        return rootToNodeIndex.get(root);
    };

    // 2. Matrix Setup
    // Size = NumNodes + NumVoltageSources
    const voltageSources = components.filter(c => c.type === 'battery'); // Add others later
    const matrixSize = nodeCount + voltageSources.length;

    // Iterative Solution (Newton-Raphson)
    let solution = new Array(matrixSize).fill(0);
    const maxIter = 20;
    const tolerance = 1e-3;

    for (let iter = 0; iter < maxIter; iter++) {
        const A = Matrix.zeros(matrixSize, matrixSize);
        const b = new Array(matrixSize).fill(0);

        // Stamp Components
        components.forEach(comp => {
            const model = Models[comp.type];
            if (!model) return;

            // Prepare node indices for this component
            const nodes = {};
            // Map component ports to matrix indices
            const ports = getPortsForComponent(comp);
            ports.forEach(p => {
                nodes[p] = getNode(comp.id, p);
            });

            if (model.type === 'voltage_source') {
                const srcIdx = voltageSources.findIndex(s => s.id === comp.id);
                model.stamp(A, b, nodes, comp, srcIdx, nodeCount);
            } else if (model.type === 'diode') {
                let anodeV = 0, cathodeV = 0;
                if (nodes.anode !== undefined) anodeV = solution[nodes.anode];
                if (nodes.cathode !== undefined) cathodeV = solution[nodes.cathode];
                const vDiff = anodeV - cathodeV;
                model.stamp(A, b, nodes, comp, vDiff);
            } else if (model.type === 'bjt') {
                let B = 0, C = 0, E = 0;
                if (nodes.base !== undefined) B = solution[nodes.base];
                if (nodes.collector !== undefined) C = solution[nodes.collector];
                if (nodes.emitter !== undefined) E = solution[nodes.emitter];
                model.stamp(A, b, nodes, comp, B - E, C - E);
            } else if (model.type === 'mosfet') {
                let G = 0, D = 0, S = 0;
                if (nodes.gate !== undefined) G = solution[nodes.gate];
                if (nodes.drain !== undefined) D = solution[nodes.drain];
                if (nodes.source !== undefined) S = solution[nodes.source];
                model.stamp(A, b, nodes, comp, G - S, D - S);
            } else {
                model.stamp(A, b, nodes, comp);
            }
        });

        // Solve
        const nextSolution = Matrix.solve(A, b);
        if (!nextSolution) {
            console.warn("Singular matrix");
            return null;
        }

        // Check convergence
        let diff = 0;
        for (let i = 0; i < matrixSize; i++) {
            diff += Math.abs(nextSolution[i] - solution[i]);
        }
        solution = nextSolution;

        if (diff < tolerance) break;
    }

    // 3. Result Mapping
    // Map solution back to component states
    const updates = {};
    components.forEach(comp => {
        const model = Models[comp.type];
        if (model) {
            const nodes = {};
            const ports = getPortsForComponent(comp);
            ports.forEach(p => {
                const idx = getNode(comp.id, p);
                nodes[p] = idx !== undefined ? solution[idx] : 0;
            });

            // Calculate basic stats
            let vDiff = 0, current = 0, power = 0;

            if (model.type === 'passive' || model.type === 'diode' || model.type === 'switch') {
                const p1 = ports[0];
                const p2 = ports[1];
                vDiff = nodes[p1] - nodes[p2];
                // I = V/R or similar. For diode, use model eq.
                // Simplified: I = G * V for passive
                if (comp.type === 'resistor') {
                    const R = parseFloat(comp.properties?.resistance || 1000);
                    current = vDiff / Math.max(R, 1e-6);
                } else if (comp.type === 'led') {
                    // Recalculate diode current
                    const Is = 1e-12, Vt = 0.026;
                    current = Is * (Math.exp(Math.min(vDiff, 3) / Vt) - 1);
                }
                power = vDiff * current;

                if (model.calculateState) {
                    updates[comp.id] = { ...model.calculateState(vDiff), voltage: vDiff, current, power };
                } else {
                    updates[comp.id] = { voltage: vDiff, current, power };
                }
            } else if (model.type === 'voltage_source') {
                const srcIdx = voltageSources.findIndex(s => s.id === comp.id);
                // Current is in the solution vector at nodeCount + srcIdx
                current = solution[nodeCount + srcIdx];
                // Power = V * I (Source power)
                vDiff = parseFloat(comp.properties?.voltage || 9);
                power = vDiff * current;
                updates[comp.id] = { voltage: vDiff, current, power };
            } else if (model.type === 'bjt') {
                const vBE = nodes.base - nodes.emitter;
                const vCE = nodes.collector - nodes.emitter;
                updates[comp.id] = model.calculateState(0, 0, 0, vBE, vCE);
            } else if (model.type === 'mosfet') {
                const vGS = nodes.gate - nodes.source;
                const vDS = nodes.drain - nodes.source;
                updates[comp.id] = model.calculateState(0, 0, 0, vGS, vDS);
            }
        }
    });

    return updates;
};

// Helper: Define ports for components
const getPortsForComponent = (comp) => {
    switch (comp.type) {
        case 'resistor': return ['p1', 'p2'];
        case 'battery': return ['pos', 'neg'];
        case 'led': return ['anode', 'cathode'];
        case 'switch': return ['in', 'out'];
        case 'transistor': return ['base', 'collector', 'emitter'];
        case 'mosfet': return ['gate', 'drain', 'source'];
        default: return [];
    }
};
