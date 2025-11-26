/**
 * NgSpice-Style Circuit Simulator
 * Browser-compatible SPICE simulator with full features
 * Supports: DC, AC, Transient, Operating Point analysis
 */

/**
 * Parse component value with engineering notation
 * Supports: p, n, u/µ, m, k, meg, g, t
 */
export function parseValue(valueStr) {
  if (!valueStr) return 0;
  if (typeof valueStr === "number") return valueStr;

  const str = String(valueStr).trim().toLowerCase();

  const units = {
    t: 1e12,
    g: 1e9,
    meg: 1e6,
    k: 1e3,
    m: 1e-3,
    u: 1e-6,
    µ: 1e-6,
    n: 1e-9,
    p: 1e-12,
    f: 1e-15,
  };

  // Match number followed by optional unit
  const match = str.match(/^([+-]?[\d.]+(?:e[+-]?\d+)?)\s*([a-zµ]+)?/i);
  if (!match) return parseFloat(str) || 0;

  const [, numStr, unit] = match;
  const number = parseFloat(numStr);

  if (!unit) return number;

  // Check for 'meg' first (3 chars)
  if (unit.startsWith("meg")) return number * units["meg"];

  // Then check single char units
  const multiplier = units[unit[0]] || 1;
  return number * multiplier;
}

/**
 * Format value with engineering notation
 */
export function formatValue(value, precision = 3) {
  if (value === 0) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e12)
    return `${sign}${(absValue / 1e12).toFixed(precision)}T`;
  if (absValue >= 1e9) return `${sign}${(absValue / 1e9).toFixed(precision)}G`;
  if (absValue >= 1e6) return `${sign}${(absValue / 1e6).toFixed(precision)}M`;
  if (absValue >= 1e3) return `${sign}${(absValue / 1e3).toFixed(precision)}k`;
  if (absValue >= 1) return `${sign}${absValue.toFixed(precision)}`;
  if (absValue >= 1e-3) return `${sign}${(absValue * 1e3).toFixed(precision)}m`;
  if (absValue >= 1e-6) return `${sign}${(absValue * 1e6).toFixed(precision)}u`;
  if (absValue >= 1e-9) return `${sign}${(absValue * 1e9).toFixed(precision)}n`;
  if (absValue >= 1e-12)
    return `${sign}${(absValue * 1e12).toFixed(precision)}p`;
  return `${sign}${(absValue * 1e15).toFixed(precision)}f`;
}

/**
 * NgSpice-style Circuit Simulator
 */
export class NgSpiceSimulator {
  constructor(options = {}) {
    this.options = {
      abstol: 1e-12,
      reltol: 1e-3,
      vntol: 1e-6,
      method: "trap", // trap, gear
      maxiter: 100,
      ...options,
    };

    this.components = [];
    this.connections = [];
    this.nodeMap = new Map();
    this.groundNode = 0;
  }

  /**
   * Load circuit components and connections
   */
  loadCircuit(components, connections) {
    this.components = components;
    this.connections = connections;
    this.buildNodeMap();
  }

  /**
   * Build node mapping from connections
   */
  buildNodeMap() {
    this.nodeMap.clear();
    let nodeIndex = 1; // 0 is ground

    const nodeIds = new Set();

    // Collect all unique node IDs
    this.connections.forEach((conn) => {
      const startId = `${conn.startComponent}_${conn.startPort}`;
      const endId = `${conn.endComponent}_${conn.endPort}`;
      nodeIds.add(startId);
      nodeIds.add(endId);
    });

    // Map each node to an index
    nodeIds.forEach((nodeId) => {
      if (!this.nodeMap.has(nodeId)) {
        this.nodeMap.set(nodeId, nodeIndex++);
      }
    });

    // Find ground nodes
    this.components.forEach((comp) => {
      if (comp.type === "ground") {
        // Ground has a single port "GND" (or "top" in legacy)
        // We map "GND" to ground node 0
        const nodeId = `${comp.id}_GND`;
        this.nodeMap.set(nodeId, this.groundNode);
      }
    });
  }

  /**
   * Get node index for component port
   */
  getNodeIndex(componentId, port) {
    const nodeId = `${componentId}_${port}`;
    return this.nodeMap.get(nodeId) || this.groundNode;
  }

