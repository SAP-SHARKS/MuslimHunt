/**
 * Font Configuration
 *
 * Comprehensive list of Google Fonts for theme customization
 */

export interface FontOption {
  name: string;
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
  googleFont: boolean;
}

export const HEADING_FONTS: FontOption[] = [
  // A-Z Alphabetical Order
  { name: 'Alegreya (serif)', family: 'Alegreya', category: 'serif', googleFont: true },
  { name: 'Alfa Slab One (display)', family: 'Alfa Slab One', category: 'display', googleFont: true },
  { name: 'Anton (display)', family: 'Anton', category: 'display', googleFont: true },
  { name: 'Archivo Black (display)', family: 'Archivo Black', category: 'display', googleFont: true },
  { name: 'Bebas Neue (display)', family: 'Bebas Neue', category: 'display', googleFont: true },
  { name: 'Bitter (serif)', family: 'Bitter', category: 'serif', googleFont: true },
  { name: 'Bungee (display)', family: 'Bungee', category: 'display', googleFont: true },
  { name: 'Cardo (serif)', family: 'Cardo', category: 'serif', googleFont: true },
  { name: 'Cormorant Garamond (serif)', family: 'Cormorant Garamond', category: 'serif', googleFont: true },
  { name: 'Crimson Text (serif)', family: 'Crimson Text', category: 'serif', googleFont: true },
  { name: 'DM Sans (sans-serif)', family: 'DM Sans', category: 'sans-serif', googleFont: true },
  { name: 'EB Garamond (serif)', family: 'EB Garamond', category: 'serif', googleFont: true },
  { name: 'Exo 2 (display)', family: 'Exo 2', category: 'display', googleFont: true },
  { name: 'Georgia (serif)', family: 'Georgia', category: 'serif', googleFont: false },
  { name: 'Inter (sans-serif)', family: 'Inter', category: 'sans-serif', googleFont: true },
  { name: 'Libre Baskerville (serif)', family: 'Libre Baskerville', category: 'serif', googleFont: true },
  { name: 'Lora (serif)', family: 'Lora', category: 'serif', googleFont: true },
  { name: 'Manrope (sans-serif)', family: 'Manrope', category: 'sans-serif', googleFont: true },
  { name: 'Merriweather (serif)', family: 'Merriweather', category: 'serif', googleFont: true },
  { name: 'Montserrat (sans-serif)', family: 'Montserrat', category: 'sans-serif', googleFont: true },
  { name: 'Noto Serif (serif)', family: 'Noto Serif', category: 'serif', googleFont: true },
  { name: 'Nunito (sans-serif)', family: 'Nunito', category: 'sans-serif', googleFont: true },
  { name: 'Open Sans (sans-serif)', family: 'Open Sans', category: 'sans-serif', googleFont: true },
  { name: 'Oswald (display)', family: 'Oswald', category: 'display', googleFont: true },
  { name: 'Outfit (sans-serif)', family: 'Outfit', category: 'sans-serif', googleFont: true },
  { name: 'Playfair Display (serif)', family: 'Playfair Display', category: 'serif', googleFont: true },
  { name: 'Plus Jakarta Sans (sans-serif)', family: 'Plus Jakarta Sans', category: 'sans-serif', googleFont: true },
  { name: 'Poppins (sans-serif)', family: 'Poppins', category: 'sans-serif', googleFont: true },
  { name: 'Raleway (sans-serif)', family: 'Raleway', category: 'sans-serif', googleFont: true },
  { name: 'Righteous (display)', family: 'Righteous', category: 'display', googleFont: true },
  { name: 'Roboto (sans-serif)', family: 'Roboto', category: 'sans-serif', googleFont: true },
  { name: 'Russo One (display)', family: 'Russo One', category: 'display', googleFont: true },
  { name: 'Sora (sans-serif)', family: 'Sora', category: 'sans-serif', googleFont: true },
  { name: 'Space Grotesk (sans-serif)', family: 'Space Grotesk', category: 'sans-serif', googleFont: true },
  { name: 'Spectral (serif)', family: 'Spectral', category: 'serif', googleFont: true },
  { name: 'Syncopate (display)', family: 'Syncopate', category: 'display', googleFont: true },
  { name: 'Vollkorn (serif)', family: 'Vollkorn', category: 'serif', googleFont: true },
  { name: 'Work Sans (sans-serif)', family: 'Work Sans', category: 'sans-serif', googleFont: true },
];

