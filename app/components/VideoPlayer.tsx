'use client';

import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title = 'Appetizer Camera',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayUrl, setDisplayUrl] = useState('http://192.168.1.100:8080/video.m3u8');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayUrl(e.target.value);
  };

  const handleUpdateUrl = () => {
    if (displayUrl.trim()) {
      setIsLoading(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.src = displayUrl;
        videoRef.current.load();
      }
    }
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateUrl();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setError('Failed to load video stream. Check the camera URL.');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Load initial URL
  useEffect(() => {
    if (videoRef.current && displayUrl) {
      videoRef.current.src = displayUrl;
      videoRef.current.load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative bg-black flex items-center justify-center min-h-0">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4 mx-auto"></div>
              <p className="text-sm">Loading camera feed...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
            <div className="text-white text-center px-4">
              <p className="text-red-400 mb-2">⚠️ {error}</p>
              <p className="text-xs text-gray-300 mb-4">Make sure the camera is on the same network</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>

      {/* URL Configuration Section */}
      <div className="bg-gray-900 p-3 border-t border-gray-700">
        <div className="text-white text-xs mb-2 font-semibold">{title}</div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={displayUrl}
            onChange={handleUrlChange}
            onKeyPress={handleUrlKeyPress}
            placeholder="http://192.168.x.x:8080/video.m3u8"
            className="flex-1 px-3 py-2 text-xs bg-gray-800 text-white border border-gray-700 rounded placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleUpdateUrl}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
          >
            Update
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          💡 HLS (.m3u8) or MJPEG stream
        </p>
      </div>
    </div>
  );
};

