import React, { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Edit,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Package,
  CreditCard,
  Check,
} from 'lucide-react';
import {
  useAdminUsers,
  useAdminPlans,
  useAdminModules,
  useUserSubscriptions,
  useAdminUserModules,
} from '../hooks/useAdminData';

export const UsersPage: React.FC = () => {
  const { users, totalCount, loading, fetchUsers, updateUser, deleteUser } = useAdminUsers();
  const { plans } = useAdminPlans();
  const { modules } = useAdminModules();
  const { assignPlanToUser, getUserSubscription } = useUserSubscriptions();
  const { updateUserModules, getUserModules } = useAdminUserModules();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'modules' | 'plan'>('info');
  const [userModules, setUserModules] = useState<string[]>([]);
  const [userPlanId, setUserPlanId] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers({ page, pageSize, search, type: filterType, status: filterStatus });
  }, [page, filterType, filterStatus, fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers({ page: 1, pageSize, search, type: filterType, status: filterStatus });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openUserModal = async (user: any) => {
    setSelectedUser(user);
    setActiveTab('info');

    // Load user modules
    const { data: mods } = await getUserModules(user.id);
    setUserModules(mods);

    // Load user subscription
    const { data: sub } = await getUserSubscription(user.id);
    setUserPlanId(sub?.plan_id || null);

    setShowModal(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    await updateUser(selectedUser.id, {
      type: selectedUser.type,
      status: selectedUser.status,
    });

    fetchUsers({ page, pageSize, search, type: filterType, status: filterStatus });
    setShowModal(false);
    setActionLoading(false);
  };

  const handleSaveModules = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    await updateUserModules(selectedUser.id, userModules);

    setActionLoading(false);
  };

  const handleSavePlan = async () => {
    if (!selectedUser || !userPlanId) return;
    setActionLoading(true);

    await assignPlanToUser(selectedUser.id, userPlanId);

    setActionLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const result = await deleteUser(selectedUser.id);
    if (result.success) {
      fetchUsers({ page, pageSize, search, type: filterType, status: filterStatus });
      setShowDeleteConfirm(false);
      setShowModal(false);
    }
    setActionLoading(false);
  };

  const toggleUserModule = (slug: string) => {
    setUserModules(prev => (prev.includes(slug) ? prev.filter(m => m !== slug) : [...prev, slug]));
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
      case 'suspended':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SUPERADMIN':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'BUSINESS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gerenciar Usuários</h1>
          <p className="text-zinc-500 mt-1">{totalCount} usuários cadastrados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={e => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
        >
          <option value="all">Todos os tipos</option>
          <option value="SUPERADMIN">Superadmin</option>
          <option value="PERSONAL">Pessoal</option>
          <option value="BUSINESS">Negócios</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="suspended">Suspenso</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Módulos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Cadastro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadge(user.type)}`}>
                        {user.type === 'SUPERADMIN'
                          ? 'Admin'
                          : user.type === 'BUSINESS'
                            ? 'Negócios'
                            : 'Pessoal'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(user.status || 'active')}`}
                      >
                        {user.status === 'suspended'
                          ? 'Suspenso'
                          : user.status === 'inactive'
                            ? 'Inativo'
                            : 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {user.enabled_modules?.length || 0} módulos
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openUserModal(user)}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalCount)} de{' '}
              {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Editar Usuário
              </h3>
              <p className="text-sm text-zinc-500">{selectedUser.email}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              {[
                { id: 'info', label: 'Informações', icon: Edit },
                { id: 'modules', label: 'Módulos', icon: Package },
                { id: 'plan', label: 'Plano', icon: CreditCard },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Nome
                    </label>
                    <p className="text-zinc-900 dark:text-white">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Tipo de Conta
                    </label>
                    <select
                      value={selectedUser.type}
                      onChange={e => setSelectedUser({ ...selectedUser, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    >
                      <option value="PERSONAL">Pessoal</option>
                      <option value="BUSINESS">Negócios</option>
                      <option value="SUPERADMIN">Superadmin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedUser.status || 'active'}
                      onChange={e => setSelectedUser({ ...selectedUser, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'modules' && (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-500 mb-4">
                    Selecione os módulos que este usuário pode acessar
                  </p>
                  {modules.map(mod => (
                    <div
                      key={mod.id}
                      onClick={() => toggleUserModule(mod.slug)}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        userModules.includes(mod.slug)
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: mod.color + '20' }}
                        >
                          <Package className="w-5 h-5" style={{ color: mod.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{mod.name}</p>
                          <p className="text-xs text-zinc-500">{mod.description}</p>
                        </div>
                      </div>
                      {userModules.includes(mod.slug) && <Check className="w-5 h-5 text-red-600" />}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-500 mb-4">Selecione o plano para este usuário</p>
                  {plans.map(plan => (
                    <div
                      key={plan.id}
                      onClick={() => setUserPlanId(plan.id)}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        userPlanId === plan.id
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-zinc-900 dark:text-white">{plan.name}</p>
                          {plan.is_highlighted && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500">
                          {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}/mês`}
                        </p>
                      </div>
                      {userPlanId === plan.id && <Check className="w-5 h-5 text-red-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={
                    activeTab === 'info'
                      ? handleSaveUser
                      : activeTab === 'modules'
                        ? handleSaveModules
                        : handleSavePlan
                  }
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-zinc-500 mb-6">
              Tem certeza que deseja excluir <strong>{selectedUser.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
