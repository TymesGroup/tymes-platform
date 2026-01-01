/**
 * AppRouter - Centralized route configuration
 *
 * Hierarchical structure:
 * /{account-type}/{module}/{feature}/{action}
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, Profile } from '../lib/AuthContext';
import { ProfileType } from '../types';
import { PROFILE_TO_ACCOUNT } from './types';

// Guards
import { AuthGuard, GuestGuard, AccountGuard, AdminOnlyGuard } from './guards';

// Layouts
import { Layout } from '../components/layout';

// Lazy loaded modules for better performance
const Landing = lazy(() => import('../modules/landing').then(m => ({ default: m.Landing })));
const ModuleLanding = lazy(() =>
  import('../modules/landing/ModuleLanding').then(m => ({ default: m.ModuleLanding }))
);
const Auth = lazy(() => import('../modules/auth').then(m => ({ default: m.Auth })));
const OnboardingView = lazy(() =>
  import('../modules/onboarding').then(m => ({ default: m.OnboardingView }))
);
const DashboardView = lazy(() =>
  import('../modules/dashboard').then(m => ({ default: m.DashboardView }))
);
const ExploreView = lazy(() =>
  import('../modules/explore').then(m => ({ default: m.ExploreView }))
);
const AIAgentView = lazy(() => import('../modules/ai').then(m => ({ default: m.AIAgentView })));
const SettingsView = lazy(() =>
  import('../modules/settings').then(m => ({ default: m.SettingsView }))
);
const ProfileView = lazy(() =>
  import('../modules/profile').then(m => ({ default: m.ProfileView }))
);
const ShopModule = lazy(() => import('../modules/shop').then(m => ({ default: m.ShopModule })));
const ClassModule = lazy(() => import('../modules/class').then(m => ({ default: m.ClassModule })));
const WorkModule = lazy(() => import('../modules/work').then(m => ({ default: m.WorkModule })));
const SocialModule = lazy(() =>
  import('../modules/social').then(m => ({ default: m.SocialModule }))
);
const SuperAdminModule = lazy(() =>
  import('../modules/superadmin').then(m => ({ default: m.SuperAdminModule }))
);

// Global Pages
import { CheckoutPage, OrdersPage, SavesPage, NotificationsPage, BagPage } from '../modules/global';

// Public Pages
const AboutPage = lazy(() => import('../modules/public/pages/AboutPage'));
const BlogPage = lazy(() => import('../modules/public/pages/BlogPage'));
const CareersPage = lazy(() => import('../modules/public/pages/CareersPage'));
const PressPage = lazy(() => import('../modules/public/pages/PressPage'));
const HelpCenterPage = lazy(() => import('../modules/public/pages/HelpCenterPage'));
const DocumentationPage = lazy(() => import('../modules/public/pages/DocumentationPage'));
const ApiPage = lazy(() => import('../modules/public/pages/ApiPage'));
const StatusPage = lazy(() => import('../modules/public/pages/StatusPage'));
const TermsPage = lazy(() => import('../modules/public/pages/TermsPage'));
const PrivacyPage = lazy(() => import('../modules/public/pages/PrivacyPage'));
const CookiesPage = lazy(() => import('../modules/public/pages/CookiesPage'));
const LgpdPage = lazy(() => import('../modules/public/pages/LgpdPage'));

/**
 * Loading fallback component
 */
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm text-zinc-500">Carregando...</p>
    </div>
  </div>
);

/**
 * Redirect to correct account path based on user profile
 */
const AccountRedirect: React.FC = () => {
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/auth/login" replace />;
  const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];
  return <Navigate to={`/${accountType}/dashboard`} replace />;
};

/**
 * Parse URL path to extract module and feature
 */
function parsePathInfo(pathname: string): { module: string; feature: string; id?: string } {
  const parts = pathname.split('/').filter(Boolean);
  // parts[0] = account type (personal/business/admin)
  // parts[1] = module
  // parts[2] = feature
  // parts[3] = id
  return {
    module: parts[1] || 'dashboard',
    feature: parts[2] || 'overview',
    id: parts[3],
  };
}

/**
 * Map module names from enum to URL slug
 */
