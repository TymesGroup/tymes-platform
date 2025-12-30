/**
 * Design System - Primitive Components
 *
 * Core UI building blocks with consistent styling following the Tymes design system.
 * All components use design tokens for colors, typography, spacing, and shadows.
 *
 * @module design-system/primitives
 *
 * @example
 * // Import individual components
 * import { Button, Card, Input } from '@/design-system/primitives';
 *
 * @example
 * // Import with types
 * import { Button, type ButtonProps } from '@/design-system/primitives';
 *
 * Components:
 * - Button: Primary action buttons with variants and loading states
 * - Input: Form inputs with labels, icons, and validation
 * - Card: Container cards with hover effects and sub-components
 * - Modal: Dialog overlays with backdrop blur and animations
 * - Badge: Status indicators and labels
 * - Skeleton: Loading placeholders with pulse animation
 * - Image: Lazy-loaded images with blur placeholder
 * - VirtualList/VirtualGrid: Virtualized lists for performance
 * - PageTransition/FadeIn/SlideIn: Animation components
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Card, CardHeader, CardContent, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from './Card';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonProductCard,
} from './Skeleton';
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCardProps,
  SkeletonAvatarProps,
  SkeletonProductCardProps,
} from './Skeleton';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Image } from './Image';
export type { ImageProps } from './Image';

export { VirtualList, VirtualGrid } from './VirtualList';
export type { VirtualListProps, VirtualGridProps } from './VirtualList';

export { PageTransition, FadeIn, SlideIn } from './PageTransition';
export type { PageTransitionProps, FadeInProps, SlideInProps } from './PageTransition';
