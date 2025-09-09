'use client';

import { useState, useRef } from 'react';

interface VideoPlayerProps {
  url: string;
  caption?: string;
}

export default function VideoPlayer({ url, caption }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // YouTube, Vimeo 등 외부 비디오 처리
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');
  
  if (isYouTube) {
    const videoId = url.includes('youtu.be') 
      ? url.split('/').pop()?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    
    return (
      <div className="my-6">
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={caption || "YouTube video"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {caption && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
            {caption}
          </p>
        )}
      </div>
    );
  }

  if (isVimeo) {
    const videoId = url.split('/').pop()?.split('?')[0];
    
    return (
      <div className="my-6">
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            title={caption || "Vimeo video"}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        {caption && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
            {caption}
          </p>
        )}
      </div>
    );
  }

  // 직접 업로드된 비디오 파일
  return (
    <div className="my-6">
      <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <video
          ref={videoRef}
          src={url}
          className="w-full h-auto"
          controls
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          브라우저가 비디오를 지원하지 않습니다.
        </video>
      </div>
      {caption && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
}