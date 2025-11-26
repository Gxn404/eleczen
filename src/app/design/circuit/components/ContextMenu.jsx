"use client";

import { Copy, RotateCw, Trash2, X } from "lucide-react";

export default function ContextMenu({ x, y, onClose, onAction, hasSelection }) {
  if (x === null || y === null) return null;

  return (
    <div
      className="context-menu"
      style={{
        left: x,
        top: y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {hasSelection ? (
        <>
          <div className="context-menu-item" onClick={() => onAction("copy")}>
            <Copy size={14} />
            <span>Copy</span>
            <span className="shortcut-hint">Ctrl+C</span>
          </div>
          <div className="context-menu-item" onClick={() => onAction("rotate")}>
            <RotateCw size={14} />
            <span>Rotate</span>
            <span className="shortcut-hint">R</span>
          </div>
          <div className="context-menu-separator" />
          <div
            className="context-menu-item"
            onClick={() => onAction("delete")}
            style={{ color: "var(--accent-danger)" }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
            <span className="shortcut-hint">Del</span>
          </div>
        </>
      ) : (
        <div className="context-menu-item" onClick={onClose}>
          <X size={14} />
          <span>Close Menu</span>
        </div>
      )}
    </div>
  );
}
