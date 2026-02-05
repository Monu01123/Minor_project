import React, { useState, useRef } from "react";
import "./CourseContentPage.css";

const CustomVideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState("720P");

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === "0");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    videoRef.current.currentTime = (videoRef.current.duration * newProgress) / 100;
    setProgress(newProgress);
  };

  const updateProgress = () => {
    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);
  };

  const handleQualityChange = () => {
    // Placeholder function for changing video quality
    // Implement logic here to load a new video source with the selected quality
    setQuality(quality === "720P" ? "1080P" : "720P");
  };

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={videoSrc}
        onTimeUpdate={updateProgress}
        className="video-element"
      />

      {/* Custom Controls */}
      <div className="custom-controls">
        <button onClick={togglePlayPause} className="play-pause-btn">
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        
        <button onClick={toggleMute} className="volume-btn">
          {isMuted || volume === 0 ? "🔇" : "🔊"}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="progress-bar"
        />

        <button onClick={handleQualityChange} className="quality-btn">
          {quality}
        </button>

        <button onClick={toggleFullscreen} className="fullscreen-btn">
          🔲
        </button>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