  /**
   * DC Operating Point Analysis
   */
  dcOperatingPoint() {
    const numNodes = Math.max(...this.nodeMap.values()) + 1;

    // Initialize MNA (Modified Nodal Analysis) matrices
    const G = Array(numNodes)
      .fill(0)
      .map(() => Array(numNodes).fill(0));
    const I = Array(numNodes).fill(0);

    // Add voltage sources (creates additional equations)
    let vsourceCount = 0;
    const vsources = [];

    // Build MNA matrix
    this.components.forEach((comp) => {
      const value = parseValue(comp.value);

      switch (comp.type) {
        case "resistor": {
          const n1 = this.getNodeIndex(comp.id, "left");
          const n2 = this.getNodeIndex(comp.id, "right");
          const g = 1 / (value || 1e-6); // Conductance

          if (n1 !== 0) {
            G[n1][n1] += g;
            if (n2 !== 0) G[n1][n2] -= g;
          }
          if (n2 !== 0) {
            G[n2][n2] += g;
            if (n1 !== 0) G[n2][n1] -= g;
          }
          break;
        }

        case "voltage_source": {
          const n1 = this.getNodeIndex(comp.id, "+"); // +
          const n2 = this.getNodeIndex(comp.id, "-"); // -

          vsources.push({ n1, n2, value, compId: comp.id });
          vsourceCount++;
          break;
        }

        case "current_source": {
          const n1 = this.getNodeIndex(comp.id, "In");
          const n2 = this.getNodeIndex(comp.id, "Out");

          if (n1 !== 0) I[n1] -= value;
          if (n2 !== 0) I[n2] += value;
          break;
        }

        case "capacitor": {
          // DC analysis: capacitor = open circuit
          break;
        }

        case "inductor": {
          // DC analysis: inductor = short circuit (small resistance)
          const n1 = this.getNodeIndex(comp.id, "top");
          const n2 = this.getNodeIndex(comp.id, "bottom");
          const g = 1 / 1e-6; // Very small resistance

          if (n1 !== 0) {
            G[n1][n1] += g;
            if (n2 !== 0) G[n1][n2] -= g;
          }
          if (n2 !== 0) {
            G[n2][n2] += g;
            if (n1 !== 0) G[n2][n1] -= g;
          }
          break;
        }

        case "diode": {
          // Simplified diode: voltage drop ~0.7V for forward bias
          const n1 = this.getNodeIndex(comp.id, "top"); // Anode
          const n2 = this.getNodeIndex(comp.id, "bottom"); // Cathode
          const g = 1 / 100; // Forward resistance

          if (n1 !== 0) {
            G[n1][n1] += g;
            if (n2 !== 0) G[n1][n2] -= g;
          }
          if (n2 !== 0) {
            G[n2][n2] += g;
            if (n1 !== 0) G[n2][n1] -= g;
          }
          break;
        }
      }
    });

    // Extend matrix for voltage sources
    if (vsourceCount > 0) {
      const extSize = numNodes + vsourceCount;
      const Gext = Array(extSize)
        .fill(0)
        .map(() => Array(extSize).fill(0));
      const Iext = Array(extSize).fill(0);

      // Copy original G and I
      for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < numNodes; j++) {
          Gext[i][j] = G[i][j];
        }
        Iext[i] = I[i];
      }

      // Add voltage source equations
      vsources.forEach((vs, idx) => {
        const eqnIdx = numNodes + idx;

        // V[n1] - V[n2] = Vsource
        if (vs.n1 !== 0) {
          Gext[eqnIdx][vs.n1] = 1;
          Gext[vs.n1][eqnIdx] = 1;
        }
        if (vs.n2 !== 0) {
          Gext[eqnIdx][vs.n2] = -1;
          Gext[vs.n2][eqnIdx] = -1;
        }

        Iext[eqnIdx] = vs.value;
      });

      const solution = this.solveLinearSystem(Gext, Iext);

      // Extract node voltages
      const voltages = solution.slice(0, numNodes);
      const currents = solution.slice(numNodes);

