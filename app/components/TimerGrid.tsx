'use client';

import React from 'react';
import { TimerCube } from './TimerCube';

interface Timer {
  id: string;
  position: number;
  section: 'appetizer' | 'pizza';
  isRemovable: boolean;
}

interface TimerGridProps {
  timers: Timer[];
  onTimerRemove: (timerId: string) => void;
  sectionType: 'appetizer' | 'pizza';
  maxPositions: number;
}

export const TimerGrid: React.FC<TimerGridProps> = ({
  timers,
  onTimerRemove,
  sectionType,
  maxPositions,
}) => {
  const filteredTimers = timers.filter((t) => t.section === sectionType);

  const isAppetizer = sectionType === 'appetizer';
  const gridColsClass = isAppetizer ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-4 p-4 bg-gray-100 rounded-lg`}>
      {Array.from({ length: maxPositions }).map((_, index) => {
        const timer = filteredTimers.find((t) => t.position === index);

        return (
          <div key={`slot-${index}`} className="w-full aspect-square">
            {timer ? (
              <div className="w-full h-full">
                <TimerCube
                  id={timer.id}
                  isRemovable={timer.isRemovable}
                  onRemove={onTimerRemove}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-lg opacity-30 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Empty</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

