"use client";

// SVG component renderers for different circuit elements
export const ResistorSymbol = ({
  x,
  y,
  width,
  height,
  angle = 0,
  color = "#F59E0B",
}) => {
  const boxWidth = width * 0.6;
  const boxX = x + (width - boxWidth) / 2;
  const boxY = y + height * 0.25;

  return (
    <g
      transform={`translate(${x + width / 2}, ${y + height / 2}) rotate(${angle}) translate(${-width / 2}, ${-height / 2})`}
    >
      {/* Left lead */}
      <line
        x1={x}
        y1={y + height / 2}
        x2={boxX}
        y2={boxY + (height * 0.5) / 2}
        className="resistor-symbol"
        stroke={color}
      />
      {/* Resistor box */}
      <rect
        x={boxX}
        y={boxY}
        width={boxWidth}
        height={height * 0.5}
        className="resistor-symbol"
        stroke={color}
        fill="none"
      />
      {/* Right lead */}
      <line
        x1={boxX + boxWidth}
        y1={boxY + (height * 0.5) / 2}
        x2={x + width}
        y2={y + height / 2}
        className="resistor-symbol"
        stroke={color}
      />
    </g>
  );
};

export const CapacitorSymbol = ({
  x,
  y,
  width,
  height,
  angle = 0,
  color = "#3B82F6",
}) => {
  const plateDistance = width * 0.2;

  return (
    <g
      transform={`translate(${x + width / 2}, ${y + height / 2}) rotate(${angle}) translate(${-width / 2}, ${-height / 2})`}
    >
      {/* Left lead */}
      <line
        x1={x}
        y1={y + height / 2}
        x2={x + width / 2 - plateDistance / 2}
        y2={y + height / 2}
        className="capacitor-symbol"
        stroke={color}
      />
      {/* Left plate */}
      <line
        x1={x + width / 2 - plateDistance / 2}
        y1={y + height * 0.2}
        x2={x + width / 2 - plateDistance / 2}
        y2={y + height * 0.8}
        className="capacitor-symbol"
        stroke={color}
      />
      {/* Right plate */}
      <line
        x1={x + width / 2 + plateDistance / 2}
        y1={y + height * 0.2}
        x2={x + width / 2 + plateDistance / 2}
        y2={y + height * 0.8}
        className="capacitor-symbol"
        stroke={color}
      />
      {/* Right lead */}
      <line
        x1={x + width / 2 + plateDistance / 2}
        y1={y + height / 2}
        x2={x + width}
        y2={y + height / 2}
        className="capacitor-symbol"
        stroke={color}
      />
    </g>
  );
};

export const DiodeSymbol = ({
  x,
  y,
  width,
  height,
  angle = 0,
  color = "#EC4899",
}) => {
  const triangleSize = width * 0.5;

  return (
    <g
      transform={`translate(${x + width / 2}, ${y + height / 2}) rotate(${angle}) translate(${-width / 2}, ${-height / 2})`}
    >
      {/* Left lead */}
      <line
        x1={x}
        y1={y + height / 2}
        x2={x + width * 0.25}
        y2={y + height / 2}
        className="diode-symbol"
        stroke={color}
      />
      {/* Triangle (anode) */}
      <polygon
        points={`${x + width * 0.25},${y + height / 2 - triangleSize / 2} ${x + width * 0.25},${y + height / 2 + triangleSize / 2} ${x + width * 0.6},${y + height / 2}`}
        className="diode-symbol"
        stroke={color}
        fill="none"
      />
      {/* Bar (cathode) */}
      <line
        x1={x + width * 0.6}
        y1={y + height / 2 - triangleSize / 2}
        x2={x + width * 0.6}
        y2={y + height / 2 + triangleSize / 2}
        className="diode-symbol"
        stroke={color}
        strokeWidth="2"
      />
      {/* Right lead */}
      <line
        x1={x + width * 0.6}
        y1={y + height / 2}
        x2={x + width}
        y2={y + height / 2}
        className="diode-symbol"
        stroke={color}
      />
    </g>
  );
};

