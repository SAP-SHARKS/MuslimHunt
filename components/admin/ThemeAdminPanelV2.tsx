import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Download, Upload, RotateCcw } from 'lucide-react';
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
  publishThemeToAllUsers,
} from '../../theme/apply';
import { HEADING_FONTS, BODY_FONTS, applyFonts, saveFontConfig } from '../../theme/fonts';
import { MigrationModal } from './MigrationModal';

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

// Advanced mode sections
const advancedSections = [
  { id: 'brand', name: 'Brand Colors', description: 'Primary, secondary, and accent colors' },
  { id: 'backgrounds', name: 'Backgrounds', description: 'Background colors for different surfaces' },
  { id: 'fonts', name: 'Typography', description: 'Font families and text styles' },
  { id: 'sidebar', name: 'Sidebar Icons', description: 'Icon colors and hover states' },
  { id: 'text', name: 'Text Colors', description: 'Primary, secondary, and muted text' },
  { id: 'buttons', name: 'Buttons', description: 'Button styles and hover states' },
  { id: 'navigation', name: 'Navigation', description: 'Navigation bar and menu colors' },
  { id: 'status', name: 'Status Colors', description: 'Success, warning, error indicators' },
];

export const ThemeAdminPanelV2: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('simple');
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Current theme values
  const [primaryColor, setPrimaryColor] = useState('#10B981');
  const [accentColor, setAccentColor] = useState('#F59E0B');
  const [backgroundColor, setBackgroundStyle] = useState<BackgroundStyle>('clean-white');

  // Font state
  const [headingFont, setHeadingFont] = useState('Playfair Display');
  const [bodyFont, setBodyFont] = useState('Inter');

  // Additional customization state
  const [buttonStyle, setButtonStyle] = useState<'filled' | 'soft' | 'outline'>('filled');
  const [roundness, setRoundness] = useState<'sharp' | 'rounded' | 'pill'>('rounded');
  const [bannerStyle, setBannerStyle] = useState<'dark' | 'primary' | 'light'>('primary');

  // Advanced color states
  const [secondaryColor, setSecondaryColor] = useState('#10B981');
  const [sidebarIconColor, setSidebarIconColor] = useState(primaryColor);
  const [sidebarIconHoverColor, setSidebarIconHoverColor] = useState(primaryColor);
  const [textPrimaryColor, setTextPrimaryColor] = useState('#111827');
  const [textSecondaryColor, setTextSecondaryColor] = useState('#6B7280');
  const [textMutedColor, setTextMutedColor] = useState('#9CA3AF');
  const [buttonBgColor, setButtonBgColor] = useState(primaryColor);
  const [buttonHoverColor, setButtonHoverColor] = useState(primaryColor);
  const [navBgColor, setNavBgColor] = useState('#FFFFFF');
  const [navTextColor, setNavTextColor] = useState('#111827');
  const [successColor, setSuccessColor] = useState('#10B981');
  const [warningColor, setWarningColor] = useState('#F59E0B');
  const [errorColor, setErrorColor] = useState('#EF4444');

  // Modal State
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationSql, setMigrationSql] = useState('');

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

  // Apply theme (save to localStorage and reload)
  const handleApplyTheme = () => {
    console.log('[ThemePanel] Apply Theme clicked!');
    const config: SimpleThemeConfig = {
      primaryColor,
      accentColor,
      backgroundColor,
      roundness: 'rounded',
    };
    console.log('[ThemePanel] Config:', config);

    try {
      // Apply theme colors
      updateTheme(config);
      console.log('[ThemePanel] updateTheme() called successfully');

      // Apply fonts
      applyFonts(headingFont, bodyFont);
      saveFontConfig(headingFont, bodyFont);
      console.log('[ThemePanel] Fonts applied:', headingFont, bodyFont);

      // Show success message then auto-reload
      alert('✅ Theme applied successfully! The page will reload to show changes.');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('[ThemePanel] Error applying theme:', error);
      alert('❌ Error applying theme. Check console for details.');
    }
  };

  // Publish to all users (saves to database)
  const handlePublishToAll = async () => {
    if (confirm('🚀 Publish this theme for all users? This will change the theme for everyone publicly.')) {
      const config: SimpleThemeConfig = {
        primaryColor,
        accentColor,
        backgroundColor,
        roundness: 'rounded',
      };

      // Publish to database
      const success = await publishThemeToAllUsers(config);

      if (success) {
        alert('✅ Theme published successfully to all users! The page will reload.');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // SQL for user to copy
        const sql = `CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  tokens JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read app_settings" ON app_settings FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can update app_settings" ON app_settings FOR ALL TO authenticated USING (auth.jwt() ->> 'email' IN ('admin@muslimhunt.com', 'moderator@muslimhunt.com', 'zeirislam@gmail.com'));
INSERT INTO app_settings (id, config, tokens) VALUES ('global_theme', '${JSON.stringify(config)}', '{}') ON CONFLICT (id) DO NOTHING;`;

        setMigrationSql(sql);
        setShowMigrationModal(true);
      }
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
      setTimeout(() => {
        window.location.reload();
      }, 300);
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

  // Toggle advanced section
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
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
      <MigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        sql={migrationSql}
      />

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
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'simple'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              ✨ Simple
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'advanced'
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
                        className={`relative rounded-lg border-2 transition-all hover:shadow-lg ${selectedPreset === preset.id
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
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${primaryColor === option.color
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
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${backgroundColor === option.value
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
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${accentColor === option.color
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

                  {/* Button Style */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                      <h3 className="font-semibold text-gray-900">Button Style</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setButtonStyle('filled')}
                        className={`p-4 rounded-lg border-2 transition ${buttonStyle === 'filled' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: primaryColor }} />
                        <div className="text-sm font-semibold text-gray-900">Filled</div>
                        <div className="text-xs text-gray-500">Bold</div>
                      </button>

                      <button
                        onClick={() => setButtonStyle('soft')}
                        className={`p-4 rounded-lg border-2 transition ${buttonStyle === 'soft' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />
                        <div className="text-sm font-semibold text-gray-900">Soft</div>
                        <div className="text-xs text-gray-500">Light</div>
                      </button>

                      <button
                        onClick={() => setButtonStyle('outline')}
                        className={`p-4 rounded-lg border-2 transition ${buttonStyle === 'outline' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-full h-12 rounded-lg mb-2 border-2" style={{ borderColor: primaryColor }} />
                        <div className="text-sm font-semibold text-gray-900">Outline</div>
                        <div className="text-xs text-gray-500">Minimal</div>
                      </button>
                    </div>
                  </div>

                  {/* Roundness */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        5
                      </span>
                      <h3 className="font-semibold text-gray-900">Roundness</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setRoundness('sharp')}
                        className={`p-4 rounded-lg border-2 transition ${roundness === 'sharp' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-20 h-20 bg-gray-200 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-gray-900">Sharp</div>
                        <div className="text-xs text-gray-500">4px</div>
                      </button>

                      <button
                        onClick={() => setRoundness('rounded')}
                        className={`p-4 rounded-lg border-2 transition ${roundness === 'rounded' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-xl mx-auto mb-2" />
                        <div className="text-sm font-semibold text-gray-900">Rounded</div>
                        <div className="text-xs text-gray-500">12px</div>
                      </button>

                      <button
                        onClick={() => setRoundness('pill')}
                        className={`p-4 rounded-lg border-2 transition ${roundness === 'pill' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2" />
                        <div className="text-sm font-semibold text-gray-900">Pill</div>
                        <div className="text-xs text-gray-500">9999px</div>
                      </button>
                    </div>
                  </div>

                  {/* Banner Style */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        6
                      </span>
                      <h3 className="font-semibold text-gray-900">Banner Style</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setBannerStyle('dark')}
                        className={`p-4 rounded-lg border-2 transition ${bannerStyle === 'dark' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-full h-12 bg-gray-800 rounded-lg mb-2" />
                        <div className="text-sm font-semibold text-gray-900">Dark</div>
                        <div className="text-xs text-gray-500">Forest</div>
                      </button>

                      <button
                        onClick={() => setBannerStyle('primary')}
                        className={`p-4 rounded-lg border-2 transition ${bannerStyle === 'primary' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: primaryColor }} />
                        <div className="text-sm font-semibold text-gray-900">Primary</div>
                        <div className="text-xs text-gray-500">Brand</div>
                      </button>

                      <button
                        onClick={() => setBannerStyle('light')}
                        className={`p-4 rounded-lg border-2 transition ${bannerStyle === 'light' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />
                        <div className="text-sm font-semibold text-gray-900">Light</div>
                        <div className="text-xs text-gray-500">Subtle</div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Advanced Mode */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customize Colors</h2>

                {/* Expandable Sections */}
                {advancedSections.map((section) => (
                  <div key={section.id} className="mb-2">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition"
                    >
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{section.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
                      </div>
                      {expandedSection === section.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Expanded Content */}
                    {expandedSection === section.id && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                        {section.id === 'brand' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                              <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#10B981"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                              <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#10B981"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                              <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#F59E0B"
                              />
                            </div>
                          </>
                        )}

                        {section.id === 'backgrounds' && (
                          <div className="grid grid-cols-2 gap-3">
                            {backgroundOptions.map((option) => (
                              <button
                                key={option.name}
                                onClick={() => setBackgroundStyle(option.value)}
                                className={`p-3 rounded-lg border-2 transition ${backgroundColor === option.value ? 'border-gray-900 bg-white' : 'border-gray-200'}`}
                              >
                                <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: option.color }} />
                                <span className="text-xs font-medium">{option.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {section.id === 'fonts' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Heading Font ({HEADING_FONTS.length} options)
                              </label>
                              <select
                                value={headingFont}
                                onChange={(e) => setHeadingFont(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                {HEADING_FONTS.map((font) => (
                                  <option key={font.family} value={font.family}>
                                    {font.name} ({font.category})
                                  </option>
                                ))}
                              </select>
                              <div className="mt-2 p-3 bg-white rounded border" style={{ fontFamily: headingFont }}>
                                <p className="text-2xl font-bold">Sample Heading Text</p>
                                <p className="text-xs text-gray-500 mt-1">Font: {headingFont}</p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Body Font ({BODY_FONTS.length} options)
                              </label>
                              <select
                                value={bodyFont}
                                onChange={(e) => setBodyFont(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                {BODY_FONTS.map((font) => (
                                  <option key={font.family} value={font.family}>
                                    {font.name} ({font.category})
                                  </option>
                                ))}
                              </select>
                              <div className="mt-2 p-3 bg-white rounded border" style={{ fontFamily: bodyFont }}>
                                <p className="text-sm">This is sample body text. The quick brown fox jumps over the lazy dog.</p>
                                <p className="text-xs text-gray-500 mt-1">Font: {bodyFont}</p>
                              </div>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs text-blue-800">
                                💡 <strong>Font changes will apply globally!</strong> All headings and body text across the entire website will use your selected fonts. Google Fonts are loaded automatically.
                              </p>
                            </div>
                          </>
                        )}

                        {section.id === 'sidebar' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Icon Color</label>
                              <input
                                type="color"
                                value={sidebarIconColor}
                                onChange={(e) => setSidebarIconColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={sidebarIconColor}
                                onChange={(e) => setSidebarIconColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#10B981"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Icon Hover Color</label>
                              <input
                                type="color"
                                value={sidebarIconHoverColor}
                                onChange={(e) => setSidebarIconHoverColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={sidebarIconHoverColor}
                                onChange={(e) => setSidebarIconHoverColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#059669"
                              />
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs text-blue-800">
                                💡 Sidebar icon colors affect navigation icons, trending section icons, and moderator panel icons.
                              </p>
                            </div>
                          </>
                        )}

                        {section.id === 'text' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Text</label>
                              <input
                                type="color"
                                value={textPrimaryColor}
                                onChange={(e) => setTextPrimaryColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={textPrimaryColor}
                                onChange={(e) => setTextPrimaryColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#111827"
                              />
                              <p className="text-xs text-gray-500 mt-1">Main headings and important text</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Text</label>
                              <input
                                type="color"
                                value={textSecondaryColor}
                                onChange={(e) => setTextSecondaryColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={textSecondaryColor}
                                onChange={(e) => setTextSecondaryColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#6B7280"
                              />
                              <p className="text-xs text-gray-500 mt-1">Body text and descriptions</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Muted Text</label>
                              <input
                                type="color"
                                value={textMutedColor}
                                onChange={(e) => setTextMutedColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={textMutedColor}
                                onChange={(e) => setTextMutedColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#9CA3AF"
                              />
                              <p className="text-xs text-gray-500 mt-1">Subtle text and captions</p>
                            </div>
                          </>
                        )}

                        {section.id === 'buttons' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Button Background</label>
                              <input
                                type="color"
                                value={buttonBgColor}
                                onChange={(e) => setButtonBgColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={buttonBgColor}
                                onChange={(e) => setButtonBgColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#10B981"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Button Hover</label>
                              <input
                                type="color"
                                value={buttonHoverColor}
                                onChange={(e) => setButtonHoverColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={buttonHoverColor}
                                onChange={(e) => setButtonHoverColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#059669"
                              />
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs text-blue-800">
                                💡 Button colors affect all primary action buttons, submit buttons, and CTA buttons across the site.
                              </p>
                            </div>
                          </>
                        )}

                        {section.id === 'navigation' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Background</label>
                              <input
                                type="color"
                                value={navBgColor}
                                onChange={(e) => setNavBgColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={navBgColor}
                                onChange={(e) => setNavBgColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#FFFFFF"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Text</label>
                              <input
                                type="color"
                                value={navTextColor}
                                onChange={(e) => setNavTextColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={navTextColor}
                                onChange={(e) => setNavTextColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#111827"
                              />
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs text-blue-800">
                                💡 Navigation colors affect the navbar, menu items, and top navigation bar.
                              </p>
                            </div>
                          </>
                        )}

                        {section.id === 'status' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Success Color</label>
                              <input
                                type="color"
                                value={successColor}
                                onChange={(e) => setSuccessColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={successColor}
                                onChange={(e) => setSuccessColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#10B981"
                              />
                              <div className="mt-2 px-3 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: successColor }}>
                                ✓ Success Message
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Warning Color</label>
                              <input
                                type="color"
                                value={warningColor}
                                onChange={(e) => setWarningColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={warningColor}
                                onChange={(e) => setWarningColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#F59E0B"
                              />
                              <div className="mt-2 px-3 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: warningColor }}>
                                ⚠ Warning Message
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Error Color</label>
                              <input
                                type="color"
                                value={errorColor}
                                onChange={(e) => setErrorColor(e.target.value)}
                                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={errorColor}
                                onChange={(e) => setErrorColor(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                placeholder="#EF4444"
                              />
                              <div className="mt-2 px-3 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: errorColor }}>
                                ✗ Error Message
                              </div>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs text-blue-800">
                                💡 Status colors are used for success messages, warnings, errors, and notification badges.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Advanced mode:</strong> Click any section above to customize individual color tokens.
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

                    {/* Buttons - with dynamic styles */}
                    <div className="flex gap-2 mb-3">
                      <button
                        className={`px-3 py-1.5 text-xs font-medium shadow-sm hover:opacity-90 transition ${
                          roundness === 'sharp' ? 'rounded' : roundness === 'rounded' ? 'rounded-lg' : 'rounded-full'
                        } ${
                          buttonStyle === 'filled' ? 'text-white' : buttonStyle === 'soft' ? '' : 'bg-transparent border-2'
                        }`}
                        style={
                          buttonStyle === 'filled'
                            ? { backgroundColor: primaryColor }
                            : buttonStyle === 'soft'
                            ? { backgroundColor: primaryColor, opacity: 0.2, color: primaryColor }
                            : { borderColor: primaryColor, color: primaryColor }
                        }
                      >
                        Primary
                      </button>
                      <button className={`px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition ${
                        roundness === 'sharp' ? 'rounded' : roundness === 'rounded' ? 'rounded-lg' : 'rounded-full'
                      }`}>
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

                  {/* Banner Preview */}
                  <div
                    className={`p-3 mb-3 ${roundness === 'sharp' ? 'rounded' : roundness === 'rounded' ? 'rounded-lg' : 'rounded-full'}`}
                    style={
                      bannerStyle === 'dark'
                        ? { backgroundColor: '#1f2937', color: 'white' }
                        : bannerStyle === 'primary'
                        ? { backgroundColor: primaryColor, color: 'white' }
                        : { backgroundColor: primaryColor, opacity: 0.2, color: primaryColor }
                    }
                  >
                    <p className="text-xs font-medium">Banner Style Preview</p>
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
