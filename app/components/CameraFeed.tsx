"use client";

import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import "./CameraFeed.css";

export default function CameraFeed() {
  const [streamUrl, setStreamUrl] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Load persisted URL on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("cameraStreamUrl");
    if (savedUrl) {
      setStreamUrl(savedUrl);
      setInputValue(savedUrl);
    }
  }, []);

  // Handle video loading
  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const video = videoRef.current;
    setHasError(false);

    // Check if it's an HLS stream (.m3u8)
    if (streamUrl.toLowerCase().includes(".m3u8")) {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.attachMedia(video);

        hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setHasError(true);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS support
        video.src = streamUrl;
      }
    } else {
      // Assume MJPEG or other direct stream
      video.src = streamUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl]);

  const handleSetUrl = () => {
    if (inputValue.trim()) {
      setStreamUrl(inputValue);
      localStorage.setItem("cameraStreamUrl", inputValue);
    }
  };

  const handleClearUrl = () => {
    setStreamUrl("");
    setInputValue("");
    localStorage.removeItem("cameraStreamUrl");
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  return (
    <div className="camera-feed-container">
      {!streamUrl ? (
        <div className="camera-placeholder">
          <div className="warning-icon">⚠️</div>
          <p className="warning-text">No Camera Feed Configured</p>
          <p className="warning-subtext">Enter stream URL below</p>
        </div>
      ) : hasError ? (
        <div className="camera-error">
          <div className="error-icon">❌</div>
          <p className="error-text">Stream Connection Error</p>
          <p className="error-subtext">Check URL and try again</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="video-stream"
          autoPlay
          controls={false}
          muted
          playsInline
        />
      )}

      <div className="camera-controls">
        <input
          type="text"
          placeholder="Enter stream URL (HLS or MJPEG)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSetUrl()}
          className="stream-input"
        />
        <button onClick={handleSetUrl} className="btn-set">
          Set
        </button>
        {streamUrl && (
          <button onClick={handleClearUrl} className="btn-clear">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
