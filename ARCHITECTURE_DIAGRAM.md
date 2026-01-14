# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Muslim Hunt Application                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
         ┌──────────▼─────────┐      ┌──────────▼─────────┐
         │   AuthContext      │      │   Theme System     │
         │   (Dev + Real)     │      │   (CSS Variables)  │
         └──────────┬─────────┘      └──────────┬─────────┘
                    │                            │
         ┌──────────▼─────────────────────────────▼──────────┐
         │              App Component (Your Code)            │
         └──────────┬────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼───┐    ┌──────▼──────┐   ┌───▼────┐
│ Home  │    │ AdminRouter │   │ Other  │
│ View  │    │  Component  │   │ Views  │
└───────┘    └──────┬──────┘   └────────┘
                    │
         ┌──────────┼──────────┐
         │                     │
    ┌────▼────┐          ┌─────▼─────┐
    │ Admin   │          │  Theme    │
    │ Layout  │          │  Panel    │
    └────┬────┘          └───────────┘
         │
    ┌────▼────────────┐
    │  Admin Dashboard│
    │  Product Review │
    │  User Mgmt      │
    │  Settings       │
    └─────────────────┘
```

## Authentication Flow

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│   AuthContext (contexts/AuthContext) │
├──────────────────────────────────────┤
│                                      │
│  ┌─────────────┐   ┌──────────────┐ │
│  │  Dev Mode   │   │  Prod Mode   │ │
│  ├─────────────┤   ├──────────────┤ │
│  │ • Mock User │   │ • Supabase   │ │
│  │ • localStorage│  │ • Real Auth  │ │
│  │ • Instant   │   │ • Sessions   │ │
│  └─────────────┘   └──────────────┘ │
│                                      │
└──────────────┬───────────────────────┘
               │
               ▼
       ┌───────────────┐
       │ • user        │
       │ • isAdmin     │
       │ • loading     │
       │ • logout()    │
       └───────────────┘
```

## Theme System Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     Theme Customization                       │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │   ThemeAdminPanel Component     │
        │  (components/admin/Theme...)    │
        ├─────────────────────────────────┤
        │ • Color Pickers                 │
        │ • Background Selector           │
        │ • Roundness Slider              │
        │ • Quick Presets                 │
        │ • Live Preview                  │
        └────────────┬────────────────────┘
                     │
                     ▼ (On Save)
        ┌─────────────────────────────────┐
        │   generateTheme(config)         │
        │   (theme/utils.ts)              │
        ├─────────────────────────────────┤
        │ Input:                          │
        │ • primaryColor: '#3b82f6'       │
        │ • backgroundColor: 'clean-white'│
        │ • roundness: 'rounded'          │
        │                                 │
        │ Output: 70+ CSS Variables       │
        │ • --color-primary               │
        │ • --color-primary-hover         │
        │ • --bg-primary                  │
        │ • --text-primary                │
        │ • --radius-card                 │
        │ • ... and 65 more               │
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────┐
        │   applyTheme(tokens)            │
        │   (theme/apply.ts)              │
        ├─────────────────────────────────┤
        │ document.documentElement        │
        │   .style.setProperty(key, val)  │
        │                                 │
        │ + Save to localStorage          │
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────┐
        │   Tailwind CSS Variables        │
        │   (index.html config)           │
        ├─────────────────────────────────┤
        │ colors: {                       │
        │   primary: 'var(--color-primary)'│
        │   background: 'var(--bg-primary)'│
        │   text: 'var(--text-primary)'   │
        │ }                               │
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────┐
        │   All Components Use Theme      │
        ├─────────────────────────────────┤
        │ <div className="bg-primary">    │
        │ <button className="rounded-button">│
        │ <p className="text-text">       │
        └─────────────────────────────────┘
