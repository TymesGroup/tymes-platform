import React, { useState } from 'react';
import {
  ShoppingBag,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ProfileType } from '../../../types';
import { useOrders, useSales } from '../hooks/useShop';

interface ShopOrdersProps {
  profile: ProfileType | string;
  userId: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: {
    label: 'Pendente',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    icon: Clock,
  },
  paid: {
    label: 'Pago',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    icon: CheckCircle,
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    icon: Truck,
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    icon: Package,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
    icon: XCircle,
  },
};

export const ShopOrders: React.FC<ShopOrdersProps> = ({ profile, userId }) => {
  const isBusiness = profile === ProfileType.BUSINESS;
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>(
    isBusiness ? 'sales' : 'purchases'
  );

  const { orders: purchases, loading: loadingPurchases } = useOrders();
  const { sales, loading: loadingSales, updateOrderStatus } = useSales();

  const orders = activeTab === 'sales' ? sales : purchases;
  const loading = activeTab === 'sales' ? loadingSales : loadingPurchases;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title={activeTab === 'sales' ? 'Vendas Realizadas' : 'Meus Pedidos'}
          subtitle={
            activeTab === 'sales'
              ? 'Gerencie suas vendas e entregas.'
              : 'Acompanhe o status das suas compras.'
          }
        />

        {isBusiness && (
          <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg inline-flex items-center">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'sales'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Vendas ({sales.length})
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'purchases'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Compras ({purchases.length})
            </button>
          </div>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => {
            const statusConfig = STATUS_CONFIG[order.status || 'pending'];
            const StatusIcon = statusConfig?.icon || Clock;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm"
              >
                {/* Header do Pedido */}
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-zinc-500">Pedido </span>
                      <span className="font-mono font-medium">#{order.id.slice(0, 8)}</span>
                    </div>
                    <span className="text-zinc-300 dark:text-zinc-700">|</span>
                    <span className="text-sm text-zinc-500">{formatDate(order.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusConfig?.color}`}
                    >
                      <StatusIcon size={14} />
                      {statusConfig?.label || order.status}
                    </span>

                    {activeTab === 'sales' &&
                      order.status !== 'delivered' &&
                      order.status !== 'cancelled' && (
                        <select
                          value={order.status || 'pending'}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 bg-transparent"
                        >
                          <option value="pending">Pendente</option>
                          <option value="paid">Pago</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregue</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      )}
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.order_items?.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                          <img
                            src={
                              item.product?.image ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
                            }
                            alt={item.product?.name || 'Produto'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.product?.name || 'Produto removido'}
                          </p>
                          <p className="text-sm text-zinc-500">
                            Qtd: {item.quantity} × R$ {item.unit_price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">
                          R$ {(item.quantity * item.unit_price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer do Pedido */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-zinc-500">Total do Pedido</span>
                    <p className="text-xl font-bold text-indigo-600">
                      R$ {order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    <Eye size={16} />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <EmptyState
            title={activeTab === 'sales' ? 'Nenhuma venda realizada' : 'Nenhum pedido encontrado'}
            description={
              activeTab === 'sales'
                ? 'Suas vendas aparecerão aqui quando clientes comprarem seus produtos.'
                : 'Seus pedidos aparecerão aqui após realizar uma compra.'
            }
            icon={ShoppingBag}
          />
        </div>
      )}
    </div>
  );
};
