import React from 'react';

/**
 * Card Component
 *
 * A refined card container with minimal borders (1px zinc-200),
 * subtle shadows, and smooth hover states (150ms transition).
 * Supports structured content with CardHeader, CardContent, and CardFooter.
 *
 * @component
 * @example
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * @example
 * // Elevated card with hover effect
 * <Card variant="elevated" hoverable>
 *   <img src="/product.jpg" alt="Product" />
 *   <h4>Product Name</h4>
 *   <p>$99.00</p>
 * </Card>
 *
 * @example
 * // Clickable card (acts as button)
 * <Card clickable onClick={handleClick}>
 *   <p>Click me to navigate</p>
 * </Card>
 *
 * @example
 * // Structured card with header, content, and footer
 * <Card padding="none">
 *   <CardHeader>
 *     <h3>Settings</h3>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Configure your preferences</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Save Changes</Button>
 *   </CardFooter>
 * </Card>
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual style variant
   * - `default`: White background with subtle border
   * - `elevated`: White background with shadow (no border)
   * - `outlined`: Transparent background with border only
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'outlined';
  /**
   * Internal padding size
   * - `none`: No padding (useful with sub-components)
   * - `sm`: 12px padding
   * - `md`: 16px padding
   * - `lg`: 24px padding
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Enable hover effect (shadow increase, border highlight).
   * Automatically enabled when `clickable` is true.
   * @default false
   */
  hoverable?: boolean;
  /**
   * Make card interactive with button role and keyboard support.
   * Adds cursor pointer and active scale effect (0.99).
   * @default false
   */
  clickable?: boolean;
  /** Card content (text, elements, or sub-components) */
  children: React.ReactNode;
}

const variantStyles = {
  default: `
    bg-white dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-800
  `,
  elevated: `
    bg-white dark:bg-zinc-900
    shadow-md
    border border-zinc-100 dark:border-zinc-800
  `,
  outlined: `
    bg-transparent
    border border-zinc-200 dark:border-zinc-700
  `,
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const hoverStyles =
      hoverable || clickable
        ? 'transition-all duration-150 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-600'
        : '';

    const clickableStyles = clickable ? 'cursor-pointer active:scale-[0.99]' : '';

    return (
      <div
        ref={ref}
        className={`
          rounded-xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hoverStyles}
          ${clickableStyles}
          ${className}
        `
          .trim()
          .replace(/\s+/g, ' ')}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 *
 * Header section for Card with bottom border separator.
 * Typically contains title and optional actions.
 *
 * @component
 * @example
 * <CardHeader>
 *   <h3 className="font-semibold">Section Title</h3>
 * </CardHeader>
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header content (typically title and actions) */
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, ...props }) => (
  <div className={`pb-4 border-b border-zinc-100 dark:border-zinc-800 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardContent Component
 *
 * Main content area for Card with vertical padding.
 * Use for the primary content of the card.
 *
 * @component
 * @example
 * <CardContent>
 *   <p>Main content goes here</p>
 * </CardContent>
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main content of the card */
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => (
  <div className={`py-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardFooter Component
 *
 * Footer section for Card with top border separator.
 * Typically contains actions like buttons.
 *
 * @component
 * @example
 * <CardFooter>
 *   <Button variant="ghost">Cancel</Button>
 *   <Button>Save</Button>
 * </CardFooter>
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer content (typically action buttons) */
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children, ...props }) => (
  <div className={`pt-4 border-t border-zinc-100 dark:border-zinc-800 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
