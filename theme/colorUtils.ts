/**
 * Color Utility Functions
 *
 * Provides functions to manipulate hex colors without external dependencies.
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (hex.length !== 6) {
    return null;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lighten a hex color by a percentage
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 + (percent / 100);

  const r = Math.min(255, rgb.r * factor);
  const g = Math.min(255, rgb.g * factor);
  const b = Math.min(255, rgb.b * factor);

  return rgbToHex(r, g, b);
}

/**
 * Darken a hex color by a percentage
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 - (percent / 100);

  const r = Math.max(0, rgb.r * factor);
  const g = Math.max(0, rgb.g * factor);
  const b = Math.max(0, rgb.b * factor);

  return rgbToHex(r, g, b);
}

/**
 * Add alpha transparency to a hex color
 */
export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Mix two hex colors
 */
export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = rgb1.r * (1 - weight) + rgb2.r * weight;
  const g = rgb1.g * (1 - weight) + rgb2.g * weight;
  const b = rgb1.b * (1 - weight) + rgb2.b * weight;

  return rgbToHex(r, g, b);
}

/**
 * Check if a color is light or dark (for determining text color)
 */
export function isLight(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5;
}

/**
 * Get contrasting text color (black or white) for a background
 */
export function getContrastText(backgroundColor: string): string {
  return isLight(backgroundColor) ? '#000000' : '#ffffff';
}

/**
 * Generate a palette from a single color
 */
export function generatePalette(baseColor: string) {
  return {
    50: lighten(baseColor, 45),
    100: lighten(baseColor, 40),
    200: lighten(baseColor, 30),
    300: lighten(baseColor, 20),
    400: lighten(baseColor, 10),
    500: baseColor,
    600: darken(baseColor, 10),
    700: darken(baseColor, 20),
    800: darken(baseColor, 30),
    900: darken(baseColor, 40),
  };
}
