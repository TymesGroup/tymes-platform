/**
 * AuthGuard - Route protection based on authentication
 *
 * Checks if the user is authenticated before allowing access.
 * Redirects to login if not authenticated.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user, profile, loading, initialized } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading || !initialized) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto animate-pulse">
            T
          </div>
          <p className="text-zinc-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !profile) {
    return <Navigate to="/auth/login" state={{ returnTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};

/**
 * GuestGuard - Route protection for visitors
 *
 * Redirects authenticated users to the dashboard.
 */
interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { user, profile, loading, initialized } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl animate-pulse">
          T
        </div>
      </div>
    );
  }

  // If authenticated, redirect to the appropriate dashboard
  if (user && profile) {
    const state = location.state as { returnTo?: string } | null;
    const returnTo = state?.returnTo;

    // Determine account type from profile
    let accountType = 'personal';
    if (profile.type === 'SUPERADMIN') {
      accountType = 'admin';
    } else if (profile.type === 'BUSINESS') {
      accountType = 'business';
    }

    const defaultPath = `/${accountType}/dashboard`;
    console.log('🔄 GuestGuard redirecting to:', returnTo || defaultPath);

    return <Navigate to={returnTo || defaultPath} replace />;
  }

  return <>{children}</>;
};
