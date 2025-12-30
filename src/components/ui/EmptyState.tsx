import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-20 text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
    <Icon size={48} className="mb-4 opacity-50" />
    <p className="font-medium">{title}</p>
    {description && <p className="text-sm mt-1 text-zinc-500">{description}</p>}
  </div>
);
