import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initializeThemeFromDatabase } from './theme/apply.ts';
import { initializeFonts } from './theme/fonts.ts';

/**
 * Apply menu and dropdown settings from localStorage
 */
function applyMenuSettings() {
  const navPattern = localStorage.getItem('muslimhunt_nav_pattern') || 'standard';
  const menuStyle = localStorage.getItem('muslimhunt_menu_style') || 'default';
  const menuAnimation = localStorage.getItem('muslimhunt_menu_animation') || 'none';
  const dropdownStyle = localStorage.getItem('muslimhunt_dropdown_style') || 'classic';
  const dropdownAnimation = localStorage.getItem('muslimhunt_dropdown_animation') || 'slide-down';
  const dropdownActiveColor = localStorage.getItem('muslimhunt_dropdown_active_color') || '#3B82F6';

  // Remove any existing menu and dropdown classes
  const classesToRemove: string[] = [];
  document.body.classList.forEach(className => {
    if (className.startsWith('nav-') || className.startsWith('menu-') || className.startsWith('dropdown-')) {
      classesToRemove.push(className);
    }
  });
  classesToRemove.forEach(className => document.body.classList.remove(className));

  // Apply new menu classes to body
  document.body.classList.add(`nav-${navPattern}`);
  document.body.classList.add(`menu-${menuStyle}`);
  document.body.classList.add(`menu-anim-${menuAnimation}`);

  // Apply dropdown classes to body
  document.body.classList.add(`dropdown-${dropdownStyle}`);
  document.body.classList.add(`dropdown-anim-${dropdownAnimation}`);

  // Apply dropdown active color as CSS variable
  document.documentElement.style.setProperty('--dropdown-active-color', dropdownActiveColor);

  console.log('[Menu] Applied settings:', { navPattern, menuStyle, menuAnimation, dropdownStyle, dropdownAnimation, dropdownActiveColor });
}

// Initialize theme and fonts from database before React renders
async function initializeApp() {
  await initializeThemeFromDatabase();
  await initializeFonts();
  applyMenuSettings();
}

initializeApp();

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CRITICAL: Root element not found");
  throw new Error("Could not find root element to mount to");
}

console.log("Root element found, mounting React app...");
const root = ReactDOM.createRoot(rootElement);
console.log("Root created, calling render...");
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);