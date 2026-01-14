# Admin Panel & Theme System

A comprehensive admin panel with dynamic theming and development authentication for the Muslim Hunt application.

## Features

### 1. Development Authentication
- **Dev Login**: Quick authentication bypass for rapid development
- **Admin Mode**: Instant admin access without backend setup
- **User Mode**: Test regular user features
- **Session Persistence**: Dev sessions saved to localStorage

### 2. Dynamic Theme System
- **CSS Variables**: Runtime theme changes without recompilation
- **Live Preview**: See changes instantly as you customize
- **Multiple Presets**: Default, Ocean, Forest, Sunset, Purple, Dark, Minimal, Playful
- **Full Customization**: Colors, backgrounds, border radius
- **Import/Export**: Share and backup themes as JSON

### 3. Admin Layout
- **Responsive Sidebar**: Collapsible navigation for mobile
- **Navigation Menu**: Dashboard, Products, Users, Theme, Settings
- **User Profile**: Display current user with logout
- **Breadcrumbs**: Track current location

### 4. Admin Dashboard
- **Quick Stats**: Overview metrics (products, users, comments)
- **Action Grid**: Quick access to main features
- **Recent Activity**: Timeline of recent events
- **Customizable**: Pass your own stats and actions

## File Structure

```
components/admin/
├── AdminRouter.tsx          # Main router for admin views
├── AdminLayout.tsx          # Layout with sidebar navigation
├── AdminDashboard.tsx       # Dashboard with action grid
├── ThemeAdminPanel.tsx      # Theme customization panel
├── DevAuthButtons.tsx       # Dev mode authentication buttons
└── README.md               # This file

contexts/
└── AuthContext.tsx         # Authentication context with dev mode

theme/
├── tokens.ts               # Theme token definitions
├── colorUtils.ts           # Color manipulation utilities
├── utils.ts                # Theme generation logic
└── apply.ts                # Theme application & persistence
```

## Integration Guide

### Step 1: Wrap App with AuthProvider (Already Done)

The app is already wrapped in `index.tsx`:

```tsx
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initializeTheme } from './theme/apply.ts';

// Initialize theme before React renders
initializeTheme();

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### Step 2: Add Admin Router to Your App

In your `App.tsx`, import and use the AdminRouter:

```tsx
import { AdminRouter } from './components/admin/AdminRouter';
import { AdminPanel } from './components/AdminPanel'; // Your existing admin panel

// In your render logic where you handle views:
if (view === View.ADMIN_PANEL) {
  return (
    <AdminRouter
      ProductReviewPanel={AdminPanel} // Pass your existing panel
    />
  );
}
```

### Step 3: Add Dev Auth Buttons (Optional)

For development, add the floating auth buttons:

```tsx
import { DevAuthButtons } from './components/admin/DevAuthButtons';

// At the end of your App component:
return (
  <div>
    {/* Your app content */}
    <DevAuthButtons />
  </div>
);
```

### Step 4: Use Auth Context Anywhere

```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAdmin, devLoginAsAdmin, logout } = useAuth();

  return (
    <div>
      {isAdmin && <button>Admin Only Feature</button>}
      {!user && <button onClick={devLoginAsAdmin}>Dev Login</button>}
    </div>
  );
}
```

## Usage Examples

### Quick Dev Login

```tsx
import { useAuth } from './contexts/AuthContext';

