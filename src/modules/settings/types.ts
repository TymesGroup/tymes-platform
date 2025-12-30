import { ProfileType } from '../../types';

// Tipos de configurações disponíveis
export type SettingType = 'toggle' | 'select' | 'text' | 'number' | 'radio';

// Configuração individual
export interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: SettingType;
  defaultValue?: any;
  options?: { value: string; label: string }[]; // Para select/radio
  allowedProfiles?: ProfileType[]; // Se não definido, disponível para todos
}

// Seção de configurações
export interface SettingSection {
  id: string;
  title: string;
  icon?: string;
  settings: SettingItem[];
  allowedProfiles?: ProfileType[]; // Se não definido, disponível para todos
}

// Configurações globais por tipo de conta
export interface GlobalSettingsConfig {
  [ProfileType.SUPERADMIN]: SettingSection[];
  [ProfileType.PERSONAL]: SettingSection[];
  [ProfileType.BUSINESS]: SettingSection[];
  common: SettingSection[]; // Configurações comuns a todos
}

// Configurações de módulo
export interface ModuleSettingsConfig {
  moduleId: string;
  moduleName: string;
  sections: {
    [ProfileType.SUPERADMIN]?: SettingSection[];
    [ProfileType.PERSONAL]?: SettingSection[];
    [ProfileType.BUSINESS]?: SettingSection[];
    common?: SettingSection[];
  };
}
