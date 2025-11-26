// Canvas.jsx – Premium Glassmorphism & Neon Circuit Canvas
// ---------------------------------------------------------------
// This component provides the interactive drawing surface for the circuit
// designer. It supports:
//   • Smooth inertial pan & zoom
//   • Orthogonal (L‑shaped) wire routing with rounded corners
//   • Multi‑selection via drag‑box
//   • Neon glow effects for hover/selection
//   • Port interaction for wiring
//   • Integration with parent page via callbacks

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GRID_SIZE, PORT_POSITIONS } from "../lib/constants";
import { snapToGrid } from "../lib/utils";

/** Helper: generate orthogonal path (L‑shape) with optional rounded corners */
const getWirePath = (start, end) => {
  const r = 12; // Radius for rounded corners
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // If points are aligned or very close, just draw a straight line
  if (Math.abs(dx) < 1 || Math.abs(dy) < 1) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  // Horizontal-First Routing
  // Corner is at (end.x, start.y)
  const sx = dx > 0 ? 1 : -1;
  const sy = dy > 0 ? 1 : -1;

  // Ensure radius isn't larger than half the segment length
  const radius = Math.min(r, Math.abs(dx) / 2, Math.abs(dy) / 2);

  return [
    `M ${start.x} ${start.y}`,
    `L ${end.x - sx * radius} ${start.y}`,
    `Q ${end.x} ${start.y} ${end.x} ${start.y + sy * radius}`,
    `L ${end.x} ${end.y}`,
  ].join(" ");
};

