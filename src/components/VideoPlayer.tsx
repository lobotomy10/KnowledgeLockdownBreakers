import { useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import "../index.css";

interface VideoPlayerProps {
  videoUrl: string;
  startTimestamp?: number;
}

export const VideoPlayer = ({ videoUrl, startTimestamp = 0 }: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);

  const seekToTimestamp = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      seekToTimestamp(startTimestamp);
    }
  }, [startTimestamp]);

  return (
    <div className="w-full h-full">
      <ReactPlayer
        ref={playerRef} 
        url={videoUrl}
        width="100%"
        height="100%"
        playing
        controls
        onReady={() => seekToTimestamp(startTimestamp)} 
      />
    </div>
  );
};
