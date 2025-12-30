/**
 * Animation Tokens
 *
 * Consistent animation durations and easing functions
 * Respects prefers-reduced-motion for accessibility
 */

export const durations = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

export const easings = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const transitions = {
  fast: `${durations.fast}ms ${easings.default}`,
  normal: `${durations.normal}ms ${easings.default}`,
  slow: `${durations.slow}ms ${easings.default}`,
  bounce: `${durations.normal}ms ${easings.bounce}`,
} as const;

/**
 * CSS transition strings for common properties
 */
export const transitionProperties = {
  all: 'all',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
} as const;

/**
 * Keyframe animations for CSS
 */
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  slideInDown: {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
} as const;

export default {
  durations,
  easings,
  transitions,
  transitionProperties,
  keyframes,
};