function moduleToSlug(module: string): string {
  const mapping: Record<string, string> = {
    DASHBOARD: 'dashboard',
    EXPLORE: 'explore',
    AI_AGENT: 'ai',
    SETTINGS: 'settings',
    PROFILE: 'profile',
    SHOP: 'shop',
    CLASS: 'class',
    WORK: 'work',
    SOCIAL: 'social',
    CHECKOUT: 'checkout',
    ORDERS: 'orders',
    SAVES: 'saves',
    NOTIFICATIONS: 'notifications',
    BAG: 'bag',
  };
  return mapping[module.toUpperCase()] || module.toLowerCase();
}

/**
 * Map URL slug to module name for display
 */
function slugToModule(slug: string): string {
  const mapping: Record<string, string> = {
    dashboard: 'DASHBOARD',
    explore: 'EXPLORE',
    ai: 'AI_AGENT',
    settings: 'SETTINGS',
    profile: 'PROFILE',
    shop: 'SHOP',
    class: 'CLASS',
    work: 'WORK',
    social: 'SOCIAL',
    checkout: 'CHECKOUT',
    orders: 'ORDERS',
    saves: 'SAVES',
    notifications: 'NOTIFICATIONS',
    bag: 'BAG',
  };
  return mapping[slug.toLowerCase()] || slug.toUpperCase();
}

/**
 * Authenticated layout wrapper - uses location instead of params
 */
interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const profileType = profile.type as ProfileType;
  const accountType = PROFILE_TO_ACCOUNT[profileType];
  const isAdmin = profileType === ProfileType.SUPERADMIN;
  const { module, feature } = parsePathInfo(location.pathname);

  // For admin, the module is always SUPERADMIN and the page is the first segment after /admin
  const activeModule = isAdmin ? 'SUPERADMIN' : slugToModule(module);
  const activePage = isAdmin ? module.toUpperCase() : feature.toUpperCase();

  const handleNavigate = (mod: string) => {
    if (isAdmin) {
      // For admin, navigate to admin panel pages
      const slug = mod.toLowerCase().replace('_', '-');
      window.location.href = `/admin/${slug}`;
    } else {
      // Convert module name to URL slug
      const slug = moduleToSlug(mod);
      window.location.href = `/${accountType}/${slug}`;
    }
  };

  const handlePageChange = (page: string) => {
    if (isAdmin) {
      // For admin, the page is the second level of the route
      const slug = page.toLowerCase().replace('_', '-');
      window.location.href = `/admin/${slug}`;
    } else {
      window.location.href = `/${accountType}/${module}/${page.toLowerCase()}`;
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <Layout
      activeProfile={profileType}
      activeModule={activeModule}
      activePage={activePage}
      onNavigate={handleNavigate}
      onPageChange={handlePageChange}
      onChangeProfile={() => {}}
      onLogout={handleLogout}
    >
      {children}
    </Layout>
  );
};

/**
 * Module page wrapper
 */
interface ModulePageProps {
  module: 'shop' | 'class' | 'work' | 'social';
}

const ModulePage: React.FC<ModulePageProps> = ({ module }) => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const profileType = profile.type as ProfileType;
  const { feature, id } = parsePathInfo(location.pathname);

  // Handle special pages with IDs (e.g., product_details, course_details, service_details)
  let page = feature.toUpperCase();
  let itemId = id;

  // If the feature contains an ID pattern like "product_details:123", extract it
  if (feature.includes(':')) {
    const [pagePart, idPart] = feature.split(':');
    page = pagePart.toUpperCase();
    itemId = idPart;
  }

  const handleNavigate = (newPage: string) => {
    const accountType = PROFILE_TO_ACCOUNT[profileType];

    // Handle navigation with IDs (e.g., PRODUCT_DETAILS:123)
    if (newPage.includes(':')) {
      const [pagePart, idPart] = newPage.split(':');
      window.location.href = `/${accountType}/${module}/${pagePart.toLowerCase()}/${idPart}`;
    } else {
      window.location.href = `/${accountType}/${module}/${newPage.toLowerCase()}`;
    }
  };

  const props = { page, profile: profileType, onNavigate: handleNavigate, itemId };

  switch (module) {
    case 'shop':
      return <ShopModule {...props} />;
    case 'class':
      return <ClassModule {...props} />;
    case 'work':
      return <WorkModule {...props} />;
    case 'social':
      return <SocialModule {...props} />;
    default:
      return null;
  }
};

/**
 * Admin page wrapper
 */
