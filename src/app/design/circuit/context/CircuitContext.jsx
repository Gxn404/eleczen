"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { generateId } from "../lib/utils";

const CircuitContext = createContext();

export function CircuitProvider({ children }) {
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add to history for undo/redo
  const addToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      components: JSON.parse(JSON.stringify(components)),
      connections: JSON.parse(JSON.stringify(connections)),
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [components, connections, history, historyIndex]);

  // Component operations
  const addComponent = useCallback(
    (componentData) => {
      const newComponent = {
        ...componentData,
        id: generateId(),
      };
      setComponents((prev) => [...prev, newComponent]);
      addToHistory();
      return newComponent;
    },
    [addToHistory],
  );

  const updateComponent = useCallback(
    (componentId, updates) => {
      setComponents((prev) =>
        prev.map((c) => (c.id === componentId ? { ...c, ...updates } : c)),
      );
      if (selectedComponent?.id === componentId) {
        setSelectedComponent((prev) => ({ ...prev, ...updates }));
      }
      addToHistory();
    },
    [selectedComponent, addToHistory],
  );

  const deleteComponent = useCallback(
    (componentId) => {
      setComponents((prev) => prev.filter((c) => c.id !== componentId));
      setConnections((prev) =>
        prev.filter(
          (conn) =>
            conn.startComponent !== componentId &&
            conn.endComponent !== componentId,
        ),
      );
      if (selectedComponent?.id === componentId) {
        setSelectedComponent(null);
      }
      addToHistory();
    },
    [selectedComponent, addToHistory],
  );

  const deleteSelectedComponent = useCallback(() => {
    if (selectedComponent) {
      deleteComponent(selectedComponent.id);
    }
  }, [selectedComponent, deleteComponent]);

  // Connection operations
  const addConnection = useCallback(
    (connection) => {
      const newConnection = {
        ...connection,
        id: generateId(),
      };
      setConnections((prev) => [...prev, newConnection]);
      addToHistory();
      return newConnection;
    },
    [addToHistory],
  );

  const deleteConnection = useCallback(
    (connectionId) => {
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
      addToHistory();
    },
    [addToHistory],
  );

  // Selection operations
  const selectComponent = useCallback((component) => {
    setSelectedComponent(component);
  }, []);

  const deselectComponent = useCallback(() => {
    setSelectedComponent(null);
  }, []);

  // Clipboard operations
  const copyComponent = useCallback(() => {
    if (selectedComponent) {
      setClipboard(JSON.parse(JSON.stringify(selectedComponent)));
    }
  }, [selectedComponent]);

  const pasteComponent = useCallback(() => {
    if (clipboard) {
      const newComponent = {
        ...clipboard,
        id: generateId(),
        x: clipboard.x + 40,
        y: clipboard.y + 40,
      };
      setComponents((prev) => [...prev, newComponent]);
      setSelectedComponent(newComponent);
      addToHistory();
    }
  }, [clipboard, addToHistory]);

  const cutComponent = useCallback(() => {
    copyComponent();
    deleteSelectedComponent();
  }, [copyComponent, deleteSelectedComponent]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setComponents(JSON.parse(JSON.stringify(prevState.components)));
      setConnections(JSON.parse(JSON.stringify(prevState.connections)));
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setComponents(JSON.parse(JSON.stringify(nextState.components)));
      setConnections(JSON.parse(JSON.stringify(nextState.connections)));
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Clear all
  const clear = useCallback(() => {
    setComponents([]);
    setConnections([]);
    setSelectedComponent(null);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  // Export/Import
  const exportCircuit = useCallback(() => {
    return {
      components,
      connections,
      timestamp: new Date().toISOString(),
    };
  }, [components, connections]);

  const importCircuit = useCallback(
    (data) => {
      setComponents(data.components || []);
      setConnections(data.connections || []);
      setSelectedComponent(null);
      addToHistory();
    },
    [addToHistory],
  );

  const value = {
    components,
    connections,
    selectedComponent,
    history,
    historyIndex,
    // Component operations
    addComponent,
    updateComponent,
    deleteComponent,
    deleteSelectedComponent,
    selectComponent,
    deselectComponent,
    // Connection operations
    addConnection,
    deleteConnection,
    // Clipboard
    clipboard,
    copyComponent,
    pasteComponent,
    cutComponent,
    // Undo/Redo
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    // Utility
    clear,
    exportCircuit,
    importCircuit,
  };

  return (
    <CircuitContext.Provider value={value}>{children}</CircuitContext.Provider>
  );
}

export function useCircuit() {
  const context = useContext(CircuitContext);
  if (!context) {
    throw new Error("useCircuit must be used within CircuitProvider");
  }
  return context;
}
