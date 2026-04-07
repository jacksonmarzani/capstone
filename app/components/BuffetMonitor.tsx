'use client';

import React, { useState, useCallback } from 'react';
import { TimerCube } from './TimerCube';
import { VideoPlayer } from './VideoPlayer';

interface Timer {
  id: string;
  position: number;
  section: 'appetizer' | 'pizza';
  isRemovable: boolean;
}

export const BuffetMonitor: React.FC = () => {
  // Initialize with 4 fixed pizza timers and 3 fixed appetizer timers
  const [timers, setTimers] = useState<Timer[]>([
    // Fixed pizza timers (bottom 4)
    { id: 'pizza-0', position: 0, section: 'pizza', isRemovable: false },
    { id: 'pizza-1', position: 1, section: 'pizza', isRemovable: false },
    { id: 'pizza-2', position: 2, section: 'pizza', isRemovable: false },
    { id: 'pizza-3', position: 3, section: 'pizza', isRemovable: false },
    // Fixed appetizer timers (top right 3)
    { id: 'app-0', position: 0, section: 'appetizer', isRemovable: false },
    { id: 'app-1', position: 1, section: 'appetizer', isRemovable: false },
    { id: 'app-2', position: 2, section: 'appetizer', isRemovable: false },
  ]);

  const pizzaTimersCount = timers.filter((t) => t.section === 'pizza').length;

  const handleAddPizzaTimer = useCallback(() => {
    if (pizzaTimersCount >= 8) return;

    const newId = `pizza-${Date.now()}`;
    const nextPosition = pizzaTimersCount;

    setTimers((prev) => [
      ...prev,
      { id: newId, position: nextPosition, section: 'pizza', isRemovable: true },
    ]);
  }, [pizzaTimersCount]);

  const handleRemoveTimer = useCallback((id: string) => {
    setTimers((prev) => {
      const filtered = prev.filter((t) => t.id !== id);

      // Re-index positions for the section that had the timer removed
      const removed = prev.find((t) => t.id === id);
      if (removed) {
        return filtered.map((t) => {
          if (t.section === removed.section && t.position > removed.position) {
            return { ...t, position: t.position - 1 };
          }
          return t;
        });
      }

      return filtered;
    });
  }, []);

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Section: Appetizers (Camera + 3 Timers) */}
      <div className="flex-1 flex gap-4 p-4 bg-gray-50 min-h-0">
        {/* Camera Feed (Left) */}
        <div className="flex-1 min-w-0">
          <VideoPlayer title="Appetizer Camera" />
        </div>

        {/* Appetizer Timers (Right) - 3 stacked vertically */}
        <div className="w-1/3 flex flex-col gap-4 min-h-0">
          {timers
            .filter((t) => t.section === 'appetizer')
            .sort((a, b) => a.position - b.position)
            .map((timer) => (
              <div key={timer.id} className="flex-1 min-h-0">
                <TimerCube
                  id={timer.id}
                  isRemovable={timer.isRemovable}
                  onRemove={handleRemoveTimer}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Bottom Section: Pizzas (Grid + Add Button) */}
      <div className="flex-1 flex flex-col gap-4 p-4 bg-white relative min-h-0">
        {/* Pizza Timers Grid */}
        <div className="flex-1 grid grid-cols-4 gap-4 auto-rows-fr min-h-0">
          {timers
            .filter((t) => t.section === 'pizza')
            .sort((a, b) => a.position - b.position)
            .map((timer) => (
              <div key={timer.id} className="min-h-0">
                <TimerCube
                  id={timer.id}
                  isRemovable={timer.isRemovable}
                  onRemove={handleRemoveTimer}
                />
              </div>
            ))}

          {/* Empty slots for pizza grid */}
          {pizzaTimersCount < 8 &&
            Array.from({ length: Math.max(0, 8 - pizzaTimersCount) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-gray-200 rounded-lg opacity-30 flex items-center justify-center"
              />
            ))}
        </div>

        {/* Add Timer Button (Bottom Right) */}
        {pizzaTimersCount < 8 && (
          <button
            onClick={handleAddPizzaTimer}
            className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg text-2xl font-bold transition-all duration-200 active:scale-95 z-50"
            aria-label="Add new pizza timer"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

