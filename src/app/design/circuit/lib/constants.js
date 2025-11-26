// Component definitions with visual properties
export const COMPONENT_TYPES = {
  RESISTOR: "resistor",
  CAPACITOR: "capacitor",
  INDUCTOR: "inductor",
  DIODE: "diode",
  LED: "led",
  TRANSISTOR_NPN: "transistor_npn",
  TRANSISTOR_PNP: "transistor_pnp",
  OP_AMP: "op_amp",
  VOLTAGE_SOURCE: "voltage_source",
  CURRENT_SOURCE: "current_source",
  GROUND: "ground",
  WIRE: "wire",
};

export const COMPONENT_LIBRARY = {
  [COMPONENT_TYPES.RESISTOR]: {
    label: "Resistor",
    symbol: "R",
    category: "passives",
    width: 60,
    height: 20,
    color: "#F59E0B",
    gradient: ["#F59E0B", "#D97706"],
    defaultValue: "1k",
    description: "Limits current flow",
    svgPath: "M0 10 L10 10 L15 0 L25 20 L35 0 L45 20 L50 10 L60 10",
    ports: ["left", "right"],
  },
  [COMPONENT_TYPES.CAPACITOR]: {
    label: "Capacitor",
    symbol: "C",
    category: "passives",
    width: 40,
    height: 30,
    color: "#3B82F6",
    gradient: ["#3B82F6", "#2563EB"],
    defaultValue: "100nF",
    description: "Stores electrical energy",
    svgPath: "M0 15 L15 15 M15 0 L15 30 M25 0 L25 30 M25 15 L40 15",
    ports: ["left", "right"],
  },
  [COMPONENT_TYPES.INDUCTOR]: {
    label: "Inductor",
    symbol: "L",
    category: "passives",
    width: 50,
    height: 20,
    color: "#8B5CF6",
    gradient: ["#8B5CF6", "#7C3AED"],
    defaultValue: "10µH",
    description: "Stores energy in magnetic field",
    svgPath: "M0 10 L10 10 Q15 0 20 10 Q25 0 30 10 Q35 0 40 10 L50 10",
    ports: ["left", "right"],
  },
  [COMPONENT_TYPES.DIODE]: {
    label: "Diode",
    symbol: "D",
    category: "semiconductors",
    width: 40,
    height: 20,
    color: "#EC4899",
    gradient: ["#EC4899", "#DB2777"],
    defaultValue: "1N4148",
    description: "Allows current in one direction",
    svgPath:
      "M0 10 L15 10 M15 0 L15 20 L35 10 L15 0 M35 0 L35 20 M35 10 L40 10",
    ports: ["left", "right"],
  },
  [COMPONENT_TYPES.LED]: {
    label: "LED",
    symbol: "LED",
    category: "semiconductors",
    width: 40,
    height: 30,
    color: "#EF4444",
    gradient: ["#EF4444", "#DC2626"],
    defaultValue: "Red",
    description: "Light Emitting Diode",
    svgPath:
      "M0 15 L15 15 M15 5 L15 25 L35 15 L15 5 M35 5 L35 25 M35 15 L40 15 M20 5 L25 0 M25 8 L30 3",
    ports: ["left", "right"],
  },
  [COMPONENT_TYPES.TRANSISTOR_NPN]: {
    label: "NPN Transistor",
    symbol: "Q",
    category: "semiconductors",
    width: 50,
    height: 50,
    color: "#14B8A6",
    gradient: ["#14B8A6", "#0D9488"],
    defaultValue: "2N2222",
    description: "Bipolar Junction Transistor (NPN)",
    svgPath:
      "M25 5 L25 25 M25 25 L45 10 M25 25 L45 40 M25 10 L25 40 M0 25 L25 25 M40 38 L45 40 L42 35",
    ports: ["left", "top", "bottom"],
  },
  [COMPONENT_TYPES.TRANSISTOR_PNP]: {
    label: "PNP Transistor",
    symbol: "Q",
    category: "semiconductors",
    width: 50,
    height: 50,
    color: "#14B8A6",
    gradient: ["#14B8A6", "#0D9488"],
    defaultValue: "2N3906",
    description: "Bipolar Junction Transistor (PNP)",
    svgPath:
      "M25 5 L25 25 M25 25 L45 10 M25 25 L45 40 M25 10 L25 40 M0 25 L25 25 M30 28 L25 25 L32 24",
    ports: ["left", "top", "bottom"],
  },
  [COMPONENT_TYPES.OP_AMP]: {
    label: "Op-Amp",
    symbol: "OA",
    category: "analog",
    width: 60,
    height: 50,
    color: "#10B981",
    gradient: ["#10B981", "#059669"],
    defaultValue: "TL072",
    description: "Operational Amplifier",
    svgPath:
      "M10 5 L10 45 L50 25 L10 5 M15 15 L25 15 M20 10 L20 20 M15 35 L25 35",
    ports: ["left-top", "left-bottom", "right"],
  },
  [COMPONENT_TYPES.VOLTAGE_SOURCE]: {
    label: "Voltage Source",
    symbol: "V",
    category: "sources",
    width: 40,
    height: 60,
    color: "#FBBF24",
    gradient: ["#FBBF24", "#D97706"],
    defaultValue: "5V",
    description: "DC Voltage Source",
    svgPath:
      "M20 0 L20 15 M20 45 L20 60 M20 30 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0 M20 20 L20 26 M17 23 L23 23 M17 37 L23 37",
    ports: ["top", "bottom"],
  },
  [COMPONENT_TYPES.CURRENT_SOURCE]: {
    label: "Current Source",
    symbol: "I",
    category: "sources",
    width: 40,
    height: 60,
    color: "#F97316",
    gradient: ["#F97316", "#EA580C"],
    defaultValue: "1mA",
    description: "DC Current Source",
    svgPath:
      "M20 0 L20 15 M20 45 L20 60 M20 30 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0 M20 20 L20 40 M15 35 L20 40 L25 35",
    ports: ["top", "bottom"],
  },
  [COMPONENT_TYPES.GROUND]: {
    label: "Ground",
    symbol: "GND",
    category: "sources",
    width: 30,
    height: 30,
    color: "#6B7280",
    gradient: ["#6B7280", "#4B5563"],
    defaultValue: "0V",
    description: "Reference Ground",
    svgPath: "M15 0 L15 10 M5 10 L25 10 M10 15 L20 15 M12 20 L18 20",
    ports: ["top"],
  },
};

