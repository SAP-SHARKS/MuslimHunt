# Quick Start Guide

## 5-Minute Integration

### Step 1: Update App.tsx (2 minutes)

Add these three imports at the top:

```tsx
import { useAuth } from './contexts/AuthContext';
import { AdminRouter } from './components/admin/AdminRouter';
import { DevAuthButtons } from './components/admin/DevAuthButtons';
```

Add the hook inside your App component:

```tsx
function App() {
  const { user, isAdmin } = useAuth();
  // ... rest of your code
}
```

Replace your admin panel view:

```tsx
// Find this:
{view === View.ADMIN_PANEL && <AdminPanel />}

// Replace with:
{view === View.ADMIN_PANEL && (
  <AdminRouter ProductReviewPanel={AdminPanel} />
)}
```

Add dev buttons at the end of your return:

```tsx
return (
  <div>
    {/* All your existing content */}
    <DevAuthButtons />
  </div>
);
```

### Step 2: Test It (3 minutes)

```bash
npm run dev
```

1. Look for yellow "Dev Mode" box in bottom-right
2. Click "Login as Admin"
3. Navigate to `/admin` or your admin menu
4. Click "Theme Settings" in sidebar
5. Change colors and see live preview
6. Click "Save Theme"
7. Refresh page - theme persists!

## Done! 🎉

Your admin panel with dynamic theming is now live.

---

## What You Can Do Now

### 1. Quick Admin Login
```tsx
// Click the Dev Auth Button
// or use the hook:
const { devLoginAsAdmin } = useAuth();
devLoginAsAdmin(); // Instant admin access
```

### 2. Customize Theme
- Open Admin Panel → Theme Settings
- Pick colors with color pickers
- Try preset themes (Ocean, Dark, Playful, etc.)
- Save and reload - theme persists

### 3. Use Theme Colors in Your Components
```tsx
// Replace hardcoded colors:
<button className="bg-emerald-600 hover:bg-emerald-700">
  Old Button
</button>

// With theme colors:
<button className="bg-primary hover:bg-primary-hover rounded-button">
  New Button
</button>
```

### 4. Check Admin Access Anywhere
```tsx
const { isAdmin } = useAuth();

{isAdmin && <button>Admin Only</button>}
```

---

## Common Tasks

### Apply a Theme Preset
```tsx
import { updateTheme, THEME_PRESETS } from './theme/utils';

updateTheme(THEME_PRESETS.ocean);    // Blue theme
updateTheme(THEME_PRESETS.dark);     // Dark mode
updateTheme(THEME_PRESETS.playful);  // Pink theme
```

### Create Custom Theme
```tsx
import { updateTheme } from './theme/apply';

updateTheme({
  primaryColor: '#ff6b6b',        // Red
  backgroundColor: 'warm-beige',   // Beige background
  roundness: 'full',               // Fully rounded
});
```

### Export/Import Theme
```tsx
import { exportTheme, importTheme } from './theme/apply';

// Export
const json = exportTheme();
console.log(json); // Copy this

// Import
const success = importTheme(jsonString);
if (success) window.location.reload();
```

### Logout
```tsx
const { logout } = useAuth();
await logout();
```

---

## Available Tailwind Theme Classes

### Colors
```css
bg-primary              /* Main brand color */
bg-primary-hover        /* Hover state */
bg-primary-light        /* Light variant */
bg-accent               /* Secondary color */
bg-background           /* Main background */
bg-background-secondary /* Secondary background */
bg-card                 /* Card background */
bg-sidebar              /* Sidebar background */
```

### Text
```css
text-text               /* Primary text */
text-text-secondary     /* Secondary text */
text-text-muted         /* Muted text */
text-text-inverse       /* Inverse (white on dark) */
```

### Semantic
```css
bg-success              /* Green success */
bg-error                /* Red error */
bg-warning              /* Orange warning */
bg-info                 /* Blue info */
```

### Borders
```css
border-default          /* Default border color */
rounded-card            /* Card corners */
rounded-button          /* Button corners */
rounded-input           /* Input corners */
```

### Shadows
```css
shadow-sm               /* Small shadow */
shadow-md               /* Medium shadow */
shadow-lg               /* Large shadow */
shadow-xl               /* Extra large shadow */
```

---

## Theme Presets

```tsx
import { THEME_PRESETS, updateTheme } from './theme/utils';

updateTheme(THEME_PRESETS.default);   // Blue & white
updateTheme(THEME_PRESETS.ocean);     // Ocean blue
updateTheme(THEME_PRESETS.forest);    // Forest green
updateTheme(THEME_PRESETS.sunset);    // Orange sunset
updateTheme(THEME_PRESETS.purple);    // Purple
updateTheme(THEME_PRESETS.dark);      // Dark mode
updateTheme(THEME_PRESETS.minimal);   // Black & white
updateTheme(THEME_PRESETS.playful);   // Pink & colorful
```

---

## Admin Panel Views

Navigate between these views in the admin sidebar:

1. **Dashboard** - Quick stats and action grid
2. **Product Review** - Your existing admin panel
3. **User Management** - Coming soon (placeholder)
4. **Theme Settings** - Customize appearance
5. **Settings** - Coming soon (placeholder)

---

## Dev Mode Features

The dev mode buttons provide:

- **Login as Admin** - Instant admin access
- **Login as User** - Test regular user features
- **Logout** - Clear dev session
- **Session Display** - Shows current user
- **Auto-hidden in Production** - Won't show in prod builds

---

## File Reference

| File | Purpose |
|------|---------|
| `contexts/AuthContext.tsx` | Authentication with dev bypass |
| `theme/apply.ts` | Theme functions (update, reset, export, import) |
| `theme/utils.ts` | Theme generation and presets |
| `components/admin/AdminRouter.tsx` | Main admin routing |
| `components/admin/AdminLayout.tsx` | Sidebar layout |
| `components/admin/AdminDashboard.tsx` | Dashboard view |
| `components/admin/ThemeAdminPanel.tsx` | Theme customization |
| `components/admin/DevAuthButtons.tsx` | Dev login widget |

---

## Troubleshooting

### Theme not applying?
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors
- Verify using theme classes (`bg-primary` not `bg-blue-500`)

### Dev buttons not showing?
- They only show in dev mode
- Check `import.meta.env.PROD` is false
- Look in bottom-right corner of screen

### Admin panel shows "Access Denied"?
- Click "Login as Admin" in DevAuthButtons first
- Check `isAdmin` is true in React DevTools

### Colors not updating?
- Click "Save Theme" after making changes
- Refresh the page after saving
- Check CSS variables in browser DevTools (Elements → Styles → :root)

---

## Next Steps

1. **Customize Default Theme** - Edit `theme/tokens.ts`
2. **Add More Admin Views** - Extend `AdminRouter.tsx`
3. **Integrate Backend** - Connect theme save to Supabase
4. **Add User Management** - Build the user CRUD panel
5. **Add Analytics** - Create metrics dashboard
6. **Theme Marketplace** - Share themes with community

---

## Documentation

- **Full Integration Guide**: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Implementation Summary**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Architecture Diagram**: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
- **Component Docs**: [components/admin/README.md](components/admin/README.md)
- **Code Examples**: [APP_INTEGRATION_EXAMPLE.tsx](APP_INTEGRATION_EXAMPLE.tsx)

---

## Support

Questions? Check:
1. This quick start guide
2. The integration guide
3. Code comments in each file
4. Browser console for errors

---

**That's it!** You're ready to use the admin panel and theme system. Start by clicking "Login as Admin" in the dev buttons, then explore the admin panel. 🚀
