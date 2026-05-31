"use client";

import { useEffect, useRef } from 'react';
import { createPlayer } from '@videojs/react';
import { VideoSkin, Video, videoFeatures } from '@videojs/react/video';

const Player = createPlayer({ features: videoFeatures });

export default function VideoJSPlayer({ src, poster, className = "" }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current && playerRef.current.player) {
      const player = playerRef.current.player;
      
      // Wait for player to be ready
      const readyHandler = () => {
        // Add click handler for fullscreen on video area only
        const handleVideoClick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          
          if (player.isFullscreen()) {
            player.exitFullscreen();
          } else {
            player.requestFullscreen();
          }
          
          return false;
        };

        // Get the video element only (not controls)
        const videoElement = player.el().querySelector('video');
        
        if (videoElement) {
          videoElement.addEventListener('click', handleVideoClick, true);
          videoElement.style.cursor = 'pointer';
        }

        // Cleanup function
        return () => {
          if (videoElement) {
            videoElement.removeEventListener('click', handleVideoClick, true);
          }
        };
      };

      // Check if player is already ready
      if (player.readyState() > 0) {
        readyHandler();
      } else {
        player.one('ready', readyHandler);
      }

      return () => {
        player.off('ready', readyHandler);
      };
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <Player.Provider>
        <VideoSkin poster={poster} className="w-full h-full">
          <Video 
            src={src} 
            playsInline 
            ref={playerRef}
            preload="none"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
        </VideoSkin>
      </Player.Provider>
    </div>
  );
}
