/**
 * Theme Generation Utilities
 *
 * Generates complete theme configurations from simple user inputs.
 */

import { ThemeTokens } from './tokens';
import {
  lighten,
  darken,
  withAlpha,
  mixColors,
  isLight,
} from './colorUtils';

export type BackgroundStyle = 'clean-white' | 'dim-gray' | 'warm-beige' | 'dark-mode';
export type Roundness = 'sharp' | 'rounded' | 'full';

export interface SimpleThemeConfig {
  primaryColor: string;
  accentColor?: string;
  backgroundColor: BackgroundStyle;
  roundness: Roundness;
  headingFont?: string;
  bodyFont?: string;
}

/**
 * Background style presets
 */
const BACKGROUND_PRESETS: Record<BackgroundStyle, {
  primary: string;
  secondary: string;
  tertiary: string;
  card: string;
  sidebar: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  border: string;
  borderLight: string;
}> = {
  'clean-white': {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    card: '#ffffff',
    sidebar: '#1f2937',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textMuted: '#d1d5db',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
  },
  'dim-gray': {
    primary: '#f3f4f6',
    secondary: '#e5e7eb',
    tertiary: '#d1d5db',
    card: '#ffffff',
    sidebar: '#374151',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textMuted: '#d1d5db',
    border: '#d1d5db',
    borderLight: '#e5e7eb',
  },
  'warm-beige': {
    primary: '#fdfcf0',
    secondary: '#f5f3e8',
    tertiary: '#ebe8d9',
    card: '#ffffff',
    sidebar: '#4a4638',
    textPrimary: '#1a1a1a',
    textSecondary: '#6b6860',
    textTertiary: '#9c9a90',
    textMuted: '#d1cfc5',
    border: '#e0ded0',
    borderLight: '#ebe8d9',
  },
  'dark-mode': {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    tertiary: '#3a3a3a',
    card: '#2d2d2d',
    sidebar: '#1a1a1a',
    textPrimary: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    textMuted: '#6b7280',
    border: '#3a3a3a',
    borderLight: '#2d2d2d',
  },
};

/**
 * Roundness presets (in rem)
 */
const ROUNDNESS_PRESETS: Record<Roundness, {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  card: string;
  button: string;
  input: string;
}> = {
  sharp: {
    sm: '0rem',
    md: '0rem',
    lg: '0rem',
    xl: '0rem',
    card: '0rem',
    button: '0rem',
    input: '0rem',
  },
  rounded: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    card: '0.5rem',
    button: '0.375rem',
    input: '0.375rem',
  },
  full: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    card: '1rem',
    button: '9999px',
    input: '9999px',
  },
};

/**
 * Generate complete theme from simple config
 */
