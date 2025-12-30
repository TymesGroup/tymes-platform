import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  ToggleLeft,
  ToggleRight,
  Settings,
  BarChart3,
  Eye,
} from 'lucide-react';
import { useAdminModules, PlatformModule } from '../hooks/useAdminData';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Package,
};

export const ModulesPage: React.FC = () => {
  const { modules, loading, updateModule } = useAdminModules();
  const [selectedModule, setSelectedModule] = useState<PlatformModule | null>(null);
  const [editForm, setEditForm] = useState<Partial<PlatformModule>>({});
  const [saving, setSaving] = useState(false);

  const toggleModuleStatus = async (module: PlatformModule) => {
    const newStatus = module.status === 'active' ? 'inactive' : 'active';
    await updateModule(module.id, { status: newStatus });
  };

  const handleSaveModule = async () => {
    if (!selectedModule) return;
    setSaving(true);
    await updateModule(selectedModule.id, editForm);
    setSaving(false);
    setSelectedModule(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
      case 'beta':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName] || Package;
  };

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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gerenciar Módulos</h1>
          <p className="text-zinc-500 mt-1">Configure os módulos disponíveis na plataforma</p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map(module => {
          const Icon = getIcon(module.icon);
          return (
            <div
              key={module.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: module.color + '20' }}>
                    <Icon className="w-6 h-6" style={{ color: module.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {module.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(module.status)}`}
                    >
                      {module.status === 'active'
                        ? 'Ativo'
                        : module.status === 'beta'
                          ? 'Beta'
                          : 'Inativo'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleModuleStatus(module)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {module.status === 'active' ? (
                    <ToggleRight className="w-8 h-8 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <p className="text-sm text-zinc-500 mb-4">{module.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Users className="w-4 h-4" />
                  <span>{(module.users_count || 0).toLocaleString('pt-BR')} usuários</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedModule(module);
                      setEditForm({
                        name: module.name,
                        description: module.description,
                        status: module.status,
                        color: module.color,
                      });
                    }}
                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    title="Configurações"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Stats Summary */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Resumo dos Módulos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{modules.length}</p>
            <p className="text-sm text-zinc-500">Total de Módulos</p>
          </div>
          <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {modules.filter(m => m.status === 'active').length}
            </p>
            <p className="text-sm text-zinc-500">Ativos</p>
          </div>
          <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {modules.reduce((acc, m) => acc + (m.users_count || 0), 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-zinc-500">Usuários Totais</p>
          </div>
          <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">
              {modules.filter(m => m.status === 'beta').length}
            </p>
            <p className="text-sm text-zinc-500">Em Beta</p>
          </div>
        </div>
      </div>

      {/* Module Settings Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: selectedModule.color + '20' }}
              >
                {React.createElement(getIcon(selectedModule.icon), {
                  className: 'w-6 h-6',
                  style: { color: selectedModule.color },
                })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Configurações - {selectedModule.name}
                </h3>
                <p className="text-sm text-zinc-500">{selectedModule.slug}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Nome do Módulo
                </label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status || 'active'}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="beta">Beta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Cor
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editForm.color || '#6366f1'}
                    onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editForm.color || '#6366f1'}
                    onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveModule}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