const AdminPage: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const { module } = parsePathInfo(location.pathname);
  // Convert URL slug to page ID (e.g., dashboard -> DASHBOARD, system-settings -> SYSTEM_SETTINGS)
  const page = module.toUpperCase().replace(/-/g, '_');

  const handleNavigate = (newPage: string) => {
    // Convert page ID to slug (e.g., SYSTEM_SETTINGS -> system-settings)
    const slug = newPage.toLowerCase().replace(/_/g, '-');
    window.location.href = `/admin/${slug}`;
  };

  return (
    <SuperAdminModule page={page} profile={ProfileType.SUPERADMIN} onNavigate={handleNavigate} />
  );
};

/**
 * Global page wrappers
 */
const GlobalCheckoutPage: React.FC = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading state while profile is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-zinc-500">Faça login para continuar</p>
        </div>
      </div>
    );
  }

  const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];

  return (
    <CheckoutPage
      onBack={() => {
        navigate(`/${accountType}/bag`);
      }}
      onSuccess={() => {
        navigate(`/${accountType}/orders`);
      }}
    />
  );
};

const GlobalOrdersPage: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-zinc-500">Faça login para continuar</p>
        </div>
      </div>
    );
  }

  const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];

  return (
    <OrdersPage
      onBack={() => {
        window.location.href = `/${accountType}/dashboard`;
      }}
    />
  );
};

const GlobalSavesPage: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-zinc-500">Faça login para continuar</p>
        </div>
      </div>
    );
  }

  const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];

  return (
    <SavesPage
      onBack={() => {
        window.location.href = `/${accountType}/dashboard`;
      }}
      onViewProduct={(productId, moduleType) => {
        window.location.href = `/${accountType}/shop/product/${productId}`;
      }}
    />
  );
};

const GlobalNotificationsPage: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-zinc-500">Faça login para continuar</p>
        </div>
      </div>
    );
  }

  const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];

  return (
    <NotificationsPage
      onBack={() => {
        window.location.href = `/${accountType}/dashboard`;
      }}
    />
  );
};

const GlobalBagPage: React.FC = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-zinc-500">Faça login para continuar</p>
        </div>
      </div>
    );
  }

  const accountType = PROFILE_TO_ACCOUNT[profile.type as ProfileType];

  return (
    <BagPage
      onBack={() => {
        navigate(`/${accountType}/explore`);
      }}
      onCheckout={() => {
        navigate(`/${accountType}/checkout`);
      }}
    />
  );
};

/**
 * Shared account routes - used by both Personal and Business accounts
 * Eliminates duplication between PersonalRoutes and BusinessRoutes
 */
interface SharedRoutesProps {
  profile: any;
  profileType: ProfileType;
}

const SharedRoutes: React.FC<SharedRoutesProps> = ({ profile, profileType }) => {
  const accountType = PROFILE_TO_ACCOUNT[profileType];

  const handleOpenModule = (mod: string) => {
    window.location.href = `/${accountType}/${mod.toLowerCase()}`;
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView profile={profileType} />} />
        <Route
          path="explore"
          element={<ExploreView profile={profileType} onOpenModule={handleOpenModule} />}
        />
        <Route path="ai" element={<AIAgentView profile={profileType} />} />
        <Route path="ai/chat/:chatId" element={<AIAgentView profile={profileType} />} />
        <Route path="settings" element={<SettingsView profile={profileType} />} />
        <Route path="settings/*" element={<SettingsView profile={profileType} />} />
        <Route path="profile" element={<ProfileView />} />

        {/* Global Pages - accessible from any module */}
        <Route path="checkout" element={<GlobalCheckoutPage />} />
        <Route path="orders" element={<GlobalOrdersPage />} />
        <Route path="saves" element={<GlobalSavesPage />} />
        <Route path="notifications" element={<GlobalNotificationsPage />} />
        <Route path="bag" element={<GlobalBagPage />} />

        {/* Module Routes */}
        <Route path="shop" element={<ModulePage module="shop" />} />
        <Route path="shop/:feature" element={<ModulePage module="shop" />} />
        <Route path="shop/:feature/:id" element={<ModulePage module="shop" />} />
        <Route path="class" element={<ModulePage module="class" />} />
        <Route path="class/:feature" element={<ModulePage module="class" />} />
        <Route path="class/:feature/:id" element={<ModulePage module="class" />} />
        <Route path="work" element={<ModulePage module="work" />} />
        <Route path="work/:feature" element={<ModulePage module="work" />} />
        <Route path="work/:feature/:id" element={<ModulePage module="work" />} />
        <Route path="social" element={<ModulePage module="social" />} />
        <Route path="social/:feature" element={<ModulePage module="social" />} />
        <Route path="social/:feature/:id" element={<ModulePage module="social" />} />

        {/* Catch invalid routes */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

/**
 * Personal account routes - uses SharedRoutes
 */
const PersonalRoutes: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const { profile: authProfile } = useAuth();
  const profileType = (authProfile?.type as ProfileType) || ProfileType.PERSONAL;
  return <SharedRoutes profile={profile} profileType={profileType} />;
};

/**
 * Business account routes - uses SharedRoutes
 */
const BusinessRoutes: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const { profile: authProfile } = useAuth();
  const profileType = (authProfile?.type as ProfileType) || ProfileType.BUSINESS;
  return <SharedRoutes profile={profile} profileType={profileType} />;
};

