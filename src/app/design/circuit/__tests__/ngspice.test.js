/**
 * NgSpice Simulator Test Suite
 * Quick validation of core functionality
 */

import NgSpiceSimulator, {
  formatValue,
  parseValue,
} from "../lib/ngspice-adapter.js";

// Test data: Simple voltage divider
// V1 (5V) - R1 (1k) - Node1 - R2 (1k) - GND
const testComponents = [
  {
    id: "vsource1",
    type: "voltage_source",
    value: "5",
    x: 100,
    y: 100,
  },
  {
    id: "resistor1",
    type: "resistor",
    value: "1k",
    x: 200,
    y: 100,
  },
  {
    id: "resistor2",
    type: "resistor",
    value: "1k",
    x: 300,
    y: 100,
  },
  {
    id: "ground1",
    type: "ground",
    x: 400,
    y: 100,
  },
];

const testConnections = [
  {
    id: "conn1",
    startComponent: "vsource1",
    startPort: "top",
    endComponent: "resistor1",
    endPort: "top",
  },
  {
    id: "conn2",
    startComponent: "resistor1",
    startPort: "bottom",
    endComponent: "resistor2",
    endPort: "top",
  },
  {
    id: "conn3",
    startComponent: "resistor2",
    startPort: "bottom",
    endComponent: "ground1",
    endPort: "top",
  },
  {
    id: "conn4",
    startComponent: "vsource1",
    startPort: "bottom",
    endComponent: "ground1",
    endPort: "bottom",
  },
];

console.log("🧪 NgSpice Simulator Test Suite\n");

// Test 1: Value Parsing
console.log("Test 1: Value Parsing");
const testValues = [
  { input: "1k", expected: 1000 },
  { input: "10u", expected: 0.00001 },
  { input: "2.2M", expected: 2200000 },
  { input: "4.7n", expected: 0.0000000047 },
  { input: "100", expected: 100 },
];

testValues.forEach((test) => {
  const result = parseValue(test.input);
  const pass = Math.abs(result - test.expected) < 1e-10;
  console.log(
    `  ${pass ? "✅" : "❌"} parseValue("${
      test.input
    }") = ${result} (expected ${test.expected})`,
  );
});

// Test 2: Value Formatting
console.log("\nTest 2: Value Formatting");
const testFormats = [
  { input: 1000, expected: "1.000k" },
  { input: 0.000001, expected: "1.000u" },
  { input: 2500000, expected: "2.500M" },
];

testFormats.forEach((test) => {
  const result = formatValue(test.input);
  const pass = result === test.expected;
  console.log(
    `  ${pass ? "✅" : "❌"} formatValue(${
      test.input
    }) = "${result}" (expected "${test.expected}")`,
  );
});

// Test 3: DC Operating Point
console.log("\nTest 3: DC Operating Point (Voltage Divider)");
const simulator = new NgSpiceSimulator();
simulator.loadCircuit(testComponents, testConnections);

try {
  const result = simulator.dcOperatingPoint();

  if (result.success) {
    console.log("  ✅ Simulation successful");
    console.log("  Node voltages:");

    result.voltages.forEach((voltage, idx) => {
      if (idx === 0) {
        console.log(`    Node ${idx} (GND): ${voltage.toFixed(6)}V`);
      } else {
        console.log(`    Node ${idx}: ${voltage.toFixed(6)}V`);
      }
    });

    // Expected: Middle node should be ~2.5V (voltage divider)
    const middleVoltage = result.voltages[1]; // Assuming node 1 is the middle
    const expectedMiddle = 2.5;
    const error = Math.abs(middleVoltage - expectedMiddle);
    const pass = error < 0.1;

    console.log(
      `  ${pass ? "✅" : "❌"} Middle node voltage: ${middleVoltage.toFixed(
        3,
      )}V (expected ~${expectedMiddle}V, error: ${error.toFixed(6)}V)`,
    );
  } else {
    console.log("  ❌ Simulation failed:", result.error);
  }
} catch (error) {
  console.log("  ❌ Exception:", error.message);
}

// Test 4: DC Sweep
console.log("\nTest 4: DC Sweep");
try {
  const sweepResult = simulator.dcSweep("vsource1", 0, 5, 1);

  if (sweepResult.success) {
    console.log("  ✅ DC Sweep successful");
    console.log("  Sweep points:");

    sweepResult.results.forEach((point) => {
      console.log(
        `    V = ${point.sweep.toFixed(
          1,
        )}V → Middle = ${point.voltages[1]?.toFixed(3)}V`,
      );
    });
  } else {
    console.log("  ❌ DC Sweep failed");
  }
} catch (error) {
  console.log("  ❌ Exception:", error.message);
}

// Test 5: Transient Analysis (RC circuit)
console.log("\nTest 5: Transient Analysis");

const rcComponents = [
  {
    id: "vsource1",
    type: "voltage_source",
    value: "5",
    x: 100,
    y: 100,
  },
  {
    id: "resistor1",
    type: "resistor",
    value: "1k",
    x: 200,
    y: 100,
  },
  {
    id: "capacitor1",
    type: "capacitor",
    value: "1u", // 1µF
    x: 300,
    y: 100,
  },
  {
    id: "ground1",
    type: "ground",
    x: 400,
    y: 100,
  },
];

const rcConnections = [
  {
    id: "conn1",
    startComponent: "vsource1",
    startPort: "top",
    endComponent: "resistor1",
    endPort: "top",
  },
  {
    id: "conn2",
    startComponent: "resistor1",
    startPort: "bottom",
    endComponent: "capacitor1",
    endPort: "top",
  },
  {
    id: "conn3",
    startComponent: "capacitor1",
    startPort: "bottom",
    endComponent: "ground1",
    endPort: "top",
  },
  {
    id: "conn4",
    startComponent: "vsource1",
    startPort: "bottom",
    endComponent: "ground1",
    endPort: "bottom",
  },
];

const rcSimulator = new NgSpiceSimulator();
rcSimulator.loadCircuit(rcComponents, rcConnections);

try {
  const transResult = rcSimulator.transientAnalysis(0.005, 0.0001); // 5ms, 0.1ms step

  if (transResult.success) {
    console.log("  ✅ Transient analysis successful");
    console.log(`  Simulated ${transResult.results.length} time points`);

    // Show first few and last few points
    const firstPoints = transResult.results.slice(0, 3);
    const lastPoints = transResult.results.slice(-3);

    console.log("  First points:");
    firstPoints.forEach((point) => {
      console.log(
        `    t=${(point.time * 1000).toFixed(
          2,
        )}ms: V=${point.voltages[1]?.toFixed(4)}V`,
      );
    });

    console.log("  ...");

    console.log("  Last points:");
    lastPoints.forEach((point) => {
      console.log(
        `    t=${(point.time * 1000).toFixed(
          2,
        )}ms: V=${point.voltages[1]?.toFixed(4)}V`,
      );
    });
  } else {
    console.log("  ❌ Transient analysis failed");
  }
} catch (error) {
  console.log("  ❌ Exception:", error.message);
}

console.log("\n✅ Test suite complete!\n");

export { testComponents, testConnections };
