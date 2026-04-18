"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "./CameraFeed.css";

type DisplayMode = "none" | "iframe" | "video" | "image";

export default function CameraFeed() {
  const [inputValue, setInputValue] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("none");
  const [hasError, setHasError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const chooseMode = function (url: string): DisplayMode {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes(".m3u8")) {
      return "video";
    }

    if (
      lowerUrl.endsWith(".jpg") ||
      lowerUrl.endsWith(".jpeg") ||
      lowerUrl.endsWith(".png") ||
      lowerUrl.includes("/mjpeg") ||
      lowerUrl.includes("multipart/x-mixed-replace")
    ) {
      return "image";
    }

    return "iframe";
  };

  useEffect(() => {
    const savedUrl = localStorage.getItem("cameraStreamUrl");

    if (!savedUrl) {
      return;
    }

    setInputValue(savedUrl);
    setDisplayUrl(savedUrl);
    setDisplayMode(chooseMode(savedUrl));
    setStatusMessage("Loaded saved URL");
  }, []);

  useEffect(() => {
    setHasError(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.load();
    }

    if (imgRef.current) {
      imgRef.current.src = "";
    }

    if (!displayUrl || displayMode !== "video") {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    setStatusMessage("Trying video mode");

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(displayUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, function (_, data) {
        console.error("HLS error:", data);
        if (data.fatal) {
          setHasError(true);
          setStatusMessage("Video stream failed");
        }
      });

      return function () {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = displayUrl;
      video.onerror = function () {
        setHasError(true);
        setStatusMessage("Native video failed");
      };
      return;
    }

    setHasError(true);
    setStatusMessage("Browser does not support this video mode");
  }, [displayUrl, displayMode]);

  useEffect(() => {
    if (!displayUrl || displayMode !== "image" || !imgRef.current) {
      return;
    }

    setStatusMessage("Trying image mode");
    imgRef.current.src = displayUrl;
  }, [displayUrl, displayMode]);

  const handleSetUrl = function () {
    const trimmed = inputValue.trim();

    console.log("Set button clicked. Input value:", trimmed);
    setStatusMessage("Set button clicked");

    if (!trimmed) {
      setStatusMessage("Input is empty");
      return;
    }

    const mode = chooseMode(trimmed);

    setHasError(false);
    setDisplayUrl(trimmed);
    setDisplayMode(mode);
    localStorage.setItem("cameraStreamUrl", trimmed);

    setStatusMessage("URL applied in " + mode + " mode");
  };

  const handleClearUrl = function () {
    console.log("Clear button clicked");

    setInputValue("");
    setDisplayUrl("");
    setDisplayMode("none");
    setHasError(false);
    setStatusMessage("Cleared");
    localStorage.removeItem("cameraStreamUrl");

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.load();
    }

    if (imgRef.current) {
      imgRef.current.src = "";
    }
  };

  return (
    <div className="camera-feed-container">
      <div style={{ marginBottom: "8px", fontSize: "14px" }}>
        Status: {statusMessage}
      </div>

      {displayMode === "none" ? (
        <div className="camera-placeholder">
          <div className="warning-icon">⚠️</div>
          <p className="warning-text">No Camera Feed Configured</p>
          <p className="warning-subtext">Enter stream or page URL below</p>
        </div>
      ) : hasError ? (
        <div className="camera-error">
          <div className="error-icon">❌</div>
          <p className="error-text">Stream Connection Error</p>
          <p className="error-subtext">Check URL and try again</p>
        </div>
      ) : displayMode === "iframe" ? (
        <iframe
          src={displayUrl}
          className="video-stream"
          style={{ width: "100%", height: "500px", border: "0" }}
          title="Camera feed"
        />
      ) : displayMode === "video" ? (
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
          onError={function () {
            setHasError(true);
            setStatusMessage("Image stream failed");
          }}
        />
      )}

      <div className="camera-controls">
        <input
          type="text"
          placeholder="URL: http://192.168.1.162:8081"
          value={inputValue}
          onChange={function (e) {
            setInputValue(e.target.value);
          }}
          onKeyDown={function (e) {
            if (e.key === "Enter") {
              handleSetUrl();
            }
          }}
          className="stream-input"
        />
        <button type="button" onClick={handleSetUrl} className="btn-set">
          Set
        </button>
        {displayMode !== "none" && (
          <button type="button" onClick={handleClearUrl} className="btn-clear">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}