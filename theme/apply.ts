/**
 * Theme Application Functions
 *
 * Handles applying theme variables to the DOM and persisting them.
 */

import { ThemeTokens, DEFAULT_TOKENS } from './tokens';
import { SimpleThemeConfig, generateTheme } from './utils';

const STORAGE_KEY = 'muslimhunt_theme_config';
const STORAGE_KEY_TOKENS = 'muslimhunt_theme_tokens';

/**
 * Apply CSS variables to the document root
 */
export function applyTheme(tokens: ThemeTokens): void {
  const root = document.documentElement;

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  console.log('[Theme] Applied theme variables:', Object.keys(tokens).length, 'tokens');
}

/**
 * Save theme configuration to localStorage
 */
export function saveThemeConfig(config: SimpleThemeConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    console.log('[Theme] Saved config to localStorage');
  } catch (error) {
    console.error('[Theme] Failed to save config:', error);
  }
}

/**
 * Save generated tokens to localStorage (for faster loading)
 */
export function saveThemeTokens(tokens: ThemeTokens): void {
  try {
    localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify(tokens));
    console.log('[Theme] Saved tokens to localStorage');
  } catch (error) {
    console.error('[Theme] Failed to save tokens:', error);
  }
}

/**
 * Load theme configuration from localStorage
 */
export function loadThemeConfig(): SimpleThemeConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('[Theme] Failed to load config:', error);
  }
  return null;
}

/**
 * Load theme tokens from localStorage
 */
export function loadThemeTokens(): ThemeTokens | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TOKENS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('[Theme] Failed to load tokens:', error);
  }
  return null;
}

/**
 * Initialize theme on app load
 */
export function initializeTheme(): void {
  // Try to load saved tokens first (faster)
  let tokens = loadThemeTokens();

  // If no saved tokens, generate from config or use defaults
  if (!tokens) {
    const config = loadThemeConfig();
    if (config) {
      tokens = generateTheme(config);
      saveThemeTokens(tokens);
    } else {
      tokens = DEFAULT_TOKENS;
    }
  }

  applyTheme(tokens);
}

/**
 * Update theme with new configuration
 */
export function updateTheme(config: SimpleThemeConfig): void {
  const tokens = generateTheme(config);
  applyTheme(tokens);
  saveThemeConfig(config);
  saveThemeTokens(tokens);
}

/**
 * Reset theme to defaults
 */
export function resetTheme(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_TOKENS);
    applyTheme(DEFAULT_TOKENS);
    console.log('[Theme] Reset to defaults');
  } catch (error) {
    console.error('[Theme] Failed to reset:', error);
  }
}

/**
 * Export current theme as JSON
 */
export function exportTheme(): string {
  const config = loadThemeConfig();
  const tokens = loadThemeTokens();

  const exportData = {
    config,
    tokens,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import theme from JSON
 */
export function importTheme(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (data.config) {
      saveThemeConfig(data.config);
    }

    if (data.tokens) {
      applyTheme(data.tokens);
      saveThemeTokens(data.tokens);
    }

    console.log('[Theme] Successfully imported theme');
    return true;
  } catch (error) {
    console.error('[Theme] Failed to import theme:', error);
    return false;
  }
}

/**
 * Get current theme preview (for showing in UI)
 */
export function getCurrentTheme(): {
  config: SimpleThemeConfig | null;
  tokens: ThemeTokens;
} {
  const config = loadThemeConfig();
  const tokens = loadThemeTokens() || DEFAULT_TOKENS;

  return { config, tokens };
}
