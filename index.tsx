import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initializeThemeFromDatabase } from './theme/apply.ts';
import { initializeFonts } from './theme/fonts.ts';

/**
 * Apply menu settings from localStorage
 */
function applyMenuSettings() {
  const navPattern = localStorage.getItem('muslimhunt_nav_pattern') || 'standard';
  const menuStyle = localStorage.getItem('muslimhunt_menu_style') || 'default';
  const menuAnimation = localStorage.getItem('muslimhunt_menu_animation') || 'none';

  // Remove any existing menu classes
  const classesToRemove: string[] = [];
  document.body.classList.forEach(className => {
    if (className.startsWith('nav-') || className.startsWith('menu-')) {
      classesToRemove.push(className);
    }
  });
  classesToRemove.forEach(className => document.body.classList.remove(className));

  // Apply new menu classes to body
  document.body.classList.add(`nav-${navPattern}`);
  document.body.classList.add(`menu-${menuStyle}`);
  document.body.classList.add(`menu-anim-${menuAnimation}`);

  console.log('[Menu] Applied settings:', { navPattern, menuStyle, menuAnimation });
}

// Initialize theme and fonts from database before React renders
initializeThemeFromDatabase();
initializeFonts();
applyMenuSettings();

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