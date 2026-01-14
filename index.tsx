import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initializeThemeFromDatabase } from './theme/apply.ts';
import { initializeFonts } from './theme/fonts.ts';

// Initialize theme and fonts from database before React renders
initializeThemeFromDatabase();
initializeFonts();

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