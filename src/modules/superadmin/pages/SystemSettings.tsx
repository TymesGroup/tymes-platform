import React, { useState } from 'react';
import { Settings, Mail, Shield, Bell, Save, Check } from 'lucide-react';
import { useSystemSettings } from '../hooks/useAdminData';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  settings: {
    key: string;
    label: string;
    description: string;
    type: 'toggle' | 'text' | 'select' | 'number';
    options?: { label: string; value: string }[];
  }[];
}

const SETTING_SECTIONS: SettingSection[] = [
  {
    id: 'general',
    title: 'Geral',
    icon: Settings,
    settings: [
      {
        key: 'platform_name',
        label: 'Nome da Plataforma',
        description: 'Nome exibido em toda a plataforma',
        type: 'text',
      },
      {
        key: 'maintenance_mode',
        label: 'Modo Manutenção',
        description: 'Ativar modo de manutenção para todos os usuários',
        type: 'toggle',
      },
      {
        key: 'default_language',
        label: 'Idioma Padrão',
        description: 'Idioma padrão para novos usuários',
        type: 'select',
        options: [
          { label: 'Português (Brasil)', value: 'pt-BR' },
          { label: 'English', value: 'en' },
          { label: 'Español', value: 'es' },
        ],
      },
    ],
  },
  {
    id: 'email',
    title: 'Email',
    icon: Mail,
    settings: [
      {
        key: 'smtp_enabled',
        label: 'SMTP Habilitado',
        description: 'Usar servidor SMTP personalizado',
        type: 'toggle',
      },
      {
        key: 'from_email',
        label: 'Email Remetente',
        description: 'Email usado para enviar notificações',
        type: 'text',
      },
      {
        key: 'from_name',
        label: 'Nome Remetente',
        description: 'Nome exibido nos emails enviados',
        type: 'text',
      },
    ],
  },
  {
    id: 'security',
    title: 'Segurança',
    icon: Shield,
    settings: [
      {
        key: 'two_factor_required',
        label: '2FA Obrigatório',
        description: 'Exigir autenticação de dois fatores para todos',
        type: 'toggle',
      },
      {
        key: 'session_timeout',
        label: 'Timeout de Sessão (minutos)',
        description: 'Tempo de inatividade antes de deslogar',
        type: 'number',
      },
      {
        key: 'password_min_length',
        label: 'Tamanho Mínimo de Senha',
        description: 'Número mínimo de caracteres para senhas',
        type: 'number',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificações',
    icon: Bell,
    settings: [
      {
        key: 'email_notifications',
        label: 'Notificações por Email',
        description: 'Enviar notificações por email aos usuários',
        type: 'toggle',
      },
      {
        key: 'push_notifications',
        label: 'Push Notifications',
        description: 'Habilitar notificações push no navegador',
        type: 'toggle',
      },
      {
        key: 'admin_alerts',
        label: 'Alertas para Admin',
        description: 'Receber alertas de eventos importantes',
        type: 'toggle',
      },
    ],
  },
];

export const SystemSettingsPage: React.FC = () => {
  const { settings, loading, updateSetting } = useSystemSettings();
  const [activeSection, setActiveSection] = useState('general');
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentSection = SETTING_SECTIONS.find(s => s.id === activeSection);

  const getValue = (key: string) => {
    if (pendingChanges[key] !== undefined) {
      return pendingChanges[key];
    }
    return settings[key]?.value;
  };

  const handleChange = (key: string, value: any) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);

    for (const [key, value] of Object.entries(pendingChanges)) {
      await updateSetting(key, value);
    }

    setPendingChanges({});
    setSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Configurações do Sistema
          </h1>
          <p className="text-zinc-500 mt-1">Configure as opções globais da plataforma</p>
        </div>
        {(hasChanges || saved) && (
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Salvo!
              </>
            ) : saving ? (
              'Salvando...'
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Alterações
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {SETTING_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {currentSection && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                  <currentSection.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {currentSection.title}
                </h2>
              </div>

              <div className="space-y-6">
                {currentSection.settings.map(setting => {
                  const value = getValue(setting.key);

                  return (
                    <div
                      key={setting.key}
                      className="flex items-start justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 mr-4">
                        <label className="block text-sm font-medium text-zinc-900 dark:text-white">
                          {setting.label}
                        </label>
                        <p className="text-sm text-zinc-500 mt-1">{setting.description}</p>
                      </div>
                      <div className="shrink-0">
                        {setting.type === 'toggle' && (
                          <button
                            onClick={() => handleChange(setting.key, !value)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              value ? 'bg-red-600' : 'bg-zinc-300 dark:bg-zinc-600'
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                value ? 'left-7' : 'left-1'
                              }`}
                            />
                          </button>
                        )}
                        {setting.type === 'text' && (
                          <input
                            type="text"
                            value={value || ''}
                            onChange={e => handleChange(setting.key, e.target.value)}
                            className="w-64 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm"
                          />
                        )}
                        {setting.type === 'number' && (
                          <input
                            type="number"
                            value={value || 0}
                            onChange={e => handleChange(setting.key, parseInt(e.target.value))}
                            className="w-32 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm"
                          />
                        )}
                        {setting.type === 'select' && setting.options && (
                          <select
                            value={value || ''}
                            onChange={e => handleChange(setting.key, e.target.value)}
                            className="w-48 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm"
                          >
                            {setting.options.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
