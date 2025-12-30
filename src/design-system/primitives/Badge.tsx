import React from 'react';

/**
 * Badge Component
 *
 * A minimal badge for status indicators, labels, and tags.
 * Supports semantic color variants and two sizes.
 *
 * @component
 * @example
 * // Default badge
 * <Badge>New</Badge>
 *
 * @example
 * // Success status badge
 * <Badge variant="success">Active</Badge>
 *
 * @example
 * // Warning badge
 * <Badge variant="warning">Pending</Badge>
 *
 * @example
 * // Error badge
 * <Badge variant="error">Failed</Badge>
 *
 * @example
 * // Small outline badge
 * <Badge variant="outline" size="sm">Draft</Badge>
 *
 * @example
 * // Primary accent badge
 * <Badge variant="primary">Featured</Badge>
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual style variant
   * - `default`: Neutral gray background
   * - `primary`: Accent color (indigo) background
   * - `success`: Green background for positive states
   * - `warning`: Amber background for caution states
   * - `error`: Red background for negative states
   * - `outline`: Transparent with border only
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
  /**
   * Size variant
   * - `sm`: Smaller padding and 10px font
   * - `md`: Standard padding and 12px font
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /** Badge content (text or elements) */
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  primary: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  outline:
    'bg-transparent border border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-md
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
