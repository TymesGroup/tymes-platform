import React from 'react';
import { ProfileType } from '../../types';
import { GlobalSettings } from './components/GlobalSettings';
import { ModuleSettingsView } from './components/ModuleSettingsView';

interface SettingsViewProps {
  profile: ProfileType;
  moduleId?: string; // Se fornecido, mostra configurações do módulo específico
  onBack?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, moduleId, onBack }) => {
  // Se um moduleId foi fornecido, mostrar configurações do módulo
  if (moduleId) {
    return <ModuleSettingsView moduleId={moduleId} profile={profile} onBack={onBack} />;
  }

  // Caso contrário, mostrar configurações globais
  return <GlobalSettings profile={profile} />;
};

// Re-exportar componentes para uso externo
export { GlobalSettings } from './components/GlobalSettings';
export { ModuleSettingsView } from './components/ModuleSettingsView';
export { SettingSection } from './components/SettingSection';
export { SettingControl } from './components/SettingControl';