export function generateTheme(config: SimpleThemeConfig): ThemeTokens {
  const {
    primaryColor,
    accentColor = darken(primaryColor, 15),
    backgroundColor,
    roundness,
  } = config;

  const bgPreset = BACKGROUND_PRESETS[backgroundColor];
  const radiusPreset = ROUNDNESS_PRESETS[roundness];

  // Generate primary color variants
  const primaryHover = darken(primaryColor, 10);
  const primaryLight = lighten(primaryColor, 40);
  const primaryDark = darken(primaryColor, 20);
  const primaryAlpha10 = withAlpha(primaryColor, 0.1);
  const primaryAlpha20 = withAlpha(primaryColor, 0.2);

  // Generate accent color variants
  const accentHover = darken(accentColor, 10);
  const accentLight = lighten(accentColor, 40);

  // Determine button text color based on primary color lightness
  const btnPrimaryText = isLight(primaryColor) ? '#000000' : '#ffffff';

  return {
    // Backgrounds
    '--bg-primary': bgPreset.primary,
    '--bg-secondary': bgPreset.secondary,
    '--bg-tertiary': bgPreset.tertiary,
    '--bg-card': bgPreset.card,
    '--bg-sidebar': bgPreset.sidebar,
    '--bg-hover': mixColors(bgPreset.primary, bgPreset.tertiary, 0.3),
    '--bg-active': bgPreset.tertiary,

    // Text
    '--text-primary': bgPreset.textPrimary,
    '--text-secondary': bgPreset.textSecondary,
    '--text-tertiary': bgPreset.textTertiary,
    '--text-muted': bgPreset.textMuted,
    '--text-inverse': backgroundColor === 'dark-mode' ? '#1a1a1a' : '#ffffff',

    // Primary brand
    '--color-primary': primaryColor,
    '--color-primary-hover': primaryHover,
    '--color-primary-light': primaryLight,
    '--color-primary-dark': primaryDark,
    '--color-primary-alpha-10': primaryAlpha10,
    '--color-primary-alpha-20': primaryAlpha20,

    // Accent
    '--color-accent': accentColor,
    '--color-accent-hover': accentHover,
    '--color-accent-light': accentLight,

    // Semantic colors (consistent across themes)
    '--color-success': '#10b981',
    '--color-success-light': backgroundColor === 'dark-mode' ? darken('#10b981', 40) : '#d1fae5',
    '--color-warning': '#f59e0b',
    '--color-warning-light': backgroundColor === 'dark-mode' ? darken('#f59e0b', 40) : '#fef3c7',
    '--color-error': '#ef4444',
    '--color-error-light': backgroundColor === 'dark-mode' ? darken('#ef4444', 40) : '#fee2e2',
    '--color-info': primaryColor,
    '--color-info-light': primaryLight,

    // Borders
    '--border-default': bgPreset.border,
    '--border-light': bgPreset.borderLight,
    '--border-dark': darken(bgPreset.border, 10),
    '--border-focus': primaryColor,

    // Border radius
    '--radius-sm': radiusPreset.sm,
    '--radius-md': radiusPreset.md,
    '--radius-lg': radiusPreset.lg,
    '--radius-xl': radiusPreset.xl,
    '--radius-card': radiusPreset.card,
    '--radius-button': radiusPreset.button,
    '--radius-input': radiusPreset.input,

    // Spacing (consistent across themes)
    '--spacing-xs': '0.25rem',
    '--spacing-sm': '0.5rem',
    '--spacing-md': '1rem',
    '--spacing-lg': '1.5rem',
    '--spacing-xl': '2rem',

    // Shadows (adjusted for dark mode)
    '--shadow-sm': backgroundColor === 'dark-mode'
      ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '--shadow-md': backgroundColor === 'dark-mode'
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '--shadow-lg': backgroundColor === 'dark-mode'
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '--shadow-xl': backgroundColor === 'dark-mode'
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

    // Buttons
    '--btn-primary-bg': primaryColor,
    '--btn-primary-hover': primaryHover,
    '--btn-primary-text': btnPrimaryText,
    '--btn-secondary-bg': bgPreset.tertiary,
    '--btn-secondary-hover': mixColors(bgPreset.tertiary, bgPreset.border, 0.5),
    '--btn-secondary-text': bgPreset.textPrimary,
  };
}

/**
 * Predefined theme presets for quick selection
 */
export const THEME_PRESETS = {
  default: {
    primaryColor: '#3b82f6',
    backgroundColor: 'clean-white' as BackgroundStyle,
    roundness: 'rounded' as Roundness,
  },
  ocean: {
    primaryColor: '#0ea5e9',
    backgroundColor: 'clean-white' as BackgroundStyle,
    roundness: 'rounded' as Roundness,
  },
  forest: {
    primaryColor: '#10b981',
    backgroundColor: 'clean-white' as BackgroundStyle,
    roundness: 'rounded' as Roundness,
  },
  sunset: {
    primaryColor: '#f97316',
    backgroundColor: 'warm-beige' as BackgroundStyle,
    roundness: 'rounded' as Roundness,
  },
  purple: {
    primaryColor: '#8b5cf6',
    backgroundColor: 'clean-white' as BackgroundStyle,
    roundness: 'rounded' as Roundness,
  },
  dark: {
    primaryColor: '#3b82f6',
    backgroundColor: 'dark-mode' as BackgroundStyle,
    roundness: 'rounded' as Roundness,
  },
  minimal: {
    primaryColor: '#000000',
    backgroundColor: 'clean-white' as BackgroundStyle,
    roundness: 'sharp' as Roundness,
  },
  playful: {
    primaryColor: '#ec4899',
    backgroundColor: 'warm-beige' as BackgroundStyle,
    roundness: 'full' as Roundness,
  },
};
