import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

// Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  totalRevenue: number;
  usersByType: { type: string; count: number }[];
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
  created_at: string;
  subscribers_count?: number;
}

export interface PlatformModule {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'beta';
  sort_order: number;
  created_at: string;
  users_count?: number;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  phone: string | null;
  created_at: string;
  last_login_at: string | null;
  enabled_modules: string[] | null;
  plan_id: string | null;
}

// Hook para estatísticas do dashboard
export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Total de usuários
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Usuários ativos
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Novos usuários hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Novos usuários na semana
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: newUsersWeek } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Usuários por tipo
      const { data: typeData } = await supabase.from('profiles').select('type');

      const typeCounts = (typeData || []).reduce((acc: Record<string, number>, user) => {
        acc[user.type] = (acc[user.type] || 0) + 1;
        return acc;
      }, {});

      const usersByType = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count: count as number,
      }));

      // Calcular receita (baseado em assinaturas ativas)
      const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('plan_id, plans(price)')
        .eq('status', 'active');

      const totalRevenue = (subscriptions || []).reduce((acc, sub: any) => {
        return acc + (sub.plans?.price || 0);
      }, 0);

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        newUsersWeek: newUsersWeek || 0,
        totalRevenue,
        usersByType,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook para gerenciar usuários
export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (options?: {
      page?: number;
      pageSize?: number;
      search?: string;
      type?: string;
      status?: string;
    }) => {
      try {
        setLoading(true);
        const { page = 1, pageSize = 10, search, type, status } = options || {};

        let query = supabase.from('profiles').select('*', { count: 'exact' });

        if (type && type !== 'all') {
          query = query.eq('type', type);
        }

        if (status && status !== 'all') {
          query = query.eq('status', status);
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const {
          data,
          count,
          error: queryError,
        } = await query.order('created_at', { ascending: false }).range(from, to);

        if (queryError) throw queryError;

        setUsers(data || []);
        setTotalCount(count || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateUser = useCallback(async (userId: string, data: Partial<AdminUser>) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) throw updateError;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      const { error: deleteError } = await supabase.from('profiles').delete().eq('id', userId);

      if (deleteError) throw deleteError;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, totalCount, loading, error, fetchUsers, updateUser, deleteUser };
}

// Hook para gerenciar planos
export function useAdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);

      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (plansError) throw plansError;

      // Contar assinantes por plano
      const plansWithCount = await Promise.all(
        (plansData || []).map(async plan => {
          const { count } = await supabase
            .from('user_subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('plan_id', plan.id)
            .eq('status', 'active');

          return {
            ...plan,
            subscribers_count: count || 0,
          };
        })
      );

      setPlans(plansWithCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlan = useCallback(
    async (planId: string, data: Partial<Plan>) => {
      try {
        const { error: updateError } = await supabase
          .from('plans')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', planId);

        if (updateError) throw updateError;
        await fetchPlans();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [fetchPlans]
  );

  const createPlan = useCallback(
    async (data: Omit<Plan, 'id' | 'created_at' | 'subscribers_count'>) => {
      try {
        const { error: insertError } = await supabase.from('plans').insert(data);

        if (insertError) throw insertError;
        await fetchPlans();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [fetchPlans]
  );

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, fetchPlans, updatePlan, createPlan };
}

// Hook para gerenciar módulos
export function useAdminModules() {
  const [modules, setModules] = useState<PlatformModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);

      const { data: modulesData, error: modulesError } = await supabase
        .from('platform_modules')
        .select('*')
        .order('sort_order', { ascending: true });

      if (modulesError) throw modulesError;

      // Contar usuários por módulo
      const modulesWithCount = await Promise.all(
        (modulesData || []).map(async module => {
          const { data: usersWithModule } = await supabase
            .from('profiles')
            .select('enabled_modules');

          const usersCount = (usersWithModule || []).filter(u =>
            u.enabled_modules?.includes(module.slug)
          ).length;

          return {
            ...module,
            users_count: usersCount,
          };
        })
      );

      setModules(modulesWithCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateModule = useCallback(
    async (moduleId: string, data: Partial<PlatformModule>) => {
      try {
        const { error: updateError } = await supabase
          .from('platform_modules')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', moduleId);

        if (updateError) throw updateError;

        // Realtime will handle the refresh, but we can also refresh manually
        await fetchModules();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [fetchModules]
  );

  const createModule = useCallback(
    async (data: Omit<PlatformModule, 'id' | 'created_at' | 'users_count'>) => {
      try {
        const { error: insertError } = await supabase.from('platform_modules').insert(data);

        if (insertError) throw insertError;
        await fetchModules();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [fetchModules]
  );

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, fetchModules, updateModule, createModule };
}

// Hook para configurações do sistema
export function useSystemSettings() {
  const [settings, setSettings] = useState<Record<string, SystemSetting>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error: queryError } = await supabase.from('system_settings').select('*');

      if (queryError) throw queryError;

      const settingsMap = (data || []).reduce(
        (acc, setting) => {
          acc[setting.key] = setting;
          return acc;
        },
        {} as Record<string, SystemSetting>
      );

      setSettings(settingsMap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = useCallback(async (key: string, value: any) => {
    try {
      const { error: updateError } = await supabase
        .from('system_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (updateError) throw updateError;

      setSettings(prev => ({
        ...prev,
        [key]: { ...prev[key], value, updated_at: new Date().toISOString() },
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, fetchSettings, updateSetting };
}

// Hook para atividade recente
export function useRecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);

      // Buscar usuários recentes
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, name, email, type, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Buscar pedidos recentes
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, user_id, total, status, created_at, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Combinar e ordenar atividades
      const userActivities = (recentUsers || []).map(u => ({
        type: 'new_user',
        user: u.name,
        details: `Novo usuário ${u.type}`,
        timestamp: u.created_at,
      }));

      const orderActivities = (recentOrders || []).map((o: any) => ({
        type: 'order',
        user: o.profiles?.name || 'Usuário',
        details: `Pedido R$ ${o.total?.toFixed(2) || '0.00'}`,
        timestamp: o.created_at,
      }));

      const allActivities = [...userActivities, ...orderActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      setActivities(allActivities);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, refetch: fetchActivities };
}

// Hook para gerenciar assinaturas de usuários
export function useUserSubscriptions() {
  const assignPlanToUser = useCallback(async (userId: string, planId: string) => {
    try {
      // Cancelar assinatura anterior se existir
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('status', 'active');

      // Criar nova assinatura
      const { error } = await supabase.from('user_subscriptions').insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        started_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Atualizar plan_id no perfil
      await supabase
        .from('profiles')
        .update({ plan_id: planId, updated_at: new Date().toISOString() })
        .eq('id', userId);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const cancelUserSubscription = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      // Remover plan_id do perfil
      await supabase
        .from('profiles')
        .update({ plan_id: null, updated_at: new Date().toISOString() })
        .eq('id', userId);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const getUserSubscription = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, plan:plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  }, []);

  return { assignPlanToUser, cancelUserSubscription, getUserSubscription };
}

// Hook para atualizar módulos de um usuário específico (admin)
export function useAdminUserModules() {
  const updateUserModules = useCallback(async (userId: string, modules: string[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          enabled_modules: modules,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const getUserModules = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('enabled_modules')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data: data?.enabled_modules || [], error: null };
    } catch (err: any) {
      return { data: [], error: err.message };
    }
  }, []);

  return { updateUserModules, getUserModules };
}
