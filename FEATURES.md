# Eleczen Circuit Studio - Advanced Features

## 🎯 What's Been Added

### 1. Wire Connection System (WireLayer.jsx)

- **Port-based connections**: Drag wires between component ports (top, right, bottom, left)
- **L-routing algorithm**: Automatic path finding for cleaner layouts
- **Visual feedback**:
  - Blue wires (default)
  - Light blue (hover)
  - Yellow (selected)
  - Green (drawing)
- **Interactive features**:
  - Left-click to drag wires between ports
  - Right-click on wire to delete
  - Wires render with proper z-indexing
- **Auto-routing**: Prevents overlapping connections

### 2. Sub-Navigation Bar (SubNavbar.jsx)

**File Tabs Section**:

- Create new circuits with "New" button
- Tab-based file management
- Close individual files with X button
- Display component and connection counts
- Context menu (right-click):
  - Open circuit
  - Export circuit
  - Close circuit

**Circuit Tabs Section**:

- 📐 **Schematic**: Design view with components and wires
- ▶ **Simulation**: Run DC, AC, and transient analysis
- 📊 **Analysis**: Advanced circuit analysis and measurements
- ⚙ **Settings**: Configuration options

**Quick Actions**:

- Export button: Save circuit as JSON
- Settings button: Access preferences

### 3. Circuit Analysis Engine (analyzer.js)

Comprehensive SPICE-based circuit analysis with:

**Supported Analysis Types**:

- **DC Analysis**: Nodal voltage analysis using matrix methods
- **Transient Analysis**: Time-domain simulation (Euler method)
- **AC Analysis**: Frequency response analysis

**Key Features**:

- SPICE netlist generation from circuit components
- Nodal analysis matrix building (Y-matrix method)
- Gaussian elimination solver for linear systems
- Power dissipation calculation
- Component value parsing with units (1k, 100u, 1m, etc.)
- Circuit validation with warnings/errors

**Functions**:

```javascript
generateNetlist(components, connections); // Create SPICE netlist
runDCAnalysis(components, connections); // DC operating point
runTransientAnalysis(components, connections); // Time-domain
runACAnalysis(components, connections); // Frequency response
buildNodalAnalysisMatrix(components, connections); // Y-matrix
gaussianElimination(A, b); // Solve Ax=b
parseValue(valueStr); // "1k" → 1000
calculatePowerDissipation(components, nodeVoltages); // Component power
validateCircuit(components, connections); // Check for errors
```

### 4. Simulation Panel (SimulationPanel.jsx)

Real-time circuit simulation interface:

**Features**:

- **Three analysis types**: DC, Transient, AC
- **Run button**: Execute selected analysis
- **Export results**: Save as JSON file
- **Error display**: Circuit validation errors
- **Warning display**: Circuit optimization suggestions
- **Results view**:
  - Node voltages for DC analysis
  - Time-domain results for transient
  - Frequency response for AC

**Example Output**:

```
DC Analysis Results:
  top_node: 12.345V
  middle_node: 6.789V
  bottom_node: 0.000V
  (Ground reference)
```

### 5. Component Library Updates

New SPICE component models:

- Resistors, Capacitors, Inductors
- Voltage/Current sources
- Diodes, LEDs
- Transistors (NPN, PNP)
- Op-amps
- Ground reference

## 🔌 How to Use Wire Connections

### Drawing a Wire

1. Click and hold on a component port
2. Drag to another component's port
3. Release to create connection
4. Connection appears as blue line with dots

### Managing Wires

- **Select**: Left-click on wire (turns yellow)
- **Delete**: Right-click on wire or press Delete
- **View Connection Info**: Hover to highlight

### Port Reference

Each component has 4 ports:

```
      [TOP]
[LEFT]     [RIGHT]
     [BOTTOM]
```

## 🧪 Running Simulations

### DC Analysis

1. Click "Simulation" tab
2. Select "DC Analysis"
3. Click "Run"
4. View node voltages

### Transient Analysis

