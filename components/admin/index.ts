/**
 * Admin Components Export Index
 *
 * Centralized exports for all admin-related components.
 * Import from this file for cleaner imports:
 *
 * // Instead of:
 * import { AdminRouter } from './components/admin/AdminRouter';
 * import { AdminLayout } from './components/admin/AdminLayout';
 *
 * // Use:
 * import { AdminRouter, AdminLayout } from './components/admin';
 */

export { AdminRouter } from './AdminRouter';
export { AdminLayout } from './AdminLayout';
export { AdminDashboard } from './AdminDashboard';
export { ThemeAdminPanel } from './ThemeAdminPanel';
export { DevAuthButtons } from './DevAuthButtons';

// Re-export types if needed
export type { default as AdminRouterProps } from './AdminRouter';
