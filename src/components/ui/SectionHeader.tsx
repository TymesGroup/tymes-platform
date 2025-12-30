/**
 * SectionHeader - Apple-inspired Design
 * Cabeçalho de seção com design minimalista
 */

import React from 'react';

export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
        {title}
      </h2>
      {subtitle && <p className="text-[15px] text-[#86868b] mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
