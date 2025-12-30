/**
 * EmptyState - Apple-inspired Design
 * Estado vazio com design minimalista
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center mb-4">
      <Icon size={28} className="text-[#86868b]" />
    </div>
    <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">{title}</h3>
    <p className="text-[15px] text-[#86868b] max-w-sm mb-6">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-6 py-2.5 bg-[#0066cc] text-white rounded-full text-[15px] font-normal hover:bg-[#0055b3] transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);
