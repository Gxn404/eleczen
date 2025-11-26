"use client";

import { useCallback, useMemo, useRef, useState } from "react";

/**
 * WireLayer Component - Handles wire rendering and interaction
 * Features:
 * - Draw wires between component ports
 * - Visual feedback during wire drawing
 * - Auto-routing with L-shape routing algorithm
 * - Wire selection and deletion
 */
export default function WireLayer({
  components,
  connections,
  selectedConnection,
  zoom,
  pan,
  onConnectionStart,
  onConnectionEnd,
  onConnectionSelect,
  onConnectionDelete,
  isDrawingWire,
  wireStart,
  wireCurrent,
}) {
  const svgRef = useRef(null);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [ports, setPorts] = useState({});

  // Calculate component ports
  useMemo(() => {
    const allPorts = {};
    components.forEach((comp) => {
      // Each component has 4 ports (top, right, bottom, left)
      const ports_map = {
        top: { x: comp.x + comp.width / 2, y: comp.y, angle: 0 },
        right: {
          x: comp.x + comp.width,
          y: comp.y + comp.height / 2,
          angle: 90,
        },
        bottom: {
          x: comp.x + comp.width / 2,
          y: comp.y + comp.height,
          angle: 180,
        },
        left: { x: comp.x, y: comp.y + comp.height / 2, angle: 270 },
      };
      allPorts[comp.id] = ports_map;
    });
    setPorts(allPorts);
  }, [components]);

  // L-routing algorithm for automatic wire paths
  const routeWire = useCallback((startPort, endPort) => {
    const midX = (startPort.x + endPort.x) / 2;
    return `M ${startPort.x} ${startPort.y} L ${midX} ${startPort.y} L ${midX} ${endPort.y} L ${endPort.x} ${endPort.y}`;
  }, []);

  // Get port position for a connection
  const getPortPosition = (componentId, portName) => {
    return ports[componentId]?.[portName];
  };

  // Render connection lines
  const renderConnections = useMemo(() => {
    return connections.map((conn, idx) => {
      const startComp = components.find((c) => c.id === conn.startComponent);
      const endComp = components.find((c) => c.id === conn.endComponent);

      if (!startComp || !endComp) return null;

      const startPort = getPortPosition(conn.startComponent, conn.startPort);
      const endPort = getPortPosition(conn.endComponent, conn.endPort);

      if (!startPort || !endPort) return null;

      const isSelected = selectedConnection?.id === conn.id;
      const isHovered = hoveredConnection === idx;

      return (
        <g key={`wire-${idx}`} className="wire-group">
          {/* Invisible hit area for interaction */}
          <path
            d={routeWire(startPort, endPort)}
            stroke="transparent"
            strokeWidth={20}
            fill="none"
            pointerEvents="all"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredConnection(idx)}
            onMouseLeave={() => setHoveredConnection(null)}
            onClick={() => onConnectionSelect(conn)}
            onContextMenu={(e) => {
              e.preventDefault();
              onConnectionDelete(conn.id);
            }}
          />

          {/* Visible wire line */}
          <path
            d={routeWire(startPort, endPort)}
            stroke={isSelected ? "#fbbf24" : isHovered ? "#93c5fd" : "#60a5fa"}
            strokeWidth={isSelected || isHovered ? 3 : 2}
            fill="none"
            pointerEvents="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots at connection points */}
          <circle
            cx={startPort.x}
            cy={startPort.y}
            r={isSelected || isHovered ? 5 : 3}
            fill={isSelected ? "#fbbf24" : isHovered ? "#93c5fd" : "#60a5fa"}
            pointerEvents="none"
          />
          <circle
            cx={endPort.x}
            cy={endPort.y}
            r={isSelected || isHovered ? 5 : 3}
            fill={isSelected ? "#fbbf24" : isHovered ? "#93c5fd" : "#60a5fa"}
            pointerEvents="none"
          />
        </g>
      );
    });
  }, [
    connections,
    components,
    selectedConnection,
    hoveredConnection,
    routeWire,
    onConnectionSelect,
    onConnectionDelete,
  ]);

  // Render current wire being drawn
  const renderDrawingWire = useMemo(() => {
    if (!isDrawingWire || !wireStart || !wireCurrent) return null;

    const startPort = getPortPosition(
      wireStart.componentId,
      wireStart.portName,
    );
    if (!startPort) return null;

    return (
      <g className="drawing-wire-group">
        {/* Drawing line */}
        <path
          d={`M ${startPort.x} ${startPort.y} L ${wireCurrent.x} ${wireCurrent.y}`}
          stroke="#10b981"
          strokeWidth={2}
          fill="none"
          strokeDasharray="5,5"
          pointerEvents="none"
        />
        {/* Start port indicator */}
        <circle cx={startPort.x} cy={startPort.y} r={5} fill="#10b981" />
        {/* Current position indicator */}
        <circle cx={wireCurrent.x} cy={wireCurrent.y} r={3} fill="#10b981" />
      </g>
    );
  }, [isDrawingWire, wireStart, wireCurrent, getPortPosition]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Arrow marker for wire directions */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#60a5fa" />
        </marker>
      </defs>

      {/* Render all connections */}
      {renderConnections}

      {/* Render current drawing wire */}
      {renderDrawingWire}
    </svg>
  );
}
