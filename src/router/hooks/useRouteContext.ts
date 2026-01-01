/**
 * useRouteContext - Hook to get complete context of the current route
 *
 * Provides information about:
 * - Account type
 * - Current module
 * - Feature/action
 * - User permissions
 * - Authentication state
 */

import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { usePlatform } from '../../lib/PlatformContext';
import { RouteContext, AccountType, ModuleSlug, Permission, PROFILE_TO_ACCOUNT } from '../types';
import { findRouteDefinition } from '../routes';
import { ProfileType } from '../../types';

export function useRouteContext(): RouteContext {
  const location = useLocation();
  const params = useParams();
  const { user, profile } = useAuth();
  const { canAccessModule } = usePlatform();

  // Extract information from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  const accountFromUrl = pathParts[0] as AccountType | undefined;
  const moduleFromUrl = pathParts[1] as ModuleSlug | undefined;
  const featureFromUrl = pathParts[2];
  const actionFromUrl = pathParts[3];

  // Determine account type
  const accountType: AccountType = profile
    ? PROFILE_TO_ACCOUNT[profile.type as ProfileType]
    : accountFromUrl || 'personal';

  // Determine module
  const module: ModuleSlug = moduleFromUrl || 'dashboard';

  // Get permissions based on account type
  const permissions = getPermissionsForAccount(accountType);

  // Check subscription for module
  const hasRequiredSubscription = canAccessModule(module);

  return {
    accountType,
    module,
    feature: featureFromUrl,
    action: actionFromUrl,
    permissions,
    isAuthenticated: !!user && !!profile,
    hasRequiredSubscription,
  };
}

/**
 * Hook for contextual navigation
 */
export function useContextualNavigation() {
  const { accountType } = useRouteContext();

  const navigate = (module: ModuleSlug, feature?: string, params?: Record<string, string>) => {
    let path = `/${accountType}/${module}`;

    if (feature) {
      path += `/${feature}`;
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        path += `/${value}`;
      });
    }

    // Use browser router
    window.location.href = path;
  };

  const navigateToModule = (module: ModuleSlug) => navigate(module);

  const navigateToFeature = (module: ModuleSlug, feature: string) => navigate(module, feature);

  const navigateToDashboard = () => navigate('dashboard');

  const navigateToSettings = () => navigate('settings');

  return {
    navigate,
    navigateToModule,
    navigateToFeature,
    navigateToDashboard,
    navigateToSettings,
  };
}

/**
 * Hook for route-based breadcrumbs
 */
export function useBreadcrumbs(): Array<{ label: string; path: string }> {
  const { accountType, module, feature, action } = useRouteContext();

  const breadcrumbs: Array<{ label: string; path: string }> = [];

  // Dashboard is always first
  breadcrumbs.push({
    label: 'Dashboard',
    path: `/${accountType}/dashboard`,
  });

  // Add module if not dashboard
  if (module && module !== 'dashboard') {
    breadcrumbs.push({
      label: getModuleLabel(module),
      path: `/${accountType}/${module}`,
    });
  }

  // Add feature if exists
  if (feature) {
    breadcrumbs.push({
      label: getFeatureLabel(feature),
      path: `/${accountType}/${module}/${feature}`,
    });
  }

  // Add action if exists
  if (action) {
    breadcrumbs.push({
      label: getActionLabel(action),
      path: `/${accountType}/${module}/${feature}/${action}`,
    });
  }

  return breadcrumbs;
}

// Helpers
function getPermissionsForAccount(accountType: AccountType): Permission[] {
  switch (accountType) {
    case 'admin':
      return ['read', 'write', 'delete', 'manage', 'admin'];
    case 'business':
      return ['read', 'write', 'delete', 'manage'];
    case 'personal':
      return ['read'];
    default:
      return [];
  }
}

function getModuleLabel(module: ModuleSlug | string): string {
  const labels: Record<string, string> = {
    dashboard: 'Dashboard',
    explore: 'Explorar',
    ai: 'Tymes AI',
    settings: 'Configurações',
    profile: 'Perfil',
    shop: 'Shop',
    class: 'Class',
    work: 'Work',
    social: 'Social',
    // Admin modules
    users: 'Usuários',
    modules: 'Módulos',
    plans: 'Planos',
    analytics: 'Analytics',
    system: 'Sistema',
  };
  return labels[module] || module;
}

function getFeatureLabel(feature: string): string {
  const labels: Record<string, string> = {
    browse: 'Explorar',
    inventory: 'Inventário',
    cart: 'Bolsa',
    checkout: 'Checkout',
    orders: 'Pedidos',
    saves: 'Salvos',
    offers: 'Ofertas',
    sales: 'Vendas',
    analytics: 'Analytics',
    enrolled: 'Matriculados',
    teaching: 'Ensino',
    certificates: 'Certificados',
    projects: 'Projetos',
    tasks: 'Tarefas',
    services: 'Serviços',
    team: 'Equipe',
    feed: 'Feed',
    connections: 'Conexões',
    messages: 'Mensagens',
    campaigns: 'Campanhas',
    promotions: 'Promoções',
    notifications: 'Notificações',
    users: 'Usuários',
    modules: 'Módulos',
    plans: 'Planos',
    system: 'Sistema',
  };
  return labels[feature] || feature;
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    create: 'Criar',
    edit: 'Editar',
    view: 'Visualizar',
    list: 'Lista',
    manage: 'Gerenciar',
  };
  return labels[action] || action;
}
