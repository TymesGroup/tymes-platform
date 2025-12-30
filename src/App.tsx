/**
 * App.tsx - Application entry point
 *
 * Route structure:
 * /{account-type}/{module}/{feature}/{action}
 *
 * Examples:
 * /personal/dashboard - Personal dashboard
 * /business/shop/inventory - Seller inventory
 * /admin/users - User management
 */

import React from 'react';
import { AppProviders } from './app/providers';
import { AppRouter } from './router';

const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;
