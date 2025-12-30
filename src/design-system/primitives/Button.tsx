import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 *
 * A refined button with consistent styling, subtle animations (scale 0.98 on click),
 * and proper accessibility support. Follows the design system tokens for colors,
 * spacing, and typography.
 *
 * @component
 * @example
 * // Primary button (default)
 * <Button onClick={handleSubmit}>Submit</Button>
 *
 * @example
 * // Secondary button with icon
 * <Button variant="secondary" leftIcon={<Plus size={16} />}>
 *   Add Item
 * </Button>
 *
 * @example
 * // Loading state
 * <Button loading disabled>
 *   Processing...
 * </Button>
 *
 * @example
 * // Danger button for destructive actions
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete Account
 * </Button>
 *
 * @example
 * // Full width button
 * <Button fullWidth size="lg">
 *   Continue to Checkout
 * </Button>
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * - `primary`: Main CTA, accent color background (indigo-600)
   * - `secondary`: Secondary actions, neutral background
   * - `ghost`: Minimal style, transparent background
   * - `danger`: Destructive actions, red background
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /**
   * Size of the button
   * - `sm`: Height 32px, smaller padding
   * - `md`: Height 40px, standard padding
   * - `lg`: Height 48px, larger padding
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Show loading spinner and disable interactions.
   * Replaces left icon with a spinning loader.
   * @default false
   */
  loading?: boolean;
  /**
   * Make button take full width of container
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Icon element to display on the left side of the button text.
   * Hidden when `loading` is true.
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon element to display on the right side of the button text.
   * Hidden when `loading` is true.
   */
  rightIcon?: React.ReactNode;
  /** Button content (text or elements) */
  children: React.ReactNode;
}

const variantStyles = {
  primary: `
    bg-accent-600 text-white
    hover:bg-accent-700
    active:scale-[0.98]
    disabled:bg-zinc-300 disabled:text-zinc-500
    dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400
  `,
  secondary: `
    bg-zinc-100 text-zinc-900
    hover:bg-zinc-200
    active:scale-[0.98]
    dark:bg-zinc-800 dark:text-zinc-100
    dark:hover:bg-zinc-700
    disabled:bg-zinc-100 disabled:text-zinc-400
    dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500
  `,
  ghost: `
    bg-transparent text-zinc-700
    hover:bg-zinc-100
    active:scale-[0.98]
    dark:text-zinc-300
    dark:hover:bg-zinc-800
    disabled:text-zinc-400
    dark:disabled:text-zinc-500
  `,
  danger: `
    bg-red-500 text-white
    hover:bg-red-600
    active:scale-[0.98]
    disabled:bg-red-300 disabled:text-red-100
    dark:disabled:bg-red-900 dark:disabled:text-red-400
  `,
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-lg
          transition-all duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/30 focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-zinc-900
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `
          .trim()
          .replace(/\s+/g, ' ')}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}

        <span>{children}</span>

        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
