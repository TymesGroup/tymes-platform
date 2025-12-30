/**
 * Navigation Helpers - Utility functions for navigation
 *
 * Centralizes URL building and navigation logic
 */

import { ProfileType } from '../types';
import { AccountType, ModuleSlug, PROFILE_TO_ACCOUNT } from './types';

/**
 * Builds URL for navigation based on account type
 */
export function buildUrl(
  profileType: ProfileType,
  module: string,
  feature?: string,
  id?: string
): string {
  const accountType = PROFILE_TO_ACCOUNT[profileType];
  let url = `/${accountType}/${module.toLowerCase()}`;

  if (feature) {
    url += `/${feature.toLowerCase()}`;
  }

  if (id) {
    url += `/${id}`;
  }

  return url;
}

/**
 * Navigates to a URL using hash router
 */
export function navigateTo(url: string): void {
  window.location.hash = url;
}

/**
 * Navigates to the dashboard for the account type
 */
export function navigateToDashboard(profileType: ProfileType): void {
  const url = buildUrl(profileType, 'dashboard');
  navigateTo(url);
}

/**
 * Navigates to a specific module
 */
export function navigateToModule(profileType: ProfileType, module: ModuleSlug): void {
  const url = buildUrl(profileType, module);
  navigateTo(url);
}

/**
 * Navigates to a feature within a module
 */
export function navigateToFeature(
  profileType: ProfileType,
  module: ModuleSlug,
  feature: string
): void {
  const url = buildUrl(profileType, module, feature);
  navigateTo(url);
}

/**
 * Navigates to item details
 */
export function navigateToDetail(
  profileType: ProfileType,
  module: ModuleSlug,
  feature: string,
  id: string
): void {
  const url = buildUrl(profileType, module, feature, id);
  navigateTo(url);
}

/**
 * Gets the account type from the current URL
 */
export function getAccountTypeFromUrl(): AccountType | null {
  const hash = window.location.hash.replace('#', '');
  const parts = hash.split('/').filter(Boolean);

  if (parts.length > 0) {
    const account = parts[0] as AccountType;
    if (['personal', 'business', 'admin'].includes(account)) {
      return account;
    }
  }

  return null;
}

/**
 * Gets the current module from URL
 */
export function getModuleFromUrl(): string | null {
  const hash = window.location.hash.replace('#', '');
  const parts = hash.split('/').filter(Boolean);

  if (parts.length > 1) {
    return parts[1];
  }

  return null;
}

/**
 * Gets the current feature from URL
 */
export function getFeatureFromUrl(): string | null {
  const hash = window.location.hash.replace('#', '');
  const parts = hash.split('/').filter(Boolean);

  if (parts.length > 2) {
    return parts[2];
  }

  return null;
}

/**
 * Checks if the current URL matches a pattern
 */
export function matchesRoute(pattern: string): boolean {
  const hash = window.location.hash.replace('#', '');
  const patternParts = pattern.split('/').filter(Boolean);
  const hashParts = hash.split('/').filter(Boolean);

  if (patternParts.length !== hashParts.length) {
    return false;
  }

  return patternParts.every((part, index) => {
    if (part.startsWith(':')) {
      return true; // Dynamic parameter
    }
    return part === hashParts[index];
  });
}
