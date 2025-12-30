/**
 * PermissionGuard - Route protection based on granular permissions
 *
 * Checks specific permissions like read, write, delete, manage, admin.
 * Integrated with Supabase RLS for server-side validation.
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Permission, PROFILE_TO_ACCOUNT } from '../types';
import { ProfileType } from '../../types';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: Permission[];
  resource?: string; // Specific resource (e.g., 'products', 'courses')
  resourceId?: string; // Specific resource ID
  fallbackPath?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions,
  resource,
  resourceId,
  fallbackPath,
}) => {
  const { profile } = useAuth();
  const location = useLocation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermissions() {
      if (!profile) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      // Admin has all permissions
      if (profile.type === ProfileType.SUPERADMIN) {
        setHasPermission(true);
        setLoading(false);
        return;
      }

      // Check permissions based on account type
      const accountPermissions = getAccountPermissions(profile.type as ProfileType);
      const hasAllRequired = requiredPermissions.every(p => accountPermissions.includes(p));

      // If specific resource check is needed, query Supabase
      if (hasAllRequired && resource && resourceId) {
        const ownershipCheck = await checkResourceOwnership(profile.id, resource, resourceId);
        setHasPermission(ownershipCheck);
      } else {
        setHasPermission(hasAllRequired);
      }

      setLoading(false);
    }

    checkPermissions();
  }, [profile, requiredPermissions, resource, resourceId]);

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

  if (!hasPermission) {
    const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];
    const defaultFallback = `/${accountType}/dashboard`;

    return (
      <PermissionDenied
        fallbackPath={fallbackPath || defaultFallback}
        requiredPermissions={requiredPermissions}
      />
    );
  }

  return <>{children}</>;
};

/**
 * Gets permissions based on account type
 */
function getAccountPermissions(profileType: ProfileType): Permission[] {
  switch (profileType) {
    case ProfileType.SUPERADMIN:
      return ['read', 'write', 'delete', 'manage', 'admin'];
    case ProfileType.BUSINESS:
      return ['read', 'write', 'delete', 'manage'];
    case ProfileType.PERSONAL:
      return ['read'];
    default:
      return [];
  }
}

/**
 * Checks resource ownership in Supabase
 */
async function checkResourceOwnership(
  userId: string,
  resource: string,
  resourceId: string
): Promise<boolean> {
  try {
    // Map resources to tables
    const tableMap: Record<string, string> = {
      products: 'products',
      courses: 'courses',
      services: 'services',
      orders: 'orders',
    };

    const table = tableMap[resource];
    if (!table) return false;

    // Check if the user owns the resource
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq('id', resourceId)
      .eq('created_by', userId)
      .maybeSingle();

    if (error) {
      console.error('Permission check error:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Permission check failed:', err);
    return false;
  }
}

/**
 * Permission denied component
 */
interface PermissionDeniedProps {
  fallbackPath: string;
  requiredPermissions: Permission[];
}

const PermissionDenied: React.FC<PermissionDeniedProps> = ({
  fallbackPath,
  requiredPermissions,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          Permissão negada
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-2">
          Você não tem as permissões necessárias para acessar esta página.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">
          Permissões requeridas: {requiredPermissions.join(', ')}
        </p>
        <a
          href={`#${fallbackPath}`}
          className="inline-flex items-center px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
        >
          Voltar
        </a>
      </div>
    </div>
  );
};

/**
 * Hook to check permissions
 */
export function usePermissions(): {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
} {
  const { profile } = useAuth();

  const permissions = profile ? getAccountPermissions(profile.type as ProfileType) : [];

  return {
    permissions,
    hasPermission: p => permissions.includes(p),
    hasAllPermissions: ps => ps.every(p => permissions.includes(p)),
    hasAnyPermission: ps => ps.some(p => permissions.includes(p)),
  };
}

/**
 * Hook to check resource ownership
 */
export function useResourceOwnership(
  resource: string,
  resourceId: string | undefined
): {
  isOwner: boolean;
  loading: boolean;
} {
  const { profile } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      if (!profile || !resourceId) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      // Admin is "owner" of everything
      if (profile.type === ProfileType.SUPERADMIN) {
        setIsOwner(true);
        setLoading(false);
        return;
      }

      const result = await checkResourceOwnership(profile.id, resource, resourceId);
      setIsOwner(result);
      setLoading(false);
    }

    check();
  }, [profile, resource, resourceId]);

  return { isOwner, loading };
}
