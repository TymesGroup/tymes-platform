import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleType, ProfileType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { TopBar } from './TopBar';
import {
  ArrowLeft,
  Settings,
  X,
  Moon,
  Sun,
  LogOut,
  User,
  Bell,
  Shield,
  CreditCard,
  ShoppingBag,
  Bookmark,
  ListOrdered,
  Sliders,
} from 'lucide-react';
import { MODULE_MENUS } from '../../constants/navigation';
import { useBag } from '../../lib/BagContext';
import { useUnifiedBag } from '../../lib/UnifiedBagContext';
import { useAuth } from '../../lib/AuthContext';
import { PROFILE_TO_ACCOUNT } from '../../router/types';

interface LayoutProps {
  children: React.ReactNode;
  activeProfile: ProfileType;
  activeModule: ModuleType | string;
  activePage: string;
  onNavigate: (module: ModuleType | string) => void;
  onPageChange: (page: string) => void;
  onChangeProfile: (profile: ProfileType) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeProfile,
  activeModule,
  activePage,
  onNavigate,
  onPageChange,
  onChangeProfile,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { items: bagItems } = useBag();
  const { totalItems: unifiedBagItems } = useUnifiedBag();
  const { profile } = useAuth();

  // Combined bag count
  const totalBagCount = bagItems.length + unifiedBagItems;

  // Check if in a root module or sub-module
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

  // Get current module title
  const currentModuleMenu = MODULE_MENUS[activeModule as string];
  const moduleTitle = currentModuleMenu?.title || 'Tymes';

  // Function to go back to Explore
  const handleBack = () => {
    onNavigate(ModuleType.EXPLORE);
  };

  // Function to navigate to global pages
  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';
  const navigate = useNavigate();

  const goToBag = () => {
    navigate(`/${accountType}/bag`);
  };

  const goToCheckout = () => {
    navigate(`/${accountType}/checkout`);
  };

  const goToOrders = () => {
    navigate(`/${accountType}/orders`);
  };

  const goToSaves = () => {
    navigate(`/${accountType}/saves`);
  };

  const handleNavigateToProduct = (productId: string) => {
    navigate(`/${accountType}/shop/product/${productId}`);
  };

  const handleNavigateToModule = (moduleId: string) => {
    onNavigate(moduleId);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar
        activeProfile={activeProfile}
        activeModule={activeModule}
        activePage={activePage}
        onNavigate={onNavigate}
        onPageChange={onPageChange}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* TopBar - Desktop */}
      <TopBar
        onNavigateToCheckout={goToBag}
        onNavigateToOrders={goToOrders}
        onNavigateToSaves={goToSaves}
        onNavigateToProduct={handleNavigateToProduct}
        onNavigateToModule={handleNavigateToModule}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 px-3 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="w-10">
            {!isRootModule ? (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft size={22} />
              </button>
            ) : null}
          </div>

          {/* Center - Title */}
          <div className="flex items-center gap-2">
            {isRootModule ? (
              <>
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  T
                </div>
                <span className="font-bold text-lg">Tymes</span>
              </>
            ) : (
              <span className="font-semibold text-lg">{moduleTitle}</span>
            )}
          </div>

          {/* Right side - Quick actions + Settings */}
          <div className="flex items-center gap-1">
            {/* Bag button with badge */}
            <button
              onClick={goToBag}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            >
              <ShoppingBag size={20} />
              {totalBagCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalBagCount > 9 ? '9+' : totalBagCount}
                </span>
              )}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Slide Panel - Mobile */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          showSettings ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowSettings(false)} />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 ease-out ${
            showSettings ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-semibold text-lg">
              {!isRootModule ? `Config. ${moduleTitle}` : 'Configurações'}
            </h2>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 -mr-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Panel Content */}
          <div
            className="p-4 space-y-2 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          >
            {/* Module Settings - quando dentro de um módulo */}
            {!isRootModule && currentModuleMenu && (
              <>
                <button
                  onClick={() => {
                    onPageChange('SETTINGS');
                    setShowSettings(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <Sliders size={20} />
                  <span className="flex-1 text-left font-medium">
                    Configurações do {moduleTitle}
                  </span>
                </button>

                <div className="border-t border-zinc-200 dark:border-zinc-800 my-3" />
              </>
            )}

            {/* Quick Actions - Bolsa, Pedidos, Salvos */}
            <p className="text-xs text-zinc-500 uppercase font-medium px-1 mb-2">Ações Rápidas</p>

            <button
              onClick={() => {
                goToBag();
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="flex-1 text-left">Bolsa</span>
              {totalBagCount > 0 && (
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
                  {totalBagCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                goToOrders();
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ListOrdered size={20} />
              <span className="flex-1 text-left">Meus Pedidos</span>
            </button>

            <button
              onClick={() => {
                goToSaves();
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bookmark size={20} />
              <span className="flex-1 text-left">Salvos</span>
            </button>

            <div className="border-t border-zinc-200 dark:border-zinc-800 my-3" />

            <p className="text-xs text-zinc-500 uppercase font-medium px-1 mb-2">Conta</p>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="flex-1 text-left">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => {
                onNavigate(ModuleType.PROFILE);
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <User size={20} />
              <span className="flex-1 text-left">Meus Dados</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => {
                onNavigate(ModuleType.SETTINGS);
                onPageChange('NOTIFICATIONS');
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bell size={20} />
              <span className="flex-1 text-left">Notificações</span>
            </button>

            {/* Privacy */}
            <button
              onClick={() => {
                onNavigate(ModuleType.SETTINGS);
                onPageChange('PRIVACY');
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Shield size={20} />
              <span className="flex-1 text-left">Privacidade</span>
            </button>

            {/* Subscription */}
            <button
              onClick={() => {
                onNavigate(ModuleType.SETTINGS);
                onPageChange('SUBSCRIPTION');
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <CreditCard size={20} />
              <span className="flex-1 text-left">Assinatura</span>
            </button>

            {/* All Settings */}
            <button
              onClick={() => {
                onNavigate(ModuleType.SETTINGS);
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Settings size={20} />
              <span className="flex-1 text-left">Todas as Configurações</span>
            </button>

            <div className="border-t border-zinc-200 dark:border-zinc-800 my-3" />

            {/* Logout */}
            <button
              onClick={() => {
                onLogout();
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              <span className="flex-1 text-left">Sair</span>
            </button>
          </div>

          {/* Account Type Badge */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Tipo de conta</p>
              <p className="font-medium">
                {activeProfile === ProfileType.BUSINESS
                  ? 'Conta Empresarial'
                  : activeProfile === ProfileType.SUPERADMIN
                    ? 'Super Admin'
                    : 'Conta Pessoal'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeProfile={activeProfile}
        activeModule={activeModule}
        activePage={activePage}
        onNavigate={onNavigate}
        onPageChange={onPageChange}
      />

      {/* Main Content - Ajustado para mobile com padding bottom para o nav */}
      <main className="flex-1 overflow-auto pt-14 md:pt-[76px] pb-20 md:pb-0 md:pr-3 relative">
        <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-full">{children}</div>
      </main>
    </div>
  );
};
