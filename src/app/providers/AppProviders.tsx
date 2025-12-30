/**
 * AppProviders - Composable provider hierarchy
 *
 * Uses the compose pattern to flatten nested providers,
 * making the code cleaner and easier to maintain.
 *
 * Provider order (optimized for dependencies):
 * 1. ThemeProvider - No dependencies, provides theme context
 * 2. AuthProvider - No dependencies, provides auth state
 * 3. PlatformProvider - Depends on AuthProvider
 * 4. CartProvider - Depends on AuthProvider
 * 5. FavoritesProvider - Depends on AuthProvider
 * 6. CheckoutProvider - Depends on AuthProvider, CartProvider
 */

import React, { ComponentType, ReactNode } from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '../../lib/AuthContext';
import { PlatformProvider } from '../../lib/PlatformContext';
import { CartProvider } from '../../lib/CartContext';
import { FavoritesProvider } from '../../lib/FavoritesContext';
import { CheckoutProvider } from '../../lib/CheckoutContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

type ProviderComponent = ComponentType<{ children: ReactNode }>;

/**
 * Composes multiple providers into a single component.
 * Providers are applied from left to right (first provider wraps all others).
 */
function composeProviders(...providers: ProviderComponent[]): ProviderComponent {
  return providers.reduce(
    (AccumulatedProviders, CurrentProvider) => {
      return function ComposedProvider({ children }: { children: ReactNode }) {
        return (
          <AccumulatedProviders>
            <CurrentProvider>{children}</CurrentProvider>
          </AccumulatedProviders>
        );
      };
    },
    ({ children }: { children: ReactNode }) => <>{children}</>
  );
}

/**
 * All application providers in optimized order.
 * Order matters for dependency resolution:
 * - ThemeProvider: Independent, provides theme
 * - AuthProvider: Independent, provides user/session
 * - PlatformProvider: Uses useAuth
 * - CartProvider: Uses useAuth
 * - FavoritesProvider: Uses useAuth
 * - CheckoutProvider: Uses useAuth, useCart
 */
const providers: ProviderComponent[] = [
  ThemeProvider,
  AuthProvider,
  PlatformProvider,
  CartProvider,
  FavoritesProvider,
  CheckoutProvider,
];

const ComposedProviders = composeProviders(...providers);

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders wraps the application with all necessary context providers.
 * Uses composition pattern to avoid deep nesting.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ComposedProviders>
      <HashRouter>{children}</HashRouter>
    </ComposedProviders>
  );
}

export default AppProviders;
