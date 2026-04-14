"use client";

import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import "./CameraFeed.css";

export default function CameraFeed() {
  const [streamUrl, setStreamUrl] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [streamType, setStreamType] = useState<"video" | "image">("video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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
    if (!streamUrl) return;

    setHasError(false);

    // Check if it's an HLS stream (.m3u8)
    if (streamUrl.toLowerCase().includes(".m3u8")) {
      setStreamType("video");
      if (!videoRef.current) return;
      
      const video = videoRef.current;
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.attachMedia(video);

        hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            setHasError(true);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      }
    } else {
      // Try as video element first (works for some MJPEG streams)
      setStreamType("video");
      if (videoRef.current) {
        const video = videoRef.current;
        video.src = streamUrl;
        video.crossOrigin = "use-credentials";
        
        video.onerror = () => {
          console.error("Video failed, trying image approach");
          // Fallback to img tag for MJPEG
          setStreamType("image");
        };
        
        video.onloadstart = () => {
          console.log("Video loading started");
        };
        
        video.oncanplay = () => {
          console.log("Video can play");
        };
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl]);

  // Handle image (MJPEG fallback) reloading
  useEffect(() => {
    if (streamType !== "image" || !streamUrl || !imgRef.current) return;

    const img = imgRef.current;
    let refreshInterval: NodeJS.Timeout;
    
    const loadImage = () => {
      // Add timestamp to bypass cache
      img.src = `${streamUrl}?t=${Date.now()}`;
    };

    loadImage();
    
    // Refresh image every 100ms for smooth motion
    refreshInterval = setInterval(loadImage, 100);

    return () => clearInterval(refreshInterval);
  }, [streamType, streamUrl]);

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
    if (imgRef.current) {
      imgRef.current.src = "";
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
      ) : streamType === "video" ? (
        <video
          ref={videoRef}
          className="video-stream"
          autoPlay
          controls={false}
          muted
          playsInline
        />
      ) : (
        <img
          ref={imgRef}
          className="video-stream"
          alt="Camera feed"
          onError={() => setHasError(true)}
        />
      )}

      <div className="camera-controls">
        <input
          type="text"
          placeholder="URL: http://user:pass@IP:port/path"
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
