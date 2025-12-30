/**
 * ModuleGuard - Route protection based on module access
 *
 * Checks if the user has access to the module through:
 * 1. Module active on the platform
 * 2. Module enabled in user profile
 * 3. Module included in subscription plan
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { usePlatform } from '../../lib/PlatformContext';
import { ModuleSlug, PROFILE_TO_ACCOUNT } from '../types';
import { ProfileType } from '../../types';

interface ModuleGuardProps {
  children: React.ReactNode;
  module: ModuleSlug;
  requiresSubscription?: boolean;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  children,
  module,
  requiresSubscription = true,
}) => {
  const { profile } = useAuth();
  const { canAccessModule, loading } = usePlatform();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth/login" state={{ returnTo: location.pathname }} replace />;
  }

  const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];

  // Check module access
  if (requiresSubscription && !canAccessModule(module)) {
    return <ModuleAccessDenied module={module} accountType={accountType} reason="subscription" />;
  }

  return <>{children}</>;
};

/**
 * Module access denied component
 */
interface ModuleAccessDeniedProps {
  module: ModuleSlug;
  accountType: string;
  reason: 'subscription' | 'permission' | 'inactive';
}

const ModuleAccessDenied: React.FC<ModuleAccessDeniedProps> = ({ module, accountType, reason }) => {
  const messages = {
    subscription: {
      title: 'Módulo não disponível',
      description: 'Este módulo não está incluído no seu plano atual.',
      action: 'Fazer upgrade do plano',
      actionPath: `/${accountType}/settings/subscription`,
    },
    permission: {
      title: 'Acesso restrito',
      description: 'Você não tem permissão para acessar este módulo.',
      action: 'Voltar ao dashboard',
      actionPath: `/${accountType}/dashboard`,
    },
    inactive: {
      title: 'Módulo desativado',
      description: 'Este módulo está temporariamente desativado.',
      action: 'Voltar ao dashboard',
      actionPath: `/${accountType}/dashboard`,
    },
  };

  const message = messages[reason];

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          {message.title}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">{message.description}</p>
        <a
          href={`#${message.actionPath}`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {message.action}
        </a>
      </div>
    </div>
  );
};

/**
 * Hook to check module access
 */
export function useModuleAccess(module: ModuleSlug): {
  hasAccess: boolean;
  loading: boolean;
  reason?: 'subscription' | 'permission' | 'inactive';
} {
  const { canAccessModule, loading } = usePlatform();

  if (loading) {
    return { hasAccess: false, loading: true };
  }

  const hasAccess = canAccessModule(module);

  return {
    hasAccess,
    loading: false,
    reason: hasAccess ? undefined : 'subscription',
  };
}
