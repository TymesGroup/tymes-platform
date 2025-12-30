import React from 'react';
import * as Icons from 'lucide-react';
import { SettingSection as SettingSectionType } from '../types';
import { SettingControl } from './SettingControl';

interface SettingSectionProps {
  section: SettingSectionType;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export const SettingSection: React.FC<SettingSectionProps> = ({ section, values, onChange }) => {
  // Pegar o ícone dinamicamente
  const IconComponent = section.icon ? (Icons as any)[section.icon] : Icons.Settings;

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
        <IconComponent className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-lg">{section.title}</h3>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {section.settings.map(setting => (
          <div
            key={setting.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
          >
            <div className="flex-1">
              <h4 className="font-medium text-sm">{setting.label}</h4>
              {setting.description && (
                <p className="text-xs text-zinc-500 mt-0.5">{setting.description}</p>
              )}
            </div>
            <div className="flex-shrink-0">
              <SettingControl setting={setting} value={values[setting.id]} onChange={onChange} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
