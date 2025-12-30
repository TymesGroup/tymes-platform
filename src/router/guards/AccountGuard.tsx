/**
 * AccountGuard - Route protection based on account type
 *
 * Checks if the user's account type matches the expected route.
 * Redirects to the correct dashboard if it doesn't match.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { AccountType, PROFILE_TO_ACCOUNT } from '../types';
import { ProfileType } from '../../types';

interface AccountGuardProps {
  children: React.ReactNode;
  allowedAccounts: AccountType[];
  fallbackPath?: string;
}

export const AccountGuard: React.FC<AccountGuardProps> = ({
  children,
  allowedAccounts,
  fallbackPath,
}) => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) {
    return <Navigate to="/auth/login" state={{ returnTo: location.pathname }} replace />;
  }

  const userAccountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];

  // Extract account type from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  const routeAccountType = pathParts[0] as AccountType | undefined;

  // If the route has account type in URL, check if it matches the user's type
  if (routeAccountType && ['personal', 'business', 'admin'].includes(routeAccountType)) {
    // Check if the account type in URL matches the user's type
    if (routeAccountType !== userAccountType) {
      // Redirect to the same route but with the correct account type
      const restOfPath = pathParts.slice(1).join('/');
      const correctedPath = `/${userAccountType}/${restOfPath || 'dashboard'}`;
      return <Navigate to={correctedPath} replace />;
    }
  }

  // Check if the user's account type is in the allowed list
  if (!allowedAccounts.includes(userAccountType)) {
    const defaultPath = fallbackPath || `/${userAccountType}/dashboard`;
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};

/**
 * BusinessOnlyGuard - Shortcut for Business-only routes
 */
export const BusinessOnlyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AccountGuard allowedAccounts={['business']}>{children}</AccountGuard>
);

/**
 * AdminOnlyGuard - Shortcut for Admin-only routes
 */
export const AdminOnlyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AccountGuard allowedAccounts={['admin']}>{children}</AccountGuard>
);

/**
 * Hook to get current account type information
 */
export function useAccountType(): {
  accountType: AccountType;
  profileType: ProfileType;
  isBusiness: boolean;
  isPersonal: boolean;
  isAdmin: boolean;
} {
  const { profile } = useAuth();

  const profileType = (profile?.type as ProfileType) || ProfileType.PERSONAL;
  const accountType = PROFILE_TO_ACCOUNT[profileType];

  return {
    accountType,
    profileType,
    isBusiness: accountType === 'business',
    isPersonal: accountType === 'personal',
    isAdmin: accountType === 'admin',
  };
}
