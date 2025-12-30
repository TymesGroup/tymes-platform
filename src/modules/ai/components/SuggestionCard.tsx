import React from 'react';
import {
  Lightbulb,
  TrendingUp,
  Target,
  ShoppingBag,
  GraduationCap,
  Users,
  X,
  ArrowRight,
} from 'lucide-react';

interface SuggestionCardProps {
  id: string;
  type: string;
  title: string;
  description: string | null;
  onDismiss: (id: string) => void;
  onAction?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  insight: Lightbulb,
  growth: TrendingUp,
  goal: Target,
  shop: ShoppingBag,
  learning: GraduationCap,
  social: Users,
};

const colorMap: Record<string, string> = {
  insight: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  growth: 'bg-green-500/10 text-green-600 dark:text-green-400',
  goal: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  shop: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  learning: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  social: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  id,
  type,
  title,
  description,
  onDismiss,
  onAction,
}) => {
  const Icon = iconMap[type] || Lightbulb;
  const colorClass = colorMap[type] || colorMap.insight;

  return (
    <div className="group relative bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:shadow-md">
      <button
        onClick={() => onDismiss(id)}
        className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
        aria-label="Dispensar sugestão"
      >
        <X size={14} className="text-zinc-400" />
      </button>

      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{title}</h4>
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Explorar <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
};