export const BODY_FONTS: FontOption[] = [
  // A-Z Alphabetical Order
  { name: 'Bitter (serif)', family: 'Bitter', category: 'serif', googleFont: true },
  { name: 'Cardo (serif)', family: 'Cardo', category: 'serif', googleFont: true },
  { name: 'Crimson Text (serif)', family: 'Crimson Text', category: 'serif', googleFont: true },
  { name: 'DM Sans (sans-serif)', family: 'DM Sans', category: 'sans-serif', googleFont: true },
  { name: 'Fira Code (monospace)', family: 'Fira Code', category: 'monospace', googleFont: true },
  { name: 'Georgia (serif)', family: 'Georgia', category: 'serif', googleFont: false },
  { name: 'IBM Plex Mono (monospace)', family: 'IBM Plex Mono', category: 'monospace', googleFont: true },
  { name: 'IBM Plex Sans (sans-serif)', family: 'IBM Plex Sans', category: 'sans-serif', googleFont: true },
  { name: 'Inter (sans-serif)', family: 'Inter', category: 'sans-serif', googleFont: true },
  { name: 'JetBrains Mono (monospace)', family: 'JetBrains Mono', category: 'monospace', googleFont: true },
  { name: 'Karla (sans-serif)', family: 'Karla', category: 'sans-serif', googleFont: true },
  { name: 'Lato (sans-serif)', family: 'Lato', category: 'sans-serif', googleFont: true },
  { name: 'Lexend (sans-serif)', family: 'Lexend', category: 'sans-serif', googleFont: true },
  { name: 'Lora (serif)', family: 'Lora', category: 'serif', googleFont: true },
  { name: 'Manrope (sans-serif)', family: 'Manrope', category: 'sans-serif', googleFont: true },
  { name: 'Merriweather (serif)', family: 'Merriweather', category: 'serif', googleFont: true },
  { name: 'Montserrat (sans-serif)', family: 'Montserrat', category: 'sans-serif', googleFont: true },
  { name: 'Noto Sans (sans-serif)', family: 'Noto Sans', category: 'sans-serif', googleFont: true },
  { name: 'Noto Serif (serif)', family: 'Noto Serif', category: 'serif', googleFont: true },
  { name: 'Nunito (sans-serif)', family: 'Nunito', category: 'sans-serif', googleFont: true },
  { name: 'Open Sans (sans-serif)', family: 'Open Sans', category: 'sans-serif', googleFont: true },
  { name: 'Outfit (sans-serif)', family: 'Outfit', category: 'sans-serif', googleFont: true },
  { name: 'Plus Jakarta Sans (sans-serif)', family: 'Plus Jakarta Sans', category: 'sans-serif', googleFont: true },
  { name: 'Poppins (sans-serif)', family: 'Poppins', category: 'sans-serif', googleFont: true },
  { name: 'PT Sans (sans-serif)', family: 'PT Sans', category: 'sans-serif', googleFont: true },
  { name: 'PT Serif (serif)', family: 'PT Serif', category: 'serif', googleFont: true },
  { name: 'Public Sans (sans-serif)', family: 'Public Sans', category: 'sans-serif', googleFont: true },
  { name: 'Raleway (sans-serif)', family: 'Raleway', category: 'sans-serif', googleFont: true },
  { name: 'Roboto (sans-serif)', family: 'Roboto', category: 'sans-serif', googleFont: true },
  { name: 'Roboto Mono (monospace)', family: 'Roboto Mono', category: 'monospace', googleFont: true },
  { name: 'Rubik (sans-serif)', family: 'Rubik', category: 'sans-serif', googleFont: true },
  { name: 'Sora (sans-serif)', family: 'Sora', category: 'sans-serif', googleFont: true },
  { name: 'Source Code Pro (monospace)', family: 'Source Code Pro', category: 'monospace', googleFont: true },
  { name: 'Source Sans Pro (sans-serif)', family: 'Source Sans Pro', category: 'sans-serif', googleFont: true },
  { name: 'Space Grotesk (sans-serif)', family: 'Space Grotesk', category: 'sans-serif', googleFont: true },
  { name: 'Space Mono (monospace)', family: 'Space Mono', category: 'monospace', googleFont: true },
  { name: 'Spectral (serif)', family: 'Spectral', category: 'serif', googleFont: true },
  { name: 'Ubuntu (sans-serif)', family: 'Ubuntu', category: 'sans-serif', googleFont: true },
  { name: 'Vollkorn (serif)', family: 'Vollkorn', category: 'serif', googleFont: true },
  { name: 'Work Sans (sans-serif)', family: 'Work Sans', category: 'sans-serif', googleFont: true },
];

