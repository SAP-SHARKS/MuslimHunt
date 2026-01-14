import React, { useState, useEffect } from 'react';
import { Palette, Download, Upload, RotateCcw, Eye, Save } from 'lucide-react';
import {
  SimpleThemeConfig,
  BackgroundStyle,
  Roundness,
  generateTheme,
  THEME_PRESETS,
} from '../../theme/utils';
import {
  updateTheme,
  resetTheme,
  exportTheme,
  importTheme,
  loadThemeConfig,
} from '../../theme/apply';

interface ThemeLivePreviewProps {
  primaryColor: string;
  accentColor: string;
  backgroundColor: BackgroundStyle;
  roundness: Roundness;
}

const ThemeLivePreview: React.FC<ThemeLivePreviewProps> = ({
  primaryColor,
  accentColor,
  backgroundColor,
  roundness,
}) => {
  // Generate preview tokens
  const previewTokens = generateTheme({
    primaryColor,
    accentColor,
    backgroundColor,
    roundness,
  });

  // Create inline styles from tokens for preview
  const previewStyles: React.CSSProperties = {
    backgroundColor: previewTokens['--bg-card'],
    color: previewTokens['--text-primary'],
    borderRadius: previewTokens['--radius-card'],
    border: `1px solid ${previewTokens['--border-default']}`,
  };

  const primaryButtonStyles: React.CSSProperties = {
    backgroundColor: previewTokens['--btn-primary-bg'],
    color: previewTokens['--btn-primary-text'],
    borderRadius: previewTokens['--radius-button'],
  };

  const secondaryButtonStyles: React.CSSProperties = {
    backgroundColor: previewTokens['--btn-secondary-bg'],
    color: previewTokens['--btn-secondary-text'],
    borderRadius: previewTokens['--radius-button'],
  };

  const badgeStyles: React.CSSProperties = {
    backgroundColor: previewTokens['--color-primary-light'],
    color: previewTokens['--color-primary'],
    borderRadius: previewTokens['--radius-sm'],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-4 h-4 text-gray-600" />
        <h3 className="font-semibold text-sm text-gray-700">Live Preview</h3>
      </div>

      <div style={previewStyles} className="p-6 space-y-4 shadow-md">
        <div>
          <h4 className="font-bold text-lg mb-1" style={{ color: previewTokens['--text-primary'] }}>
            Preview Card
          </h4>
          <p className="text-sm" style={{ color: previewTokens['--text-secondary'] }}>
            This is how your theme will look across the application.
          </p>
        </div>

        <div className="flex gap-2">
          <button style={primaryButtonStyles} className="px-4 py-2 font-medium text-sm transition">
            Primary Button
          </button>
          <button style={secondaryButtonStyles} className="px-4 py-2 font-medium text-sm transition">
            Secondary
          </button>
        </div>

        <div className="flex gap-2">
          <span style={badgeStyles} className="px-3 py-1 text-xs font-medium">
            Badge
          </span>
          <span
            className="px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: previewTokens['--color-success-light'],
              color: previewTokens['--color-success'],
              borderRadius: previewTokens['--radius-sm'],
            }}
          >
            Success
          </span>
          <span
            className="px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: previewTokens['--color-error-light'],
              color: previewTokens['--color-error'],
              borderRadius: previewTokens['--radius-sm'],
            }}
          >
            Error
          </span>
        </div>

        <div
          className="p-3 text-sm"
          style={{
            backgroundColor: previewTokens['--bg-secondary'],
            color: previewTokens['--text-secondary'],
            borderRadius: previewTokens['--radius-md'],
          }}
        >
          Secondary background content area
        </div>
      </div>
    </div>
  );
};

export const ThemeAdminPanel: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [backgroundColor, setBackgroundStyle] = useState<BackgroundStyle>('clean-white');
  const [roundness, setRoundness] = useState<Roundness>('rounded');
  const [isSaving, setIsSaving] = useState(false);

  // Load current theme on mount
  useEffect(() => {
    const currentConfig = loadThemeConfig();
    if (currentConfig) {
      setPrimaryColor(currentConfig.primaryColor);
      setAccentColor(currentConfig.accentColor || '#8b5cf6');
      setBackgroundStyle(currentConfig.backgroundColor);
      setRoundness(currentConfig.roundness);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    const config: SimpleThemeConfig = {
      primaryColor,
      accentColor,
      backgroundColor,
      roundness,
    };
    updateTheme(config);
    setTimeout(() => {
      setIsSaving(false);
      alert('Theme saved successfully!');
    }, 500);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default theme?')) {
      resetTheme();
      setPrimaryColor('#3b82f6');
      setAccentColor('#8b5cf6');
      setBackgroundStyle('clean-white');
      setRoundness('rounded');
    }
  };

  const handleExport = () => {
    const json = exportTheme();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muslimhunt-theme-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const success = importTheme(content);
          if (success) {
            alert('Theme imported successfully!');
            window.location.reload();
          } else {
            alert('Failed to import theme. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const applyPreset = (presetName: keyof typeof THEME_PRESETS) => {
    const preset = THEME_PRESETS[presetName];
    setPrimaryColor(preset.primaryColor);
    setAccentColor(preset.accentColor || preset.primaryColor);
    setBackgroundStyle(preset.backgroundColor);
    setRoundness(preset.roundness);
  };

  const backgroundOptions: { value: BackgroundStyle; label: string; description: string }[] = [
    { value: 'clean-white', label: 'Clean White', description: 'Pure white background' },
    { value: 'dim-gray', label: 'Dim Gray', description: 'Soft gray background' },
    { value: 'warm-beige', label: 'Warm Beige', description: 'Warm cream tones' },
    { value: 'dark-mode', label: 'Dark Mode', description: 'Dark theme' },
  ];

  const roundnessOptions: { value: Roundness; label: string; description: string }[] = [
    { value: 'sharp', label: 'Sharp', description: 'No rounded corners (0px)' },
    { value: 'rounded', label: 'Rounded', description: 'Medium rounded (8px)' },
    { value: 'full', label: 'Full Round', description: 'Fully rounded (20px+)' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Theme Settings</h1>
        </div>
        <p className="text-gray-600">Customize the look and feel of your application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Presets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Presets</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.keys(THEME_PRESETS).map((presetName) => (
                <button
                  key={presetName}
                  onClick={() => applyPreset(presetName as keyof typeof THEME_PRESETS)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition capitalize text-sm font-medium"
                >
                  {presetName}
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Colors</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-12 rounded cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-20 h-12 rounded cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Background Style */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Background Style</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {backgroundOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBackgroundStyle(option.value)}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    backgroundColor === option.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Roundness */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Border Roundness</h2>
            <div className="grid grid-cols-3 gap-3">
              {roundnessOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRoundness(option.value)}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    roundness === option.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Theme'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ThemeLivePreview
              primaryColor={primaryColor}
              accentColor={accentColor}
              backgroundColor={backgroundColor}
              roundness={roundness}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeAdminPanel;
