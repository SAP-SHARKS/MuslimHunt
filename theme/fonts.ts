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
  // Serif Fonts (Elegant, Traditional)
  { name: 'Playfair Display', family: 'Playfair Display', category: 'serif', googleFont: true },
  { name: 'Merriweather', family: 'Merriweather', category: 'serif', googleFont: true },
  { name: 'Lora', family: 'Lora', category: 'serif', googleFont: true },
  { name: 'Crimson Text', family: 'Crimson Text', category: 'serif', googleFont: true },
  { name: 'EB Garamond', family: 'EB Garamond', category: 'serif', googleFont: true },
  { name: 'Libre Baskerville', family: 'Libre Baskerville', category: 'serif', googleFont: true },
  { name: 'Georgia', family: 'Georgia', category: 'serif', googleFont: false },
  { name: 'Noto Serif', family: 'Noto Serif', category: 'serif', googleFont: true },

  // Sans-Serif Fonts (Modern, Clean)
  { name: 'Inter', family: 'Inter', category: 'sans-serif', googleFont: true },
  { name: 'Roboto', family: 'Roboto', category: 'sans-serif', googleFont: true },
  { name: 'Poppins', family: 'Poppins', category: 'sans-serif', googleFont: true },
  { name: 'Montserrat', family: 'Montserrat', category: 'sans-serif', googleFont: true },
  { name: 'Open Sans', family: 'Open Sans', category: 'sans-serif', googleFont: true },
  { name: 'Raleway', family: 'Raleway', category: 'sans-serif', googleFont: true },
  { name: 'Nunito', family: 'Nunito', category: 'sans-serif', googleFont: true },
  { name: 'Work Sans', family: 'Work Sans', category: 'sans-serif', googleFont: true },

  // Display Fonts (Bold, Unique)
  { name: 'Bebas Neue', family: 'Bebas Neue', category: 'display', googleFont: true },
  { name: 'Righteous', family: 'Righteous', category: 'display', googleFont: true },
  { name: 'Archivo Black', family: 'Archivo Black', category: 'display', googleFont: true },
  { name: 'Oswald', family: 'Oswald', category: 'display', googleFont: true },
];

export const BODY_FONTS: FontOption[] = [
  // Sans-Serif (Primary body fonts)
  { name: 'Inter', family: 'Inter', category: 'sans-serif', googleFont: true },
  { name: 'Roboto', family: 'Roboto', category: 'sans-serif', googleFont: true },
  { name: 'Open Sans', family: 'Open Sans', category: 'sans-serif', googleFont: true },
  { name: 'Lato', family: 'Lato', category: 'sans-serif', googleFont: true },
  { name: 'Poppins', family: 'Poppins', category: 'sans-serif', googleFont: true },
  { name: 'Montserrat', family: 'Montserrat', category: 'sans-serif', googleFont: true },
  { name: 'Source Sans Pro', family: 'Source Sans Pro', category: 'sans-serif', googleFont: true },
  { name: 'Nunito', family: 'Nunito', category: 'sans-serif', googleFont: true },
  { name: 'Work Sans', family: 'Work Sans', category: 'sans-serif', googleFont: true },
  { name: 'Raleway', family: 'Raleway', category: 'sans-serif', googleFont: true },
  { name: 'Ubuntu', family: 'Ubuntu', category: 'sans-serif', googleFont: true },
  { name: 'Noto Sans', family: 'Noto Sans', category: 'sans-serif', googleFont: true },
  { name: 'PT Sans', family: 'PT Sans', category: 'sans-serif', googleFont: true },
  { name: 'Karla', family: 'Karla', category: 'sans-serif', googleFont: true },
  { name: 'Rubik', family: 'Rubik', category: 'sans-serif', googleFont: true },

  // Serif (Readable body fonts)
  { name: 'Merriweather', family: 'Merriweather', category: 'serif', googleFont: true },
  { name: 'Lora', family: 'Lora', category: 'serif', googleFont: true },
  { name: 'Georgia', family: 'Georgia', category: 'serif', googleFont: false },
  { name: 'Crimson Text', family: 'Crimson Text', category: 'serif', googleFont: true },
  { name: 'Noto Serif', family: 'Noto Serif', category: 'serif', googleFont: true },
  { name: 'PT Serif', family: 'PT Serif', category: 'serif', googleFont: true },

  // Monospace (Code/Technical)
  { name: 'JetBrains Mono', family: 'JetBrains Mono', category: 'monospace', googleFont: true },
  { name: 'Fira Code', family: 'Fira Code', category: 'monospace', googleFont: true },
  { name: 'Source Code Pro', family: 'Source Code Pro', category: 'monospace', googleFont: true },
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

  // Update CSS variables
  document.documentElement.style.setProperty('--font-heading', headingFont);
  document.documentElement.style.setProperty('--font-body', bodyFont);

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
