"use client";

import mediumZoom, { Zoom } from "medium-zoom";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface ZoomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ZoomImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
}: ZoomImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState<Zoom>();

  const { resolvedTheme } = useTheme();
  const background = resolvedTheme === "dark" ? "#171717" : "#FAFAFA";

  useEffect(() => {
    if (!ref.current || ref.current.classList.contains("medium-zoom-image"))
      return;

    setZoom(mediumZoom(ref.current, { background }));
  }, [background]);

  useEffect(() => {
    zoom?.update({ background });
  }, [background, zoom]);

  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
