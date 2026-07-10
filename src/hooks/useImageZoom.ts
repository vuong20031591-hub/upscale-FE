// Custom hook for image zoom and pan functionality

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseImageZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export function useImageZoom(options: UseImageZoomOptions = {}) {
  const { minZoom = 1, maxZoom = 5, zoomStep = 0.5 } = options;

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom in
  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  }, [maxZoom, zoomStep]);

  // Zoom out
  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - zoomStep, minZoom);
      // Reset position if zooming back to 1x
      if (newZoom === minZoom) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, [minZoom, zoomStep]);

  // Reset zoom and position
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Handle wheel zoom - only when Ctrl key is pressed
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Only zoom when Ctrl key is pressed
      if (!e.ctrlKey) return;
      
      e.preventDefault();
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      setZoom((prev) => {
        const newZoom = Math.max(minZoom, Math.min(prev + delta, maxZoom));
        if (newZoom === minZoom) {
          setPosition({ x: 0, y: 0 });
        }
        return newZoom;
      });
    },
    [minZoom, maxZoom, zoomStep]
  );

  // Handle mouse drag start
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true);
        dragStart.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        };
      }
    },
    [zoom, position]
  );

  // Handle mouse drag move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      }
    },
    [isDragging, zoom]
  );

  // Handle mouse drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch pinch zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture detected
      e.preventDefault();
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  return {
    zoom,
    position,
    isDragging,
    containerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    handleMouseDown,
    handleTouchStart,
    canZoomIn: zoom < maxZoom,
    canZoomOut: zoom > minZoom,
  };
}
