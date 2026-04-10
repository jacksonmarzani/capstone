"use client";

import { useState, useEffect, useRef } from "react";
import "./TimerCube.css";

interface TimerCubeProps {
  id: string;
  label?: string;
  onRemove?: () => void;
  removable?: boolean;
}

export default function TimerCube({
  id,
  label,
  onRemove,
  removable = false,
}: TimerCubeProps) {
  const [seconds, setSeconds] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const lastTapRef = useRef<number>(0);
  const enlargeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timer increment
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Calculate color based on time
  const getTimerColor = (totalSeconds: number) => {
    if (totalSeconds < 1200) {
      // 0-20min: green
      return "green";
    } else if (totalSeconds < 1800) {
      // 20-30min: green to yellow
      const progress = (totalSeconds - 1200) / 600;
      const greenVal = Math.floor(255 * (1 - progress));
      return `rgb(255, ${greenVal}, 0)`;
    } else if (totalSeconds < 2400) {
      // 30-40min: yellow to red
      const progress = (totalSeconds - 1800) / 600;
      const greenVal = Math.floor(255 * (1 - progress));
      return `rgb(255, ${greenVal}, 0)`;
    } else {
      // 40min+: red
      return "red";
    }
  };

  // Handle tap/double-tap
  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      // Double tap - reset
      setSeconds(0);
      setIsEnlarged(false);
      if (enlargeTimeoutRef.current) {
        clearTimeout(enlargeTimeoutRef.current);
      }
    } else {
      // Single tap - enlarge
      setIsEnlarged(true);
      if (enlargeTimeoutRef.current) {
        clearTimeout(enlargeTimeoutRef.current);
      }
      enlargeTimeoutRef.current = setTimeout(() => {
        setIsEnlarged(false);
      }, 2000);
    }

    lastTapRef.current = now;
  };

  return (
    <div
      className={`timer-cube ${isEnlarged ? "enlarged" : ""}`}
      onClick={handleTap}
      style={{
        backgroundColor: getTimerColor(seconds),
      }}
    >
      {removable && (
        <button
          className="timer-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          ✕
        </button>
      )}

      <div className="timer-content">
        {label && <div className="timer-label">{label}</div>}
        <div className="timer-display">{formatTime(seconds)}</div>
      </div>
    </div>
  );
}
