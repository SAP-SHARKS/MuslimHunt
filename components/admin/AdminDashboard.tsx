import React from 'react';
import {
  Users,
  FileCheck,
  Palette,
  Settings,
  TrendingUp,
  Activity,
  MessageSquare,
  Shield,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

interface ActionCard {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  stats?: string;
  onClick?: () => void;
}

interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
  stats?: {
    pendingProducts?: number;
    totalUsers?: number;
    totalProducts?: number;
    totalComments?: number;
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, stats }) => {
  const actionCards: ActionCard[] = [
    {
      id: 'products',
      label: 'Product Review',
      description: 'Review and approve pending submissions',
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      stats: stats?.pendingProducts ? `${stats.pendingProducts} pending` : undefined,
      onClick: () => onNavigate?.('products'),
    },
    {
      id: 'users',
      label: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      stats: stats?.totalUsers ? `${stats.totalUsers} users` : undefined,
      onClick: () => onNavigate?.('users'),
    },
    {
      id: 'theme',
      label: 'Theme Settings',
      description: 'Customize the look and feel of your app',
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      onClick: () => onNavigate?.('theme'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'View insights and performance metrics',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      onClick: () => onNavigate?.('analytics'),
    },
    {
      id: 'moderation',
      label: 'Content Moderation',
      description: 'Review comments, forum posts, and reports',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      stats: stats?.totalComments ? `${stats.totalComments} comments` : undefined,
      onClick: () => onNavigate?.('moderation'),
    },
    {
      id: 'settings',
      label: 'System Settings',
      description: 'Configure application settings and preferences',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      onClick: () => onNavigate?.('settings'),
    },
  ];

  const quickStats = [
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Pending Review',
      value: stats?.pendingProducts || 0,
      icon: FileCheck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Active Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Comments',
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage your application, review content, and configure settings from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Activity className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Action Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={card.onClick}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-emerald-300 transition transform hover:-translate-y-1 text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.label}</h3>
                <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                {card.stats && (
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {card.stats}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              action: 'New product submitted',
              user: 'user@example.com',
              time: '5 minutes ago',
              type: 'product',
            },
            {
              action: 'Product approved',
              user: 'admin@muslimhunt.com',
              time: '15 minutes ago',
              type: 'approval',
            },
            {
              action: 'New user registered',
              user: 'newuser@example.com',
              time: '1 hour ago',
              type: 'user',
            },
            {
              action: 'Comment posted',
              user: 'commenter@example.com',
              time: '2 hours ago',
              type: 'comment',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'product'
                    ? 'bg-green-100 text-green-600'
                    : activity.type === 'approval'
                    ? 'bg-blue-100 text-blue-600'
                    : activity.type === 'user'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-orange-100 text-orange-600'
                }`}
              >
                {activity.type === 'product' && <FileCheck className="w-5 h-5" />}
                {activity.type === 'approval' && <Shield className="w-5 h-5" />}
                {activity.type === 'user' && <Users className="w-5 h-5" />}
                {activity.type === 'comment' && <MessageSquare className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">{activity.action}</div>
                <div className="text-xs text-gray-600">{activity.user}</div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