```

## Admin Panel Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                      AdminRouter                            │
│                  (Main Entry Point)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │       AdminLayout               │
         │   (Sidebar + Content Area)      │
         └─────┬───────────────────────────┘
               │
    ┌──────────┼──────────────────┬─────────────┬──────────┐
    │          │                  │             │          │
┌───▼──┐  ┌────▼────┐  ┌──────────▼───┐  ┌─────▼────┐  ┌─▼─────┐
│ Dash │  │ Product │  │    Users     │  │  Theme   │  │Settings│
│board │  │ Review  │  │  Management  │  │  Panel   │  │        │
└──────┘  └─────────┘  └──────────────┘  └──────────┘  └────────┘
    │
    └─► Quick Stats
        Action Grid
        Recent Activity
```

## Component Dependency Graph

```
index.tsx
  │
  ├─► AuthProvider (wraps entire app)
  │     │
  │     └─► AuthContext available to all children
  │
  ├─► initializeTheme() (runs once on load)
  │     │
  │     └─► Loads theme from localStorage
  │           │
  │           └─► Applies CSS variables to :root
  │
  └─► App.tsx
        │
        ├─► useAuth() hook
        │     └─► Access user, isAdmin, logout, etc.
        │
        ├─► View Routing
        │     │
        │     └─► View.ADMIN_PANEL
        │           │
        │           └─► AdminRouter
        │                 │
        │                 ├─► AdminLayout
        │                 │     ├─► Sidebar Navigation
        │                 │     └─► User Profile
        │                 │
        │                 └─► View Components
        │                       ├─► AdminDashboard
        │                       ├─► ThemeAdminPanel
        │                       ├─► ProductReviewPanel (yours)
        │                       ├─► UserManagement (todo)
        │                       └─► Settings (todo)
        │
        └─► DevAuthButtons (floating widget)
              └─► Login as Admin/User buttons
```

## Data Flow: Theme Customization

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │ (1) Opens Theme Settings
       ▼
┌──────────────────────┐
│  ThemeAdminPanel     │
│  • Shows current     │
│  • Color pickers     │
│  • Live preview      │
└──────┬───────────────┘
       │ (2) Changes primary color
       ▼
┌──────────────────────┐
│  Live Preview Card   │  ◄── Updates instantly (no save)
│  • Primary button    │
│  • Badge             │
│  • Text colors       │
└──────────────────────┘
       │
       │ (3) User clicks "Save"
       ▼
┌──────────────────────┐
│ generateTheme()      │
│ • Takes: config      │
│ • Returns: 70 tokens │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ applyTheme()         │
│ • Sets CSS vars      │
│ • Saves to localStorage│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Entire App Updates   │  ◄── All components using theme classes
│ • Navbar             │      update instantly
│ • Buttons            │
│ • Cards              │
│ • Text               │
└──────────────────────┘
```

## Dev Authentication Flow

```
┌─────────────┐
│ Developer   │
└─────┬───────┘
      │
      ▼
┌─────────────────────┐
│ DevAuthButtons      │  ◄── Floating widget (bottom-right)
│ • Login as Admin    │
│ • Login as User     │
│ • Logout            │
└─────┬───────────────┘
      │
      │ (Click "Login as Admin")
      ▼
