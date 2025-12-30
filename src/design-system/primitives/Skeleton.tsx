import React from 'react';

/**
 * Skeleton Component
 *
 * Loading placeholder with smooth pulse animation.
 * Use instead of spinners for better perceived performance.
 * Provides visual feedback during data loading states.
 *
 * @component
 * @example
 * // Text placeholder
 * <Skeleton variant="text" width="200px" />
 *
 * @example
 * // Circular avatar placeholder
 * <Skeleton variant="circular" size={40} />
 *
 * @example
 * // Rectangular image placeholder
 * <Skeleton variant="rectangular" height={200} />
 *
 * @example
 * // Rounded card placeholder
 * <Skeleton variant="rounded" width="100%" height={160} />
 *
 * @example
 * // Without animation (static)
 * <Skeleton variant="text" animation="none" />
 */

export interface SkeletonProps {
  /**
   * Shape variant
   * - `text`: Rounded rectangle for text lines (default height 16px)
   * - `circular`: Perfect circle for avatars
   * - `rectangular`: Sharp corners for images
   * - `rounded`: Rounded corners (12px radius) for cards
   * @default 'text'
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /**
   * Width of the skeleton.
   * Accepts CSS string (e.g., "100%", "200px") or number (pixels).
   */
  width?: string | number;
  /**
   * Height of the skeleton.
   * Accepts CSS string (e.g., "100%", "200px") or number (pixels).
   */
  height?: string | number;
  /**
   * Size for circular variant (sets both width and height).
   * Takes precedence over width/height when specified.
   */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /**
   * Animation type
   * - `pulse`: Opacity fade animation (default)
   * - `wave`: Shimmer effect (requires custom CSS)
   * - `none`: No animation
   * @default 'pulse'
   */
  animation?: 'pulse' | 'wave' | 'none';
}

const variantStyles = {
  text: 'rounded h-4',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  size,
  className = '',
  animation = 'pulse',
}) => {
  const animationClass =
    animation === 'pulse' ? 'animate-pulse' : animation === 'wave' ? 'animate-shimmer' : '';

  const style: React.CSSProperties = {
    width: size ? `${size}px` : typeof width === 'number' ? `${width}px` : width,
    height: size ? `${size}px` : typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`
        bg-zinc-200 dark:bg-zinc-800
        ${variantStyles[variant]}
        ${animationClass}
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
      style={style}
      aria-hidden="true"
    />
  );
};

// Pre-built skeleton patterns

/**
 * SkeletonText Component
 *
 * Pre-built skeleton pattern for text content.
 * Renders multiple lines with the last line shorter for natural appearance.
 *
 * @component
 * @example
 * // Default 3 lines
 * <SkeletonText />
 *
 * @example
 * // Custom number of lines
 * <SkeletonText lines={5} />
 */
export interface SkeletonTextProps {
  /**
   * Number of text lines to display
   * @default 3
   */
  lines?: number;
  /** Additional CSS classes */
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%'} />
    ))}
  </div>
);

/**
 * SkeletonCard Component
 *
 * Pre-built skeleton pattern for card content.
 * Includes image placeholder, title, and subtitle.
 *
 * @component
 * @example
 * <SkeletonCard />
 */
export interface SkeletonCardProps {
  /** Additional CSS classes */
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => (
  <div className={`p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 ${className}`}>
    <Skeleton variant="rounded" height={160} className="mb-4" />
    <Skeleton variant="text" width="70%" className="mb-2" />
    <Skeleton variant="text" width="40%" />
  </div>
);

/**
 * SkeletonAvatar Component
 *
 * Pre-built skeleton pattern for user avatars.
 * Renders a circular placeholder.
 *
 * @component
 * @example
 * // Default size (40px)
 * <SkeletonAvatar />
 *
 * @example
 * // Large avatar
 * <SkeletonAvatar size={64} />
 */
export interface SkeletonAvatarProps {
  /**
   * Avatar diameter in pixels
   * @default 40
   */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ size = 40, className = '' }) => (
  <Skeleton variant="circular" size={size} className={className} />
);

/**
 * SkeletonProductCard Component
 *
 * Pre-built skeleton pattern for product cards in e-commerce.
 * Includes image, category badge, title, price, and action button.
 *
 * @component
 * @example
 * // Use in product grid while loading
 * <div className="grid grid-cols-3 gap-4">
 *   <SkeletonProductCard />
 *   <SkeletonProductCard />
 *   <SkeletonProductCard />
 * </div>
 */
export interface SkeletonProductCardProps {
  /** Additional CSS classes */
  className?: string;
}

export const SkeletonProductCard: React.FC<SkeletonProductCardProps> = ({ className = '' }) => (
  <div
    className={`rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${className}`}
  >
    <Skeleton variant="rectangular" height={200} />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" width="30%" height={12} />
      <Skeleton variant="text" width="80%" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="circular" size={32} />
      </div>
    </div>
  </div>
);

export default Skeleton;
