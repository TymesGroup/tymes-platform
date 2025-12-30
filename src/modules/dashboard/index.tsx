import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Package,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { ProfileType } from '../../types';
import { STATS_DATA } from '../../data/mock';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useAuth } from '../../lib/AuthContext';
import { usePlatform } from '../../lib/PlatformContext';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Package,
};

export const DashboardView: React.FC<{ profile: ProfileType }> = ({ profile }) => {
  const { profile: userProfile } = useAuth();
  const { activeModules, userEnabledModules, userPlan, loading } = usePlatform();

  const firstName =
    userProfile?.name?.split(' ')[0] || (profile === ProfileType.BUSINESS ? 'Empresa' : 'Usuário');

  // Get user's active modules
  const userModules = activeModules.filter(m => userEnabledModules.includes(m.slug));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={`Olá, ${firstName}`} subtitle="Aqui está o resumo do seu dia." />

      {/* Plan & Modules Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Plan */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-zinc-500">Seu Plano</span>
            </div>
            {userPlan?.is_highlighted && (
              <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full text-xs font-medium">
                Popular
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {userPlan?.name || 'Gratuito'}
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            {userPlan?.price === 0 ? 'Plano gratuito' : `R$ ${userPlan?.price?.toFixed(2)}/mês`}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Package className="w-4 h-4" />
            <span>{userPlan?.modules_included?.length || 1} módulos incluídos</span>
          </div>
        </div>

        {/* Active Modules */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-zinc-500">Módulos Ativos</span>
            </div>
            <span className="text-sm text-zinc-400">
              {userModules.length} de {activeModules.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userModules.length > 0 ? (
              userModules.map(mod => {
                const Icon = ICON_MAP[mod.icon] || Package;
                return (
                  <div
                    key={mod.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                    style={{ backgroundColor: mod.color + '20', color: mod.color }}
                  >
                    <Icon className="w-4 h-4" />
                    {mod.name}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-500">
                Nenhum módulo ativo.{' '}
                <a href="#/app" className="text-indigo-500 hover:underline">
                  Ativar módulos
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm font-medium">Receita Total</span>
            <DollarSign className="text-emerald-500" size={20} />
          </div>
          <div className="text-3xl font-bold">R$ 45.231,89</div>
          <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +20.1% esse mês
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm font-medium">
              {profile === ProfileType.BUSINESS ? 'Clientes' : 'Conexões'}
            </span>
            <Users className="text-indigo-500" size={20} />
          </div>
          <div className="text-3xl font-bold">+2,350</div>
          <div className="text-xs text-indigo-500 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +180 novos hoje
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm font-medium">Tarefas Pendentes</span>
            <CheckCircle2 className="text-amber-500" size={20} />
          </div>
          <div className="text-3xl font-bold">12</div>
          <div className="text-xs text-zinc-500 mt-2">4 alta prioridade</div>
        </div>
      </div>

      {/* Quick Access to Modules */}
      {userModules.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-bold mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userModules.slice(0, 4).map(mod => {
              const Icon = ICON_MAP[mod.icon] || Package;
              return (
                <a
                  key={mod.id}
                  href={`#/app`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group"
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: mod.color + '20' }}>
                    <Icon className="w-5 h-5" style={{ color: mod.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900 dark:text-white">{mod.name}</p>
                    <p className="text-xs text-zinc-500">Acessar</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-80">
          <h3 className="text-lg font-bold mb-6">Desempenho de Vendas</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={STATS_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#3f3f46"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `R${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#e4e4e7' }}
              />
              <Bar dataKey="vendas" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-80">
          <h3 className="text-lg font-bold mb-6">Crescimento de Usuários</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={STATS_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#3f3f46"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#e4e4e7' }}
              />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