┌─────────────────────────────┐
│ devLoginAsAdmin()           │
│                             │
│ const mockUser = {          │
│   id: 'dev-admin-id',       │
│   email: 'admin@dev.local', │
│   role: 'admin'             │
│ }                           │
│                             │
│ setUser(mockUser)           │
│ localStorage.set('dev_session', ...)│
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────┐
│ useAuth() returns:  │
│ • user: mockUser    │
│ • isAdmin: true     │
│ • isDevMode: true   │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ AdminRouter         │  ◄── Access granted!
│ • Shows dashboard   │
│ • All admin features│
└─────────────────────┘
```

## File Organization

```
muslimhunt/
│
├── index.tsx                    [Modified] ◄── AuthProvider wrapper
├── index.html                   [Modified] ◄── Tailwind config
├── App.tsx                      [To Modify] ◄── Add AdminRouter
│
├── contexts/
│   └── AuthContext.tsx          [NEW] ◄── Authentication logic
│
├── theme/
│   ├── tokens.ts                [NEW] ◄── Token definitions
│   ├── colorUtils.ts            [NEW] ◄── Color helpers
│   ├── utils.ts                 [NEW] ◄── Theme generation
│   └── apply.ts                 [NEW] ◄── DOM application
│
├── components/
│   ├── admin/
│   │   ├── AdminRouter.tsx      [NEW] ◄── Main router
│   │   ├── AdminLayout.tsx      [NEW] ◄── Sidebar layout
│   │   ├── AdminDashboard.tsx   [NEW] ◄── Dashboard view
│   │   ├── ThemeAdminPanel.tsx  [NEW] ◄── Theme customizer
│   │   ├── DevAuthButtons.tsx   [NEW] ◄── Dev login widget
│   │   ├── index.ts             [NEW] ◄── Exports
│   │   └── README.md            [NEW] ◄── Documentation
│   │
│   └── AdminPanel.tsx           [Existing] ◄── Your product review
│
├── INTEGRATION_GUIDE.md         [NEW] ◄── How to integrate
├── APP_INTEGRATION_EXAMPLE.tsx  [NEW] ◄── Code examples
├── IMPLEMENTATION_SUMMARY.md    [NEW] ◄── What was built
└── ARCHITECTURE_DIAGRAM.md      [NEW] ◄── This file
```

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                   Application State                     │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼──────────┐   ┌────────▼──────────┐
│  AuthContext      │   │  Theme System     │
│  (Global)         │   │  (CSS + localStorage)│
├───────────────────┤   ├───────────────────┤
│ • user            │   │ • CSS Variables   │
│ • session         │   │ • Config Object   │
│ • isAdmin         │   │ • Tokens Object   │
│ • loading         │   │                   │
│ • isDevMode       │   │ Stored in:        │
│                   │   │ • document.style  │
│ Stored in:        │   │ • localStorage    │
│ • React Context   │   │                   │
│ • localStorage    │   │                   │
└───────────────────┘   └───────────────────┘
```

## CSS Variable Cascade

```
:root
  │
  ├─► --color-primary: #3b82f6
  ├─► --color-primary-hover: #2563eb
  ├─► --color-primary-light: #dbeafe
  ├─► --bg-primary: #ffffff
  ├─► --bg-card: #ffffff
  ├─► --text-primary: #111827
  ├─► --radius-card: 0.5rem
  └─► ... 63 more variables
        │
        ▼
  Tailwind Config (index.html)
        │
        ├─► bg-primary → var(--color-primary)
        ├─► bg-card → var(--bg-card)
        ├─► text-text → var(--text-primary)
        └─► rounded-card → var(--radius-card)
              │
              ▼
        Component Classes
              │
              ├─► <button className="bg-primary">
              ├─► <div className="bg-card rounded-card">
              └─► <p className="text-text">
                    │
                    ▼
              Browser renders with actual values
              from CSS variables
```

## Integration Points

```
┌──────────────────────────────────────────────────┐
│            Your Existing App.tsx                 │
└────────────────────┬─────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌───▼───────┐ ┌─▼──────────┐
│  Add Hook    │ │ Update    │ │ Add Widget │
│              │ │ Admin View│ │            │
│ useAuth()    │ │           │ │ <DevAuth   │
│              │ │ <AdminRouter│ │  Buttons/> │
└──────────────┘ │ Product.../>│ │            │
                 │ />          │ │            │
                 └─────────────┘ └────────────┘

     These 3 changes enable the entire system!
```

## Summary

- **1 Provider**: AuthProvider wraps app
- **1 Function Call**: initializeTheme() on app start
- **5 Main Components**: Router, Layout, Dashboard, ThemePanel, DevButtons
- **4 Theme Files**: tokens, colorUtils, utils, apply
- **70+ CSS Variables**: Dynamically generated and applied
- **3 Integration Points**: Hook, View, Widget

Total integration time: **5-10 minutes**
