import React, { useState } from 'react';
import {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Package,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { usePlatform } from '../../../lib/PlatformContext';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Package,
};

export const ModulesSettings: React.FC = () => {
  const {
    activeModules,
    userEnabledModules,
    updateUserModules,
    loading: platformLoading,
  } = usePlatform();
  const [saving, setSaving] = useState(false);
  const [localEnabled, setLocalEnabled] = useState<string[]>(userEnabledModules);

  // Sync local state with platform state
  React.useEffect(() => {
    setLocalEnabled(userEnabledModules);
  }, [userEnabledModules]);

  const toggleModule = async (slug: string) => {
    const newEnabled = localEnabled.includes(slug)
      ? localEnabled.filter(m => m !== slug)
      : [...localEnabled, slug];

    setLocalEnabled(newEnabled);
    setSaving(true);

    const result = await updateUserModules(newEnabled);

    if (!result.success) {
      // Revert on error
      setLocalEnabled(userEnabledModules);
      alert('Erro ao atualizar módulos: ' + result.error);
    }

    setSaving(false);
  };

  if (platformLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Módulos Ativos</h3>
        <p className="text-sm text-zinc-500">
          Escolha quais módulos você deseja usar na plataforma
        </p>
      </div>

      <div className="grid gap-4">
        {activeModules.map(module => {
          const Icon = ICON_MAP[module.icon] || Package;
          const isEnabled = localEnabled.includes(module.slug);

          return (
            <div
              key={module.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isEnabled
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: module.color + '20' }}
                >
                  <Icon className="w-6 h-6" style={{ color: module.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-zinc-900 dark:text-white">{module.name}</h4>
                    {module.status === 'beta' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full">
                        Beta
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">{module.description}</p>
                </div>
              </div>

              <button
                onClick={() => toggleModule(module.slug)}
                disabled={saving}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  isEnabled ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-600'
                } ${saving ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    isEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {activeModules.length === 0 && (
        <div className="text-center py-8 text-zinc-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Nenhum módulo disponível</p>
        </div>
      )}

      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-500">
          {localEnabled.length} de {activeModules.length} módulos ativos
        </p>
      </div>
    </div>
  );
};
