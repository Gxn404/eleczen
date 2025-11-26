"use client";

import React from "react";

export default function PropertiesPanel({
  selectedComponents = [],
  components = [],
  onUpdate,
  onRotate,
  onDelete,
}) {
  if (!selectedComponents || selectedComponents.length === 0) return null;

  // Get selected component objects
  const selection = components.filter((c) => selectedComponents.includes(c.id));

  // Single Selection Mode
  if (selection.length === 1) {
    const component = selection[0];
    return (
      <div className="properties-panel">
        <div className="panel-header">
          <h3 className="panel-title">Properties</h3>
          <p className="panel-subtitle">
            {component.type.replace("_", " ").toUpperCase()}
          </p>
        </div>

        <div style={{ padding: "20px" }}>
          {/* Component Type Badge */}
          <div className="input-group">
            <label className="input-label">Type</label>
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "6px",
                fontSize: "13px",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                textTransform: "capitalize",
              }}
            >
              {component.type.replace("_", " ")}
            </div>
          </div>

          {/* Label Input */}
          <div className="input-group">
            <label className="input-label">Label</label>
            <input
              type="text"
              className="glass-input"
              value={component.label || ""}
              onChange={(e) => onUpdate("label", e.target.value)}
              placeholder="Component Label"
            />
          </div>

          {/* Value Input */}
          <div className="input-group">
            <label className="input-label">Value</label>
            <input
              type="text"
              className="glass-input"
              value={component.value || ""}
              onChange={(e) => onUpdate("value", e.target.value)}
              placeholder="e.g. 1k, 10u"
            />
          </div>

          {/* Position Info */}
          <div
            className="input-group"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              padding: "12px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "8px",
            }}
          >
            <div>
              <label className="input-label" style={{ fontSize: "10px" }}>
                X Position
              </label>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}
              >
                {Math.round(component.x)}
              </div>
            </div>
            <div>
              <label className="input-label" style={{ fontSize: "10px" }}>
                Y Position
              </label>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}
              >
                {Math.round(component.y)}
              </div>
            </div>
            <div>
              <label className="input-label" style={{ fontSize: "10px" }}>
                Rotation
              </label>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}
              >
                {component.rotation || 0}°
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button className="glass-btn primary" onClick={() => onRotate(90)}>
              <span>↻</span> Rotate 90°
            </button>
            <button className="glass-btn danger" onClick={onDelete}>
              <span>🗑</span> Delete Component
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multiple Selection Mode
  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3 className="panel-title">Selection</h3>
        <p className="panel-subtitle">{selection.length} ITEMS SELECTED</p>
      </div>

      <div style={{ padding: "20px" }}>
        <div
          style={{
            padding: "12px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid var(--accent-primary)",
            borderRadius: "8px",
            marginBottom: "20px",
            color: "var(--text-secondary)",
            fontSize: "13px",
          }}
        >
          Multiple items selected. You can rotate or delete them as a group.
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="glass-btn primary" onClick={() => onRotate(90)}>
            <span>↻</span> Rotate All 90°
          </button>
          <button className="glass-btn danger" onClick={onDelete}>
            <span>🗑</span> Delete All
          </button>
        </div>
      </div>
    </div>
  );
}
