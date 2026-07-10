
import { useState, useCallback, useRef, useEffect } from 'react';
import { SLIDER_DEFAULT_POSITION, SLIDER_STEP } from '@/lib/constants';

export interface UseComparisonSliderReturn {
  position: number;
  isDragging: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: () => void;
  handleTouchStart: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export function useComparisonSlider(): UseComparisonSliderReturn {
  const [position, setPosition] = useState<number>(SLIDER_DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate position from pointer event
  const calculatePosition = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return position;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;

      // Clamp between 0 and 100
      return Math.max(0, Math.min(100, percentage));
    },
    [position]
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;
      const newPosition = calculatePosition(event.clientX);
      setPosition(newPosition);
    },
    [isDragging, calculatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isDragging) return;
      const touch = event.touches[0];
      const newPosition = calculatePosition(touch.clientX);
      setPosition(newPosition);
    },
    [isDragging, calculatePosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard navigation (NF-AC-007)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setPosition((prev) => Math.max(0, prev - SLIDER_STEP));
          break;
        case 'ArrowRight':
          event.preventDefault();
          setPosition((prev) => Math.min(100, prev + SLIDER_STEP));
          break;
        case 'Home':
          event.preventDefault();
          setPosition(0);
          break;
        case 'End':
          event.preventDefault();
          setPosition(100);
          break;
      }
    },
    []
  );

  // Add/remove global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
  };
}
