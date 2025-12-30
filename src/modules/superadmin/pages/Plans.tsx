import React, { useState } from 'react';
import { CreditCard, Check, Edit, Plus, Users } from 'lucide-react';
import { useAdminPlans, Plan } from '../hooks/useAdminData';

export const PlansPage: React.FC = () => {
  const { plans, loading, updatePlan, createPlan } = useAdminPlans();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});
  const [saving, setSaving] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    billing_cycle: 'monthly' as const,
    features: [] as string[],
    modules_included: [] as string[],
    max_storage_gb: 1,
    is_highlighted: false,
    status: 'active' as const,
  });

  const totalRevenue = plans.reduce((acc, plan) => {
    return acc + plan.price * (plan.subscribers_count || 0);
  }, 0);

  const totalSubscribers = plans.reduce((acc, plan) => acc + (plan.subscribers_count || 0), 0);

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    setSaving(true);
    await updatePlan(editingPlan.id, editForm);
    setSaving(false);
    setEditingPlan(null);
  };

  const handleCreatePlan = async () => {
    setSaving(true);
    await createPlan(newPlanForm);
    setSaving(false);
    setShowNewPlanModal(false);
    setNewPlanForm({
      name: '',
      slug: '',
      description: '',
      price: 0,
      billing_cycle: 'monthly',
      features: [],
      modules_included: [],
      max_storage_gb: 1,
      is_highlighted: false,
      status: 'active',
    });
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Planos e Preços</h1>
          <p className="text-zinc-500 mt-1">Gerencie os planos de assinatura da plataforma</p>
        </div>
        <button
          onClick={() => setShowNewPlanModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Plano
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-zinc-500">Receita Mensal</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-zinc-500">Total Assinantes</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            {totalSubscribers.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-zinc-500">Ticket Médio</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            R${' '}
            {(totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`bg-white dark:bg-zinc-900 rounded-xl border-2 p-5 relative ${
              plan.is_highlighted ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            {plan.is_highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-xs rounded-full">
                Mais Popular
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
              <button
                onClick={() => {
                  setEditingPlan(plan);
                  setEditForm({
                    name: plan.name,
                    description: plan.description,
                    price: plan.price,
                    status: plan.status,
                    is_highlighted: plan.is_highlighted,
                  });
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
              </span>
              {plan.price > 0 && <span className="text-zinc-500 text-sm">/mês</span>}
            </div>

            <div className="space-y-2 mb-4">
              {(plan.features || []).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Assinantes</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {(plan.subscribers_count || 0).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-zinc-500">Receita</span>
                <span className="font-medium text-green-600">
                  R${' '}
                  {(plan.price * (plan.subscribers_count || 0)).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Editar Plano - {editingPlan.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Nome do Plano
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
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price || 0}
                  onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
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
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlighted"
                  checked={editForm.is_highlighted || false}
                  onChange={e => setEditForm({ ...editForm, is_highlighted: e.target.checked })}
                  className="rounded border-zinc-300"
                />
                <label htmlFor="highlighted" className="text-sm text-zinc-700 dark:text-zinc-300">
                  Destacar como "Mais Popular"
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Novo Plano</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  value={newPlanForm.name}
                  onChange={e => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Slug (identificador único)
                </label>
                <input
                  type="text"
                  value={newPlanForm.slug}
                  onChange={e =>
                    setNewPlanForm({
                      ...newPlanForm,
                      slug: e.target.value.toLowerCase().replace(/\s/g, '-'),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newPlanForm.description}
                  onChange={e => setNewPlanForm({ ...newPlanForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newPlanForm.price}
                  onChange={e =>
                    setNewPlanForm({ ...newPlanForm, price: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewPlanModal(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={saving || !newPlanForm.name || !newPlanForm.slug}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Criando...' : 'Criar Plano'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
