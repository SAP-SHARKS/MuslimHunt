import React from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * DevAuthButtons Component
 *
 * Quick authentication buttons for development mode.
 * Shows buttons to login as admin or regular user without real authentication.
 */
export const DevAuthButtons: React.FC = () => {
  const { user, devLoginAsAdmin, devLoginAsUser, logout, isDevMode } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border-2 border-yellow-400 p-4 max-w-xs">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide">
            Dev Mode
          </span>
        </div>

        {user ? (
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium text-gray-900 mb-1">Logged in as:</div>
              <div className="text-xs text-gray-600 break-all">{user.email}</div>
              {isDevMode && (
                <div className="mt-1 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                  Dev Session
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={devLoginAsAdmin}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              Login as Admin
            </button>
            <button
              onClick={devLoginAsUser}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition text-sm font-medium"
            >
              <User className="w-4 h-4" />
              Login as User
            </button>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed">
            Quick dev authentication. No backend required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevAuthButtons;
