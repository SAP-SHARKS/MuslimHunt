import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { ThemeAdminPanelV2 } from './ThemeAdminPanelV2';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, AlertTriangle, FileCheck } from 'lucide-react';

interface AdminRouterProps {
  // Optional: Pass in the existing AdminPanel component for the 'products' view
  ProductReviewPanel?: React.ComponentType<any>;
  // Props to pass to the ProductReviewPanel
  user?: any;
  onRefresh?: () => void;
}

export const AdminRouter: React.FC<AdminRouterProps> = ({ ProductReviewPanel, user, onRefresh }) => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const { isAdmin, loading, user: authUser } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Check admin access
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin panel. Please contact an administrator.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate view based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <AdminDashboard
            onNavigate={setCurrentView}
            stats={{
              pendingProducts: 5,
              totalUsers: 150,
              totalProducts: 45,
              totalComments: 320,
            }}
          />
        );

      case 'theme':
        return <ThemeAdminPanelV2 />;

      case 'products':
        // Use the existing AdminPanel component if provided
        if (ProductReviewPanel) {
          return (
            <ProductReviewPanel
              user={user || authUser}
              onBack={() => setCurrentView('dashboard')}
              onRefresh={onRefresh || (() => {})}
            />
          );
        }
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Review</h2>
              <p className="text-gray-600 mb-6">
                The product review panel will be displayed here. Pass the ProductReviewPanel
                component as a prop to enable this feature.
              </p>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        );

      default:
        return (
          <AdminDashboard
            onNavigate={setCurrentView}
            stats={{
              pendingProducts: 5,
              totalUsers: 150,
              totalProducts: 45,
              totalComments: 320,
            }}
          />
        );
    }
  };

  return (
    <AdminLayout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </AdminLayout>
  );
};

export default AdminRouter;
