import React, { useState } from 'react';
import { Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { ProfileType } from '../../../types';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { SettingSection } from './SettingSection';
import { ModuleSettingsConfig } from '../types';
import { moduleSettingsMap } from '../config/moduleSettings';

interface ModuleSettingsViewProps {
  moduleId: string;
  profile: ProfileType;
  onBack?: () => void;
}

export const ModuleSettingsView: React.FC<ModuleSettingsViewProps> = ({
  moduleId,
  profile,
  onBack,
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Buscar configurações do módulo
  const moduleConfig = moduleSettingsMap[moduleId];

  if (!moduleConfig) {
    return (
      <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="Configurações" subtitle="Módulo não encontrado." />
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-zinc-500">As configurações para este módulo não estão disponíveis.</p>
          {onBack && (
            <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline text-sm">
              Voltar
            </button>
          )}
        </div>
      </div>
    );
  }

  // Combinar configurações comuns com as específicas do tipo de conta
  const sections = [
    ...(moduleConfig.sections.common || []),
    ...(moduleConfig.sections[profile] || []),
  ];

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Salvar no backend/localStorage
    console.log(`Saving ${moduleId} settings:`, values);
    setHasChanges(false);
  };

  const handleReset = () => {
    setValues({});
    setHasChanges(false);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header com botão de voltar */}
      <div className="flex items-start gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="mt-1 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <SectionHeader
          title={`Configurações do ${moduleConfig.moduleName}`}
          subtitle="Personalize as preferências deste módulo."
        />
      </div>

      {/* Seções de configuração */}
      {sections.length > 0 ? (
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
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-zinc-500">
            Não há configurações específicas disponíveis para o seu tipo de conta neste módulo.
          </p>
        </div>
      )}

      {/* Botões de ação */}
      {sections.length > 0 && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
};
