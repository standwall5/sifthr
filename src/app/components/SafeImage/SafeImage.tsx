"use client";

import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  fallbackClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackIcon: FallbackIcon = PhotoIcon,
  fallbackClassName = "",
  className = "",
  style,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!src || hasError) {
    return (
      <div
        className={`${fallbackClassName} ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--card-bg-highlight, #f0f0f0)",
          color: "var(--text-secondary, #888)",
          ...style,
        }}
        title={alt}
      >
        <FallbackIcon
          style={{
            width: "40%",
            height: "40%",
            opacity: 0.5,
          }}
        />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={className}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--card-bg-highlight, #f0f0f0)",
            ...style,
          }}
        >
          <FallbackIcon
            style={{
              width: "40%",
              height: "40%",
              opacity: 0.3,
            }}
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          display: isLoading ? "none" : "block",
        }}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}