/**
 * Admin routes
 */
const AdminRoutes: React.FC = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AdminPage />} />
    <Route path="users" element={<AdminPage />} />
    <Route path="users/:userId" element={<AdminPage />} />
    <Route path="modules" element={<AdminPage />} />
    <Route path="plans" element={<AdminPage />} />
    <Route path="analytics" element={<AdminPage />} />
    <Route path="system" element={<AdminPage />} />
    <Route path="system-settings" element={<AdminPage />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

/**
 * Main Router Component
 */
export const AppRouter: React.FC = () => {
  const { profile, loading, signIn, signUp } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto animate-pulse">
            T
          </div>
          <p className="text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <GuestGuard>
              <Landing
                onEnter={() => {
                  window.location.href = '/auth/login';
                }}
              />
            </GuestGuard>
          }
        />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/login"
          element={
            <GuestGuard>
              <Auth
                onLogin={() => {}}
                onBack={() => {
                  window.location.href = '/';
                }}
                signIn={signIn}
                signUp={signUp}
              />
            </GuestGuard>
          }
        />
        <Route
          path="/auth/register"
          element={
            <GuestGuard>
              <Auth
                onLogin={() => {}}
                onBack={() => {
                  window.location.href = '/';
                }}
                signIn={signIn}
                signUp={signUp}
              />
            </GuestGuard>
          }
        />
        <Route
          path="/auth/register/:type"
          element={
            <GuestGuard>
              <Auth
                onLogin={() => {}}
                onBack={() => {
                  window.location.href = '/';
                }}
                signIn={signIn}
                signUp={signUp}
              />
            </GuestGuard>
          }
        />

        {/* Module Previews */}
        <Route path="/preview/:module" element={<ModuleLanding module="shop" />} />
        <Route path="/shop" element={<ModuleLanding module="shop" />} />
        <Route path="/class" element={<ModuleLanding module="class" />} />
        <Route path="/work" element={<ModuleLanding module="work" />} />
        <Route path="/social" element={<ModuleLanding module="social" />} />

        {/* Public Pages - Empresa */}
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/carreiras" element={<CareersPage />} />
        <Route path="/imprensa" element={<PressPage />} />

        {/* Public Pages - Suporte */}
        <Route path="/ajuda" element={<HelpCenterPage />} />
        <Route path="/documentacao" element={<DocumentationPage />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/status" element={<StatusPage />} />

        {/* Public Pages - Legal */}
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/lgpd" element={<LgpdPage />} />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            <AuthGuard>
              <OnboardingView />
            </AuthGuard>
          }
        />

        {/* Legacy redirect */}
        <Route
          path="/app"
          element={
            <AuthGuard>
              <AccountRedirect />
            </AuthGuard>
          }
        />

        {/* Personal Account */}
        <Route
          path="/personal/*"
          element={
            <AuthGuard>
              <AccountGuard allowedAccounts={['personal', 'business']}>
                <AuthenticatedLayout>
                  <PersonalRoutes profile={profile} />
                </AuthenticatedLayout>
              </AccountGuard>
            </AuthGuard>
          }
        />

        {/* Business Account */}
        <Route
          path="/business/*"
          element={
            <AuthGuard>
              <AccountGuard allowedAccounts={['business']}>
                <AuthenticatedLayout>
                  <BusinessRoutes profile={profile} />
                </AuthenticatedLayout>
              </AccountGuard>
            </AuthGuard>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <AuthGuard>
              <AdminOnlyGuard>
                <AuthenticatedLayout>
                  <AdminRoutes />
                </AuthenticatedLayout>
              </AdminOnlyGuard>
            </AuthGuard>
          }
        />

        {/* Fallback - only redirect if truly unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
