"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { buttonClassName } from "@/components/ui/Button";

const videos = [
  { id: "UIu95uh2Z7E", title: "Colombia travel, framed slowly" },
  { id: "GH-LGkEjwd4", title: "VIP 7 Days in Cartagena" },
  { id: "JYWwhnMrF7w", title: "VIP 4 Days in Cartagena" },
];

export function Film() {
  return (
    <Reveal className="home-section bg-paper">
      <div className="section-inner">
        <p className="eyebrow">From the channel</p>
        <h2 className="section-title mt-4">Recent trips</h2>
        <div className="video-grid mt-10">
          {videos.map((video) => (
            <VideoFacade key={video.id} video={video} />
          ))}
        </div>
        <a
          href="https://www.youtube.com/@alitravelframes"
          className={buttonClassName("quiet", "mt-12")}
        >
          Visit the channel
        </a>
      </div>
    </Reveal>
  );
}

function VideoFacade({ video }: { video: (typeof videos)[number] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;

  return (
    <article>
      <div className="media-frame aspect-video bg-ink">
        {isPlaying ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            className="video-facade"
            type="button"
            aria-label={`Play ${video.title}`}
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src={thumbnailUrl}
              alt={`${video.title} preview`}
              width={1280}
              height={720}
              loading="lazy"
              sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
              className="video-thumbnail h-full w-full object-cover"
            />
            <span className="video-facade-overlay" aria-hidden="true" />
            <span className="video-play-button" aria-hidden="true">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="m9 7 8 5-8 5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <h3 className="video-title mt-4">
        {video.title}
      </h3>
    </article>
  );
}
