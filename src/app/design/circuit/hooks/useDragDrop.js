import { useCallback, useState } from "react";

export const useDragDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback((e, component, componentType) => {
    setIsDragging(true);
    setDraggedComponent({ ...component, type: componentType });

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((e, canvasRef, zoom, offset) => {
    e.preventDefault();
    setIsDragging(false);

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left - offset.x) / zoom;
    const y = (e.clientY - canvasRect.top - offset.y) / zoom;

    return { x, y, draggedComponent };
  }, []);

  return {
    isDragging,
    draggedComponent,
    dragOffset,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};

export const useZoom = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);

  const handleWheel = useCallback((e, maxZoom = 3, minZoom = 0.5) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(minZoom, Math.min(maxZoom, prev + delta)));
  }, []);

  return { zoom, setZoom, handleWheel };
};

export const usePan = (initialOffset = { x: 0, y: 0 }) => {
  const [offset, setOffset] = useState(initialOffset);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handlePanStart = useCallback((e) => {
    if (e.button !== 2 && e.button !== 1) return; // middle or right click
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handlePanMove = useCallback(
    (e) => {
      if (!isPanning) return;

      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;

      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setPanStart({ x: e.clientX, y: e.clientY });
    },
    [isPanning, panStart],
  );

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  const reset = useCallback(() => {
    setOffset(initialOffset);
  }, [initialOffset]);

  return {
    offset,
    setOffset,
    isPanning,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    reset,
  };
};
