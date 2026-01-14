/**
 * APP INTEGRATION EXAMPLE
 *
 * This file shows how to integrate the new Admin Panel and Theme System
 * into your existing App.tsx file.
 *
 * IMPORTANT: This is just an EXAMPLE file showing the integration pattern.
 * DO NOT replace your App.tsx with this file!
 * Instead, copy the relevant parts into your existing App.tsx.
 */

import React, { useState, useEffect } from 'react';

// NEW IMPORTS - Add these to your existing App.tsx
import { useAuth } from './contexts/AuthContext';
import { AdminRouter } from './components/admin/AdminRouter';
import { DevAuthButtons } from './components/admin/DevAuthButtons';

// Your existing imports (examples)
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel'; // Your existing admin panel
// ... all your other imports

enum View {
  HOME = 'home',
  ADMIN_PANEL = 'admin_panel',
  // ... your other views
}

function App() {
  // NEW: Add auth hook
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Your existing state
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState(null); // You might already have this
  // ... all your other state

  // Your existing useEffect hooks
  useEffect(() => {
    // Your existing auth check code can stay or be removed
    // The new AuthContext handles authentication
  }, []);

  // Your existing functions
  const handleNavigation = (newView: View) => {
    setView(newView);
  };

  // ... all your other functions

  // ======================================
  // MAIN INTEGRATION POINT
  // ======================================
  // Find where you render different views and update the ADMIN_PANEL case:

  // BEFORE (your existing code):
  // if (view === View.ADMIN_PANEL) {
  //   return <AdminPanel /* your props */ />;
  // }

  // AFTER (new integration):
  if (view === View.ADMIN_PANEL) {
    return (
      <>
        <AdminRouter
          ProductReviewPanel={AdminPanel} // Pass your existing panel
        />
        <DevAuthButtons /> {/* Optional: Add dev login buttons */}
      </>
    );
  }

  // Your existing view rendering
  return (
    <div className="min-h-screen bg-cream">
      {/* Your existing Navbar */}
      <Navbar
        user={user}
        isAdmin={isAdmin} // Can use from useAuth hook
        onNavigate={handleNavigation}
        // ... your other props
      />

      {/* Your existing view routing */}
      {view === View.HOME && (
        <div>Your Home View</div>
      )}

      {view === View.SUBMIT && (
        <div>Your Submit View</div>
      )}

      {/* Updated Admin Panel View */}
      {view === View.ADMIN_PANEL && (
        <AdminRouter ProductReviewPanel={AdminPanel} />
      )}

      {/* ... all your other views */}

      {/* NEW: Add dev auth buttons at the end (only visible in dev mode) */}
      <DevAuthButtons />
    </div>
  );
}

export default App;

/**
 * INTEGRATION CHECKLIST:
 *
 * 1. ✅ Add imports at the top:
 *    - useAuth from './contexts/AuthContext'
 *    - AdminRouter from './components/admin/AdminRouter'
 *    - DevAuthButtons from './components/admin/DevAuthButtons'
 *
 * 2. ✅ Add useAuth hook inside App component:
 *    const { user, isAdmin } = useAuth();
 *
 * 3. ✅ Update ADMIN_PANEL view rendering:
 *    Replace <AdminPanel /> with <AdminRouter ProductReviewPanel={AdminPanel} />
 *
 * 4. ✅ Add DevAuthButtons at the end of your return (optional):
 *    <DevAuthButtons />
 *
 * 5. ✅ (Optional) Replace hardcoded colors with theme classes:
 *    bg-blue-500 → bg-primary
 *    bg-white → bg-background
 *    text-gray-900 → text-text
 *
 * THAT'S IT! The system should now work.
 *
 * TESTING:
 * 1. Run: npm run dev
 * 2. Look for yellow "Dev Mode" box in bottom-right
 * 3. Click "Login as Admin"
 * 4. Navigate to admin panel
 * 5. See new admin dashboard with theme settings
 */

/**
 * EXAMPLE: Using Auth in Other Components
 */

// Example 1: Protected Admin Button
function ExampleAdminButton() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <button className="bg-primary hover:bg-primary-hover text-white rounded-button px-4 py-2">
      Admin Action
    </button>
  );
}

// Example 2: User Profile Dropdown
function ExampleUserMenu() {
  const { user, logout } = useAuth();

  return (
    <div>
      <div>{user?.email}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Example 3: Using Theme Colors
function ExampleCard() {
  return (
    <div className="bg-card border border-default rounded-card p-4 shadow-md">
      <h3 className="text-text font-bold mb-2">Card Title</h3>
      <p className="text-text-secondary">Card content using theme colors</p>
      <button className="bg-primary hover:bg-primary-hover text-white rounded-button px-4 py-2 mt-4">
        Primary Button
      </button>
    </div>
  );
}

/**
 * EXAMPLE: Updating Existing Components to Use Theme
 */

// BEFORE (hardcoded colors):
function OldButton() {
  return (
    <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2">
      Submit
    </button>
  );
}

// AFTER (theme colors):
function NewButton() {
  return (
    <button className="bg-primary hover:bg-primary-hover text-white rounded-button px-4 py-2">
      Submit
    </button>
  );
}

/**
 * EXAMPLE: Applying Custom Theme Programmatically
 */
import { updateTheme } from './theme/apply';

function ExampleThemeSwitcher() {
  const applyDarkTheme = () => {
    updateTheme({
      primaryColor: '#3b82f6',
      backgroundColor: 'dark-mode',
      roundness: 'rounded',
    });
  };

  const applyOceanTheme = () => {
    updateTheme({
      primaryColor: '#0ea5e9',
      backgroundColor: 'clean-white',
      roundness: 'rounded',
    });
  };

  return (
    <div className="space-x-2">
      <button onClick={applyDarkTheme}>Dark</button>
      <button onClick={applyOceanTheme}>Ocean</button>
    </div>
  );
}
