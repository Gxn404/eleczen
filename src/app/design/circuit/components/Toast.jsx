"use client";

import { useEffect, useState } from "react";

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors = {
    success: "var(--accent-success)",
    error: "var(--accent-danger)",
    warning: "var(--accent-warning)",
    info: "var(--accent-primary)",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 10000,
        animation: isExiting
          ? "slideOutRight 0.3s ease-out"
          : "slideInRight 0.3s ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 20px",
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${colors[type]}`,
          borderRadius: "8px",
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${colors[type]}33`,
          color: "var(--text-primary)",
          fontSize: "14px",
          minWidth: "300px",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: colors[type],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {icons[type]}
        </div>
        <span style={{ flex: 1 }}>{message}</span>
      </div>
    </div>
  );
}
