import React from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  UserPlus,
  ShoppingCart,
} from 'lucide-react';
import { useAdminStats, useRecentActivity } from '../hooks/useAdminData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const SuperAdminDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { stats, loading: statsLoading } = useAdminStats();
  const { activities, loading: activitiesLoading } = useRecentActivity();

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats?.totalUsers || 0,
      change: stats?.newUsersWeek ? `+${stats.newUsersWeek} esta semana` : '',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Usuários Ativos',
      value: stats?.activeUsers || 0,
      change: '',
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      title: 'Novos Hoje',
      value: stats?.newUsersToday || 0,
      change: '',
      icon: UserPlus,
      color: 'bg-purple-500',
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '',
      icon: CreditCard,
      color: 'bg-amber-500',
    },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Painel Administrativo</h1>
        <p className="text-zinc-500 mt-1">Visão geral da plataforma Tymes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.change && (
                <span className="text-sm flex items-center gap-1 text-green-500">
                  {stat.change}
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {typeof stat.value === 'number' ? stat.value.toLocaleString('pt-BR') : stat.value}
            </p>
            <p className="text-sm text-zinc-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('USERS')}
              className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                Gerenciar Usuários
              </span>
            </button>
            <button
              onClick={() => onNavigate('MODULES')}
              className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <Activity className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                Gerenciar Módulos
              </span>
            </button>
            <button
              onClick={() => onNavigate('PLANS')}
              className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                Planos e Preços
              </span>
            </button>
            <button
              onClick={() => onNavigate('ANALYTICS')}
              className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                Ver Analytics
              </span>
            </button>
          </div>
        </div>

        {/* Users by Type */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Usuários por Tipo
          </h2>
          <div className="space-y-3">
            {stats?.usersByType.map(item => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      item.type === 'SUPERADMIN'
                        ? 'bg-red-500'
                        : item.type === 'BUSINESS'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                    }`}
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.type === 'SUPERADMIN'
                      ? 'Superadmin'
                      : item.type === 'BUSINESS'
                        ? 'Negócios'
                        : 'Pessoal'}
                  </span>
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {item.count}
                </span>
              </div>
            ))}
            {(!stats?.usersByType || stats.usersByType.length === 0) && (
              <p className="text-sm text-zinc-500 text-center py-4">Nenhum dado disponível</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Atividade Recente
        </h2>
        {activitiesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === 'new_user'
                        ? 'bg-green-100 dark:bg-green-900'
                        : activity.type === 'order'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-zinc-100 dark:bg-zinc-700'
                    }`}
                  >
                    {activity.type === 'new_user' ? (
                      <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {activity.details}
                    </p>
                    <p className="text-xs text-zinc-500">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-400">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">Nenhuma atividade recente</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
