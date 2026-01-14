/**
 * Theme Application Functions
 *
 * Handles applying theme variables to the DOM and persisting them.
 */

import { ThemeTokens, DEFAULT_TOKENS } from './tokens';
import { SimpleThemeConfig, generateTheme } from './utils';
import { supabase } from '../lib/supabase';

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

/**
 * Publish theme to database for all users
 */
export async function publishThemeToAllUsers(config: SimpleThemeConfig): Promise<boolean> {
  try {
    const tokens = generateTheme(config);

    // Save to database (upsert to 'app_settings' table with id='global_theme')
    const { error } = await supabase
      .from('app_settings')
      .upsert({
        id: 'global_theme',
        config: config,
        tokens: tokens,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('[Theme] Failed to publish theme to database:', error);

      // Show user-friendly error message
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        alert('⚠️ Database table not found!\n\nPlease run the SQL migration first:\n1. Open Supabase Dashboard\n2. Go to SQL Editor\n3. Run supabase_migration_app_settings.sql\n\nSee SETUP_STEPS.md for details.');
      }

      return false;
    }

    console.log('[Theme] Published theme to database for all users');

    // Also apply locally
    applyTheme(tokens);
    saveThemeConfig(config);
    saveThemeTokens(tokens);

    return true;
  } catch (error) {
    console.error('[Theme] Error publishing theme:', error);
    return false;
  }
}

/**
 * Load global theme from database
 */
export async function loadGlobalTheme(): Promise<{ config: SimpleThemeConfig; tokens: ThemeTokens } | null> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('config, tokens')
      .eq('id', 'global_theme')
      .single();

    if (error) {
      // If table doesn't exist or no data, silently fallback
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('[Theme] Database table not found, using localStorage fallback');
        return null;
      }
      console.warn('[Theme] Failed to load global theme:', error.message);
      return null;
    }

    if (data && data.config && data.tokens) {
      console.log('[Theme] Loaded global theme from database');
      return {
        config: data.config as SimpleThemeConfig,
        tokens: data.tokens as ThemeTokens,
      };
    }

    return null;
  } catch (error) {
    console.warn('[Theme] Error loading global theme, using fallback:', error);
    return null;
  }
}

/**
 * Initialize theme on app load (checks database first, then localStorage)
 */
export async function initializeThemeFromDatabase(): Promise<void> {
  // First, try to load from database (global theme for all users)
  const globalTheme = await loadGlobalTheme();

  if (globalTheme) {
    applyTheme(globalTheme.tokens);
    // Also save to localStorage as cache
    saveThemeConfig(globalTheme.config);
    saveThemeTokens(globalTheme.tokens);
    return;
  }

  // Fallback to localStorage or defaults
  initializeTheme();
}
