import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

// Types
export interface PlatformModule {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'beta';
  sort_order: number;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  modules_included: string[];
  max_storage_gb: number;
  is_highlighted: boolean;
  status: 'active' | 'inactive';
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  started_at: string;
  expires_at: string | null;
  plan?: Plan;
}

export interface SystemSettings {
  platform_name: string;
  maintenance_mode: boolean;
  default_language: string;
  [key: string]: any;
}

interface PlatformContextType {
  // Modules
  modules: PlatformModule[];
  activeModules: PlatformModule[];
  isModuleActive: (slug: string) => boolean;
  userEnabledModules: string[];
  canAccessModule: (slug: string) => boolean;

  // Plans & Subscription
  plans: Plan[];
  userSubscription: UserSubscription | null;
  userPlan: Plan | null;

  // Settings
  settings: SystemSettings;
  isMaintenanceMode: boolean;

  // Loading states
  loading: boolean;

  // Actions
  refreshModules: () => Promise<void>;
  refreshPlans: () => Promise<void>;
  refreshUserSubscription: () => Promise<void>;
  updateUserModules: (modules: string[]) => Promise<{ success: boolean; error?: string }>;
}

const defaultSettings: SystemSettings = {
  platform_name: 'Tymes',
  maintenance_mode: false,
  default_language: 'pt-BR',
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [modules, setModules] = useState<PlatformModule[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Fetch platform modules
  const refreshModules = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('platform_modules')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  }, []);

  // Fetch plans
  const refreshPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  }, []);

  // Fetch user subscription
  const refreshUserSubscription = useCallback(async () => {
    if (!user?.id) {
      setUserSubscription(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, plan:plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setUserSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
    }
  }, [user?.id]);

  // Fetch system settings
  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('system_settings').select('key, value');

      if (error) {
        // Se não tiver permissão (não é admin), usar defaults
        console.log('Using default settings');
        return;
      }

      const settingsMap = (data || []).reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, any>
      );

      setSettings({ ...defaultSettings, ...settingsMap });
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  }, []);

  // Update user enabled modules
  const updateUserModules = useCallback(
    async (modulesList: string[]) => {
      if (!user?.id) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            enabled_modules: modulesList,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [user?.id]
  );

  // Initial load
  useEffect(() => {
    const loadPlatformData = async () => {
      setLoading(true);
      await Promise.all([refreshModules(), refreshPlans(), fetchSettings()]);
      setLoading(false);
    };

    loadPlatformData();
  }, [refreshModules, refreshPlans, fetchSettings]);

  // Load user subscription when user changes
  useEffect(() => {
    if (user?.id) {
      refreshUserSubscription();
    }
  }, [user?.id, refreshUserSubscription]);

  // Real-time subscriptions for modules and settings
  useEffect(() => {
    // Subscribe to module changes
    const modulesSubscription = supabase
      .channel('platform_modules_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platform_modules' }, () => {
        console.log('📦 Modules updated');
        refreshModules();
      })
      .subscribe();

    // Subscribe to plan changes
    const plansSubscription = supabase
      .channel('plans_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plans' }, () => {
        console.log('💳 Plans updated');
        refreshPlans();
      })
      .subscribe();

    return () => {
      modulesSubscription.unsubscribe();
      plansSubscription.unsubscribe();
    };
  }, [refreshModules, refreshPlans]);

  // Computed values
  const activeModules = modules.filter(m => m.status === 'active');

  const isModuleActive = useCallback(
    (slug: string) => {
      const module = modules.find(m => m.slug === slug);
      return module?.status === 'active';
    },
    [modules]
  );

  const userEnabledModules = profile?.enabled_modules || [];

  const canAccessModule = useCallback(
    (slug: string) => {
      // Check if module is active on platform
      if (!isModuleActive(slug)) return false;

      // Check if user has enabled this module
      if (!userEnabledModules.includes(slug)) return false;

      // Check if user's plan includes this module (if they have a subscription)
      if (userSubscription?.plan) {
        const planModules = userSubscription.plan.modules_included || [];
        if (planModules.length > 0 && !planModules.includes(slug)) {
          return false;
        }
      }

      return true;
    },
    [isModuleActive, userEnabledModules, userSubscription]
  );

  const userPlan = userSubscription?.plan || plans.find(p => p.slug === 'free') || null;
  const isMaintenanceMode = settings.maintenance_mode === true;

  return (
    <PlatformContext.Provider
      value={{
        modules,
        activeModules,
        isModuleActive,
        userEnabledModules,
        canAccessModule,
        plans,
        userSubscription,
        userPlan,
        settings,
        isMaintenanceMode,
        loading,
        refreshModules,
        refreshPlans,
        refreshUserSubscription,
        updateUserModules,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within PlatformProvider');
  }
  return context;
}
