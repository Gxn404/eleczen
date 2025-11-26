# ⚡ Eleczen Circuit Studio

A sleek, modern circuit simulator inspired by professional tools like **Falstad**, **Proteus**, and **Tinkercad Circuit**. Eleczen provides an engineering-grade UI/UX for designing, simulating, and analyzing electronic circuits directly in your browser.

## 🎯 Features

### Core Functionality

- **Drag-and-Drop Component Placement** - Intuitive palette with categorized electronic components
- **Real-Time Wiring** - Draw connections between component ports with visual feedback
- **Live Simulation** - Run transient and DC analysis on your circuit
- **Component Properties Editor** - Modify component values, labels, and parameters
- **Simulation Controls** - Play, pause, stop, and reset simulation with time display
- **Save/Load** - Store circuits locally and restore them later

### Visual Design

- **Dark Engineering Aesthetic** - Slate-950 workspace with professional color palette
- **Grid-Based Canvas** - 20px grid with snapping for precise component placement
- **Smooth Zoom & Pan** - Mouse wheel to zoom, middle-click to pan the canvas
- **Selection Highlighting** - Visual feedback for selected/hovered components
- **Component Symbols** - SVG-based schematics for all component types

### Developer-Friendly

- **Modular Architecture** - Separate components for Canvas, Palette, ControlPanel, etc.
- **State Management** - CircuitContext for centralized state with undo/redo
- **API Endpoints** - RESTful backend for circuit persistence
- **Simulation Engine** - Built-in DC and transient analysis capabilities
- **Utility Functions** - Helpers for grid snapping, value parsing, geometry calculations

## 📁 Project Structure

```
src/app/design/circuit/
├── page.jsx                          # Main circuit designer page
├── components/
│   ├── Canvas.jsx                    # Canvas with grid, components, wiring
│   ├── ComponentPalette.jsx          # Categorized component selector
│   ├── ControlPanel.jsx              # Simulation & file controls
│   └── PropertyEditor.jsx            # Component value/label editor (optional)
├── hooks/
│   └── useDragDrop.js                # Drag-drop, zoom, pan hooks
├── lib/
│   ├── constants.js                  # Component types, colors, sizes
│   ├── utils.js                      # Grid snap, geometry, value parsing
│   ├── componentSymbols.jsx          # SVG renderers for components
│   └── simulator.js                  # Circuit analysis engine
├── context/
│   └── CircuitContext.jsx            # Global state management
├── styles/
│   └── circuit.css                   # Circuit-specific styling
└── api/
    └── routes.js                     # Backend endpoints

src/app/api/circuits/
└── route.js                          # POST/GET/DELETE circuit data
```

## 🚀 Getting Started

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Ensure Tailwind CSS is configured** in `postcss.config.mjs` and `globals.css`

3. **Start the development server**:

```bash
npm run dev
```

4. **Navigate to** `http://localhost:3000/design/circuit`

### Basic Usage

1. **Add Components**:

   - Click categories in the right panel to expand/collapse
   - Drag components onto the canvas
   - Release to place them (snaps to grid)

2. **Modify Components**:

   - Click a component to select it
   - Edit label and value in the left sidebar
   - Right-click to delete or press `Delete` key

3. **Wire Connections** (coming soon):

   - Click and drag from one port to another
   - Release to create connection
   - Right-click wire to delete

4. **Run Simulation**:

   - Press `Space` or click **Play** to start simulation
   - Watch the simulation time advance
   - Click **Pause** or **Stop** to control

5. **Save Your Circuit**:
   - Click **Save** or press `Ctrl+S`
   - Downloads circuit as `.json` file
   - Click **Load** to restore from file

## ⌨️ Keyboard Shortcuts

| Shortcut               | Action                        |
| ---------------------- | ----------------------------- |
| `Delete` / `Backspace` | Delete selected component     |
| `R`                    | Rotate selected component 90° |
| `Space`                | Play/Pause simulation         |
| `Ctrl+S`               | Save circuit                  |
| `Ctrl+Z`               | Undo (future)                 |
| `Ctrl+Y`               | Redo (future)                 |
| `Ctrl+C`               | Copy (future)                 |
| `Ctrl+V`               | Paste (future)                |
| `Ctrl+X`               | Cut (future)                  |

## 🔧 Component Library

### Passive Components

- **Resistor** - Variable resistance (default: 1kΩ)
- **Capacitor** - Capacitance (default: 100nF)
- **Inductor** - Inductance (default: 10µH)

### Semiconductors

- **Diode** - Standard 1N4148
- **LED** - Light Emitting Diode (Red)
- **NPN Transistor** - 2N2222

### Analog ICs

- **Op-Amp** - TL072 (3-pin + power)

### Power Sources

- **Voltage Source** - DC voltage (default: 5V)
- **Current Source** - DC current (default: 1mA)
- **Ground** - Reference node (0V)

