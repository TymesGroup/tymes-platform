import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  Search,
  Filter,
  Eye,
  MapPin,
  CreditCard,
  Calendar,
  ShoppingBag,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    id: string;
    name: string;
    image: string | null;
    category: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  store_id: string | null;
  total_amount: number;
  status: string;
  payment_method: string | null;
  shipping_address: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

interface OrdersPageProps {
  onBack: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bgColor: string }> =
  {
    pending: {
      label: 'Pendente',
      color: 'text-amber-600',
      icon: Clock,
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    confirmed: {
      label: 'Confirmado',
      color: 'text-blue-600',
      icon: CheckCircle,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    processing: {
      label: 'Processando',
      color: 'text-indigo-600',
      icon: Package,
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
    shipped: {
      label: 'Enviado',
      color: 'text-purple-600',
      icon: Truck,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    delivered: {
      label: 'Entregue',
      color: 'text-emerald-600',
      icon: CheckCircle,
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    cancelled: {
      label: 'Cancelado',
      color: 'text-red-600',
      icon: XCircle,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
  };

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  boleto: 'Boleto',
  bank_transfer: 'Transferência',
};

export const OrdersPage: React.FC<OrdersPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          items:order_items (
            id,
            product_id,
            quantity,
            unit_price,
            product:products (
              id,
              name,
              image,
              category
            )
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderOrderCard = (order: Order) => {
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const StatusIcon = status.icon;

    return (
      <div
        key={order.id}
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-500/50 transition-all cursor-pointer"
        onClick={() => setSelectedOrder(order)}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-zinc-500">Pedido</p>
              <p className="font-mono font-bold">#{order.id.slice(0, 8)}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor}`}>
              <StatusIcon size={14} className={status.color} />
              <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
            </div>
          </div>

          {/* Items Preview */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {order.items?.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id}
                  className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 overflow-hidden"
                  style={{ zIndex: 3 - idx }}
                >
                  {item.product?.image ? (
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={14} className="text-zinc-400" />
                    </div>
                  )}
                </div>
              ))}
              {(order.items?.length || 0) > 3 && (
                <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs font-bold">
                  +{(order.items?.length || 0) - 3}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Calendar size={14} />
              {formatDate(order.created_at)}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">{formatPrice(order.total_amount)}</span>
              <ChevronRight size={18} className="text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    const status = STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG.pending;
    const StatusIcon = status.icon;
    const address = selectedOrder.shipping_address;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setSelectedOrder(null)}
      >
        <div
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">Pedido</p>
                <p className="text-2xl font-bold font-mono">#{selectedOrder.id.slice(0, 8)}</p>
                <p className="text-sm text-zinc-500 mt-1">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor}`}>
                <StatusIcon size={18} className={status.color} />
                <span className={`font-medium ${status.color}`}>{status.label}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Package size={18} />
              Itens do Pedido
            </h4>
            <div className="space-y-3">
              {selectedOrder.items?.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
                >
                  <div className="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name || 'Produto'}</p>
                    <p className="text-sm text-zinc-500">Qtd: {item.quantity}</p>
                  </div>
                  <span className="font-bold">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          {address && (
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <MapPin size={18} />
                Endereço de Entrega
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                {address.street}, {address.number}
                {address.complement && ` - ${address.complement}`}
                <br />
                {address.neighborhood}, {address.city} - {address.state}
                <br />
                CEP: {address.zip_code}
              </p>
            </div>
          )}

          {/* Payment */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <CreditCard size={18} />
              Pagamento
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              {PAYMENT_LABELS[selectedOrder.payment_method || ''] || selectedOrder.payment_method}
            </p>
          </div>

          {/* Total */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(selectedOrder.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <SectionHeader
        title="Meus Pedidos"
        subtitle={`${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'} realizados`}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por número do pedido..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos os status</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map(renderOrderCard)}
        </div>
      ) : (
        <div className="py-16">
          <EmptyState
            title={orders.length === 0 ? 'Nenhum pedido realizado' : 'Nenhum pedido encontrado'}
            description={
              orders.length === 0
                ? 'Seus pedidos aparecerão aqui após sua primeira compra'
                : 'Tente ajustar os filtros de busca'
            }
            icon={ShoppingBag}
          />
        </div>
      )}

      {/* Order Details Modal */}
      {renderOrderDetails()}
    </div>
  );
};
