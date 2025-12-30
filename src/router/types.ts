/**
 * Route Types - Defines route structure with semantic context
 *
 * URL Hierarchy:
 * /{account-type}/{module}/{feature}/{action}
 *
 * Examples:
 * /business/shop/inventory/create
 * /personal/class/courses/enrolled
 * /admin/users/list
 */

import { ProfileType } from '../types';

// Account types that determine the route prefix
export type AccountType = 'personal' | 'business' | 'admin';

// ProfileType -> AccountType mapping
export const PROFILE_TO_ACCOUNT: Record<ProfileType, AccountType> = {
  [ProfileType.PERSONAL]: 'personal',
  [ProfileType.BUSINESS]: 'business',
  [ProfileType.SUPERADMIN]: 'admin',
};

export const ACCOUNT_TO_PROFILE: Record<AccountType, ProfileType> = {
  personal: ProfileType.PERSONAL,
  business: ProfileType.BUSINESS,
  admin: ProfileType.SUPERADMIN,
};

// Available modules by account type
export type ModuleSlug =
  | 'dashboard'
  | 'explore'
  | 'ai'
  | 'settings'
  | 'profile'
  | 'shop'
  | 'class'
  | 'work'
  | 'social';

export type AdminModuleSlug = 'dashboard' | 'users' | 'modules' | 'plans' | 'analytics' | 'system';

// Granular permissions
export type Permission = 'read' | 'write' | 'delete' | 'manage' | 'admin';

// Route definition with complete context
export interface RouteDefinition {
  path: string;
  // Who can access
  allowedAccounts: AccountType[];
  // Required permissions
  requiredPermissions?: Permission[];
  // Module it belongs to
  module: ModuleSlug | AdminModuleSlug;
  // Specific feature within the module
  feature?: string;
  // Action (create, edit, view, list)
  action?: 'create' | 'edit' | 'view' | 'list' | 'manage';
  // Description for documentation
  description: string;
  // If requires active subscription
  requiresSubscription?: boolean;
  // Plan modules that must include this
  requiredPlanModules?: string[];
}

// Route metadata for the current component
export interface RouteContext {
  accountType: AccountType;
  module: ModuleSlug | AdminModuleSlug;
  feature?: string;
  action?: string;
  permissions: Permission[];
  isAuthenticated: boolean;
  hasRequiredSubscription: boolean;
}

// Navigation state
export interface NavigationState {
  from?: string;
  returnTo?: string;
  openModule?: string;
  productId?: string;
  courseId?: string;
  orderId?: string;
}