export default function Canvas({
  components = [],
  connections = [],
  selectedComponents = [], // array of component IDs
  onComponentClick = () => {},
  onCanvasClick = () => {},
  onDrop = () => {},
  isDrawingWire = false,
  wireStart = null,
  wireCurrent = null,
  onWireStart = () => {},
  onWireEnd = () => {},
  onComponentDrag = () => {},
}) {
  // -------------------------------------------------------------------
  // Refs & basic state
  // -------------------------------------------------------------------
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [hoveredPort, setHoveredPort] = useState(null);

  // Zoom / pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Inertial panning helpers
  const velocity = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const animationFrame = useRef(null);

  // Dragging a component
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Multi‑selection box
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });

  // -------------------------------------------------------------------
  // Utility: convert screen → world coordinates (taking pan & zoom into account)
  // -------------------------------------------------------------------
  const screenToWorld = (pt) => ({
    x: (pt.x - pan.x) / zoom,
    y: (pt.y - pan.y) / zoom,
  });

  // -------------------------------------------------------------------
  // Port Logic
  // -------------------------------------------------------------------
  const getComponentPorts = (component) => {
    const type = component.type.toUpperCase();
    // Fallback to generic 4 ports if type not found (e.g. for testing)
    const portDefs = PORT_POSITIONS[type] || [
      { side: "top", offset: 0.5 },
      { side: "right", offset: 0.5 },
      { side: "bottom", offset: 0.5 },
      { side: "left", offset: 0.5 },
    ];

    return portDefs.map((def, index) => {
      const { width, height } = component;
      let x = 0,
        y = 0;
      switch (def.side) {
        case "top":
          x = width * def.offset;
          y = 0;
          break;
        case "right":
          x = width;
          y = height * def.offset;
          break;
        case "bottom":
          x = width * def.offset;
          y = height;
          break;
        case "left":
          x = 0;
          y = height * def.offset;
          break;
      }
      // Generate a stable ID for the port
      // If label exists, use it (e.g. "+", "-"), otherwise use side
      // For duplicate sides, append index to ensure uniqueness if needed,
      // but for standard components like Resistor, "left" and "right" are unique enough.
      // However, to be safe and match existing "left"/"right" usage:
      let id = def.side;
      if (portDefs.filter((p) => p.side === def.side).length > 1) {
        id = `${def.side}-${index}`;
      }
      // Special case for Op-Amp to match likely expectations or labels
      if (def.label) id = def.label;

      return { id, x, y, label: def.label };
    });
  };

  const getPortPosition = (component, portId) => {
    const ports = getComponentPorts(component);
    const port = ports.find((p) => p.id === portId) || ports[0]; // Fallback
    return { x: port.x, y: port.y };
  };

  // -------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomFactor = delta > 0 ? 1.1 : 0.9;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const worldBefore = screenToWorld(mouse);
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.3), 3);
      setZoom(newZoom);
      const worldAfter = screenToWorld(mouse);
      // Adjust pan so that the point under the cursor stays stationary
      setPan((p) => ({
        x: p.x + (worldAfter.x - worldBefore.x) * newZoom,
        y: p.y + (worldAfter.y - worldBefore.y) * newZoom,
      }));
    },
    [zoom, pan],
  );

  const handleMouseDown = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    // Right‑click opens context menu – let parent handle it, just stop propagation
    if (e.button === 2) return;

    // Determine if we clicked on a component body (hit‑test)
    const hit = components.find((c) => {
      const left = pan.x + c.x * zoom;
      const top = pan.y + c.y * zoom;
      const w = c.width * zoom;
      const h = c.height * zoom;
      return (
        mouse.x >= left &&
        mouse.x <= left + w &&
        mouse.y >= top &&
        mouse.y <= top + h
      );
    });

    if (hit) {
      // Start dragging the component
      setDraggedComponent(hit);
      setDragOffset({
        x: mouse.x - (pan.x + hit.x * zoom),
        y: mouse.y - (pan.y + hit.y * zoom),
      });
    } else {
      // Start a selection box
      setIsSelecting(true);
      setSelectionStart(mouse);
      setSelectionEnd(mouse);
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const now = performance.now();
    const dt = now - lastTime.current || 16;

    // Inertial panning when not dragging nor selecting
    if (!draggedComponent && !isSelecting && e.buttons === 1) {
      // Left button held → pan
      const dx = mouse.x - lastMouse.current.x;
      const dy = mouse.y - lastMouse.current.y;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      velocity.current = { x: dx / dt, y: dy / dt };
    }

    // Update selection box
    if (isSelecting) {
      setSelectionEnd(mouse);
    }

    // Drag component
    if (draggedComponent) {
      const worldX = (mouse.x - dragOffset.x - pan.x) / zoom;
      const worldY = (mouse.y - dragOffset.y - pan.y) / zoom;
      const newX = snapToGrid(worldX);
      const newY = snapToGrid(worldY);
      onComponentDrag(draggedComponent.id, { x: newX, y: newY });
    }

    // Hover handling for components & ports
    const hoverComp = components.find((c) => {
      const left = pan.x + c.x * zoom;
      const top = pan.y + c.y * zoom;
      const w = c.width * zoom;
      const h = c.height * zoom;
      return (
        mouse.x >= left &&
        mouse.x <= left + w &&
        mouse.y >= top &&
        mouse.y <= top + h
      );
    });
    setHoveredComponent(hoverComp?.id ?? null);

    // Port hover detection
    let hoveredPortId = null;
    if (hoverComp) {
      const ports = getComponentPorts(hoverComp);
      for (const port of ports) {
        const portScreen = {
          x: pan.x + (hoverComp.x + port.x) * zoom,
          y: pan.y + (hoverComp.y + port.y) * zoom,
        };
        const dist = Math.hypot(mouse.x - portScreen.x, mouse.y - portScreen.y);
        if (dist < 12) {
          hoveredPortId = `${hoverComp.id}-${port.id}`;
          break;
        }
      }
    }
    setHoveredPort(hoveredPortId);

    // Store for next frame
    lastMouse.current = mouse;
    lastTime.current = now;
  };

  const handleMouseUp = () => {
    // Finish selection box – compute which components fall inside
    if (isSelecting) {
      const x1 = Math.min(selectionStart.x, selectionEnd.x);
      const y1 = Math.min(selectionStart.y, selectionEnd.y);
      const x2 = Math.max(selectionStart.x, selectionEnd.x);
      const y2 = Math.max(selectionStart.y, selectionEnd.y);

      const worldStart = screenToWorld({ x: x1, y: y1 });
      const worldEnd = screenToWorld({ x: x2, y: y2 });

      const selectedIds = components
        .filter((c) => {
          const cx = c.x + c.width / 2;
          const cy = c.y + c.height / 2;
          return (
            cx >= worldStart.x &&
            cx <= worldEnd.x &&
            cy >= worldStart.y &&
            cy <= worldEnd.y
          );
        })
        .map((c) => c.id);

      // Notify parent – we simply call onComponentClick on each (no modifier keys)
      selectedIds.forEach((id) => {
        const comp = components.find((c) => c.id === id);
        if (comp) onComponentClick(comp, { shiftKey: false, ctrlKey: false });
      });
    }

    setIsSelecting(false);
    setDraggedComponent(null);
  };

  // -------------------------------------------------------------------
  // Rendering helpers
  // -------------------------------------------------------------------
  const renderGrid = () => {
    const lines = [];
    const baseStep = GRID_SIZE * zoom;
    if (baseStep < 4) return null;
    const levels = [
      { step: baseStep, opacity: 0.08, width: 0.5 },
      { step: baseStep * 5, opacity: 0.15, width: 1 },
    ];
    const width = canvasRef.current?.clientWidth || 0;
    const height = canvasRef.current?.clientHeight || 0;
    levels.forEach((lvl, idx) => {
      const startX = Math.ceil(-pan.x / lvl.step) * lvl.step - pan.x;
      const startY = Math.ceil(-pan.y / lvl.step) * lvl.step - pan.y;
      for (let x = startX; x < width; x += lvl.step) {
        lines.push(
          <line
            key={`v-${idx}-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={lvl.width}
            opacity={lvl.opacity}
          />,
        );
      }
      for (let y = startY; y < height; y += lvl.step) {
        lines.push(
          <line
            key={`h-${idx}-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={lvl.width}
            opacity={lvl.opacity}
          />,
        );
      }
    });
    return lines;
  };

  const renderWires = () => {
    return connections.map((conn) => {
      const startComp = components.find((c) => c.id === conn.startComponent);
      const endComp = components.find((c) => c.id === conn.endComponent);
      if (!startComp || !endComp) return null;

      const startPos = getPortPosition(startComp, conn.startPort);
      const endPos = getPortPosition(endComp, conn.endPort);

      const startScreen = {
        x: pan.x + (startComp.x + startPos.x) * zoom,
        y: pan.y + (startComp.y + startPos.y) * zoom,
      };
      const endScreen = {
        x: pan.x + (endComp.x + endPos.x) * zoom,
        y: pan.y + (endComp.y + endPos.y) * zoom,
      };
      const path = getWirePath(startScreen, endScreen);
      const isSelected = false; // TODO: wire selection
      return (
        <g
          key={`wire-${conn.id}`}
          className={isSelected ? "wire selected" : "wire"}
        >
          {/* Glow */}
          <path
            d={path}
            stroke={
              isSelected ? "var(--accent-primary)" : "var(--accent-primary)"
            }
            strokeWidth={isSelected ? 6 : 4}
            fill="none"
            opacity={0.3}
            filter="blur(4px)"
            pointerEvents="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Core */}
          <path
            d={path}
            stroke={isSelected ? "white" : "var(--text-secondary)"}
            strokeWidth={2}
            fill="none"
            pointerEvents="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* End points */}
          <circle
            cx={startScreen.x}
            cy={startScreen.y}
            r={3}
            fill="var(--accent-primary)"
          />
          <circle
            cx={endScreen.x}
            cy={endScreen.y}
            r={3}
            fill="var(--accent-primary)"
          />
        </g>
      );
    });
  };

  const renderDrawingWire = () => {
    if (!isDrawingWire || !wireStart) return null;
    const startComp = components.find((c) => c.id === wireStart.componentId);
    if (!startComp) return null;

    const startPos = getPortPosition(startComp, wireStart.portName);
    const startScreen = {
      x: pan.x + (startComp.x + startPos.x) * zoom,
      y: pan.y + (startComp.y + startPos.y) * zoom,
    };
    const endScreen = wireCurrent
      ? { x: wireCurrent.x, y: wireCurrent.y }
      : startScreen;
    const path = getWirePath(startScreen, endScreen);
    return (
      <g>
        <path
          d={path}
          stroke="var(--accent-success)"
          strokeWidth={2}
          fill="none"
          strokeDasharray="5,5"
          pointerEvents="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={startScreen.x}
          cy={startScreen.y}
          r={4}
          fill="var(--accent-success)"
        />
        {wireCurrent && (
          <circle
            cx={wireCurrent.x}
            cy={wireCurrent.y}
            r={4}
            fill="var(--accent-success)"
          />
        )}
      </g>
    );
  };

  const renderSelectionBox = () => {
    if (!isSelecting) return null;
    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const w = Math.abs(selectionEnd.x - selectionStart.x);
    const h = Math.abs(selectionEnd.y - selectionStart.y);
    return (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="rgba(59,130,246,0.1)"
        stroke="var(--accent-primary)"
        strokeWidth={1}
        strokeDasharray="4,4"
        pointerEvents="none"
      />
    );
  };

  const renderComponents = () => {
    return components.map((comp) => {
      const left = pan.x + comp.x * zoom;
      const top = pan.y + comp.y * zoom;
      const w = comp.width * zoom;
      const h = comp.height * zoom;
      const isSelected = selectedComponents?.includes(comp.id);
      const isHover = hoveredComponent === comp.id;

      return (
        <g
          key={comp.id}
          transform={`translate(${left}, ${top})`}
          onClick={(e) => {
            e.stopPropagation();
            onComponentClick(comp, e);
          }}
          style={{
            cursor: draggedComponent ? "grabbing" : "grab",
            transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Selection glow */}
          {isSelected && (
            <rect
              x={-4}
              y={-4}
              width={w + 8}
              height={h + 8}
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              rx={6}
              filter="drop-shadow(0 0 8px var(--accent-primary))"
            />
          )}
          {/* Hover glow */}
          {isHover && !isSelected && (
            <rect
              x={-3}
              y={-3}
              width={w + 6}
              height={h + 6}
              fill="none"
              stroke="var(--accent-secondary)"
              strokeWidth={2}
              rx={6}
              opacity={0.5}
            />
          )}
          {/* Body */}
          {comp.svgPath ? (
            <g>
              {/* Background for hit area */}
              <rect width={w} height={h} fill="transparent" />
              <path
                d={comp.svgPath}
                transform={`scale(${w / 60}, ${h / 20})`} // Assuming base SVG is designed for 60x20, adjust as needed per component type if they differ
                stroke={
                  isSelected
                    ? "var(--accent-primary)"
                    : comp.color || "var(--text-primary)"
                }
                strokeWidth={2 * (60 / w)} // Counter-scale stroke width
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : (
            <rect
              width={w}
              height={h}
              fill={isSelected ? "#1e3a8a" : "#1f2937"}
              className="component-body"
              stroke={
                isSelected ? "var(--accent-primary)" : "var(--border-color)"
              }
              strokeWidth={1.5}
              rx={4}
            />
          )}

          {/* Label */}
          <text
            x={w / 2}
            y={-8}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize={Math.max(10, 12 * zoom)}
            fontFamily="monospace"
            fontWeight="bold"
            pointerEvents="none"
            style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
          >
            {comp.label || comp.type.toUpperCase().slice(0, 3)}
          </text>
          {/* Value */}
          {comp.value && (
            <text
              x={w / 2}
              y={h + 12}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize={Math.max(8, 10 * zoom)}
              fontFamily="monospace"
              pointerEvents="none"
            >
              {comp.value}
            </text>
          )}
          {/* Ports */}
          {getComponentPorts(comp).map((port) => {
            const portScreen = { x: port.x * zoom, y: port.y * zoom };
            const isPortHovered = hoveredPort === `${comp.id}-${port.id}`;
            const isConnected = connections.some(
              (c) =>
                (c.startComponent === comp.id && c.startPort === port.id) ||
                (c.endComponent === comp.id && c.endPort === port.id),
            );
            return (
              <g
                key={port.id}
                transform={`translate(${portScreen.x}, ${portScreen.y})`}
                onMouseEnter={() => setHoveredPort(`${comp.id}-${port.id}`)}
                onMouseLeave={() => setHoveredPort(null)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onWireStart(comp.id, port.id);
                }}
                style={{ cursor: "crosshair" }}
              >
                <circle
                  r={isPortHovered || isConnected ? 6 : 4}
                  fill={
                    isConnected ? "var(--accent-success)" : "var(--bg-dark)"
                  }
                  stroke={
                    isPortHovered
                      ? "var(--accent-primary)"
                      : "var(--text-secondary)"
                  }
                  strokeWidth={2}
                  style={{ transition: "all 0.2s" }}
                />
              </g>
            );
          })}
        </g>
      );
    });
  };

  // -------------------------------------------------------------------
  // Effect: attach canvas listeners
  // -------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, [handleWheel]);

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <div
      ref={canvasRef}
      className="canvas-container"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        cursor: isPanning ? "grabbing" : "default",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onCanvasClick(e);
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Grid */}
        {renderGrid()}
        {/* Wires */}
        {renderWires()}
        {/* Wire being drawn */}
        {renderDrawingWire()}
        {/* Components */}
        {renderComponents()}
        {/* Selection rectangle */}
        {renderSelectionBox()}
      </svg>
      {/* HUD – zoom level */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          background: "var(--bg-panel)",
          padding: "6px 12px",
          borderRadius: 8,
          backdropFilter: "blur(8px)",
          border: "1px solid var(--border-color)",
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}
