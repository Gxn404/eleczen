"use client";
import {
  BarChart3,
  Download,
  File,
  FileText,
  Menu,
  Redo2,
  Save,
  Settings,
  Trash2,
  Undo2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function SubNavbar({
  openCircuits = [],
  currentCircuitId = null,
  currentTab = "schematic",
  onCircuitSwitch,
  onCircuitClose,
  onNewCircuit,
  onTabChange,
  onNew = () => {},
  onOpen = () => {},
  onSave = () => {},
  onExport = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onDelete = () => {},
  onSettings = () => {},
  canUndo = false,
  canRedo = false,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);

  const MenuItem = ({ icon, label, onClick, shortcut, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`menu-item ${disabled ? "disabled" : ""}`}
    >
      <div className="menu-item-content">
        {icon}
        {label}
      </div>
      <div className="menu-item-shortcut">{shortcut}</div>
    </button>
  );

  const Divider = () => <div className="menu-divider" />;

  const handleCircuitContextMenu = (e, circuitId) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type: "circuit", circuitId });
  };

  const handleTabContextMenu = (e, tab) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type: "tab", tab });
  };

  const handleClickOutside = () => setContextMenu(null);

  const tabs = [
    { id: "schematic", label: "📐 Schematic", icon: FileText },
    { id: "simulation", label: "▶ Simulation", icon: Zap },
    { id: "analysis", label: "📊 Analysis", icon: BarChart3 },
  ];

  return (
    <div className="sub-navbar">
      <div className="sub-navbar-inner">
        {/* File Menu */}
        <div className="toolbar-section">
          <div className="dropdown-wrapper">
            <button
              className="toolbar-btn"
              onClick={() => setShowFileMenu(!showFileMenu)}
            >
              <File size={14} /> File
            </button>
            {showFileMenu && (
              <div
                className="dropdown-menu"
                onClick={() => setShowFileMenu(false)}
              >
                <MenuItem
                  icon={<Download size={16} />}
                  label="New"
                  onClick={onNew}
                  shortcut="Ctrl+N"
                />
                <MenuItem
                  icon={<Menu size={16} />}
                  label="Open"
                  onClick={onOpen}
                  shortcut="Ctrl+O"
                />
                <Divider />
                <MenuItem
                  icon={<Save size={16} />}
                  label="Save"
                  onClick={onSave}
                  shortcut="Ctrl+S"
                />
                <MenuItem
                  icon={<Download size={16} />}
                  label="Export"
                  onClick={onExport}
                  shortcut="Ctrl+E"
                />
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="dropdown-wrapper">
            <button
              className="toolbar-btn"
              onClick={() => setShowEditMenu(!showEditMenu)}
            >
              ✎ Edit
            </button>
            {showEditMenu && (
              <div
                className="dropdown-menu"
                onClick={() => setShowEditMenu(false)}
              >
                <MenuItem
                  icon={<Undo2 size={16} />}
                  label="Undo"
                  onClick={onUndo}
                  shortcut="Ctrl+Z"
                  disabled={!canUndo}
                />
                <MenuItem
                  icon={<Redo2 size={16} />}
                  label="Redo"
                  onClick={onRedo}
                  shortcut="Ctrl+Y"
                  disabled={!canRedo}
                />
                <Divider />
                <MenuItem
                  icon={<Trash2 size={16} />}
                  label="Delete"
                  onClick={onDelete}
                  shortcut="Del"
                />
              </div>
            )}
          </div>

          <button
            className="toolbar-btn"
            onClick={onSave}
            title="Save (Ctrl+S)"
          >
            <Save size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="vertical-divider" />

        {/* Circuit Tabs */}
        <div className="circuit-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "settings") onSettings();
                else onTabChange(tab.id);
              }}
              onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
              className={`tab-button ${currentTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            className="quick-action-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
          <div className="vertical-divider" />
          <button
            className="quick-action-btn"
            onClick={onSettings}
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            className="quick-action-btn"
            onClick={onExport}
            title="Export"
          >
            <Download size={14} />
          </button>
        </div>

        {/* File Tabs */}
        <div className="file-tabs">
          {openCircuits.map((circuit) => (
            <div
              key={circuit.id}
              onContextMenu={(e) => handleCircuitContextMenu(e, circuit.id)}
              className={`file-tab ${currentCircuitId === circuit.id ? "active" : ""}`}
              onClick={() => onCircuitSwitch(circuit.id)}
            >
              <FileText size={14} />
              <span className="file-tab-name">
                {circuit.name || "Untitled"}
              </span>
              <button
                className="file-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onCircuitClose(circuit.id);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="context-backdrop" onClick={handleClickOutside} />
          <div
            className="context-menu"
            style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          >
            {contextMenu.type === "circuit" && (
              <>
                <button
                  className="menu-item"
                  onClick={() => {
                    onCircuitSwitch(contextMenu.circuitId);
                    handleClickOutside();
                  }}
                >
                  Open
                </button>
                <button
                  className="menu-item"
                  onClick={() => {
                    onExport();
                    handleClickOutside();
                  }}
                >
                  Export
                </button>
                <Divider />
                <button
                  className="menu-item danger"
                  onClick={() => {
                    onCircuitClose(contextMenu.circuitId);
                    handleClickOutside();
                  }}
                >
                  Close
                </button>
              </>
            )}
            {contextMenu.type === "tab" && (
              <>
                <button
                  className="menu-item"
                  onClick={() => {
                    onTabChange(contextMenu.tab);
                    handleClickOutside();
                  }}
                >
                  Open in new window
                </button>
                <button
                  className="menu-item"
                  onClick={() => {
                    /* placeholder */ handleClickOutside();
                  }}
                >
                  View options
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
