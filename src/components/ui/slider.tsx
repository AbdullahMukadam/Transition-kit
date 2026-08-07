"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  className?: string;
}

export function Slider({
  className,
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const trackRef = useRef<HTMLDivElement>(null);

  // Use controlled value if provided, otherwise fallback to internal state
  const actualValue = value !== undefined ? value : internalValue;

  // Calculate width/position percentage
  const percentage = Math.max(
    0,
    Math.min(100, ((actualValue - min) / (max - min)) * 100)
  );

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      let newValue = min + percent * (max - min);

      // Snap to nearest step
      newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));

      if (value === undefined) setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    },
    [min, max, step, value, onValueChange]
  );

  // --- Mouse / Touch Handlers ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    updateValue(e.clientX);
    // Captures the mouse so dragging works even if the cursor leaves the element
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      updateValue(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // --- Keyboard Accessibility ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let newValue = actualValue;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      newValue = Math.min(max, actualValue + step);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      newValue = Math.max(min, actualValue - step);
    }

    if (newValue !== actualValue) {
      e.preventDefault(); // Prevent page from scrolling
      if (value === undefined) setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-full h-5 items-center cursor-pointer touch-none select-none",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background Track */}
      <div
        ref={trackRef}
        className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden"
      >
        {/* The Range/Fill - Safe from overrides! */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-gray-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Draggable Thumb */}
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={actualValue}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full border border-gray-300 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 active:scale-110 transition-transform"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}
