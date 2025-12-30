/**
 * Sidebar Component - Apple-inspired Design
 * Navegação lateral com design minimalista estilo Apple
 */

import React, { useState } from 'react';
import {
  LogOut,
  Moon,
  Sun,
  ArrowLeft,
  UserPlus,
  ChevronDown,
  X,
  Mail,
  Lock,
  Loader2,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  UserCog,
  Shield,
} from 'lucide-react';
import { ModuleType, ProfileType } from '../../types';
import { ROOT_NAV_ITEMS, MODULE_MENUS } from '../../constants/navigation';
import { useAuth } from '../../lib/AuthContext';

interface SidebarProps {
  activeProfile: ProfileType;
  activeModule: ModuleType | string;
  activePage: string;
  onNavigate: (module: ModuleType | string) => void;
  onPageChange: (page: string) => void;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeProfile,
  activeModule,
  activePage,
  onNavigate,
  onPageChange,
  theme,
  toggleTheme,
  onLogout,
}) => {
  const {
    profile,
    accounts,
    switchAccount,
    removeAccount,
    addAccount,
    loading: authLoading,
  } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSuperAdmin = activeProfile === ProfileType.SUPERADMIN;
  const superAdminMenu = MODULE_MENUS['SUPERADMIN'];

  const isRootModule =
    !isSuperAdmin &&
    [
      ModuleType.DASHBOARD,
      ModuleType.EXPLORE,
      ModuleType.AI_AGENT,
      ModuleType.SETTINGS,
      ModuleType.PROFILE,
    ].includes(activeModule as ModuleType);

  const navItemsToRender = isRootModule
    ? ROOT_NAV_ITEMS.filter(item => item.allowedProfiles.includes(activeProfile))
    : [];
  const currentModuleMenu =
    !isSuperAdmin && !isRootModule ? MODULE_MENUS[activeModule as string] : null;

  const getProfileLabel = (p: ProfileType | string) => {
    switch (p) {
      case ProfileType.SUPERADMIN:
      case 'SUPERADMIN':
        return 'Admin';
      case ProfileType.BUSINESS:
      case 'BUSINESS':
        return 'Negócios';
      case ProfileType.PERSONAL:
      case 'PERSONAL':
        return 'Pessoal';
      default:
        return 'Pessoal';
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await addAccount(email, password);
      if (error) {
        setError(
          error.message === 'Invalid login credentials' ? 'Email ou senha inválidos' : error.message
        );
      } else {
        setShowAccountModal(false);
        setEmail('');
        setPassword('');
      }
    } catch {
      setError('Erro ao adicionar conta');
    }
    setLoading(false);
  };

  const handleSwitchAccount = async (accountId: string) => {
    if (accountId === profile?.id || authLoading) return;
    setShowAccountSwitcher(false);
    await switchAccount(accountId);
  };

  const otherAccounts = accounts.filter(a => a.id !== profile?.id);

  return (
    <>
      <aside
        className={`hidden md:flex flex-col ${collapsed ? 'w-16' : 'w-60'} bg-[#f5f5f7] dark:bg-[#1d1d1f] border-r border-[#d2d2d7] dark:border-[#424245] transition-all duration-200`}
      >
        {/* Logo */}
        <div
          className={`h-12 flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-[#d2d2d7] dark:border-[#424245]`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              T
            </div>
            {!collapsed && (
              <span className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Tymes
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#2d2d2d] transition-colors"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>

        {/* Expand Button */}
        {collapsed && (
          <div className="p-2">
            <button
              onClick={() => setCollapsed(false)}
              className="w-full p-2 rounded-lg text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#2d2d2d] transition-colors flex justify-center"
            >
              <PanelLeft size={18} />
            </button>
          </div>
        )}

        {/* Account Switcher */}
        <div className={`${collapsed ? 'px-2 py-3' : 'p-3'} relative`}>
          <button
            onClick={() => !collapsed && setShowAccountSwitcher(!showAccountSwitcher)}
            className={`w-full ${collapsed ? 'p-2 justify-center' : 'p-3'} rounded-xl bg-white dark:bg-[#2d2d2d] hover:bg-[#e8e8ed] dark:hover:bg-[#3d3d3d] transition-colors flex items-center gap-3`}
            title={collapsed ? profile?.name : undefined}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                    {profile?.name || 'Usuário'}
                  </p>
                  <p className="text-[12px] text-[#86868b]">
                    {getProfileLabel(profile?.type || 'PERSONAL')}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[#86868b] transition-transform flex-shrink-0 ${showAccountSwitcher ? 'rotate-180' : ''}`}
                />
              </>
            )}
          </button>

          {/* Account Dropdown */}
          {showAccountSwitcher && !collapsed && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg border border-[#d2d2d7] dark:border-[#424245] overflow-hidden z-50">
              {otherAccounts.length > 0 && (
                <>
                  <div className="px-3 py-2 border-b border-[#d2d2d7] dark:border-[#424245]">
                    <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide">
                      Outras contas
                    </p>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {otherAccounts.map(account => (
                      <div
                        key={account.id}
                        className="flex items-center hover:bg-[#f5f5f7] dark:hover:bg-[#3d3d3d] transition-colors"
                      >
                        <button
                          onClick={() => handleSwitchAccount(account.id)}
                          className="flex-1 flex items-center gap-2.5 p-2.5"
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                            {account.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                              {account.name}
                            </p>
                            <p className="text-[11px] text-[#86868b] truncate">{account.email}</p>
                          </div>
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeAccount(account.id);
                          }}
                          className="p-2 mr-1 text-[#86868b] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="p-2 border-t border-[#d2d2d7] dark:border-[#424245]">
                <button
                  onClick={() => {
                    setShowAccountSwitcher(false);
                    setShowAccountModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2 text-[13px] font-medium text-[#0066cc] hover:bg-[#f5f5f7] dark:hover:bg-[#3d3d3d] rounded-lg transition-colors"
                >
                  <UserPlus size={16} />
                  Adicionar conta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Badge */}
        {isSuperAdmin && !collapsed && (
          <div className="px-3 mb-2">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-red-600 dark:text-red-400" />
                <span className="text-[13px] font-medium text-red-700 dark:text-red-300">
                  Painel Admin
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Module Header */}
        {!isSuperAdmin && !isRootModule && !collapsed && (
          <div className="px-3 mb-2">
            <div className="p-3 bg-white dark:bg-[#2d2d2d] rounded-xl border border-[#d2d2d7] dark:border-[#424245]">
              <button
                onClick={() => onNavigate(ModuleType.EXPLORE)}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[#0066cc] mb-1 hover:underline"
              >
                <ArrowLeft size={12} /> Voltar
              </button>
              <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                {currentModuleMenu?.title}
              </p>
            </div>
          </div>
        )}

        {/* Back Button (Collapsed) */}
        {!isSuperAdmin && !isRootModule && collapsed && (
          <div className="px-2 mb-2">
            <button
              onClick={() => onNavigate(ModuleType.EXPLORE)}
              className="w-full p-2 rounded-lg bg-white dark:bg-[#2d2d2d] text-[#0066cc] flex justify-center"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} space-y-1 overflow-y-auto`}>
          {/* SuperAdmin Navigation */}
          {isSuperAdmin &&
            superAdminMenu?.items.map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-[14px] transition-colors ${
                  activePage === item.id
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                    : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#2d2d2d]'
                }`}
              >
                <item.icon size={18} />
                {!collapsed && item.label}
              </button>
            ))}

          {/* Root Navigation */}
          {!isSuperAdmin &&
            isRootModule &&
            navItemsToRender.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-[14px] transition-colors ${
                    isActive
                      ? 'bg-white dark:bg-[#2d2d2d] text-[#0066cc] font-medium shadow-sm'
                      : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#2d2d2d]'
                  }`}
                >
                  <Icon size={18} />
                  {!collapsed && item.label}
                </button>
              );
            })}

          {/* Module Sub-Navigation */}
          {!isSuperAdmin &&
            !isRootModule &&
            currentModuleMenu?.items
              .filter(item => !item.allowedProfiles || item.allowedProfiles.includes(activeProfile))
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-[14px] transition-colors ${
                    activePage === item.id
                      ? 'bg-white dark:bg-[#2d2d2d] text-[#0066cc] font-medium shadow-sm'
                      : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#2d2d2d]'
                  }`}
                >
                  <item.icon size={18} />
                  {!collapsed && item.label}
                </button>
              ))}
        </nav>

        {/* Bottom Actions */}
        <div
          className={`${collapsed ? 'p-2' : 'p-3'} border-t border-[#d2d2d7] dark:border-[#424245] space-y-1`}
        >
          {!isSuperAdmin && (
            <button
              onClick={() => onNavigate(ModuleType.PROFILE)}
              title={collapsed ? 'Meu Perfil' : undefined}
              className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-[14px] transition-colors ${
                activeModule === ModuleType.PROFILE
                  ? 'bg-white dark:bg-[#2d2d2d] text-[#0066cc] font-medium shadow-sm'
                  : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#2d2d2d]'
              }`}
            >
              <UserCog size={18} />
              {!collapsed && 'Meu Perfil'}
            </button>
          )}
          <button
            onClick={toggleTheme}
            title={collapsed ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#2d2d2d] transition-colors`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro')}
          </button>
          <button
            onClick={onLogout}
            title={collapsed ? 'Sair' : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-[14px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
          >
            <LogOut size={18} />
            {!collapsed && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Add Account Modal - Apple Style */}
      {showAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          onClick={() => {
            setShowAccountModal(false);
            setEmail('');
            setPassword('');
            setError('');
          }}
        >
          <div
            className="bg-white dark:bg-[#1d1d1f] rounded-[20px] shadow-2xl max-w-[360px] w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Adicionar Conta
                  </h2>
                  <p className="text-[14px] text-[#86868b] mt-1">Entre com outra conta</p>
                </div>
                <button
                  onClick={() => {
                    setShowAccountModal(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                  }}
                  className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors"
                >
                  <X size={18} className="text-[#86868b]" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-[13px]">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]"
                      size={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2d2d2d] border border-[#d2d2d7] dark:border-[#424245] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]"
                      size={18}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2d2d2d] border border-[#d2d2d7] dark:border-[#424245] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0066cc] text-white text-[15px] font-normal hover:bg-[#0055b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar e Adicionar'}
                </button>

                <p className="text-[12px] text-center text-[#86868b]">
                  Você será desconectado da conta atual
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
