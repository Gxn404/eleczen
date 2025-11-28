/**
 * Eleczen LiteSim Engine
 * Rule-based simulation for instant feedback.
 * 
 * Principles:
 * - No matrix solving (SPICE).
 * - Breadth-first voltage propagation.
 * - Components have "logic" functions that determine state based on inputs.
 */

export const evaluateCircuit = (components, wires) => {
    // 1. Build Node Graph
    // Map each component port to a "Net" ID.
    // Wires connect ports to the same Net.

    const nets = new Map(); // NetID -> { voltage: number, source: boolean }
    const portToNet = new Map(); // ComponentID:PortID -> NetID

    // Helper to get/create net
    let netCounter = 0;
    const getNetId = (key) => {
        if (!portToNet.has(key)) {
            portToNet.set(key, `net_${netCounter++}`);
        }
        return portToNet.get(key);
    };

    // Merge nets connected by wires
    wires.forEach(wire => {
        const startKey = `${wire.fromComp}:${wire.fromPort}`;
        const endKey = `${wire.toComp}:${wire.toPort}`;

        // Simple union-find or just naive merging for now
        // For this lite version, we'll just assume wires are perfect conductors
        // and pre-assign nets.
        // Actually, let's do a proper union-find if we want auto-routing logic later,
        // but for now, let's just group connected ports.
    });

    // RE-THINK: Sim-Lite approach
    // Just propagate "Power" from Batteries.

    // Reset all component states
    const updates = {};

    // Find sources
    const sources = components.filter(c => c.type === 'battery');

    // Propagate voltage
    // This is a very naive implementation for the "Lite" feel.
    // Real implementation would need a graph traversal.

    // For the prototype, let's just check if an LED is connected to a Battery.
    // We need a graph.

    const graph = buildGraph(components, wires);

    // Evaluate rules
    components.forEach(comp => {
        if (comp.type === 'led') {
            const voltageDiff = getVoltageDiff(comp, graph);
            updates[comp.id] = { active: voltageDiff > 1.5 }; // Simple threshold
        }
        if (comp.type === 'motor') {
            const voltageDiff = getVoltageDiff(comp, graph);
            updates[comp.id] = { active: voltageDiff > 2.5, speed: voltageDiff * 10 };
        }
    });

    return updates;
};

// Helper to build a connectivity graph
const buildGraph = (components, wires) => {
    const adj = {}; // PortKey -> [PortKey]

    wires.forEach(w => {
        const u = `${w.fromComp}:${w.fromPort}`;
        const v = `${w.toComp}:${w.toPort}`;
        if (!adj[u]) adj[u] = [];
        if (!adj[v]) adj[v] = [];
        adj[u].push(v);
        adj[v].push(u);
    });

    // Also internal connections (e.g. switch closed)
    components.forEach(c => {
        // Switch: Closed = Connected
        if (c.type === 'switch' && c.state?.on) {
            addEdge(adj, `${c.id}:in`, `${c.id}:out`);
        }

        // Resistor: Always Connected (ignoring resistance value for connectivity check)
        if (c.type === 'resistor') {
            addEdge(adj, `${c.id}:p1`, `${c.id}:p2`);
        }

        // Transistor (NPN Idealized):
        // If Base is connected to High, Collector-Emitter is connected.
        if (c.type === 'transistor') {
            // We need to check Base voltage first. 
            // This requires a multi-pass or just a simple check against known sources.
            // For Sim-Lite, let's just check if Base is connected to a Battery Pos in the current graph state (excluding the transistor itself).
            // This is tricky because the graph isn't fully built.
            // Let's assume for now we just check if Base is connected to *something* that might be high?
            // Or better: Iterative simulation. 
            // But for now, let's just say if it's "active" state (set by previous tick?)
            // Actually, let's skip complex transistor logic for this exact step and just ensure Resistors work.
            // We can add a simple "if base connected to battery pos" check here?
            // No, `adj` is just being built.

            // Let's leave Transistor open for now, or maybe always closed for testing?
            // No, that defeats the purpose.
        }
    });

    return { adj, components };
};

const addEdge = (adj, u, v) => {
    if (!adj[u]) adj[u] = [];
    if (!adj[v]) adj[v] = [];
    adj[u].push(v);
    adj[v].push(u);
};

const getVoltageDiff = (comp, graph) => {
    // Determine ports based on type
    let posPort, negPort;

    if (comp.type === 'led') {
        posPort = `${comp.id}:anode`;
        negPort = `${comp.id}:cathode`;
    } else if (comp.type === 'motor') {
        posPort = `${comp.id}:pos`;
        negPort = `${comp.id}:neg`;
    } else {
        return 0;
    }

    const hasPathTo = (startPort, targetType, targetPort) => {
        const queue = [startPort];
        const visited = new Set();
        while (queue.length > 0) {
            const curr = queue.shift();
            if (visited.has(curr)) continue;
            visited.add(curr);

            // Check if this port belongs to the target
            const [compId, portId] = curr.split(':');
            const node = graph.components.find(c => c.id === compId);
            if (node && node.type === targetType && portId === targetPort) return true;

            // Neighbors
            if (graph.adj[curr]) {
                queue.push(...graph.adj[curr]);
            }
        }
        return false;
    };

    // Check connectivity to Battery
    const connectedToPos = hasPathTo(posPort, 'battery', 'pos');
    const connectedToNeg = hasPathTo(negPort, 'battery', 'neg');

    if (connectedToPos && connectedToNeg) return 9; // Idealized 9V
    return 0;
};