export const LEDSymbol = ({
  x,
  y,
  width,
  height,
  angle = 0,
  color = "#EF4444",
}) => {
  const triangleSize = width * 0.4;

  return (
    <g
      transform={`translate(${x + width / 2}, ${y + height / 2}) rotate(${angle}) translate(${-width / 2}, ${-height / 2})`}
    >
      {/* Left lead */}
      <line
        x1={x}
        y1={y + height / 2}
        x2={x + width * 0.25}
        y2={y + height / 2}
        className="led-symbol"
        stroke={color}
      />
      {/* Triangle */}
      <polygon
        points={`${x + width * 0.25},${y + height / 2 - triangleSize / 2} ${x + width * 0.25},${y + height / 2 + triangleSize / 2} ${x + width * 0.55},${y + height / 2}`}
        className="led-symbol"
        stroke={color}
        fill="none"
      />
      {/* Bar */}
      <line
        x1={x + width * 0.55}
        y1={y + height / 2 - triangleSize / 2}
        x2={x + width * 0.55}
        y2={y + height / 2 + triangleSize / 2}
        className="led-symbol"
        stroke={color}
        strokeWidth="2"
      />
      {/* Right lead */}
      <line
        x1={x + width * 0.55}
        y1={y + height / 2}
        x2={x + width}
        y2={y + height / 2}
        className="led-symbol"
        stroke={color}
      />
      {/* Light rays */}
      <line
        x1={x + width * 0.65}
        y1={y + height * 0.1}
        x2={x + width * 0.8}
        y2={y}
        className="led-symbol"
        stroke={color}
        opacity="0.6"
      />
      <line
        x1={x + width * 0.75}
        y1={y + height * 0.15}
        x2={x + width * 0.95}
        y2={y + height * 0.05}
        className="led-symbol"
        stroke={color}
        opacity="0.6"
      />
    </g>
  );
};

export const NPNTransistorSymbol = ({
  x,
  y,
  width,
  height,
  angle = 0,
  color = "#14B8A6",
}) => {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const baseWidth = width * 0.15;
  const baseHeight = height * 0.5;

  return (
    <g
      transform={`translate(${centerX}, ${centerY}) rotate(${angle}) translate(${-centerX}, ${-centerY})`}
    >
      {/* Base line */}
      <line
        x1={centerX - baseWidth / 2}
        y1={centerY - baseHeight / 2}
        x2={centerX - baseWidth / 2}
        y2={centerY + baseHeight / 2}
        className="transistor-symbol"
        stroke={color}
        strokeWidth="2"
      />

      {/* Collector lead and line */}
      <line
        x1={centerX - baseWidth / 2}
        y1={centerY - height * 0.25}
        x2={x + width * 0.1}
        y2={y}
        className="transistor-symbol"
        stroke={color}
      />
      {/* Emitter lead and line with arrow */}
      <line
        x1={centerX - baseWidth / 2}
        y1={centerY + height * 0.25}
        x2={x + width * 0.1}
        y2={y + height}
        className="transistor-symbol"
        stroke={color}
      />
      {/* Arrow on emitter */}
      <polygon
        points={`${x + width * 0.1},${y + height} ${x + width * 0.05},${y + height - width * 0.1} ${x + width * 0.15},${y + height - width * 0.05}`}
        className="transistor-symbol"
        stroke={color}
        fill={color}
        opacity="0.7"
      />

      {/* Base lead */}
      <line
        x1={x}
        y1={centerY}
        x2={centerX - baseWidth / 2}
        y2={centerY}
        className="transistor-symbol"
        stroke={color}
      />
      {/* Collector arrow line */}
      <line
        x1={centerX - baseWidth / 2}
        y1={centerY - height * 0.2}
        x2={centerX + baseWidth}
        y2={centerY - height * 0.15}
        className="transistor-symbol"
        stroke={color}
      />
      {/* Collector output */}
      <line
        x1={centerX + baseWidth}
        y1={centerY - height * 0.15}
        x2={x + width}
        y2={y}
        className="transistor-symbol"
        stroke={color}
      />
    </g>
  );
};

export const GroundSymbol = ({ x, y, width, height, color = "#6B7280" }) => {
  const lineX = x + width / 2;
  const lineY = y + height * 0.3;

  return (
    <g>
      {/* Lead */}
      <line
        x1={lineX}
        y1={y}
        x2={lineX}
        y2={lineY}
        className="ground-symbol"
        stroke={color}
      />
      {/* Main line */}
      <line
        x1={lineX - width * 0.3}
        y1={lineY}
        x2={lineX + width * 0.3}
        y2={lineY}
        className="ground-symbol"
        stroke={color}
        strokeWidth="2"
      />
      {/* Second line */}
      <line
        x1={lineX - width * 0.2}
        y1={lineY + height * 0.2}
        x2={lineX + width * 0.2}
        y2={lineY + height * 0.2}
        className="ground-symbol"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Third line */}
      <line
        x1={lineX - width * 0.1}
        y1={lineY + height * 0.35}
        x2={lineX + width * 0.1}
        y2={lineY + height * 0.35}
        className="ground-symbol"
        stroke={color}
        strokeWidth="1"
      />
    </g>
  );
};

