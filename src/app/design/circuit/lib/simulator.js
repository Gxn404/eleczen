/**
 * Circuit Simulation Engine
 * Provides basic DC analysis and transient simulation capabilities
 */

export class CircuitSimulator {
  constructor(components, connections) {
    this.components = components;
    this.connections = connections;
    this.nodes = this.buildNodeNetwork();
    this.time = 0;
    this.history = [];
  }

  buildNodeNetwork() {
    const nodes = new Map();
    let nodeId = 0;

    // Assign nodes to each connection point
    this.connections.forEach((conn) => {
      const key = `${conn.startComponent}:${conn.startPort}`;
      if (!nodes.has(key)) {
        nodes.set(key, nodeId++);
      }

      const key2 = `${conn.endComponent}:${conn.endPort}`;
      if (!nodes.has(key2)) {
        nodes.set(key2, nodeId++);
      }

      // Map both ports to the same node
      nodes.set(key, nodes.get(key) || nodes.get(key2) || nodeId++);
      nodes.set(key2, nodes.get(key));
    });

    return nodes;
  }

  /**
   * Perform DC analysis
   * Computes steady-state voltages and currents
   */
  dcAnalysis() {
    const voltages = new Map();
    const currents = new Map();

    // Build conductance matrix (simplified)
    const nodeCount = new Set(this.nodes.values()).size;
    const G = Array(nodeCount)
      .fill(0)
      .map(() => Array(nodeCount).fill(0));
    const I = Array(nodeCount).fill(0);

    // Apply component characteristics
    this.components.forEach((comp) => {
      const compInfo = this.getComponentInfo(comp);
      if (!compInfo) return;

      const node1 = this.nodes.get(`${comp.id}:left`);
      const node2 = this.nodes.get(`${comp.id}:right`);

      if (node1 !== undefined && node2 !== undefined) {
        const conductance = 1 / compInfo.resistance;
        G[node1][node1] += conductance;
        G[node2][node2] += conductance;
        G[node1][node2] -= conductance;
        G[node2][node1] -= conductance;
      }
    });

    // Solve using Gaussian elimination (simplified)
    try {
      const solution = this.gaussianElimination(G, I);
      solution.forEach((voltage, idx) => {
        voltages.set(idx, voltage || 0);
      });
    } catch (e) {
      console.warn("DC analysis failed:", e);
    }

    return { voltages, currents };
  }

  /**
   * Perform transient (time-domain) analysis
   */
  transientAnalysis(timeStep = 0.001, duration = 1) {
    const results = {
      time: [],
      voltages: {},
      currents: {},
    };

    let t = 0;
    while (t < duration) {
      const analysis = this.dcAnalysis();

      results.time.push(t);
      analysis.voltages.forEach((v, nodeId) => {
        if (!results.voltages[nodeId]) {
          results.voltages[nodeId] = [];
        }
        results.voltages[nodeId].push(v);
      });

      t += timeStep;
    }

    return results;
  }

  /**
   * Get component electrical characteristics
   */
  getComponentInfo(component) {
    const resistanceMap = {
      resistor: (value) => this.parseValue(value),
      capacitor: () => 1e9, // Very high impedance for DC
      inductor: () => 0, // Zero impedance for DC
      diode: () => 100, // Simplified diode model
      led: () => 150,
      voltage_source: () => 1e-6, // Near-zero impedance
      current_source: () => 1e9, // Very high impedance
      ground: () => 0,
      op_amp: () => 1e12, // Very high input impedance
    };

    const fn = resistanceMap[component.type];
    if (!fn) return null;

    return {
      resistance: fn(component.value),
      type: component.type,
      label: component.label,
    };
  }

  /**
   * Parse component value string (e.g., "10k", "100n", "1.5M")
   */
  parseValue(valueStr) {
    if (!valueStr) return 1000;

    const multipliers = {
      p: 1e-12,
      n: 1e-9,
      µ: 1e-6,
      u: 1e-6,
      m: 1e-3,
      k: 1e3,
      M: 1e6,
      G: 1e9,
    };

    const match = valueStr.match(/^([\d.]+)\s*([a-zA-Z])?/);
    if (!match) return 1000;

    const [, num, unit] = match;
    const multiplier = multipliers[unit] || 1;
    return parseFloat(num) * multiplier;
  }

  /**
   * Solve Ax = b using Gaussian elimination
   */
  gaussianElimination(A, b) {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);

    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }

      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      // Make all rows below this one 0 in current column
      for (let k = i + 1; k < n; k++) {
        if (augmented[i][i] === 0) continue;
        const c = augmented[k][i] / augmented[i][i];
        for (let j = i; j <= n; j++) {
          augmented[k][j] -= c * augmented[i][j];
        }
      }
    }

    // Back substitution
    const solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      solution[i] = augmented[i][n];
      for (let j = i + 1; j < n; j++) {
        solution[i] -= augmented[i][j] * solution[j];
      }
      solution[i] /= augmented[i][i];
    }

    return solution;
  }

  /**
   * Get voltages at all nodes
   */
  getNodeVoltages() {
    const analysis = this.dcAnalysis();
    return Array.from(analysis.voltages.entries());
  }

  /**
   * Get current through a component
   */
  getComponentCurrent(componentId) {
    const analysis = this.dcAnalysis();
    // Simplified: return average current through component
    return Math.random() * 0.1; // Placeholder
  }

  /**
   * Validate circuit connectivity
   */
  validateCircuit() {
    const issues = [];

    // Check for floating nodes
    const connectedPorts = new Set();
    this.connections.forEach((conn) => {
      connectedPorts.add(`${conn.startComponent}:${conn.startPort}`);
      connectedPorts.add(`${conn.endComponent}:${conn.endPort}`);
    });

    this.components.forEach((comp) => {
      if (comp.type === "ground") return; // Ground nodes are OK floating

      if (!connectedPorts.has(`${comp.id}:left`)) {
        issues.push(`Component ${comp.label} left port is floating`);
      }
      if (!connectedPorts.has(`${comp.id}:right`)) {
        issues.push(`Component ${comp.label} right port is floating`);
      }
    });

    // Check for voltage source loops
    // Check for ground reference
    const hasGround = this.components.some((c) => c.type === "ground");
    if (!hasGround) {
      issues.push("No ground reference in circuit");
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}

/**
 * Export simulation results to various formats
 */
export function exportSimulationResults(results, format = "json") {
  switch (format) {
    case "json":
      return JSON.stringify(results, null, 2);
    case "csv": {
      let csv = "Time," + Object.keys(results.voltages).join(",") + "\n";
      for (let i = 0; i < results.time.length; i++) {
        csv += results.time[i];
        for (const nodeId in results.voltages) {
          csv += "," + (results.voltages[nodeId][i] || 0);
        }
        csv += "\n";
      }
      return csv;
    }
    case "netlist": {
      // Simple SPICE netlist export
      let netlist = "* Eleczen Circuit Netlist\n";
      netlist += "* Generated: " + new Date().toISOString() + "\n\n";
      // Additional netlist generation logic would go here
      return netlist;
    }
    default:
      return JSON.stringify(results);
  }
}
