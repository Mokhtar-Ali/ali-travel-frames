"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { buttonClassName } from "@/components/ui/Button";

const videos = [
  { id: "UIu95uh2Z7E", title: "Colombia travel, framed slowly" },
  { id: "gK0ONJORuoA", title: "Bora Bora Cartagena" },
  { id: "GH-LGkEjwd4", title: "VIP 7 Days in Cartagena" },
  { id: "JYWwhnMrF7w", title: "VIP 4 Days in Cartagena" },
];

export function Film() {
  const [heroVideo, ...supportingVideos] = videos;

  return (
    <Reveal className="home-section bg-paper">
      <div className="section-inner">
        <h2 className="section-title">From the channel</h2>
        <div className="video-main-grid mt-10">
          <VideoFacade video={heroVideo} isLarge />
          <div className="video-small-grid">
            {supportingVideos.map((video) => (
              <VideoFacade key={video.id} video={video} />
            ))}
          </div>
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

function VideoFacade({
  video,
  isLarge = false,
}: {
  video: (typeof videos)[number];
  isLarge?: boolean;
}) {
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
              sizes={isLarge ? "100vw" : "(max-width: 899px) 100vw, 33vw"}
              className="media-scale h-full w-full object-cover"
            />
            <span className="video-play-button" aria-hidden="true">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="m9 7 8 5-8 5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <h3
        className={`mt-4 font-sans text-[15px] leading-[1.6] text-ink ${
          isLarge ? "max-w-[44ch]" : ""
        }`}
      >
        {video.title}
      </h3>
    </article>
  );
}
