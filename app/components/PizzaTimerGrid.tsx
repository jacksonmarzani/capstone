"use client";

import { useState, useEffect } from "react";
import TimerCube from "./TimerCube";
import "./PizzaTimerGrid.css";

interface Timer {
  id: string;
  position: number;
}

export default function PizzaTimerGrid() {
  const [additionalTimers, setAdditionalTimers] = useState<Timer[]>([]);
  const [mounted, setMounted] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addTimer = () => {
    if (additionalTimers.length < 4) {
      const newPosition = additionalTimers.length;
      setAdditionalTimers([
        ...additionalTimers,
        { id: `pizza-extra-${Date.now()}`, position: newPosition },
      ]);
    }
  };

  const removeTimer = (id: string) => {
    const updatedTimers = additionalTimers
      .filter((t) => t.id !== id)
      .map((t, index) => ({ ...t, position: index }));
    setAdditionalTimers(updatedTimers);
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPosition: number) => {
    if (!draggedId) return;

    const draggedTimer = additionalTimers.find((t) => t.id === draggedId);
    if (!draggedTimer) return;

    const newTimers = additionalTimers.filter((t) => t.id !== draggedId);
    newTimers.splice(targetPosition, 0, draggedTimer);

    setAdditionalTimers(
      newTimers.map((t, index) => ({ ...t, position: index }))
    );
    setDraggedId(null);
  };

  const isFullGrid = additionalTimers.length === 4;
  const gridColumns = isFullGrid ? 4 : 3;

  // Create array of items to render (timers + placeholders)
  const gridItems: (Timer | { id: string; isPlaceholder: boolean })[] = [];
  for (let i = 0; i < gridColumns; i++) {
    const timer = additionalTimers.find((t) => t.position === i);
    if (timer) {
      gridItems.push(timer);
    } else {
      gridItems.push({ id: `placeholder-${i}`, isPlaceholder: true });
    }
  }

  if (!mounted) return null;

  return (
    <div className="pizza-timer-section">
      {/* First Row: 4 Fixed Timers */}
      <div className="pizza-row pizza-row-fixed">
        <TimerCube id="pizza-1" label="Pizza 1" />
        <TimerCube id="pizza-2" label="Pizza 2" />
        <TimerCube id="pizza-3" label="Pizza 3" />
        <TimerCube id="pizza-4" label="Pizza 4" />
      </div>

      {/* Second Row: Additional Timers (3 or 4 columns) */}
      {additionalTimers.length > 0 && (
        <div className="pizza-row-wrapper">
          <div
            className={`pizza-row pizza-row-additional ${
              isFullGrid ? "full-grid" : "three-grid"
            }`}
          >
            {gridItems.map((item, index) => {
              if ("isPlaceholder" in item && item.isPlaceholder) {
                return (
                  <div
                    key={item.id}
                    className="timer-grid-placeholder"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                  />
                );
              }

              const timer = item as Timer;
              return (
                <div
                  key={timer.id}
                  draggable
                  onDragStart={() => handleDragStart(timer.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="timer-drag-wrapper"
                >
                  <TimerCube
                    id={timer.id}
                    label={`Pizza ${5 + additionalTimers.indexOf(timer)}`}
                    removable={true}
                    onRemove={() => removeTimer(timer.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty Grid Placeholder - only show when no additional timers (3 columns, centered) */}
      {additionalTimers.length === 0 && (
        <div className="pizza-row-wrapper">
          <div className="pizza-row pizza-row-additional three-grid">
            <div className="timer-grid-placeholder" />
            <div className="timer-grid-placeholder" />
            <div className="timer-grid-placeholder" />
          </div>
        </div>
      )}

      {/* Add Timer Button - Fixed Overlay */}
      {additionalTimers.length < 4 && (
        <button
          className="btn-add-timer"
          onClick={addTimer}
          disabled={additionalTimers.length >= 4}
        >
          <span className="plus-icon">+</span>
        </button>
      )}
    </div>
  );
}
