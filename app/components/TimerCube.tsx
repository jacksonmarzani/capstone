'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TimerCubeProps {
  id: string;
  initialTime?: number;
  isRemovable?: boolean;
  onRemove?: (id: string) => void;
  isDragging?: boolean;
}

export const TimerCube: React.FC<TimerCubeProps> = ({
  id,
  initialTime = 0,
  isRemovable = false,
  onRemove,
  isDragging = false,
}) => {
  const [seconds, setSeconds] = useState(initialTime);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  // Timer interval effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate color based on time
  const getBackgroundColor = (): string => {
    if (seconds < 1200) {
      // 0-20 minutes: Green
      return 'rgb(34, 197, 94)'; // green-500
    } else if (seconds < 1800) {
      // 20-30 minutes: Green to Yellow transition
      const progress = (seconds - 1200) / 600; // 0 to 1
      const r = Math.round(34 + (234 - 34) * progress);
      const g = Math.round(197 + (179 - 197) * progress);
      const b = Math.round(94 + (51 - 94) * progress);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (seconds < 2400) {
      // 30-40 minutes: Yellow to Red transition
      const progress = (seconds - 1800) / 600; // 0 to 1
      const r = Math.round(234 + (239 - 234) * progress);
      const g = Math.round(179 + (68 - 179) * progress);
      const b = Math.round(51 + (68 - 51) * progress);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // 40+ minutes: Red
      return 'rgb(239, 68, 68)'; // red-500
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      // Double tap detected
      tapCountRef.current++;
      if (tapCountRef.current === 2) {
        handleDoubleTap();
        tapCountRef.current = 0;
      }
    } else {
      // Single tap
      tapCountRef.current = 1;
      handleSingleTap();
    }

    lastTapRef.current = now;

    // Clear pending timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // Set new timeout to reset tap count
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 300);
  };

  const handleSingleTap = () => {
    setIsEnlarged(true);
    setTimeout(() => setIsEnlarged(false), 300);
  };

  const handleDoubleTap = () => {
    setSeconds(0);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <div
      onClick={handleTap}
      onTouchEnd={handleTap}
      className={`
        relative rounded-lg shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center
        ${isEnlarged ? 'scale-110' : 'scale-100'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      style={{
        backgroundColor: getBackgroundColor(),
        aspectRatio: '1',
        minHeight: '100px',
      }}
    >
      {/* Time Display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-white select-none drop-shadow-lg">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Remove Button (only for removable timers) */}
      {isRemovable && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full w-6 h-6 flex items-center justify-center transition-all"
          aria-label="Remove timer"
        >
          ✕
        </button>
      )}

      {/* Info Text */}
      <div className="absolute bottom-2 text-xs text-white text-opacity-70 font-medium">
        {isRemovable ? 'Tap twice to reset' : 'Tap to enlarge, double tap to reset'}
      </div>
    </div>
  );
};
