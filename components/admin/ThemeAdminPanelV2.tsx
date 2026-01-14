import React, { useState, useEffect } from 'react';
import { ChevronRight, Download, Upload, RotateCcw } from 'lucide-react';
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

type ViewMode = 'simple' | 'advanced';

// Preset theme data matching actual presets
const presetThemes = [
  { id: 'default', name: 'Default', colors: ['#10B981', '#10B981', '#F59E0B'], isDark: false },
  { id: 'forest', name: 'Forest Dark', colors: ['#10B981', '#10B981', '#F59E0B'], isDark: true },
  { id: 'ocean', name: 'Ocean Teal', colors: ['#0EA5E9', '#0EA5E9', '#F59E0B'], isDark: false },
  { id: 'sunset', name: 'Royal Gold', colors: ['#F97316', '#F97316', '#8B5CF6'], isDark: false },
  { id: 'purple', name: 'Violet', colors: ['#8B5CF6', '#8B5CF6', '#10B981'], isDark: false },
  { id: 'playful', name: 'Rose Garden', colors: ['#EC4899', '#EC4899', '#8B5CF6'], isDark: false },
  { id: 'dark', name: 'Midnight Blue', colors: ['#3B82F6', '#3B82F6', '#F59E0B'], isDark: true },
  { id: 'minimal', name: 'Sage Green', colors: ['#10B981', '#10B981', '#DC2626'], isDark: false },
];

