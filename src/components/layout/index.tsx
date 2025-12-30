import React, { useState } from 'react';
import { ModuleType, ProfileType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
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
  ShoppingCart,
  Heart,
  ListOrdered,
  Sliders,
} from 'lucide-react';
import { MODULE_MENUS } from '../../constants/navigation';
import { useCart } from '../../lib/CartContext';
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
  const { items: cartItems } = useCart();
  const { profile } = useAuth();

  // Check if in a root module or sub-module
  const isRootModule = [
    ModuleType.DASHBOARD,
    ModuleType.EXPLORE,
    ModuleType.AI_AGENT,
    ModuleType.SETTINGS,
    ModuleType.PROFILE,
  ].includes(activeModule as ModuleType);

  // Get current module title
  const currentModuleMenu = MODULE_MENUS[activeModule as string];
  const moduleTitle = currentModuleMenu?.title || 'Tymes';

  // Function to go back to Explore
  const handleBack = () => {
    onNavigate(ModuleType.EXPLORE);
  };

  // Function to navigate to global pages
  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  const goToCart = () => {
    window.location.hash = `/${accountType}/shop/cart`;
  };

  const goToOrders = () => {
    window.location.hash = `/${accountType}/orders`;
  };

  const goToFavorites = () => {
    window.location.hash = `/${accountType}/favorites`;
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
            {/* Cart button with badge */}
            <button
              onClick={goToCart}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItems.length > 9 ? '9+' : cartItems.length}
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

            {/* Quick Actions - Carrinho, Pedidos, Favoritos */}
            <p className="text-xs text-zinc-500 uppercase font-medium px-1 mb-2">Ações Rápidas</p>

            <button
              onClick={() => {
                goToCart();
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="flex-1 text-left">Carrinho</span>
              {cartItems.length > 0 && (
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
                  {cartItems.length}
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
                goToFavorites();
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Heart size={20} />
              <span className="flex-1 text-left">Favoritos</span>
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
      <main className="flex-1 overflow-auto pt-14 md:pt-0 pb-20 md:pb-0 relative">
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-full">{children}</div>
      </main>
    </div>
  );
};
