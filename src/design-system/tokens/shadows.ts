/**
 * Design System - Shadow Tokens
 *
 * Subtle elevation levels only (sm, md, lg)
 * Minimal shadow usage for clean, modern aesthetic
 */

export const shadows = {
  none: 'none',

  // Subtle shadows for minimal elevation
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',

  // Default shadow for cards and elevated elements
  md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',

  // Larger shadow for modals and dropdowns
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',

  // Extra large for floating elements
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)',

  // Inner shadow for inputs
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Focus ring styles
export const focusRing = {
  default: '0 0 0 2px rgb(99 102 241 / 0.2)',
  error: '0 0 0 2px rgb(239 68 68 / 0.2)',
  success: '0 0 0 2px rgb(16 185 129 / 0.2)',
} as const;

export type ShadowToken = typeof shadows;
