import React from 'react';
import { ShoppingBag, GraduationCap, CheckSquare, FileText, Users, TrendingUp } from 'lucide-react';

interface UserStats {
  totalPurchases: number;
  totalCourses: number;
  completedTasks: number;
  totalPosts: number;
  totalConnections: number;
}

interface StatsOverviewProps {
  stats: UserStats | null;
  profileType: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, profileType }) => {
  if (!stats) return null;

  const businessStats = [
    { label: 'Produtos', value: stats.totalPurchases, icon: ShoppingBag, color: 'text-purple-500' },
    { label: 'Publicações', value: stats.totalPosts, icon: FileText, color: 'text-blue-500' },
    { label: 'Conexões', value: stats.totalConnections, icon: Users, color: 'text-green-500' },
    {
      label: 'Tarefas concluídas',
      value: stats.completedTasks,
      icon: CheckSquare,
      color: 'text-amber-500',
    },
  ];

  const personalStats = [
    { label: 'Cursos', value: stats.totalCourses, icon: GraduationCap, color: 'text-indigo-500' },
    {
      label: 'Tarefas concluídas',
      value: stats.completedTasks,
      icon: CheckSquare,
      color: 'text-green-500',
    },
    { label: 'Publicações', value: stats.totalPosts, icon: FileText, color: 'text-blue-500' },
    { label: 'Conexões', value: stats.totalConnections, icon: Users, color: 'text-pink-500' },
  ];

  const displayStats = profileType === 'BUSINESS' ? businessStats : personalStats;

  return (
    <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/50">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Seu resumo</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayStats.map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <stat.icon size={14} className={stat.color} />
            <div>
              <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
