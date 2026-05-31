'use client';

import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

export default function PlyrPlayer({ src, poster, className = "" }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Initialize Plyr player with simplified config
      playerRef.current = new Plyr(videoRef.current, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        autoplay: false,
        clickToPlay: true,
        hideControls: false,
        resetOnEnd: false,
        tooltips: { controls: true, seek: true },
        fullscreen: { enabled: true, fallback: true },
        storage: { enabled: false }
      });

      // Add click handler for fullscreen toggle
      playerRef.current.on('click', () => {
        if (playerRef.current.fullscreen.active) {
          playerRef.current.fullscreen.exit();
        } else {
          playerRef.current.fullscreen.enter();
        }
      });

      setIsLoaded(true);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        setIsLoaded(false);
      }
    };
  }, [src]);

  return (
    <div className={`plyr-container ${className}`}>
      <video
        ref={videoRef}
        className="plyr-video"
        poster={poster}
        preload="metadata"
        crossOrigin="anonymous"
        playsInline
        style={{ width: '100%', height: '100%' }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
