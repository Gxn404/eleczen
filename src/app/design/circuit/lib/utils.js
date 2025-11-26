import { GRID_SIZE, SNAP_TO_GRID } from "./constants";

export const snapToGrid = (value) => {
  if (!SNAP_TO_GRID) return value;
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export const calculateDistance = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const isPointNearLine = (point, lineStart, lineEnd, threshold = 10) => {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy) < threshold;
};

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const parseValue = (valueStr) => {
  const multipliers = {
    p: 1e-12,
    n: 1e-9,
    µ: 1e-6,
    u: 1e-6,
    m: 1e-3,
    k: 1e3,
    M: 1e6,
    G: 1e9,
  };

  const match = valueStr.match(/^([\d.]+)\s*([a-zA-Z]?)(.*)$/);
  if (!match) return null;

  const [, num, unit, suffix] = match;
  const multiplier = multipliers[unit] || 1;
  return parseFloat(num) * multiplier;
};

export const formatValue = (value, unit = "Ω") => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}G${unit}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M${unit}`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}k${unit}`;
  if (value >= 1) return `${value.toFixed(2)}${unit}`;
  if (value >= 1e-3) return `${(value * 1e3).toFixed(2)}m${unit}`;
  if (value >= 1e-6) return `${(value * 1e6).toFixed(2)}µ${unit}`;
  if (value >= 1e-9) return `${(value * 1e9).toFixed(2)}n${unit}`;
  return `${(value * 1e12).toFixed(2)}p${unit}`;
};

export const rotatePoint = (point, center, angle) => {
  const cos = Math.cos((angle * Math.PI) / 180);
  const sin = Math.sin((angle * Math.PI) / 180);

  const x = point.x - center.x;
  const y = point.y - center.y;

  return {
    x: x * cos - y * sin + center.x,
    y: x * sin + y * cos + center.y,
  };
};

export const getBoundingBox = (components) => {
  if (components.length === 0) return null;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  components.forEach((comp) => {
    minX = Math.min(minX, comp.x);
    minY = Math.min(minY, comp.y);
    maxX = Math.max(maxX, comp.x + comp.width);
    maxY = Math.max(maxY, comp.y + comp.height);
  });

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

export const isRectIntersecting = (rect1, rect2) => {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect1.x > rect2.x + rect2.width ||
    rect1.y + rect1.height < rect2.y ||
    rect1.y > rect2.y + rect2.height
  );
};

export const getComponentPorts = (component, componentType) => {
  // Returns absolute port positions for a component
  const ports = [];
  const baseX = component.x;
  const baseY = component.y;
  const width = component.width;
  const height = component.height;

  switch (componentType) {
    case "resistor":
    case "capacitor":
    case "inductor":
      ports.push({
        id: `${component.id}-left`,
        x: baseX,
        y: baseY + height / 2,
      });
      ports.push({
        id: `${component.id}-right`,
        x: baseX + width,
        y: baseY + height / 2,
      });
      break;
    case "op_amp":
      ports.push({
        id: `${component.id}-in1`,
        x: baseX,
        y: baseY + height * 0.25,
      }); // +
      ports.push({
        id: `${component.id}-in2`,
        x: baseX,
        y: baseY + height * 0.75,
      }); // -
      ports.push({
        id: `${component.id}-out`,
        x: baseX + width,
        y: baseY + height * 0.5,
      });
      break;
    case "ground":
      ports.push({ id: `${component.id}-pin`, x: baseX + width / 2, y: baseY });
      break;
    default:
      ports.push({ id: `${component.id}-1`, x: baseX, y: baseY + height / 2 });
      ports.push({
        id: `${component.id}-2`,
        x: baseX + width,
        y: baseY + height / 2,
      });
  }

  return ports;
};
