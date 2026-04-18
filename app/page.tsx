"use client";

import { useState, useEffect } from "react";
import CameraFeed from "./components/CameraFeed";
import TimerCube from "./components/TimerCube";
import PizzaTimerGrid from "./components/PizzaTimerGrid";
import "./page.css";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="buffet-timer-container">
      {/* Top Half: Camera Feed + Appetizer Timers */}
      <div className="top-section">
        {/* Left: Camera Feed */}
        <div className="camera-section">
          <CameraFeed />
        </div>

        {/* Right: Appetizer Timers (3 fixed) */}
        <div className="appetizer-timers">
          <div className="timer-stack">
            <TimerCube id="appetizer-1" label="Appetizers 1" />
            <TimerCube id="appetizer-2" label="Appetizers 2" />
            <TimerCube id="appetizer-3" label="Appetizers 3" />
          </div>
        </div>
      </div>

      {/* Bottom Half: Pizza Timers */}
      <div className="bottom-section">
        <PizzaTimerGrid />
      </div>
    </div>
  );
}