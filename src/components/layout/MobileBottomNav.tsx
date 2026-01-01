/**
 * MobileBottomNav Component - Apple-inspired Design
 * Navegação mobile com design minimalista estilo Apple
 */

import React from 'react';
import { LayoutDashboard, Compass, Bot, UserCog } from 'lucide-react';
import { ModuleType, ProfileType } from '../../types';
import { MODULE_MENUS } from '../../constants/navigation';

interface MobileBottomNavProps {
  activeProfile: ProfileType;
  activeModule: ModuleType | string;
  activePage: string;
  onNavigate: (module: ModuleType | string) => void;
  onPageChange: (page: string) => void;
}

const ROOT_MOBILE_ITEMS = [
  {
    id: ModuleType.DASHBOARD,
    label: 'Início',
    icon: LayoutDashboard,
    allowedProfiles: [ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
  {
    id: ModuleType.EXPLORE,
    label: 'Explorar',
    icon: Compass,
    allowedProfiles: [ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
  {
    id: ModuleType.AI_AGENT,
    label: 'IA',
    icon: Bot,
    allowedProfiles: [ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
  {
    id: ModuleType.PROFILE,
    label: 'Perfil',
    icon: UserCog,
    allowedProfiles: [ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeProfile,
  activeModule,
  activePage,
  onNavigate,
  onPageChange,
}) => {
  const isSuperAdmin = activeProfile === ProfileType.SUPERADMIN;

  // Global pages should be treated as root modules to keep the main menu visible
  const GLOBAL_PAGES = ['CHECKOUT', 'ORDERS', 'SAVES', 'NOTIFICATIONS', 'BAG'];
  const isGlobalPage = GLOBAL_PAGES.includes(activeModule as string);

  const isRootModule =
    [
      ModuleType.DASHBOARD,
      ModuleType.EXPLORE,
      ModuleType.AI_AGENT,
      ModuleType.SETTINGS,
      ModuleType.PROFILE,
    ].includes(activeModule as ModuleType) || isGlobalPage;

  const currentModuleMenu = !isRootModule ? MODULE_MENUS[activeModule as string] : null;
  const superAdminMenu = MODULE_MENUS['SUPERADMIN'];

  const filteredRootItems = ROOT_MOBILE_ITEMS.filter(item =>
    item.allowedProfiles.includes(activeProfile)
  );

  // SuperAdmin Navigation
  if (isSuperAdmin) {
    const adminItems = superAdminMenu?.items.slice(0, 5) || [];

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f5f5f7]/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl backdrop-saturate-150 border-t border-[#d2d2d7] dark:border-[#424245] safe-area-bottom">
        <div className="flex items-center justify-around px-2 h-16">
          {adminItems.map(item => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1.5 px-2 rounded-xl transition-colors ${
                  isActive ? 'text-red-600 dark:text-red-400' : 'text-[#86868b]'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                <span className={`text-[10px] mt-0.5 ${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Module Navigation (SHOP, CLASS, etc.)
  if (!isRootModule && currentModuleMenu) {
    const moduleItems = currentModuleMenu.items
      .filter(item => !item.allowedProfiles || item.allowedProfiles.includes(activeProfile))
      .slice(0, 5);

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f5f5f7]/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl backdrop-saturate-150 border-t border-[#d2d2d7] dark:border-[#424245] safe-area-bottom">
        <div className="flex items-center justify-around px-2 h-16">
          {moduleItems.map(item => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1.5 px-2 rounded-xl transition-colors ${
                  isActive ? 'text-[#0066cc]' : 'text-[#86868b]'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                <span
                  className={`text-[10px] mt-0.5 truncate max-w-[52px] ${isActive ? 'font-medium' : ''}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Root Navigation
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f5f5f7]/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl backdrop-saturate-150 border-t border-[#d2d2d7] dark:border-[#424245] safe-area-bottom">
      <div className="flex items-center justify-around px-2 h-16">
        {filteredRootItems.map(item => {
          const isActive = activeModule === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1.5 px-2 rounded-xl transition-colors ${
                isActive ? 'text-[#0066cc]' : 'text-[#86868b]'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
