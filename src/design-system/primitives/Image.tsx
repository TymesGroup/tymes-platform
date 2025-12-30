/**
 * Image Component with Lazy Loading
 *
 * Optimized image component with built-in lazy loading using Intersection Observer,
 * blur placeholder during load, and error fallback support.
 * Improves performance by only loading images when they enter the viewport.
 *
 * @component
 * @example
 * // Basic usage
 * <Image src="/product.jpg" alt="Product photo" />
 *
 * @example
 * // With aspect ratio (prevents layout shift)
 * <Image
 *   src="/hero.jpg"
 *   alt="Hero banner"
 *   aspectRatio="16/9"
 * />
 *
 * @example
 * // Square image with contain fit
 * <Image
 *   src="/logo.png"
 *   alt="Company logo"
 *   aspectRatio="1/1"
 *   objectFit="contain"
 * />
 *
 * @example
 * // With custom fallback
 * <Image
 *   src="/user-avatar.jpg"
 *   alt="User avatar"
 *   fallback="/default-avatar.png"
 *   className="rounded-full"
 * />
 *
 * @example
 * // Without blur placeholder
 * <Image
 *   src="/thumbnail.jpg"
 *   alt="Thumbnail"
 *   blur={false}
 * />
 */

import React, { useState, useRef, useEffect } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image source URL (required) */
  src: string;
  /** Alt text for accessibility (required) */
  alt: string;
  /**
   * Aspect ratio to maintain (e.g., "16/9", "4/3", "1/1").
   * Prevents layout shift by reserving space before image loads.
   */
  aspectRatio?: string;
  /**
   * Fallback image URL displayed when the main image fails to load.
   * Defaults to a gray placeholder with "No Image" text.
   */
  fallback?: string;
  /**
   * Show animated blur placeholder while image is loading.
   * @default true
   */
  blur?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /**
   * How the image should fit within its container
   * - `cover`: Fill container, crop if needed (default)
   * - `contain`: Fit entire image, may have letterboxing
   * - `fill`: Stretch to fill (may distort)
   * - `none`: Natural size
   * @default 'cover'
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

const DEFAULT_FALLBACK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f4f4f5" width="100" height="100"/%3E%3Ctext x="50" y="50" font-family="system-ui" font-size="12" fill="%23a1a1aa" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  fallback = DEFAULT_FALLBACK,
  blur = true,
  className = '',
  objectFit = 'cover',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imageSrc = hasError ? fallback : src;
  const showBlur = blur && !isLoaded && isInView;

  const aspectRatioStyle = aspectRatio ? { aspectRatio: aspectRatio.replace('/', ' / ') } : {};

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${className}`}
      style={aspectRatioStyle}
    >
      {/* Blur placeholder */}
      {showBlur && <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />}

      {/* Actual image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit }}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

export default Image;