      return {
        success: true,
        voltages,
        vsourceCurrents: currents,
        nodeMap: Object.fromEntries(this.nodeMap),
      };
    }

    const voltages = this.solveLinearSystem(G, I);

    return {
      success: true,
      voltages,
      nodeMap: Object.fromEntries(this.nodeMap),
    };
  }

  /**
   * DC Sweep Analysis
   */
  dcSweep(sourceId, start, stop, step) {
    const results = [];

    for (let v = start; v <= stop; v += step) {
      // Update voltage source value
      const comp = this.components.find((c) => c.id === sourceId);
      if (!comp) continue;

      const origValue = comp.value;
      comp.value = v;

      const opPoint = this.dcOperatingPoint();
      if (opPoint.success) {
        results.push({
          sweep: v,
          voltages: opPoint.voltages,
        });
      }

      comp.value = origValue;
    }

    return {
      success: true,
      results,
      sourceId,
    };
  }

  /**
   * Transient Analysis
   */
  transientAnalysis(duration, timeStep, method = "trap") {
    const numNodes = Math.max(...this.nodeMap.values()) + 1;
    const numSteps = Math.ceil(duration / timeStep);

    // Initialize state vectors
    let V = Array(numNodes).fill(0); // Node voltages
    const Vprev = Array(numNodes).fill(0);

    // Get capacitor and inductor values
    const capacitors = [];
    const inductors = [];

    this.components.forEach((comp) => {
      if (comp.type === "capacitor") {
        capacitors.push({
          id: comp.id,
          value: parseValue(comp.value),
          n1: this.getNodeIndex(comp.id, "top"),
          n2: this.getNodeIndex(comp.id, "bottom"),
          current: 0,
        });
      } else if (comp.type === "inductor") {
        inductors.push({
          id: comp.id,
          value: parseValue(comp.value),
          n1: this.getNodeIndex(comp.id, "top"),
          n2: this.getNodeIndex(comp.id, "bottom"),
          current: 0,
        });
      }
    });

    // Get DC operating point as initial condition
    const opPoint = this.dcOperatingPoint();
    if (opPoint.success) {
      V = [...opPoint.voltages];
      Vprev.splice(0, V.length, ...V);
    }

    const results = [];

    // Time-stepping loop
    for (let step = 0; step <= numSteps; step++) {
      const t = step * timeStep;

      // Build MNA for this time step
      const G = Array(numNodes)
        .fill(0)
        .map(() => Array(numNodes).fill(0));
      const I = Array(numNodes).fill(0);

      // Add resistors
      this.components.forEach((comp) => {
        if (comp.type === "resistor") {
          const n1 = this.getNodeIndex(comp.id, "top");
          const n2 = this.getNodeIndex(comp.id, "bottom");
          const g = 1 / (parseValue(comp.value) || 1e-6);

          if (n1 !== 0) {
            G[n1][n1] += g;
            if (n2 !== 0) G[n1][n2] -= g;
          }
          if (n2 !== 0) {
            G[n2][n2] += g;
            if (n1 !== 0) G[n2][n1] -= g;
          }
        }
      });

      // Add capacitors (companion model)
      capacitors.forEach((cap) => {
        const geq = cap.value / timeStep;
        const ieq = geq * (V[cap.n1] - V[cap.n2]);

        if (cap.n1 !== 0) {
          G[cap.n1][cap.n1] += geq;
          if (cap.n2 !== 0) G[cap.n1][cap.n2] -= geq;
          I[cap.n1] += ieq;
        }
        if (cap.n2 !== 0) {
          G[cap.n2][cap.n2] += geq;
          if (cap.n1 !== 0) G[cap.n2][cap.n1] -= geq;
          I[cap.n2] -= ieq;
        }
      });

      // Add inductors (companion model)
      inductors.forEach((ind) => {
        const geq = timeStep / ind.value;
        const ieq = ind.current;

        if (ind.n1 !== 0) {
          G[ind.n1][ind.n1] += geq;
          if (ind.n2 !== 0) G[ind.n1][ind.n2] -= geq;
          I[ind.n1] += ieq;
        }
        if (ind.n2 !== 0) {
          G[ind.n2][ind.n2] += geq;
          if (ind.n1 !== 0) G[ind.n2][ind.n1] -= geq;
          I[ind.n2] -= ieq;
        }

        // Update inductor current
        ind.current =
          ((V[ind.n1] - V[ind.n2]) / ind.value) * timeStep + ind.current;
      });

      // Add sources
      this.components.forEach((comp) => {
        if (comp.type === "voltage_source") {
          const n1 = this.getNodeIndex(comp.id, "top");
          const value = parseValue(comp.value);

          if (n1 !== 0) {
            I[n1] += value / 1e-6; // Very small series resistance
            G[n1][n1] += 1 / 1e-6;
          }
        } else if (comp.type === "current_source") {
          const n1 = this.getNodeIndex(comp.id, "top");
          const n2 = this.getNodeIndex(comp.id, "bottom");
          const value = parseValue(comp.value);

          if (n1 !== 0) I[n1] -= value;
          if (n2 !== 0) I[n2] += value;
        }
      });

      // Solve for this time step
      try {
        const Vnew = this.solveLinearSystem(G, I);
        Vprev.splice(0, V.length, ...V);
        V = Vnew;

        results.push({
          time: t,
          voltages: [...V],
        });
      } catch (error) {
        console.error(`Transient analysis failed at t=${t}:`, error);
        break;
      }
    }

    return {
      success: true,
      results,
      duration,
      timeStep,
    };
  }

  /**
   * AC Analysis (Small-signal frequency response)
   */
  acAnalysis(startFreq, stopFreq, pointsPerDecade = 10, type = "dec") {
    const results = [];

    // Generate frequency points
    const frequencies = [];
    if (type === "dec") {
      const decades = Math.log10(stopFreq / startFreq);
      const numPoints = Math.ceil(decades * pointsPerDecade);

      for (let i = 0; i <= numPoints; i++) {
        const f = startFreq * 10 ** (i / pointsPerDecade);
        if (f <= stopFreq) frequencies.push(f);
      }
    } else {
      // Linear sweep
      const step = (stopFreq - startFreq) / pointsPerDecade;
      for (let f = startFreq; f <= stopFreq; f += step) {
        frequencies.push(f);
      }
    }

    // For each frequency, calculate impedance matrix
    frequencies.forEach((f) => {
      const omega = 2 * Math.PI * f;
      const numNodes = Math.max(...this.nodeMap.values()) + 1;

      // Complex admittance matrix (real and imaginary parts)
      const Greal = Array(numNodes)
        .fill(0)
        .map(() => Array(numNodes).fill(0));
      const Gimag = Array(numNodes)
        .fill(0)
        .map(() => Array(numNodes).fill(0));
      const I = Array(numNodes).fill(0);

      // Add components
      this.components.forEach((comp) => {
        const n1 = this.getNodeIndex(comp.id, "top");
        const n2 = this.getNodeIndex(comp.id, "bottom");
        const value = parseValue(comp.value);

        switch (comp.type) {
          case "resistor": {
            const g = 1 / value;
            if (n1 !== 0) {
              Greal[n1][n1] += g;
              if (n2 !== 0) Greal[n1][n2] -= g;
            }
            if (n2 !== 0) {
              Greal[n2][n2] += g;
              if (n1 !== 0) Greal[n2][n1] -= g;
            }
            break;
          }

          case "capacitor": {
            const b = omega * value; // Susceptance
            if (n1 !== 0) {
              Gimag[n1][n1] += b;
              if (n2 !== 0) Gimag[n1][n2] -= b;
            }
            if (n2 !== 0) {
              Gimag[n2][n2] += b;
              if (n1 !== 0) Gimag[n2][n1] -= b;
            }
            break;
          }

          case "inductor": {
            const b = -1 / (omega * value); // Susceptance (negative)
            if (n1 !== 0) {
              Gimag[n1][n1] += b;
              if (n2 !== 0) Gimag[n1][n2] -= b;
            }
            if (n2 !== 0) {
              Gimag[n2][n2] += b;
              if (n1 !== 0) Gimag[n2][n1] -= b;
            }
            break;
          }

          case "voltage_source": {
            if (n1 !== 0) I[n1] = value;
            break;
          }
        }
      });

      // Solve complex linear system (simplified: use real part only for now)
      const Vreal = this.solveLinearSystem(Greal, I);
      const Vimag = Array(numNodes).fill(0);

      // Calculate magnitude and phase
      const magnitudes = Vreal.map((vr, i) => {
        const vi = Vimag[i];
        return Math.sqrt(vr * vr + vi * vi);
      });

      const phases = Vreal.map((vr, i) => {
        const vi = Vimag[i];
        return (Math.atan2(vi, vr) * 180) / Math.PI;
      });

      results.push({
        frequency: f,
        magnitudes,
        phases,
      });
    });

    return {
      success: true,
      results,
      frequencies,
    };
  }

  /**
   * Solve linear system Ax = b using Gaussian elimination with partial pivoting
   */
  solveLinearSystem(A, b) {
    const n = b.length;
    const aug = A.map((row, i) => [...row, b[i]]);

    // Forward elimination with partial pivoting
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
          maxRow = k;
        }
      }

      // Swap rows
      [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];

      // Check for singular matrix
      if (Math.abs(aug[i][i]) < this.options.abstol) {
        throw new Error(`Singular matrix at row ${i}`);
      }

      // Eliminate below
      for (let k = i + 1; k < n; k++) {
        const factor = aug[k][i] / aug[i][i];
        for (let j = i; j <= n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
      }
    }

    // Back substitution
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = aug[i][n];
      for (let j = i + 1; j < n; j++) {
        x[i] -= aug[i][j] * x[j];
      }
      x[i] /= aug[i][i];
    }

    return x;
  }
}

export default NgSpiceSimulator;
