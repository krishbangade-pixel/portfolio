"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import '@videojs/react/video/skin.css';

const VideoJSPlayer = dynamic(() => import('./VideoJSPlayer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
      <div className="text-white/50 text-sm">Loading video...</div>
    </div>
  )
});

export function VideoPlayer({ src, poster, className = "" }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`w-full h-full bg-black rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-white/50 text-sm">Loading video...</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-2xl overflow-hidden ${className}`}>
      <VideoJSPlayer 
        src={src} 
        poster={poster} 
        className="w-full h-full" 
      />
    </div>
  );
}
