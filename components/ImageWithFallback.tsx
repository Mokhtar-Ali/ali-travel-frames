"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = Omit<ImageProps, "src" | "onError" | "fill"> & {
  src?: string;
  frameClassName?: string;
  fallbackLabel?: string | null;
};

export function ImageWithFallback({
  src,
  alt,
  frameClassName = "",
  fallbackLabel = "Image unavailable",
  "aria-hidden": ariaHidden,
  ...imageProps
}: ImageWithFallbackProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const usableSource = src?.trim() ? src : undefined;

  return (
    <div className={`image-with-fallback ${frameClassName}`} aria-hidden={ariaHidden}>
      {usableSource && failedSource !== usableSource ? (
        <Image
          {...imageProps}
          src={usableSource}
          alt={alt}
          onError={() => setFailedSource(usableSource)}
        />
      ) : (
        <div
          className="media-fallback"
          role="img"
          aria-label={`${alt}: image unavailable`}
        >
          {fallbackLabel ? <span>{fallbackLabel}</span> : null}
        </div>
      )}
    </div>
  );
}
