/**
 * Design System - Color Tokens
 *
 * Neutral palette with zinc/slate tones and single accent color (indigo)
 * Following modern, minimalist design principles
 */

export const colors = {
  // Neutral palette - zinc for backgrounds and text
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Single accent color - indigo for primary actions
  accent: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Semantic colors - minimal, muted tones
  semantic: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f4f4f5',
    inverse: '#18181b',
    // Dark mode
    dark: {
      primary: '#09090b',
      secondary: '#18181b',
      tertiary: '#27272a',
      inverse: '#fafafa',
    },
  },

  // Text colors
  text: {
    primary: '#18181b',
    secondary: '#52525b',
    tertiary: '#71717a',
    muted: '#a1a1aa',
    inverse: '#fafafa',
    // Dark mode
    dark: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
      tertiary: '#71717a',
      muted: '#52525b',
      inverse: '#18181b',
    },
  },

  // Border colors
  border: {
    default: '#e4e4e7',
    subtle: '#f4f4f5',
    strong: '#d4d4d8',
    // Dark mode
    dark: {
      default: '#27272a',
      subtle: '#18181b',
      strong: '#3f3f46',
    },
  },
} as const;

export type ColorToken = typeof colors;