export const ThemeAdminPanelV2: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('simple');
  const [selectedPreset, setSelectedPreset] = useState('default');

  // Current theme values
  const [primaryColor, setPrimaryColor] = useState('#10B981');
  const [accentColor, setAccentColor] = useState('#F59E0B');
  const [backgroundColor, setBackgroundStyle] = useState<BackgroundStyle>('clean-white');

  // Load current theme on mount
  useEffect(() => {
    const currentConfig = loadThemeConfig();
    if (currentConfig) {
      setPrimaryColor(currentConfig.primaryColor);
      setAccentColor(currentConfig.accentColor || '#F59E0B');
      setBackgroundStyle(currentConfig.backgroundColor);
    }
  }, []);

  // Apply preset theme instantly
  const handleApplyPreset = (presetId: keyof typeof THEME_PRESETS) => {
    setSelectedPreset(presetId);
    const preset = THEME_PRESETS[presetId];

    // Update state
    setPrimaryColor(preset.primaryColor);
    setAccentColor(preset.accentColor || preset.primaryColor);
    setBackgroundStyle(preset.backgroundColor);
  };

  // Apply theme (save to localStorage)
  const handleApplyTheme = () => {
    const config: SimpleThemeConfig = {
      primaryColor,
      accentColor,
      backgroundColor,
      roundness: 'rounded',
    };
    updateTheme(config);
    alert('✅ Theme applied successfully! Reload the page to see changes across the entire app.');
  };

  // Publish to all users (in production would save to DB)
  const handlePublishToAll = () => {
    if (confirm('🚀 Publish this theme for all users?')) {
      const config: SimpleThemeConfig = {
        primaryColor,
        accentColor,
        backgroundColor,
        roundness: 'rounded',
      };
      updateTheme(config);
      alert('✅ Theme published! In production, this would update the database.');
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('🔄 Reset to default theme?')) {
      resetTheme();
      setPrimaryColor('#10B981');
      setAccentColor('#F59E0B');
      setBackgroundStyle('clean-white');
      setSelectedPreset('default');
      alert('✅ Reset to default theme!');
    }
  };

  // Export theme as JSON
  const handleExport = () => {
    const json = exportTheme();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muslimhunt-theme-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Theme exported as JSON!');
  };

  // Import theme from JSON
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
          if (importTheme(content)) {
            alert('✅ Theme imported! Reloading...');
            setTimeout(() => window.location.reload(), 500);
          } else {
            alert('❌ Failed to import theme. Check file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Color options for custom theme builder
  const primaryColorOptions = [
    { name: 'Mint', color: '#10B981' },
    { name: 'Ocean', color: '#0EA5E9' },
    { name: 'Violet', color: '#8B5CF6' },
    { name: 'Amber', color: '#F59E0B' },
    { name: 'Rose', color: '#EC4899' },
    { name: 'Slate', color: '#64748B' },
  ];

  const accentColorOptions = [
    { name: 'Gold', color: '#F59E0B' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Ruby', color: '#DC2626' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'None', color: primaryColor },
  ];

  const backgroundOptions = [
    { name: 'Pure White', value: 'clean-white' as BackgroundStyle, color: '#FFFFFF' },
    { name: 'Warm Cream', value: 'warm-beige' as BackgroundStyle, color: '#FAF8F3' },
    { name: 'Cool Gray', value: 'dim-gray' as BackgroundStyle, color: '#F3F4F6' },
    { name: 'Dark Mode', value: 'dark-mode' as BackgroundStyle, color: '#1F2937' },
    { name: 'True Black', value: 'dark-mode' as BackgroundStyle, color: '#000000' },
  ];

  // Determine background color for preview
  const getPreviewBgColor = () => {
    switch (backgroundColor) {
      case 'clean-white':
        return '#FFFFFF';
      case 'warm-beige':
        return '#FAF8F3';
      case 'dim-gray':
        return '#F3F4F6';
      case 'dark-mode':
        return '#1F2937';
      default:
        return '#FFFFFF';
    }
  };

  const isDarkMode = backgroundColor === 'dark-mode';
  const previewTextColor = isDarkMode ? '#F9FAFB' : '#111827';
  const previewSecondaryText = isDarkMode ? '#D1D5DB' : '#6B7280';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Customize the look and feel of your app</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('simple')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === 'simple'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✨ Simple
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === 'advanced'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚙️ Advanced
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {mode === 'simple' ? (
              <>
                {/* Quick Themes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Themes</h2>
                  <p className="text-sm text-gray-600 mb-6">Click any theme to instantly apply it.</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {presetThemes.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset.id as keyof typeof THEME_PRESETS)}
                        className={`relative rounded-lg border-2 transition-all hover:shadow-lg ${
                          selectedPreset === preset.id
                            ? 'border-emerald-500 ring-2 ring-emerald-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* DEFAULT Badge */}
                        {selectedPreset === preset.id && (
                          <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md z-10">
                            DEFAULT
                          </div>
                        )}

                        {/* Theme Preview Box */}
                        <div className={`p-4 rounded-t-lg ${preset.isDark ? 'bg-gray-800' : 'bg-white'}`}>
                          <div className="flex gap-1.5 mb-3">
                            {preset.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-5 h-5 rounded-full shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded w-3/4 mb-1.5" />
                          <div className="h-1.5 bg-gray-200 rounded w-1/2" />
                        </div>

                        {/* Theme Name */}
                        <div className="py-2 px-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
                          <div className="text-xs font-semibold text-gray-900 text-center">
                            {preset.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Build Custom Theme */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Build Custom Theme</h2>
                  <p className="text-sm text-gray-600 mb-6">Or customize your own theme below.</p>

                  {/* Primary Color */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <h3 className="font-semibold text-gray-900">Primary Color</h3>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {primaryColorOptions.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => setPrimaryColor(option.color)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                            primaryColor === option.color
                              ? 'border-gray-900 bg-gray-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="w-12 h-12 rounded-full shadow-md"
                            style={{ backgroundColor: option.color }}
                          />
                          <span className="text-xs font-medium text-gray-700">{option.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Style */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <h3 className="font-semibold text-gray-900">Background Style</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {backgroundOptions.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => setBackgroundStyle(option.value)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                            backgroundColor === option.value
                              ? 'border-gray-900 bg-gray-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="w-full h-16 rounded shadow-md border border-gray-200"
                            style={{ backgroundColor: option.color }}
                          />
                          <span className="text-xs font-medium text-gray-700 text-center">
                            {option.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <h3 className="font-semibold text-gray-900">Accent Color</h3>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {accentColorOptions.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => setAccentColor(option.color)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                            accentColor === option.color
                              ? 'border-gray-900 bg-gray-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="w-12 h-12 rounded-full shadow-md"
                            style={{ backgroundColor: option.color }}
                          />
                          <span className="text-xs font-medium text-gray-700">{option.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Advanced Mode */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customize Colors</h2>

                {/* Expandable Sections */}
                {['Brand Colors', 'Backgrounds', 'Sidebar Icons', 'Text Colors', 'Buttons', 'Navigation', 'Status Colors'].map((section) => (
                  <button
                    key={section}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg mb-2 border border-gray-100"
                  >
                    <span className="font-medium text-gray-900">{section}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Advanced mode:</strong> Click any section above to customize individual color tokens. Coming soon!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview - Right Sidebar (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-700 text-sm mb-4">Live Preview</h3>

                {/* App Preview Container */}
                <div
                  className="rounded-lg p-4 border-2 border-gray-200"
                  style={{ backgroundColor: getPreviewBgColor() }}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      M
                    </div>
                    <span className="font-bold" style={{ color: previewTextColor }}>
                      Muslim Hunt
                    </span>
                  </div>

                  {/* Sample Card */}
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Sample Card</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      This is how cards will look with this theme.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2 mb-3">
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shadow-sm hover:opacity-90 transition"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Primary
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                        Secondary
                      </button>
                    </div>

                    {/* Sample Input */}
                    <input
                      type="text"
                      placeholder="Sample input..."
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs mb-3 focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': primaryColor } as any}
                    />

                    {/* Status Badges */}
                    <div className="flex gap-2">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Active
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        Inactive
                      </span>
                    </div>
                  </div>

                  {/* Semantic Colors */}
                  <div className="flex gap-3 text-xs font-medium">
                    <span className="text-green-600">Success</span>
                    <span className="text-yellow-600">Warning</span>
                    <span className="text-red-600">Error</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleApplyTheme}
                    className="w-full py-2.5 rounded-lg text-white font-medium transition hover:opacity-90 shadow-sm text-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Apply Theme
                  </button>

                  <button
                    onClick={handlePublishToAll}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition shadow-sm text-sm flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Publish to All Users
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </button>
                  </div>

                  <button
                    onClick={handleImport}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    Import Theme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeAdminPanelV2;
