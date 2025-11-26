/**
 * Circuit Analysis Engine
 * Powered by NgSpice-style simulator
 * Features:
 * - SPICE netlist generation
 * - Modified Nodal Analysis (MNA)
 * - DC Operating Point & Sweep
 * - AC Analysis (frequency response)
 * - Transient Analysis (time-domain)
 * - Full component support (R, L, C, V, I, D, Q, etc.)
 */

import NgSpiceSimulator, {
  formatValue as ngFormatValue,
  parseValue as ngParseValue,
} from "./ngspice-adapter.js";

/**
 * Parse component value with engineering notation
 */
export function parseValue(valueStr) {
  return ngParseValue(valueStr);
}

/**
 * Format value with engineering notation
 */
export function formatValue(value, precision = 3) {
  return ngFormatValue(value, precision);
}

/**
 * DC Operating Point Analysis
 */
export function runDCAnalysis(components, connections) {
  const simulator = new NgSpiceSimulator();
  simulator.loadCircuit(components, connections);

  try {
    const result = simulator.dcOperatingPoint();

    if (!result.success) {
      return {
        success: false,
        error: "DC analysis failed",
        message: "Failed to compute DC operating point",
      };
    }

    // Map voltages to node names
    const nodeVoltages = {};
    const nodeMap = result.nodeMap;

    result.voltages.forEach((voltage, idx) => {
      // Find node name for this index
      for (const [nodeName, nodeIdx] of Object.entries(nodeMap)) {
        if (nodeIdx === idx) {
          nodeVoltages[nodeName] = voltage;
        }
      }
    });

    return {
      success: true,
      voltages: nodeVoltages,
      nodeMap,
      message: "DC analysis completed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "DC analysis error",
    };
  }
}

/**
 * DC Sweep Analysis
 */
export function runDCSweep(
  components,
  connections,
  sourceId,
  start,
  stop,
  step,
) {
  const simulator = new NgSpiceSimulator();
  simulator.loadCircuit(components, connections);

  try {
    const result = simulator.dcSweep(sourceId, start, stop, step);

    if (!result.success) {
      return {
        success: false,
        error: "DC sweep failed",
        message: "Failed to run DC sweep",
      };
    }

    return {
      success: true,
      results: result.results,
      sourceId: result.sourceId,
      message: "DC sweep completed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "DC sweep error",
    };
  }
}

/**
 * Transient Analysis
 */
export function runTransientAnalysis(
  components,
  connections,
  duration = 1,
  step = 0.001,
) {
  const simulator = new NgSpiceSimulator();
  simulator.loadCircuit(components, connections);

  try {
    const result = simulator.transientAnalysis(duration, step);

    if (!result.success) {
      return {
        success: false,
        error: "Transient analysis failed",
        message: "Failed to compute transient response",
      };
    }

    return {
      success: true,
      results: result.results,
      duration: result.duration,
      step: result.timeStep,
      message: "Transient analysis completed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Transient analysis error",
    };
  }
}

/**
 * AC Analysis (frequency response)
 */
export function runACAnalysis(
  components,
  connections,
  startFreq = 1,
  stopFreq = 1000000,
  pointsPerDecade = 10,
) {
  const simulator = new NgSpiceSimulator();
  simulator.loadCircuit(components, connections);

  try {
    const result = simulator.acAnalysis(
      startFreq,
      stopFreq,
      pointsPerDecade,
      "dec",
    );

    if (!result.success) {
      return {
        success: false,
        error: "AC analysis failed",
        message: "Failed to compute frequency response",
      };
    }

    return {
      success: true,
      results: result.results,
      frequencies: result.frequencies,
      message: "AC analysis completed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "AC analysis error",
    };
  }
}

/**
 * Calculate component power dissipation
 */
export function calculatePowerDissipation(components, nodeVoltages) {
  const powerData = [];

  components.forEach((comp) => {
    if (comp.type === "resistor") {
      const v1 = nodeVoltages[`${comp.id}_top`] || 0;
      const v2 = nodeVoltages[`${comp.id}_bottom`] || 0;
      const voltage = Math.abs(v1 - v2);
      const resistance = parseValue(comp.value);
      const current = voltage / resistance;
      const power = voltage * current;

      powerData.push({
        componentId: comp.id,
        label: comp.label || comp.type,
        power,
        voltage,
        current,
      });
    }
  });

  return powerData;
}

/**
 * Validate circuit for simulation
 */
export function validateCircuit(components, connections) {
  const errors = [];
  const warnings = [];

  // Check for at least one voltage source
  const hasVoltageSource = components.some((c) => c.type === "voltage_source");
  if (!hasVoltageSource) {
    warnings.push(
      "No voltage source detected. Add a voltage source for DC analysis.",
    );
  }

  // Check for ground connection
  const hasGround = components.some((c) => c.type === "ground");
  if (!hasGround) {
    warnings.push(
      "No ground connection detected. Add a ground for proper analysis.",
    );
  }

  // Check for floating nodes
  const nodeConnections = {};
  connections.forEach((conn) => {
    const startId = `${conn.startComponent}_${conn.startPort}`;
    const endId = `${conn.endComponent}_${conn.endPort}`;
    nodeConnections[startId] = (nodeConnections[startId] || 0) + 1;
    nodeConnections[endId] = (nodeConnections[endId] || 0) + 1;
  });

  // Check if all components have at least one connection
  components.forEach((comp) => {
    const connected = ["top", "right", "bottom", "left"].some((port) => {
      const nodeId = `${comp.id}_${port}`;
      return nodeConnections[nodeId] > 0;
    });

    if (!connected && comp.type !== "ground") {
      warnings.push(`Component ${comp.label || comp.id} is not connected.`);
    }
  });

  return { errors, warnings, isValid: errors.length === 0 };
}

export default {
  parseValue,
  formatValue,
  runDCAnalysis,
  runDCSweep,
  runTransientAnalysis,
  runACAnalysis,
  calculatePowerDissipation,
  validateCircuit,
};
