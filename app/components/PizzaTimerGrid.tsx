"use client";

import { useState, useEffect } from "react";
import TimerCube from "./TimerCube";
import "./PizzaTimerGrid.css";

export default function PizzaTimerGrid() {
  const [additionalTimers, setAdditionalTimers] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addTimer = () => {
    if (additionalTimers.length < 4) {
      setAdditionalTimers([
        ...additionalTimers,
        `pizza-extra-${Date.now()}`,
      ]);
    }
  };

  const removeTimer = (id: string) => {
    setAdditionalTimers(additionalTimers.filter((t) => t !== id));
  };

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

      {/* Second Row: Additional Timers (up to 4) + Add Button */}
      <div className="pizza-row-wrapper">
        <div className="pizza-row pizza-row-additional">
          {/* Empty Grid Placeholder */}
          {additionalTimers.length === 0 && (
            <>
              <div className="timer-grid-placeholder"></div>
              <div className="timer-grid-placeholder"></div>
              <div className="timer-grid-placeholder"></div>
              <div className="timer-grid-placeholder"></div>
            </>
          )}

          {/* Render Additional Timers */}
          {additionalTimers.map((id) => (
            <TimerCube
              key={id}
              id={id}
              label={`Pizza ${4 + additionalTimers.indexOf(id) + 1}`}
              removable={true}
              onRemove={() => removeTimer(id)}
            />
          ))}

          {/* Fill remaining grid spaces with placeholders */}
          {additionalTimers.length > 0 &&
            additionalTimers.length < 4 &&
            Array.from({ length: 4 - additionalTimers.length }).map(
              (_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="timer-grid-placeholder"
                ></div>
              )
            )}
        </div>

        {/* Add Timer Button */}
        {additionalTimers.length < 4 && (
          <button className="btn-add-timer" onClick={addTimer}>
            <span className="plus-icon">+</span>
          </button>
        )}
      </div>
    </div>
  );
}
