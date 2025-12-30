import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import { useAdminStats, useAdminModules } from '../hooks/useAdminData';
import { supabase } from '../../../lib/supabase';

export const AnalyticsPage: React.FC = () => {
  const { stats, loading: statsLoading } = useAdminStats();
  const { modules, loading: modulesLoading } = useAdminModules();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [userGrowth, setUserGrowth] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    loadUserGrowth();
  }, [period]);

  const loadUserGrowth = async () => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by day
    const grouped = (data || []).reduce((acc: Record<string, number>, user) => {
      const date = new Date(user.created_at).toLocaleDateString('pt-BR');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const growth = Object.entries(grouped).map(([date, count]) => ({
      date,
      count: count as number,
    }));

    setUserGrowth(growth);
  };

  const metrics = [
    {
      title: 'Novos Usuários',
      value: stats?.newUsersWeek || 0,
      change: 12.5,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 8.2,
      icon: CreditCard,
      color: 'bg-green-500',
    },
    {
      title: 'Taxa de Conversão',
      value: stats?.totalUsers
        ? `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%`
        : '0%',
      change: 2.1,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Usuários Ativos',
      value: stats?.activeUsers || 0,
      change: 15.3,
      icon: Activity,
      color: 'bg-amber-500',
    },
  ];

  const loading = statsLoading || modulesLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h1>
          <p className="text-zinc-500 mt-1">Métricas e desempenho da plataforma</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                period === p
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-sm flex items-center gap-1 ${
                  metric.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {metric.change >= 0 ? '+' : ''}
                {metric.change}%
                {metric.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {typeof metric.value === 'number'
                ? metric.value.toLocaleString('pt-BR')
                : metric.value}
            </p>
            <p className="text-sm text-zinc-500 mt-1">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Performance */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Desempenho por Módulo
          </h2>
          <div className="space-y-4">
            {modules.map(module => {
              const maxUsers = Math.max(...modules.map(m => m.users_count || 0), 1);
              const percentage = ((module.users_count || 0) / maxUsers) * 100;

              return (
                <div key={module.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {module.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500">
                        {(module.users_count || 0).toLocaleString('pt-BR')} usuários
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: module.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {modules.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">Nenhum módulo encontrado</p>
            )}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Crescimento de Usuários
          </h2>
          {userGrowth.length > 0 ? (
            <div className="space-y-2">
              {userGrowth.slice(-10).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.date}</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">+{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-zinc-500">Nenhum dado no período selecionado</p>
            </div>
          )}
        </div>
      </div>

      {/* Users by Type */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Distribuição de Usuários por Tipo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats?.usersByType.map(item => {
            const percentage =
              stats.totalUsers > 0 ? ((item.count / stats.totalUsers) * 100).toFixed(1) : '0';

            return (
              <div key={item.type} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      item.type === 'SUPERADMIN'
                        ? 'bg-red-500'
                        : item.type === 'BUSINESS'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {item.type === 'SUPERADMIN'
                      ? 'Superadmin'
                      : item.type === 'BUSINESS'
                        ? 'Negócios'
                        : 'Pessoal'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {item.count.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-zinc-500">{percentage}% do total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
