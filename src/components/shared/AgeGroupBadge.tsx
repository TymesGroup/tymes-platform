import React from 'react';
import { Baby, User, GraduationCap, Briefcase, Heart } from 'lucide-react';
import { AgeGroup, AGE_GROUPS } from '../../lib/ageGroup';

interface AgeGroupBadgeProps {
  ageGroup: AgeGroup | null;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AGE_GROUP_ICONS: Record<AgeGroup, React.ElementType> = {
  baby: Baby,
  child: User,
  teen: GraduationCap,
  adult: Briefcase,
  senior: Heart,
};

const AGE_GROUP_COLORS: Record<AgeGroup, string> = {
  baby: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  child: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  teen: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  adult: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  senior: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const SIZES = {
  sm: { badge: 'px-2 py-0.5 text-xs', icon: 12 },
  md: { badge: 'px-2.5 py-1 text-sm', icon: 14 },
  lg: { badge: 'px-3 py-1.5 text-base', icon: 16 },
};

export const AgeGroupBadge: React.FC<AgeGroupBadgeProps> = ({
  ageGroup,
  showLabel = true,
  size = 'md',
}) => {
  if (!ageGroup) return null;

  const Icon = AGE_GROUP_ICONS[ageGroup];
  const colorClass = AGE_GROUP_COLORS[ageGroup];
  const sizeConfig = SIZES[size];
  const info = AGE_GROUPS[ageGroup];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${colorClass} ${sizeConfig.badge}`}
    >
      <Icon size={sizeConfig.icon} />
      {showLabel && <span>{info.label}</span>}
    </span>
  );
};
