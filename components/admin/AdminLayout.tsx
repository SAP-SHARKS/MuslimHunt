import React, { useState, ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  Settings,
  Palette,
  FileCheck,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  currentView?: string;
  onNavigate?: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-600',
    description: 'Overview & Analytics',
  },
  {
    id: 'products',
    label: 'Product Review',
    icon: FileCheck,
    color: 'text-green-600',
    description: 'Approve & Moderate',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    color: 'text-purple-600',
    description: 'Manage Users',
  },
  {
    id: 'theme',
    label: 'Theme Settings',
    icon: Palette,
    color: 'text-pink-600',
    description: 'Customize Appearance',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    color: 'text-gray-600',
    description: 'System Configuration',
  },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentView = 'dashboard',
  onNavigate,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAdmin, logout, isDevMode } = useAuth();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const handleNavigation = (viewId: string) => {
    if (onNavigate) {
      onNavigate(viewId);
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dev Mode Badge */}
          {isDevMode && (
            <div className="mx-4 mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-yellow-800">Dev Mode Active</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : item.color}`} />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500">{item.description}</div>
                    )}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                {user?.email?.[0].toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {user?.user_metadata?.full_name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500 truncate">{user?.email || 'admin@dev.local'}</div>
              </div>
            </div>
            {isAdmin && (
              <div className="mb-3 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded inline-block">
                Admin Access
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {NAV_ITEMS.find((item) => item.id === currentView)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-600">
                  {NAV_ITEMS.find((item) => item.id === currentView)?.description ||
                    'Manage your application'}
                </p>
              </div>
            </div>

            {/* Breadcrumbs or Actions */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {NAV_ITEMS.find((item) => item.id === currentView)?.label || 'Dashboard'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
