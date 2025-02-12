import * as React from "react";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player";

export type { VideoPlayerProps };

interface VideoPlayerProps {
  videoUrl: string;
  startTimestamp: number;
}

export const VideoPlayer = ({ videoUrl, startTimestamp }: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (playerRef.current && startTimestamp > 0) {
      playerRef.current.seekTo(startTimestamp, 'seconds');
    }
  }, [startTimestamp]);

  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        playing={false}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />
    </div>
  );
};
