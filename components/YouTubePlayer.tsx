"use client";

import { useState, useEffect } from "react";

export default function YouTubePlayer({ videoId }: { videoId: string }) {
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set ready when API loads
    window.onYouTubeIframeAPIReady = () => {
      setPlayerReady(true);
    };

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setPlayerReady(true);
    }

    return () => {
      // Cleanup
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  if (!videoId) {
    return (
      <div className="aspect-video bg-slate-200 flex items-center justify-center rounded-lg">
        <p className="text-slate-500">Video unavailable</p>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      {playerReady ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
          <p className="text-slate-500">Loading player...</p>
        </div>
      )}
    </div>
  );
}

// Need to add this for TypeScript to recognize the YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}
