/**
 * ShowcaseSection - Componente reutilizável para seções de vitrine
 * Design minimalista e consistente para Shop, Class e Work
 */

import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface ShowcaseSectionProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  compact?: boolean;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-pink-500',
  onViewAll,
  viewAllLabel = 'Ver mais',
  children,
  className = '',
  gradient,
  compact = false,
}) => {
  return (
    <section className={`${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${compact ? 'mb-4' : 'mb-6'}`}>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${iconColor}`}>
              <Icon size={20} />
            </div>
          )}
          <div>
            <h2
              className={`font-bold text-zinc-900 dark:text-zinc-100 ${compact ? 'text-lg' : 'text-xl'}`}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="group flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {viewAllLabel}
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Content */}
      {children}
    </section>
  );
};

export default ShowcaseSection;
