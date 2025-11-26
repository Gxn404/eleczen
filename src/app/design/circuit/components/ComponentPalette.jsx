"use client";

import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Lightbulb,
  Power,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { COMPONENT_LIBRARY } from "../lib/constants";
import { generateId } from "../lib/utils";

// Group components by category with icons
const CATEGORIES = {
  passives: {
    label: "Passive Components",
    icon: Zap,
    components: ["resistor", "capacitor", "inductor"],
  },
  semiconductors: {
    label: "Semiconductors",
    icon: Lightbulb,
    components: ["diode", "led", "transistor_npn"],
  },
  analog: {
    label: "Analog & OpAmps",
    icon: Cpu,
    components: ["op_amp"],
  },
  sources: {
    label: "Power Sources",
    icon: Power,
    components: ["voltage_source", "current_source", "ground"],
  },
};

export const ComponentPalette = ({
  onComponentDragStart,
  onComponentDragEnd,
}) => {
  const [expandedCategories, setExpandedCategories] = useState({
    passives: true,
    semiconductors: true,
    analog: true,
    sources: true,
  });

  const [draggedComponent, setDraggedComponent] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragStart = (e, componentType) => {
    const componentInfo = COMPONENT_LIBRARY[componentType];
    const newComponent = {
      id: generateId(),
      type: componentType,
      x: 0,
      y: 0,
      width: componentInfo.width,
      height: componentInfo.height,
      rotation: 0,
      label: `${componentInfo.symbol}1`,
      value: componentInfo.defaultValue,
      port: componentInfo.port,
    };

    setDraggedComponent(newComponent);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(newComponent));

    if (onComponentDragStart) {
      onComponentDragStart(newComponent);
    }
  };

  const handleDragEnd = (e) => {
    setDraggedComponent(null);
    if (onComponentDragEnd) {
      onComponentDragEnd();
    }
  };

  return (
    <div className="component-palette">
      <div
        style={{
          padding: "16px",
          borderBottom: "var(--glass-border)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            margin: 0,
          }}
        >
          Components
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {Object.entries(CATEGORIES).map(([categoryKey, category]) => {
          const Icon = category.icon;
          return (
            <div key={categoryKey} className="palette-category">
              <div
                className="palette-category-header"
                onClick={() => toggleCategory(categoryKey)}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Icon size={14} />
                  <span>{category.label}</span>
                </div>
                {expandedCategories[categoryKey] ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedCategories[categoryKey] && (
                <div>
                  {category.components.map((componentType) => {
                    const componentInfo = COMPONENT_LIBRARY[componentType];
                    if (!componentInfo) return null;

                    return (
                      <div
                        key={componentType}
                        className="palette-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, componentType)}
                        onDragEnd={handleDragEnd}
                        title={`Drag to add ${componentInfo.label}`}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "var(--text-primary)",
                              marginBottom: "2px",
                            }}
                          >
                            {componentInfo.label}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                              fontFamily: "monospace",
                            }}
                          >
                            {componentInfo.symbol} •{" "}
                            {componentInfo.defaultValue}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tip section */}
      <div
        style={{
          padding: "16px",
          borderTop: "var(--glass-border)",
          background: "rgba(0,0,0,0.2)",
          fontSize: "11px",
          color: "var(--text-muted)",
          lineHeight: "1.5",
        }}
      >
        <strong
          style={{
            color: "var(--text-secondary)",
            display: "block",
            marginBottom: "4px",
          }}
        >
          💡 Pro Tip:
        </strong>
        Drag components to canvas. Right-click to pan. Scroll to zoom.
      </div>
    </div>
  );
};

export default ComponentPalette;
