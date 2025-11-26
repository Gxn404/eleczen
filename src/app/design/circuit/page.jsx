"use client";

import { useCallback, useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import ComponentPalette from "./components/ComponentPalette";
import ContextMenu from "./components/ContextMenu";
import ControlPanel from "./components/ControlPanel";
import Navbar from "./components/Navbar";
import PropertiesPanel from "./components/PropertiesPanel";
import SimulationPanel from "./components/SimulationPanel";
import SubNavbar from "./components/SubNavbar";
import Toast from "./components/Toast";
import { clipboardManager } from "./lib/ClipboardManager";
import { generateId, snapToGrid } from "./lib/utils";
import "./styles/circuit.css";

// Main Circuit Designer Component
export default function CircuitDesigner() {
  // Circuit state
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]); // Array of selected IDs

  // UI State
  const [currentTab, setCurrentTab] = useState("schematic");
  const [openCircuits, setOpenCircuits] = useState([
    { id: "circuit-1", name: "Circuit 1" },
  ]);
  const [currentCircuitId, setCurrentCircuitId] = useState("circuit-1");
  const [contextMenu, setContextMenu] = useState({ x: null, y: null });

  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [status, setStatus] = useState("idle");

  // Wiring state
  const [isDrawingWire, setIsDrawingWire] = useState(false);
  const [wireStart, setWireStart] = useState(null);
  const [wireCurrent, setWireCurrent] = useState(null);

  // Dragging state
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);
  const [draggedComponentTemplate, setDraggedComponentTemplate] =
    useState(null);

  // Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  };

  // Handle component drop from palette
  const handleComponentDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;

      if (draggedComponentTemplate) {
        const newComponent = {
          ...draggedComponentTemplate,
          id: generateId(),
          x: snapToGrid(x),
          y: snapToGrid(y),
        };

        const newComponents = [...components, newComponent];
        setComponents(newComponents);
        addToHistory(newComponents, connections);
        setIsDraggingComponent(false);
        setDraggedComponentTemplate(null);
      }
    },
    [draggedComponentTemplate, components, connections],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleComponentDragStart = (component) => {
    setIsDraggingComponent(true);
    setDraggedComponentTemplate(component);
  };

  const handleComponentDragEnd = () => {
    setIsDraggingComponent(false);
    setDraggedComponentTemplate(null);
  };

  // Handle component dragging on canvas
  const handleComponentDrag = useCallback((componentId, newPos) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === componentId ? { ...c, ...newPos } : c)),
    );
  }, []);

  // Handle component selection
  const handleComponentClick = (component, e) => {
    if (e.button === 0) {
      if (e.ctrlKey || e.shiftKey) {
        // Toggle selection
        setSelectedComponents((prev) => {
          if (prev.includes(component.id)) {
            return prev.filter((id) => id !== component.id);
          } else {
            return [...prev, component.id];
          }
        });
      } else {
        // Single select
        setSelectedComponents([component.id]);
      }
      setContextMenu({ x: null, y: null });
    } else if (e.button === 2) {
      // Right click
      if (!selectedComponents.includes(component.id)) {
        setSelectedComponents([component.id]);
      }
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle canvas click to deselect
  const handleCanvasClick = (e) => {
    if (e.button === 0) {
      setSelectedComponents([]);
      setContextMenu({ x: null, y: null });
    }
  };

  // Delete selected component
  const handleDeleteComponent = () => {
    if (selectedComponents.length > 0) {
      const count = selectedComponents.length;
      const newComponents = components.filter(
        (c) => !selectedComponents.includes(c.id),
      );
      const newConnections = connections.filter(
        (conn) =>
          !selectedComponents.includes(conn.startComponent) &&
          !selectedComponents.includes(conn.endComponent),
      );
      setComponents(newComponents);
      setConnections(newConnections);
      addToHistory(newComponents, newConnections);
      setSelectedComponents([]);
      setContextMenu({ x: null, y: null });
      showToast(`Deleted ${count} component${count > 1 ? "s" : ""}`, "success");
    }
  };

  // Rotate component
  const handleRotateComponent = (angle = 90) => {
    if (selectedComponents.length > 0) {
      const newComponents = components.map((c) =>
        selectedComponents.includes(c.id)
          ? { ...c, rotation: ((c.rotation || 0) + angle) % 360 }
          : c,
      );
      setComponents(newComponents);
      addToHistory(newComponents, connections);
      setContextMenu({ x: null, y: null });
    }
  };

  // Update component value
  const handleUpdateComponent = (field, value) => {
    if (selectedComponents.length > 0) {
      const newComponents = components.map((c) =>
        selectedComponents.includes(c.id) ? { ...c, [field]: value } : c,
      );
      setComponents(newComponents);
      addToHistory(newComponents, connections);
    }
  };

  // Clipboard operations
  const handleCopy = () => {
    if (selectedComponents.length > 0) {
      const componentsToCopy = components.filter((c) =>
        selectedComponents.includes(c.id),
      );
      clipboardManager.copy(componentsToCopy);
      setContextMenu({ x: null, y: null });
      showToast(
        `Copied ${componentsToCopy.length} component${componentsToCopy.length > 1 ? "s" : ""}`,
        "success",
      );
    }
  };

  const handlePaste = () => {
    if (clipboardManager.hasContent()) {
      const pastedComponents = clipboardManager.paste(components);
      const newComponents = [...components, ...pastedComponents];
      setComponents(newComponents);
      addToHistory(newComponents, connections);

      // Select pasted components
      setSelectedComponents(pastedComponents.map((c) => c.id));
      setContextMenu({ x: null, y: null });
      showToast(
        `Pasted ${pastedComponents.length} component${pastedComponents.length > 1 ? "s" : ""}`,
        "success",
      );
    }
  };

  const handleContextMenuAction = (action) => {
    switch (action) {
      case "copy":
        handleCopy();
        break;
      case "rotate":
        handleRotateComponent(90);
        break;
      case "delete":
        handleDeleteComponent();
        break;
      default:
        break;
    }
  };

  // History management
  const addToHistory = useCallback(
    (comps, conns) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ components: comps, connections: conns });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex],
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const state = history[historyIndex - 1];
      setComponents(state.components);
      setConnections(state.connections);
      setSelectedComponents([]);
      showToast("Undone", "info");
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const state = history[historyIndex + 1];
      setComponents(state.components);
      setConnections(state.connections);
      setSelectedComponents([]);
      showToast("Redone", "info");
    }
  }, [history, historyIndex]);

  // Simulation controls
  const handlePlay = () => {
    setIsRunning(true);
    setStatus("running");
  };

  const handlePause = () => {
    setIsRunning(false);
    setStatus("paused");
  };

  const handleStop = () => {
    setIsRunning(false);
    setStatus("idle");
    setSimulationTime(0);
  };

  const handleReset = () => {
    setComponents([]);
    setConnections([]);
    setSelectedComponents([]);
    setSimulationTime(0);
    setStatus("idle");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleSave = () => {
    const circuitData = {
      components,
      connections,
      timestamp: new Date().toISOString(),
      name:
        openCircuits.find((c) => c.id === currentCircuitId)?.name || "circuit",
    };

    const json = JSON.stringify(circuitData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${circuitData.name}-${Date.now()}.json`;
    a.click();
    showToast("Circuit saved successfully", "success");
  };

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSimulationTime((prev) => prev + 0.01);
    }, 10);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Delete" || e.code === "Backspace") {
        handleDeleteComponent();
      }
      if (e.code === "KeyR" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleRotateComponent(90);
      }
      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning((prev) => !prev);
        setStatus((prev) => (prev === "running" ? "paused" : "running"));
      }
      if (
        (e.code === "KeyS" && e.ctrlKey) ||
        (e.code === "KeyS" && e.metaKey)
      ) {
        e.preventDefault();
        handleSave();
      }
      if (
        (e.code === "KeyZ" && e.ctrlKey) ||
        (e.code === "KeyZ" && e.metaKey)
      ) {
        e.preventDefault();
        handleUndo();
      }
      if (
        (e.code === "KeyY" && e.ctrlKey) ||
        (e.code === "KeyY" && e.metaKey) ||
        (e.shiftKey && e.code === "KeyZ" && e.ctrlKey) ||
        (e.shiftKey && e.code === "KeyZ" && e.metaKey)
      ) {
        e.preventDefault();
        handleRedo();
      }
      if (
        (e.code === "KeyC" && e.ctrlKey) ||
        (e.code === "KeyC" && e.metaKey)
      ) {
        e.preventDefault();
        handleCopy();
      }
      if (
        (e.code === "KeyV" && e.ctrlKey) ||
        (e.code === "KeyV" && e.metaKey)
      ) {
        e.preventDefault();
        handlePaste();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponents, isRunning, components, connections, historyIndex]);

  // Wire connection handlers
  const handleWireStart = (componentId, portName) => {
    setIsDrawingWire(true);
    setWireStart({ componentId, portName });
  };

  const handleWireEnd = (componentId, portName, position) => {
    if (position) {
      setWireCurrent(position);
    }

    if (componentId && portName && wireStart) {
      if (
        wireStart.componentId === componentId &&
        wireStart.portName === portName
      ) {
        setIsDrawingWire(false);
        setWireStart(null);
        return;
      }

      const connectionExists = connections.some(
        (c) =>
          (c.startComponent === wireStart.componentId &&
            c.startPort === wireStart.portName &&
            c.endComponent === componentId &&
            c.endPort === portName) ||
          (c.startComponent === componentId &&
            c.startPort === portName &&
            c.endComponent === wireStart.componentId &&
            c.endPort === wireStart.portName),
      );

      if (connectionExists) {
        setIsDrawingWire(false);
        setWireStart(null);
        return;
      }

      const newConnection = {
        id: generateId(),
        startComponent: wireStart.componentId,
        startPort: wireStart.portName,
        endComponent: componentId,
        endPort: portName,
      };

      const newConnections = [...connections, newConnection];
      setConnections(newConnections);
      addToHistory(components, newConnections);
      setIsDrawingWire(false);
      setWireStart(null);
      setWireCurrent(null);
    }
  };

  // Circuit management
  const handleNewCircuit = () => {
    const newCircuit = {
      id: `circuit-${Date.now()}`,
      name: `Circuit ${openCircuits.length + 1}`,
    };
    setOpenCircuits([...openCircuits, newCircuit]);
    setCurrentCircuitId(newCircuit.id);
    setComponents([]);
    setConnections([]);
  };

  const handleCloseCircuit = (circuitId) => {
    const remaining = openCircuits.filter((c) => c.id !== circuitId);
    setOpenCircuits(remaining);

    if (currentCircuitId === circuitId && remaining.length > 0) {
      setCurrentCircuitId(remaining[0].id);
    }
  };

  const handleExport = () => {
    const circuitData = {
      components,
      connections,
      timestamp: new Date().toISOString(),
      name:
        openCircuits.find((c) => c.id === currentCircuitId)?.name || "circuit",
    };

    const json = JSON.stringify(circuitData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${circuitData.name}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div
      className="circuit-container"
      onClick={() => setContextMenu({ x: null, y: null })}
    >
      {/* Main Navbar */}
      <Navbar />

      {/* Sub Navbar */}
      <SubNavbar
        openCircuits={openCircuits}
        currentCircuitId={currentCircuitId}
        currentTab={currentTab}
        onCircuitSwitch={setCurrentCircuitId}
        onCircuitClose={handleCloseCircuit}
        onNewCircuit={handleNewCircuit}
        onTabChange={setCurrentTab}
        onExport={handleExport}
        onSettings={() => alert("Settings coming soon")}
        onNew={handleNewCircuit}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDelete={handleDeleteComponent}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Main workspace */}
      <div
        className="circuit-workspace"
        style={{
          display: "flex",
          flexDirection: currentTab === "simulation" ? "column" : "row",
        }}
      >
        {currentTab === "schematic" && (
          <>
            {/* Component Palette */}
            <ComponentPalette
              onComponentDragStart={handleComponentDragStart}
              onComponentDragEnd={handleComponentDragEnd}
            />

            {/* Canvas Area */}
            <div
              className="canvas-container"
              onDrop={handleComponentDrop}
              onDragOver={handleDragOver}
            >
              <Canvas
                components={components}
                connections={connections}
                selectedComponent={null} // Deprecated, use selectedComponents
                selectedComponents={selectedComponents} // New prop
                onComponentClick={handleComponentClick}
                onCanvasClick={handleCanvasClick}
                onComponentDrag={handleComponentDrag}
                isDrawingWire={isDrawingWire}
                wireStart={wireStart}
                wireCurrent={wireCurrent}
                onWireStart={handleWireStart}
                onWireEnd={handleWireEnd}
              />
            </div>

            {/* Properties Panel */}
            <PropertiesPanel
              selectedComponents={selectedComponents}
              components={components}
              onUpdate={handleUpdateComponent}
              onRotate={handleRotateComponent}
              onDelete={handleDeleteComponent}
            />
          </>
        )}

        {currentTab === "simulation" && (
          <SimulationPanel
            components={components}
            connections={connections}
            isRunning={isRunning}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
          />
        )}

        {currentTab === "analysis" && (
          <div
            style={{
              flex: 1,
              padding: "40px",
              color: "var(--text-primary)",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
              Advanced Analysis
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Frequency response and parameter sweep tools coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Control Panel */}
      {currentTab === "schematic" && (
        <ControlPanel
          isRunning={isRunning}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onReset={handleReset}
          onSave={handleSave}
          onLoad={() => alert("Load functionality coming soon!")}
          onExport={handleExport}
          simulationTime={simulationTime}
          status={status}
        />
      )}

      {/* Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ x: null, y: null })}
        onAction={handleContextMenuAction}
        hasSelection={selectedComponents.length > 0}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