export const VoltageSourceSymbol = ({
  x,
  y,
  width,
  height,
  angle = 0,
  color = "#FBBF24",
}) => {
  const radius = Math.min(width, height) * 0.35;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  return (
    <g
      transform={`translate(${centerX}, ${centerY}) rotate(${angle}) translate(${-centerX}, ${-centerY})`}
    >
      {/* Circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        className="ground-symbol"
        stroke={color}
        fill="none"
      />
      {/* Horizontal line (positive) */}
      <line
        x1={centerX - radius * 0.4}
        y1={centerY}
        x2={centerX + radius * 0.4}
        y2={centerY}
        className="ground-symbol"
        stroke={color}
        strokeWidth="2"
      />
      {/* Vertical line (negative) */}
      <line
        x1={centerX}
        y1={centerY - radius * 0.4}
        x2={centerX}
        y2={centerY + radius * 0.4}
        className="ground-symbol"
        stroke={color}
        strokeWidth="1"
      />
      {/* Top lead */}
      <line
        x1={centerX}
        y1={centerY - radius}
        x2={centerX}
        y2={y}
        className="ground-symbol"
        stroke={color}
      />
      {/* Bottom lead */}
      <line
        x1={centerX}
        y1={centerY + radius}
        x2={centerX}
        y2={y + height}
        className="ground-symbol"
        stroke={color}
      />
    </g>
  );
};

export const OpAmpSymbol = ({
  x,
  y,
  width,
  height,
  angle = 0,
  color = "#10B981",
}) => {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const triangleSize = Math.min(width, height) * 0.6;

  return (
    <g
      transform={`translate(${centerX}, ${centerY}) rotate(${angle}) translate(${-centerX}, ${-centerY})`}
    >
      {/* Triangle body */}
      <polygon
        points={`${x + width * 0.25},${y + height * 0.2} ${x + width * 0.25},${y + height * 0.8} ${x + width * 0.75},${centerY}`}
        className="opamp-symbol"
        stroke={color}
        fill="none"
      />
      {/* + input */}
      <text
        x={x + width * 0.3}
        y={y + height * 0.35}
        fontSize="8"
        fill={color}
        textAnchor="middle"
      >
        +
      </text>
      {/* - input */}
      <text
        x={x + width * 0.3}
        y={y + height * 0.7}
        fontSize="8"
        fill={color}
        textAnchor="middle"
      >
        −
      </text>
      {/* Input leads */}
      <line
        x1={x}
        y1={y + height * 0.25}
        x2={x + width * 0.25}
        y2={y + height * 0.25}
        className="opamp-symbol"
        stroke={color}
      />
      <line
        x1={x}
        y1={y + height * 0.75}
        x2={x + width * 0.25}
        y2={y + height * 0.75}
        className="opamp-symbol"
        stroke={color}
      />
      {/* Output lead */}
      <line
        x1={x + width * 0.75}
        y1={centerY}
        x2={x + width}
        y2={centerY}
        className="opamp-symbol"
        stroke={color}
      />
    </g>
  );
};

// Wrapper component for rendering based on type
export const ComponentRenderer = ({ component, color }) => {
  const props = {
    x: 0,
    y: 0,
    width: component.width,
    height: component.height,
    angle: component.rotation || 0,
    color,
  };

  switch (component.type) {
    case "resistor":
      return <ResistorSymbol {...props} />;
    case "capacitor":
      return <CapacitorSymbol {...props} />;
    case "inductor":
      return <CapacitorSymbol {...props} />; // Similar visual for now
    case "diode":
      return <DiodeSymbol {...props} />;
    case "led":
      return <LEDSymbol {...props} />;
    case "transistor_npn":
      return <NPNTransistorSymbol {...props} />;
    case "op_amp":
      return <OpAmpSymbol {...props} />;
    case "ground":
      return <GroundSymbol {...props} />;
    case "voltage_source":
      return <VoltageSourceSymbol {...props} />;
    case "current_source":
      return <VoltageSourceSymbol {...props} />;
    default:
      return null;
  }
};
