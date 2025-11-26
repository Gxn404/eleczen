"use client";

import { useState } from "react";

export const ControlPanel = ({
  isRunning = false,
  onPlay = () => {},
  onPause = () => {},
  onStop = () => {},
  onReset = () => {},
  onSave = () => {},
  onLoad = () => {},
  onExport = () => {},
  simulationTime = 0,
  status = "idle",
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, "0")}`;
  };

  return (
    <div className="control-panel ml-auto">
      {/* Left side: Simulation controls */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Status indicator */}
        <div className={`status-indicator ${status}`}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor:
                status === "running"
                  ? "#10b981"
                  : status === "error"
                    ? "#ef4444"
                    : "#6b7280",
            }}
          />
          <span style={{ textTransform: "capitalize" }}>
            {status === "idle"
              ? "Ready"
              : status === "running"
                ? "Running"
                : status === "paused"
                  ? "Paused"
                  : "Error"}
          </span>
        </div>

        {/* Time display */}
        <div
          style={{
            padding: "6px 12px",
            backgroundColor: "#1e293b",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#e2e8f0",
            border: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          {formatTime(simulationTime)}
        </div>

        {/* Simulation buttons */}
        <div style={{ display: "flex", gap: "6px" }}>
          {!isRunning ? (
            <button
              className="toolbar-btn"
              onClick={onPlay}
              title="Start simulation (Space)"
            >
              ▶ Play
            </button>
          ) : (
            <button
              className="toolbar-btn"
              onClick={onPause}
              title="Pause simulation"
            >
              ⏸ Pause
            </button>
          )}

          <button
            className="toolbar-btn"
            onClick={onStop}
            title="Stop and reset simulation"
          >
            ⏹ Stop
          </button>

          <button className="toolbar-btn" onClick={onReset} title="Clear all">
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Advanced settings panel */}
      {showAdvanced && (
        <AdvancedSettings onClose={() => setShowAdvanced(false)} />
      )}
    </div>
  );
};

const AdvancedSettings = ({ onClose }) => {
  const [timeStep, setTimeStep] = useState(0.001);
  const [solver, setSolver] = useState("RK45");

  return (
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        right: "0",
        backgroundColor: "#1f2937",
        border: "1px solid #374151",
        borderRadius: "8px",
        padding: "16px",
        minWidth: "300px",
        zIndex: 1000,
        boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.6)",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "#e2e8f0",
            fontSize: "14px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          Advanced Settings
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Time step setting */}
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            color: "#cbd5e1",
            fontSize: "12px",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Time Step (s)
        </label>
        <input
          type="number"
          value={timeStep}
          onChange={(e) => setTimeStep(parseFloat(e.target.value))}
          step="0.0001"
          min="0.00001"
          max="0.1"
          style={{
            width: "100%",
            padding: "6px 8px",
            backgroundColor: "#111827",
            color: "#e2e8f0",
            border: "1px solid #374151",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        />
      </div>

      {/* Solver selection */}
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            color: "#cbd5e1",
            fontSize: "12px",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Solver
        </label>
        <select
          value={solver}
          onChange={(e) => setSolver(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            backgroundColor: "#111827",
            color: "#e2e8f0",
            border: "1px solid #374151",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          <option>Euler</option>
          <option>RK45</option>
          <option>Backward Euler</option>
        </select>
      </div>

      {/* Info text */}
      <div
        style={{
          fontSize: "11px",
          color: "#6b7280",
          paddingTop: "8px",
          borderTop: "1px solid #374151",
        }}
      >
        Adjust simulation parameters for accuracy and performance.
      </div>
    </div>
  );
};

export default ControlPanel;
