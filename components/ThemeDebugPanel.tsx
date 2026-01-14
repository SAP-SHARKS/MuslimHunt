/**
 * Theme Debug Panel
 *
 * Shows the current CSS variable values to help debug theme application
 */

import React, { useState, useEffect } from 'react';

export const ThemeDebugPanel: React.FC = () => {
  const [cssVars, setCssVars] = useState<Record<string, string>>({});

  const refreshVars = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const vars: Record<string, string> = {};
    const importantVars = [
      '--color-primary',
      '--color-primary-hover',
      '--color-accent',
      '--bg-primary',
      '--bg-secondary',
      '--text-primary',
      '--border-default',
    ];

    importantVars.forEach(varName => {
      const value = computedStyle.getPropertyValue(varName).trim();
      vars[varName] = value || '(not set)';
    });

    setCssVars(vars);
  };

  useEffect(() => {
    refreshVars();

    // Refresh every 2 seconds to catch changes
    const interval = setInterval(refreshVars, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-4 z-[9999] max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">🔍 CSS Variables Debug</h3>
        <button
          onClick={refreshVars}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {Object.entries(cssVars).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: value !== '(not set)' ? value : '#fff' }}
            />
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold text-gray-700">{key}</div>
              <div className="text-gray-500 truncate">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <strong>localStorage theme:</strong>
          <pre className="mt-1 p-2 bg-gray-50 rounded overflow-x-auto text-[10px]">
            {localStorage.getItem('muslimhunt_theme_config') || 'Not set'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ThemeDebugPanel;
