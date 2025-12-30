import React from 'react';
import { ProfileType } from '../../types';
import { SuperAdminDashboard } from './pages/Dashboard';
import { UsersPage } from './pages/Users';
import { ModulesPage } from './pages/Modules';
import { PlansPage } from './pages/Plans';
import { AnalyticsPage } from './pages/Analytics';
import { SystemSettingsPage } from './pages/SystemSettings';

export type SuperAdminPage =
  | 'DASHBOARD'
  | 'USERS'
  | 'MODULES'
  | 'PLANS'
  | 'ANALYTICS'
  | 'SYSTEM_SETTINGS';

interface SuperAdminModuleProps {
  page: string;
  profile: ProfileType;
  onNavigate: (page: string) => void;
}

export const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({
  page,
  profile,
  onNavigate,
}) => {
  // Only SUPERADMIN can access
  if (profile !== ProfileType.SUPERADMIN) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Acesso Restrito
          </h2>
          <p className="text-zinc-500">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'USERS':
        return <UsersPage />;
      case 'MODULES':
        return <ModulesPage />;
      case 'PLANS':
        return <PlansPage />;
      case 'ANALYTICS':
        return <AnalyticsPage />;
      case 'SYSTEM_SETTINGS':
        return <SystemSettingsPage />;
      default:
        return <SuperAdminDashboard onNavigate={onNavigate} />;
    }
  };

  return renderPage();
};

export { SuperAdminDashboard } from './pages/Dashboard';
export { UsersPage } from './pages/Users';
export { ModulesPage } from './pages/Modules';
export * from './hooks/useAdminData';
