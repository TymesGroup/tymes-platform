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
        return 'Business';
      case ProfileType.PERSONAL:
      case 'PERSONAL':
        return 'Personal';
      default:
        return 'Personal';
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
          error.message === 'Invalid login credentials'
            ? 'Invalid email or password'
            : error.message
        );
      } else {
        setShowAccountModal(false);
        setEmail('');
        setPassword('');
      }
    } catch {
      setError('Error adding account');
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
        className={`hidden md:flex flex-col ${collapsed ? 'w-16' : 'w-60'} border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-200`}
      >
        {/* Logo */}
        <div
          className={`h-14 flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-zinc-100 dark:border-zinc-800`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              T
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tymes</span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Collapse sidebar"
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
              className="w-full p-2 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors flex justify-center"
              aria-label="Expand sidebar"
            >
              <PanelLeft size={18} />
            </button>
          </div>
        )}

        {/* Account Switcher */}
        <div className={`${collapsed ? 'px-2 py-3' : 'p-3'} relative`}>
          <button
            onClick={() => !collapsed && setShowAccountSwitcher(!showAccountSwitcher)}
            className={`w-full ${collapsed ? 'p-2 justify-center' : 'p-2.5'} rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2.5`}
            title={collapsed ? profile?.name : undefined}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {profile?.name || 'User'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {getProfileLabel(profile?.type || 'PERSONAL')}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform flex-shrink-0 ${showAccountSwitcher ? 'rotate-180' : ''}`}
                />
              </>
            )}
          </button>

          {/* Account Dropdown */}
          {showAccountSwitcher && !collapsed && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50">
              {otherAccounts.length > 0 && (
                <>
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-700">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                      Other accounts
                    </p>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {otherAccounts.map(account => (
                      <div
                        key={account.id}
                        className="flex items-center hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                      >
                        <button
                          onClick={() => handleSwitchAccount(account.id)}
                          className="flex-1 flex items-center gap-2.5 p-2.5"
                        >
                          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-medium">
                            {account.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                              {account.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">{account.email}</p>
                          </div>
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeAccount(account.id);
                          }}
                          className="p-2 mr-1 text-zinc-400 hover:text-red-500 transition-colors"
                          aria-label="Remove account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="p-2 border-t border-zinc-100 dark:border-zinc-700">
                <button
                  onClick={() => {
                    setShowAccountSwitcher(false);
                    setShowAccountModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-md transition-colors"
                >
                  <UserPlus size={16} />
                  Add account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Badge */}
        {isSuperAdmin && !collapsed && (
          <div className="px-3 mb-2">
            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Module Header */}
        {!isSuperAdmin && !isRootModule && !collapsed && (
          <div className="px-3 mb-2">
            <div className="p-2.5 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-100 dark:border-accent-900/30">
              <button
                onClick={() => onNavigate(ModuleType.EXPLORE)}
                className="flex items-center gap-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 mb-1 hover:underline"
              >
                <ArrowLeft size={12} /> Back
              </button>
              <p className="text-sm font-medium text-accent-900 dark:text-accent-100">
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
              className="w-full p-2 rounded-md bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 flex justify-center"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} space-y-0.5 overflow-y-auto`}>
          {/* SuperAdmin Navigation */}
          {isSuperAdmin &&
            superAdminMenu?.items.map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'} rounded-md text-sm transition-colors ${
                  activePage === item.id
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
                  className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'} rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
                  className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'} rounded-md text-sm transition-colors ${
                    activePage === item.id
                      ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <item.icon size={18} />
                  {!collapsed && item.label}
                </button>
              ))}
        </nav>

        {/* Bottom Actions */}
        <div
          className={`${collapsed ? 'p-2' : 'p-3'} border-t border-zinc-100 dark:border-zinc-800 space-y-0.5`}
        >
          {!isSuperAdmin && (
            <button
              onClick={() => onNavigate(ModuleType.PROFILE)}
              title={collapsed ? 'My Profile' : undefined}
              className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'} rounded-md text-sm transition-colors ${
                activeModule === ModuleType.PROFILE
                  ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <UserCog size={18} />
              {!collapsed && 'My Profile'}
            </button>
          )}
          <button
            onClick={toggleTheme}
            title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'} rounded-md text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
          </button>
          <button
            onClick={onLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'} rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
          >
            <LogOut size={18} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Add Account Modal */}
      {showAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setShowAccountModal(false);
            setEmail('');
            setPassword('');
            setError('');
          }}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-sm w-full border border-zinc-200 dark:border-zinc-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Add Account
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Sign in with another account
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAccountModal(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                  }}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-accent-600 text-white font-medium hover:bg-accent-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In & Add'}
                </button>

                <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
                  You will be signed out of the current account
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
