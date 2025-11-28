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
        if (c.type === 'switch' && c.state?.on) {
            const u = `${c.id}:in`;
            const v = `${c.id}:out`;
            if (!adj[u]) adj[u] = [];
            if (!adj[v]) adj[v] = [];
            adj[u].push(v);
            adj[v].push(u);
        }
        // Breadboard rows are internally connected
        if (c.type === 'breadboard') {
            // This is complex for a "Lite" sim if we model every hole.
            // Maybe abstract breadboard as just visual for now, or handle logic later.
        }
    });

    return { adj, components };
};

const getVoltageDiff = (comp, graph) => {
    // BFS from component anode to find Battery +
    // BFS from component cathode to find Battery -
    // This is "Sim-Lite" - just connectivity check to power rails.

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

    const anode = `${comp.id}:anode`;
    const cathode = `${comp.id}:cathode`;

    // Check connectivity to Battery
    // Assuming Battery has 'pos' and 'neg' ports
    const connectedToPos = hasPathTo(anode, 'battery', 'pos');
    const connectedToNeg = hasPathTo(cathode, 'battery', 'neg');

    if (connectedToPos && connectedToNeg) return 9; // Idealized 9V
    return 0;
};
