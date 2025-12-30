/**
 * Design System - Border Radius Tokens
 *
 * Consistent border-radius values
 * sm: 6px, md: 8px, lg: 12px, xl: 16px
 */

export const radius = {
  none: '0',
  sm: '0.375rem', // 6px - small elements like badges
  md: '0.5rem', // 8px - buttons, inputs
  lg: '0.75rem', // 12px - cards, containers
  xl: '1rem', // 16px - modals, large cards
  '2xl': '1.5rem', // 24px - hero sections
  full: '9999px', // circular elements
} as const;

export type RadiusToken = typeof radius;
