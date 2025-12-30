import React from 'react';
import {
  Activity,
  Clock,
  ShoppingBag,
  GraduationCap,
  CheckSquare,
  MessageSquare,
  Eye,
} from 'lucide-react';
import type { Tables } from '../../../lib/database.types';

type ActivityLog = Tables<'user_activity_log'>;

interface ActivityInsightsProps {
  activities: ActivityLog[];
  profileType: string;
}

const activityIcons: Record<string, React.ElementType> = {
  view: Eye,
  purchase: ShoppingBag,
  course_progress: GraduationCap,
  task_complete: CheckSquare,
  ai_chat: MessageSquare,
};

const activityLabels: Record<string, string> = {
  view: 'Visualizou',
  purchase: 'Comprou',
  course_progress: 'Progresso no curso',
  task_complete: 'Completou tarefa',
  ai_chat: 'Conversa com IA',
};

export const ActivityInsights: React.FC<ActivityInsightsProps> = ({ activities, profileType }) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={16} className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Atividade recente
        </h3>
      </div>

      <div className="space-y-2">
        {activities.slice(0, 5).map(activity => {
          const Icon = activityIcons[activity.activity_type] || Activity;
          const label = activityLabels[activity.activity_type] || activity.activity_type;

          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-500">
                <Icon size={12} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                  {label}
                </p>
                {activity.entity_type && (
                  <p className="text-xs text-zinc-400 truncate">{activity.entity_type}</p>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Clock size={10} />
                {formatTime(activity.created_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
