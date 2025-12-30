import React from 'react';

/**
 * Input Component
 *
 * A refined input field with integrated label, error state, hint text,
 * and icon support. Features subtle focus ring and proper accessibility
 * with aria attributes.
 *
 * @component
 * @example
 * // Basic input with label
 * <Input label="Username" placeholder="Enter your username" />
 *
 * @example
 * // Input with left icon
 * <Input
 *   label="Email"
 *   placeholder="you@example.com"
 *   leftIcon={<Mail size={18} />}
 * />
 *
 * @example
 * // Input with error state
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 *
 * @example
 * // Input with hint text
 * <Input
 *   label="Phone"
 *   hint="We'll only use this for account recovery"
 *   leftIcon={<Phone size={18} />}
 * />
 *
 * @example
 * // Search input with icons on both sides
 * <Input
 *   placeholder="Search products..."
 *   leftIcon={<Search size={18} />}
 *   rightIcon={<X size={18} onClick={clearSearch} />}
 * />
 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text displayed above the input.
   * Automatically linked via htmlFor attribute.
   */
  label?: string;
  /**
   * Error message displayed below the input.
   * When present, input border turns red and aria-invalid is set.
   */
  error?: string;
  /**
   * Hint text displayed below the input (hidden when error is present).
   * Useful for providing additional context or instructions.
   */
  hint?: string;
  /**
   * Icon element to display on the left side of the input.
   * Automatically adjusts input padding.
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon element to display on the right side of the input.
   * Can be interactive (e.g., clear button, password toggle).
   */
  rightIcon?: React.ReactNode;
  /**
   * Size variant affecting height and font size
   * - `sm`: Height 32px
   * - `md`: Height 40px
   * - `lg`: Height 48px
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Make input take full width of container
   * @default true
   */
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
};

const iconSizeStyles = {
  sm: 'pl-8',
  md: 'pl-10',
  lg: 'pl-12',
};

const rightIconSizeStyles = {
  sm: 'pr-8',
  md: 'pr-10',
  lg: 'pr-12',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = true,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full px-3 rounded-lg
              bg-white dark:bg-zinc-900
              border transition-all duration-150
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed
              dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400
              ${
                hasError
                  ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-zinc-200 dark:border-zinc-700 focus:border-accent-500 focus:ring-accent-500/20'
              }
              ${sizeStyles[size]}
              ${leftIcon ? iconSizeStyles[size] : ''}
              ${rightIcon ? rightIconSizeStyles[size] : ''}
              ${className}
            `
              .trim()
              .replace(/\s+/g, ' ')}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
