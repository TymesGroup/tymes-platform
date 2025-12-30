/**
 * Design System - Token Exports
 *
 * Central export for all design tokens
 */

export { colors } from './colors';
export type { ColorToken } from './colors';

export { typography } from './typography';
export type { TypographyToken } from './typography';

export { spacing, sectionSpacing, containerWidth } from './spacing';
export type { SpacingToken } from './spacing';

export { shadows, focusRing } from './shadows';
export type { ShadowToken } from './shadows';

export { radius } from './radius';
export type { RadiusToken } from './radius';

// Animation tokens
export {
  durations as animationDurations,
  easings as animationEasings,
  transitions as animationTransitions,
  keyframes as animationKeyframes,
} from './animations';

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;