## 📊 Simulation Engine

The built-in simulator provides:

- **DC Analysis** - Steady-state voltages and currents
- **Transient Analysis** - Time-domain response (future)
- **Validation** - Check for floating nodes, missing ground, etc.

### Usage Example

```javascript
import { CircuitSimulator } from "./lib/simulator";

const simulator = new CircuitSimulator(components, connections);
const validation = simulator.validateCircuit();

if (validation.isValid) {
  const analysis = simulator.dcAnalysis();
  console.log("Node voltages:", analysis.voltages);
}
```

## 🎨 Styling & Theming

### Color Palette

```javascript
COLOR_PALETTE = {
  workspace: "#0F172A", // Slate-950
  gridLight: "#1E293B", // Slate-800
  gridDark: "#0F172A", // Slate-950
  wire: "#E0E7FF", // Indigo-100
  wireActive: "#60A5FA", // Blue-400
  componentHover: "#DBEAFE", // Blue-100
  selection: "#3B82F6", // Blue-500
  danger: "#EF4444", // Red-500
  success: "#10B981", // Emerald-600
};
```

### Component Colors

Each component type has a unique color for visual distinction:

- **Resistor**: Amber (#F59E0B)
- **Capacitor**: Blue (#3B82F6)
- **Inductor**: Purple (#8B5CF6)
- **Diode**: Pink (#EC4899)
- **LED**: Red (#EF4444)
- **Transistor**: Teal (#14B8A6)
- **Op-Amp**: Emerald (#10B981)
- **Ground**: Gray (#6B7280)

## 🔌 API Endpoints

### Save Circuit

```http
POST /api/circuits
Content-Type: application/json

{
  "circuitId": "circuit-123",
  "circuitData": {
    "components": [...],
    "connections": [...]
  }
}
```

### Load Circuits

```http
GET /api/circuits?id=circuit-123
```

### List All Circuits

```http
GET /api/circuits
```

### Delete Circuit

```http
DELETE /api/circuits?id=circuit-123
```

## 📦 Dependencies

- **Next.js** 16.0+ - React framework
- **React** 19.2+ - UI library
- **Tailwind CSS** 4+ - Styling (optional, CSS fallback included)
- **Mongoose** 8.19+ - Database (for production)

## 🛠️ Development

### Adding New Components

1. **Add to `lib/constants.js`**:

```javascript
COMPONENT_LIBRARY.my_component = {
  label: "My Component",
  symbol: "X",
  category: "custom",
  width: 60,
  height: 30,
  color: "#FF00FF",
  defaultValue: "10",
};
```

2. **Create symbol renderer in `lib/componentSymbols.jsx`**:

```javascript
export const MyComponentSymbol = ({ x, y, width, height, color }) => (
  <g>{/* SVG drawing code */}</g>
);
```

3. **Add to palette in `ComponentPalette.jsx`**:
   Update the `CATEGORIES` object to include your component.

### Extending the Simulator

Edit `lib/simulator.js` to add:

- New analysis types (AC, transient, Fourier)
- Component models (non-linear, frequency-dependent)
- Network solvers (MNA, tableau)

## 📱 Responsive Design

Current layout is optimized for **desktop (1920x1080+)**. Mobile responsiveness planned for v0.2.

## 🐛 Known Limitations

- Wiring interaction UI incomplete (visual only)
- Simulation engine is simplified (basic DC analysis only)
- No built-in plotting/visualization
- Single-user only (no collaboration)
- Limited component library
- No export to SPICE/netlist yet

## 🗺️ Roadmap

### v0.2 (Next)

- [ ] Wiring connections with click-and-drag
- [ ] Port highlighting and snap-to-grid
- [ ] Undo/redo functionality
- [ ] Component copy/paste
- [ ] Export to PNG/SVG

### v0.3

- [ ] Full transient analysis
- [ ] AC analysis
- [ ] Measurement tools (voltmeter, ammeter)
- [ ] Waveform plotting
- [ ] Parameter sweep analysis

### v0.4+

- [ ] Mobile touch support
- [ ] Collaborative editing (WebRTC)
- [ ] SPICE netlist import/export
- [ ] Subcircuits/hierarchical design
- [ ] Thermal analysis
- [ ] PCB layout generation

## 📚 Resources

- [Falstad Circuit Simulator](http://www.falstad.com/circuit/)
- [Proteus Design Suite](https://www.labcenter.com/)
- [Tinkercad Circuit](https://www.tinkercad.com/)
- [SPICE Simulation](https://en.wikipedia.org/wiki/SPICE)

## 📝 License

Part of the **Eleczen** platform. © 2025

## 🤝 Contributing

Contributions welcome! Please follow:

1. Component modularity
2. Consistent naming conventions
3. JSDoc documentation
4. Test coverage for utilities

---

Built with ⚡ by the Eleczen team