/**
 * Generate Google Fonts URL for selected fonts
 */
export function generateGoogleFontsURL(headingFont: string, bodyFont: string): string {
  const fonts = new Set<string>();

  const heading = HEADING_FONTS.find(f => f.family === headingFont);
  const body = BODY_FONTS.find(f => f.family === bodyFont);

  if (heading?.googleFont) {
    fonts.add(heading.family.replace(/ /g, '+') + ':400,500,600,700,800,900');
  }

  if (body?.googleFont) {
    fonts.add(body.family.replace(/ /g, '+') + ':300,400,500,600,700');
  }

  if (fonts.size === 0) return '';

  return `https://fonts.googleapis.com/css2?${Array.from(fonts).map(f => `family=${f}`).join('&')}&display=swap`;
}

/**
 * Apply fonts globally by updating document styles
 */
export function applyFonts(headingFont: string, bodyFont: string): void {
  console.log(`[Fonts] Applying fonts - Heading: ${headingFont}, Body: ${bodyFont}`);

  // Get font categories for proper fallback
  const heading = HEADING_FONTS.find(f => f.family === headingFont);
  const body = BODY_FONTS.find(f => f.family === bodyFont);

  // Create proper CSS font family strings with fallbacks
  const headingFallback = heading?.category === 'serif' ? 'serif' :
                         heading?.category === 'monospace' ? 'monospace' : 'sans-serif';
  const bodyFallback = body?.category === 'serif' ? 'serif' :
                       body?.category === 'monospace' ? 'monospace' : 'sans-serif';

  const headingFontFamily = `'${headingFont}', ${headingFallback}`;
  const bodyFontFamily = `'${bodyFont}', ${bodyFallback}`;

  // Update CSS variables with proper format
  document.documentElement.style.setProperty('--font-heading', headingFontFamily);
  document.documentElement.style.setProperty('--font-body', bodyFontFamily);

  console.log('[Fonts] CSS Variables set:', {
    '--font-heading': headingFontFamily,
    '--font-body': bodyFontFamily
  });

  // Load Google Fonts dynamically
  const googleFontsURL = generateGoogleFontsURL(headingFont, bodyFont);

  if (googleFontsURL) {
    // Remove existing font link if any
    const existingLink = document.getElementById('google-fonts-dynamic');
    if (existingLink) {
      existingLink.remove();
    }

    // Add new font link
    const link = document.createElement('link');
    link.id = 'google-fonts-dynamic';
    link.rel = 'stylesheet';
    link.href = googleFontsURL;
    document.head.appendChild(link);

    console.log('[Fonts] ✅ Google Fonts loaded:', googleFontsURL);
  }
}

/**
 * Save font configuration to localStorage
 */
export function saveFontConfig(headingFont: string, bodyFont: string): void {
  localStorage.setItem('muslimhunt_font_heading', headingFont);
  localStorage.setItem('muslimhunt_font_body', bodyFont);
  console.log('[Fonts] Saved font config to localStorage');
}

/**
 * Load font configuration from localStorage
 */
export function loadFontConfig(): { heading: string; body: string } | null {
  const heading = localStorage.getItem('muslimhunt_font_heading');
  const body = localStorage.getItem('muslimhunt_font_body');

  if (heading && body) {
    return { heading, body };
  }

  return null;
}

/**
 * Initialize fonts on app load
 */
export function initializeFonts(): void {
  const saved = loadFontConfig();

  if (saved) {
    console.log('[Fonts] Loading saved fonts:', saved);
    applyFonts(saved.heading, saved.body);
  } else {
    console.log('[Fonts] Using default fonts');
    // Defaults are already in index.html
  }
}
