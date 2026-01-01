import React, { useState } from 'react';
import { Save, RotateCcw, Settings, Package, CreditCard } from 'lucide-react';
import { ProfileType } from '../../../types';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { SettingSection } from './SettingSection';
import { globalSettingsConfig } from '../config/globalSettings';
import { ModulesSettings } from './ModulesSettings';
import { SubscriptionSettings } from './SubscriptionSettings';

interface GlobalSettingsProps {
  profile: ProfileType;
}

type SettingsTab = 'general' | 'modules' | 'subscription';

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [values, setValues] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Combinar configurações comuns com as específicas do tipo de conta
  const sections = [...globalSettingsConfig.common, ...globalSettingsConfig[profile]];

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', values);
    setHasChanges(false);
  };

  const handleReset = () => {
    setValues({});
    setHasChanges(false);
  };

  const getProfileLabel = () => {
    switch (profile) {
      case ProfileType.SUPERADMIN:
        return 'Administrador';
      case ProfileType.BUSINESS:
        return 'Empresarial';
      case ProfileType.PERSONAL:
      default:
        return 'Pessoal';
    }
  };

  const tabs = [
    { id: 'general' as const, label: 'Geral', icon: Settings },
    { id: 'modules' as const, label: 'Módulos', icon: Package },
    { id: 'subscription' as const, label: 'Assinatura', icon: CreditCard },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <SectionHeader title="Configurações" subtitle={`Conta ${getProfileLabel()}`} />

      {/* Main Card Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}

          {/* Account Type Badge */}
          <div className="ml-auto flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-medium ${
                profile === ProfileType.SUPERADMIN
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : profile === ProfileType.BUSINESS
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}
            >
              {getProfileLabel()}
            </span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          {activeTab === 'general' && (
            <>
              {/* Seções de configuração */}
              <div className="space-y-6">
                {sections.map(section => (
                  <SettingSection
                    key={section.id}
                    section={section}
                    values={values}
                    onChange={handleChange}
                  />
                ))}
              </div>

              {/* Botões de ação */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resetar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </button>
              </div>
            </>
          )}

          {activeTab === 'modules' && <ModulesSettings />}

          {activeTab === 'subscription' && <SubscriptionSettings />}
        </div>
      </div>
    </div>
  );
};