function DevTools() {
  const { devLoginAsAdmin, devLoginAsUser, logout } = useAuth();

  return (
    <div>
      <button onClick={devLoginAsAdmin}>Login as Admin</button>
      <button onClick={devLoginAsUser}>Login as User</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Check Admin Access

```tsx
import { useAuth } from './contexts/AuthContext';

function ProtectedFeature() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Feature</div>;
}
```

### Apply Custom Theme

```tsx
import { updateTheme } from './theme/apply';

function ThemeButton() {
  const applyDarkTheme = () => {
    updateTheme({
      primaryColor: '#3b82f6',
      backgroundColor: 'dark-mode',
      roundness: 'rounded',
    });
  };

  return <button onClick={applyDarkTheme}>Dark Mode</button>;
}
```

### Use Theme Colors in Components

With Tailwind classes (after theme is loaded):

```tsx
// Use dynamic theme colors
<div className="bg-primary text-white">Primary Color</div>
<div className="bg-background text-text">Background</div>
<button className="bg-primary hover:bg-primary-hover rounded-button">
  Button
</button>
```

### Export/Import Themes

```tsx
import { exportTheme, importTheme } from './theme/apply';

function ThemeManager() {
  const handleExport = () => {
    const json = exportTheme();
    // Save to file or copy to clipboard
    navigator.clipboard.writeText(json);
  };

  const handleImport = (jsonString: string) => {
    const success = importTheme(jsonString);
    if (success) {
      alert('Theme imported!');
      window.location.reload();
    }
  };

  return (
    <div>
      <button onClick={handleExport}>Export Theme</button>
      {/* File upload for import */}
    </div>
  );
}
```

## Available Theme Presets

```tsx
import { THEME_PRESETS, updateTheme } from './theme/utils';

// Apply a preset
updateTheme(THEME_PRESETS.ocean);    // Blue ocean theme
updateTheme(THEME_PRESETS.forest);   // Green forest theme
updateTheme(THEME_PRESETS.sunset);   // Orange sunset theme
updateTheme(THEME_PRESETS.purple);   // Purple theme
updateTheme(THEME_PRESETS.dark);     // Dark mode
updateTheme(THEME_PRESETS.minimal);  // Black & white minimal
updateTheme(THEME_PRESETS.playful);  // Colorful playful theme
```

## Theme Token Reference

### Colors
- `--color-primary` - Main brand color
- `--color-primary-hover` - Hover state
- `--color-primary-light` - Light variant (backgrounds)
- `--color-accent` - Secondary accent color
- `--text-primary` - Main text color
- `--text-secondary` - Secondary text
- `--text-muted` - Muted/disabled text

### Backgrounds
- `--bg-primary` - Main background
- `--bg-secondary` - Secondary background
- `--bg-card` - Card background
- `--bg-sidebar` - Sidebar background

### Borders
- `--border-default` - Default border color
- `--radius-card` - Card border radius
- `--radius-button` - Button border radius

### Semantic Colors
- `--color-success` / `--color-success-light`
- `--color-error` / `--color-error-light`
- `--color-warning` / `--color-warning-light`
- `--color-info` / `--color-info-light`

## Tailwind Integration

The Tailwind config in `index.html` is already set up to use these variables:

```tsx
// Use in components:
<div className="bg-primary text-white">Primary</div>
<div className="bg-background-secondary">Secondary BG</div>
<div className="border border-default rounded-card">Card</div>
<button className="bg-primary hover:bg-primary-hover rounded-button">
  Button
</button>
```

## API Reference

### AuthContext

```tsx
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  devLoginAsAdmin: () => void;
  devLoginAsUser: () => void;
  logout: () => Promise<void>;
  isDevMode: boolean;
}
```

### Theme Functions

```tsx
// Apply theme configuration
updateTheme(config: SimpleThemeConfig): void

// Reset to defaults
resetTheme(): void

// Export as JSON
exportTheme(): string

// Import from JSON
importTheme(jsonString: string): boolean

// Initialize on app load (call once)
initializeTheme(): void

// Generate theme tokens from config
generateTheme(config: SimpleThemeConfig): ThemeTokens

// Apply tokens directly to DOM
applyTheme(tokens: ThemeTokens): void
```

### AdminRouter Props

```tsx
interface AdminRouterProps {
  ProductReviewPanel?: React.ComponentType<any>;
}
```

### AdminDashboard Props

```tsx
interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
  stats?: {
    pendingProducts?: number;
    totalUsers?: number;
    totalProducts?: number;
    totalComments?: number;
  };
}
```

## Development Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Open Browser** and you'll see the DevAuthButtons in the bottom-right

3. **Click "Login as Admin"** to instantly access the admin panel

4. **Navigate to Theme Settings** from the sidebar

5. **Customize Colors** using the color pickers

6. **See Live Preview** update in real-time

7. **Click "Save Theme"** to persist your changes

8. **Test Your Changes** across the entire app

9. **Export Theme** when you're happy with the result

## Production Considerations

- **Dev Auth Buttons**: Automatically hidden in production (`import.meta.env.PROD`)
- **Real Authentication**: Falls back to Supabase auth when not in dev mode
- **Theme Persistence**: Saved to localStorage (consider moving to database)
- **Security**: Dev sessions are clearly marked and separate from real sessions

## Troubleshooting

### Theme not applying?
- Check that `initializeTheme()` is called before React renders
- Verify CSS variables are loaded in browser DevTools
- Clear localStorage and reload

### Dev login not working?
- Ensure `AuthProvider` wraps your app
- Check console for errors
- Verify `import.meta.env.PROD` is false

### Colors look wrong?
- Use Tailwind classes like `bg-primary` not `bg-blue-500`
- Check that variables are defined in `theme/tokens.ts`
- Verify Tailwind config in `index.html` includes variable mappings

## Next Steps

- [ ] Add user management panel
- [ ] Implement analytics dashboard
- [ ] Add content moderation features
- [ ] Create audit log viewer
- [ ] Add role-based permissions
- [ ] Integrate with backend API
- [ ] Add theme preview for entire site
- [ ] Create theme marketplace

## Support

For questions or issues:
1. Check this README
2. Review code comments
3. Test with DevAuthButtons
4. Check browser console for errors
