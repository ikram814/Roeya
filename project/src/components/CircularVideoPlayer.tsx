import React, { useState, useRef } from 'react';
import { RotatingOptions } from './RotatingOptions';
import { useTheme } from './ThemeProvider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const CircularVideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDarkMode } = useTheme();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative">
      {/* Central Video Container */}
      <div className="relative z-10">
        <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-lg shadow-black/30 transition-all duration-500">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            onClick={togglePlay}
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-spinning-around-the-earth-29351-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors duration-300"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={toggleMute}
              className="text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors duration-300 ml-4"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl -z-10 animate-pulse"></div>
      </div>

      {/* Rotating Options Around Video */}
      <RotatingOptions />
    </div>
  );
};

export default CircularVideoPlayer;