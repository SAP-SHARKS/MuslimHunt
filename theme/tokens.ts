/**
 * Theme Token Definitions
 *
 * These are the CSS variable names that the application uses.
 * They're organized by category for easy management.
 */

export interface ThemeTokens {
  // Background colors
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-tertiary': string;
  '--bg-card': string;
  '--bg-sidebar': string;
  '--bg-hover': string;
  '--bg-active': string;

  // Text colors
  '--text-primary': string;
  '--text-secondary': string;
  '--text-tertiary': string;
  '--text-muted': string;
  '--text-inverse': string;

  // Brand/Primary colors
  '--color-primary': string;
  '--color-primary-hover': string;
  '--color-primary-light': string;
  '--color-primary-dark': string;
  '--color-primary-alpha-10': string;
  '--color-primary-alpha-20': string;

  // Accent colors
  '--color-accent': string;
  '--color-accent-hover': string;
  '--color-accent-light': string;

  // Semantic colors
  '--color-success': string;
  '--color-success-light': string;
  '--color-warning': string;
  '--color-warning-light': string;
  '--color-error': string;
  '--color-error-light': string;
  '--color-info': string;
  '--color-info-light': string;

  // Border colors
  '--border-default': string;
  '--border-light': string;
  '--border-dark': string;
  '--border-focus': string;

  // Border radius
  '--radius-sm': string;
  '--radius-md': string;
  '--radius-lg': string;
  '--radius-xl': string;
  '--radius-card': string;
  '--radius-button': string;
  '--radius-input': string;

  // Spacing (optional, for consistency)
  '--spacing-xs': string;
  '--spacing-sm': string;
  '--spacing-md': string;
  '--spacing-lg': string;
  '--spacing-xl': string;

  // Shadow
  '--shadow-sm': string;
  '--shadow-md': string;
  '--shadow-lg': string;
  '--shadow-xl': string;

  // Button colors
  '--btn-primary-bg': string;
  '--btn-primary-hover': string;
  '--btn-primary-text': string;
  '--btn-secondary-bg': string;
  '--btn-secondary-hover': string;
  '--btn-secondary-text': string;
}

export const DEFAULT_TOKENS: ThemeTokens = {
  // Backgrounds
  '--bg-primary': '#ffffff',
  '--bg-secondary': '#f9fafb',
  '--bg-tertiary': '#f3f4f6',
  '--bg-card': '#ffffff',
  '--bg-sidebar': '#1f2937',
  '--bg-hover': '#f3f4f6',
  '--bg-active': '#e5e7eb',

  // Text
  '--text-primary': '#111827',
  '--text-secondary': '#6b7280',
  '--text-tertiary': '#9ca3af',
  '--text-muted': '#d1d5db',
  '--text-inverse': '#ffffff',

  // Primary brand
  '--color-primary': '#3b82f6',
  '--color-primary-hover': '#2563eb',
  '--color-primary-light': '#dbeafe',
  '--color-primary-dark': '#1e40af',
  '--color-primary-alpha-10': 'rgba(59, 130, 246, 0.1)',
  '--color-primary-alpha-20': 'rgba(59, 130, 246, 0.2)',

  // Accent
  '--color-accent': '#8b5cf6',
  '--color-accent-hover': '#7c3aed',
  '--color-accent-light': '#ede9fe',

  // Semantic
  '--color-success': '#10b981',
  '--color-success-light': '#d1fae5',
  '--color-warning': '#f59e0b',
  '--color-warning-light': '#fef3c7',
  '--color-error': '#ef4444',
  '--color-error-light': '#fee2e2',
  '--color-info': '#3b82f6',
  '--color-info-light': '#dbeafe',

  // Borders
  '--border-default': '#e5e7eb',
  '--border-light': '#f3f4f6',
  '--border-dark': '#d1d5db',
  '--border-focus': '#3b82f6',

  // Border radius
  '--radius-sm': '0.25rem',
  '--radius-md': '0.375rem',
  '--radius-lg': '0.5rem',
  '--radius-xl': '0.75rem',
  '--radius-card': '0.5rem',
  '--radius-button': '0.375rem',
  '--radius-input': '0.375rem',

  // Spacing
  '--spacing-xs': '0.25rem',
  '--spacing-sm': '0.5rem',
  '--spacing-md': '1rem',
  '--spacing-lg': '1.5rem',
  '--spacing-xl': '2rem',

  // Shadows
  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  '--shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Buttons
  '--btn-primary-bg': '#3b82f6',
  '--btn-primary-hover': '#2563eb',
  '--btn-primary-text': '#ffffff',
  '--btn-secondary-bg': '#f3f4f6',
  '--btn-secondary-hover': '#e5e7eb',
  '--btn-secondary-text': '#111827',
};

export type TokenKey = keyof ThemeTokens;