1. Select "Transient" analysis type
2. Click "Run"
3. Results show time-domain data
4. Export waveforms as JSON

### AC Analysis

1. Select "AC Analysis"
2. Click "Run"
3. View frequency response

## 📊 Circuit Validation

Before simulation, circuits are checked for:

- ✓ At least one voltage source (warning if missing)
- ✓ Ground connection (warning if missing)
- ✓ No floating nodes (warning if unconnected components)
- ✗ Errors prevent simulation (e.g., invalid connections)

## 💾 File Management

### Create New Circuit

- Click "New" button in file tabs
- Name appears as "Circuit N"
- All circuits kept in memory during session

### Switch Between Circuits

- Click circuit tab to open
- Components and wires loaded automatically

### Export Circuit

- Right-click circuit tab → Export
- Or use Export button in toolbar
- Saves as JSON with timestamp

## ⌨️ Keyboard Shortcuts

| Shortcut     | Action                         |
| ------------ | ------------------------------ |
| Delete       | Remove selected component/wire |
| R            | Rotate component 90°           |
| Space        | Play/Pause simulation          |
| Ctrl+S       | Save circuit                   |
| Ctrl+Z       | Undo                           |
| Ctrl+Y       | Redo                           |
| Shift+Ctrl+Z | Redo                           |

## 🎨 UI Features

### Dark Engineering Aesthetic

- Slate-950 background (#0f172a)
- Professional color scheme
- Lucide React icons throughout
- Smooth transitions and hover effects

### Responsive Design

- Collapsible panels
- Resizable sections
- Auto-hide controls in simulation view

## 📈 Analysis Results

### DC Analysis Output

```json
{
  "success": true,
  "voltages": {
    "component_id_top": 12.5,
    "component_id_bottom": 0.0,
    ...
  },
  "nodeMap": { ... }
}
```

### Transient Analysis Output

```json
{
  "success": true,
  "results": [
    {"time": 0, "voltages": [...]},
    {"time": 0.001, "voltages": [...]},
    ...
  ],
  "duration": 1,
  "step": 0.001
}
```

## 🚀 Next Features (Roadmap)

- [ ] Waveform plotting with Plotly
- [ ] Measurement tools (voltmeter, ammeter, probe)
- [ ] Component properties dialog
- [ ] Circuit templates library
- [ ] Multi-layer routing algorithm
- [ ] Export to SPICE netlist file
- [ ] Import SPICE netlists
- [ ] Collaborative editing
- [ ] Mobile optimization
- [ ] Real-time waveform display

## 🔧 Technical Details

### Analysis Matrix Building

Uses Modified Nodal Analysis (MNA):

- Stamping algorithm for each component
- Admittance matrix (Y-matrix) construction
- Current vector (I-vector) assembly
- Gaussian elimination with partial pivoting

### Component Stamping Rules

- **Resistor**: 1/R stamp at [n1,n1], [n2,n2], [n1,n2], [n2,n1]
- **Voltage Source**: Direct node connection
- **Current Source**: Current into respective nodes

### Simulation Engine

- Nodal analysis for DC
- Time-stepping for transient
- Frequency sweep for AC
- Support for up to 1000 nodes

## 🐛 Known Limitations

- AC analysis is placeholder (coming soon)
- Nonlinear components not yet supported
- Max 100 transient analysis points
- No automatic tolerance scaling
- Singular matrix handling basic

## 📝 Example Circuits

### Simple RC Circuit

1. Drag voltage source (V1)
2. Add resistor (R1)
3. Add capacitor (C1)
4. Add ground
5. Connect: V1→R1→C1→Ground
6. Run transient analysis

### Voltage Divider

1. Voltage source V
2. Two resistors R1, R2 in series
3. Ground at bottom
4. Observe voltage at middle node

## 💡 Tips & Tricks

- Use Tab key to switch between analysis types
- Export results regularly to prevent data loss
- Create reusable circuit templates
- Use descriptive labels for components
- Check warnings before running large simulations