export const GRID_SIZE = 20; // pixels
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 3;
export const ZOOM_STEP = 0.1;

export const SNAP_TO_GRID = true;

// Port positions for components (normalized 0-1)
export const PORT_POSITIONS = {
  RESISTOR: [
    { side: "left", offset: 0.5, type: "pin" },
    { side: "right", offset: 0.5, type: "pin" },
  ],
  CAPACITOR: [
    { side: "left", offset: 0.5, type: "pin" },
    { side: "right", offset: 0.5, type: "pin" },
  ],
  INDUCTOR: [
    { side: "left", offset: 0.5, type: "pin" },
    { side: "right", offset: 0.5, type: "pin" },
  ],
  DIODE: [
    { side: "left", offset: 0.5, type: "pin", label: "A" },
    { side: "right", offset: 0.5, type: "pin", label: "K" },
  ],
  LED: [
    { side: "left", offset: 0.5, type: "pin", label: "A" },
    { side: "right", offset: 0.5, type: "pin", label: "K" },
  ],
  OP_AMP: [
    { side: "left", offset: 0.25, type: "pin", label: "+" },
    { side: "left", offset: 0.75, type: "pin", label: "-" },
    { side: "right", offset: 0.5, type: "pin", label: "Out" },
  ],
  TRANSISTOR_NPN: [
    { side: "left", offset: 0.5, type: "pin", label: "B" },
    { side: "top", offset: 0.5, type: "pin", label: "C" },
    { side: "bottom", offset: 0.5, type: "pin", label: "E" },
  ],
  TRANSISTOR_PNP: [
    { side: "left", offset: 0.5, type: "pin", label: "B" },
    { side: "top", offset: 0.5, type: "pin", label: "C" },
    { side: "bottom", offset: 0.5, type: "pin", label: "E" },
  ],
  VOLTAGE_SOURCE: [
    { side: "top", offset: 0.5, type: "pin", label: "+" },
    { side: "bottom", offset: 0.5, type: "pin", label: "-" },
  ],
  CURRENT_SOURCE: [
    { side: "top", offset: 0.5, type: "pin", label: "In" },
    { side: "bottom", offset: 0.5, type: "pin", label: "Out" },
  ],
  GROUND: [{ side: "top", offset: 0.5, type: "pin", label: "GND" }],
};

export const COLOR_PALETTE = {
  workspace: "#0F172A", // slate-950
  gridLight: "#1E293B",
  gridDark: "#0F172A",
  wire: "#E0E7FF",
  wireActive: "#60A5FA",
  componentHover: "#DBEAFE",
  selection: "#3B82F6",
  danger: "#EF4444",
  success: "#10B981",
};
