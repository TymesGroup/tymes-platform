import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  Search,
  Eye,
  MapPin,
  CreditCard,
  Calendar,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  ClipboardList,
  RefreshCw,
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
  item_type?: 'product' | 'course' | 'service';
  item_name?: string;
  item_image?: string | null;
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
  source?: 'shop' | 'unified'; // To distinguish between shop orders and unified orders
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
    paid: {
      label: 'Pago',
      color: 'text-blue-600',
      icon: CreditCard,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
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
      icon: RefreshCw,
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
    completed: {
      label: 'Concluído',
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
    refunded: {
      label: 'Reembolsado',
      color: 'text-rose-600',
      icon: RefreshCw,
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    },
  };

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  boleto: 'Boleto',
  bank_transfer: 'Transferência',
};

const MODULE_FILTERS = [
  { id: 'all', label: 'Todos', icon: ClipboardList },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'class', label: 'Class', icon: GraduationCap },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'social', label: 'Social', icon: Users },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeModuleFilter, setActiveModuleFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Fetch shop orders
      const { data: shopOrders, error: shopError } = await supabase
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

      if (shopError) throw shopError;

      // Fetch unified orders (courses and services)
      const { data: unifiedOrders, error: unifiedError } = await (supabase as any)
        .from('unified_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch unified order items
      let unifiedOrdersWithItems: Order[] = [];
      if (!unifiedError && unifiedOrders) {
        unifiedOrdersWithItems = await Promise.all(
          unifiedOrders.map(async (order: any) => {
            const { data: items } = await (supabase as any)
              .from('unified_order_items')
              .select('*')
              .eq('order_id', order.id);

            return {
              ...order,
              source: 'unified' as const,
              items: (items || []).map(item => ({
                id: item.id,
                product_id: item.item_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                item_type: item.item_type,
                item_name: item.item_name,
                item_image: item.item_image,
              })),
            };
          })
        );
      }

      // Combine and sort all orders
      const allOrders = [
        ...(shopOrders || []).map(o => ({ ...o, source: 'shop' as const })),
        ...unifiedOrdersWithItems,
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setOrders(allOrders);
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

    // Module filter based on order source and item types
    let matchesModule = activeModuleFilter === 'all';
    if (!matchesModule) {
      if (activeModuleFilter === 'shop' && order.source === 'shop') {
        matchesModule = true;
      } else if (activeModuleFilter === 'class' && order.source === 'unified') {
        matchesModule = order.items?.some(item => item.item_type === 'course') || false;
      } else if (activeModuleFilter === 'work' && order.source === 'unified') {
        matchesModule = order.items?.some(item => item.item_type === 'service') || false;
      }
    }

    return matchesStatus && matchesModule;
  });

  const getItemIcon = (item: OrderItem) => {
    if (item.item_type === 'course') return GraduationCap;
    if (item.item_type === 'service') return Briefcase;
    return Package;
  };

  const getItemName = (item: OrderItem) => {
    return item.item_name || item.product?.name || 'Item';
  };

  const getItemImage = (item: OrderItem) => {
    return item.item_image || item.product?.image;
  };

  const renderOrderCard = (order: Order) => {
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const StatusIcon = status.icon;

    return (
      <div
        key={order.id}
        className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
        onClick={() => setSelectedOrder(order)}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-500">Pedido</p>
                {order.source === 'unified' && (
                  <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full">
                    {order.items?.some(i => i.item_type === 'course') ? 'Curso' : 'Serviço'}
                  </span>
                )}
              </div>
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
              {order.items?.slice(0, 3).map((item, idx) => {
                const ItemIcon = getItemIcon(item);
                const itemImage = getItemImage(item);

                return (
                  <div
                    key={item.id}
                    className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 overflow-hidden"
                    style={{ zIndex: 3 - idx }}
                  >
                    {itemImage ? (
                      <img src={itemImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ItemIcon size={14} className="text-zinc-400" />
                      </div>
                    )}
                  </div>
                );
              })}
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
              {selectedOrder.items?.map(item => {
                const ItemIcon = getItemIcon(item);
                const itemName = getItemName(item);
                const itemImage = getItemImage(item);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
                  >
                    <div className="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                      {itemImage ? (
                        <img src={itemImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ItemIcon size={20} className="text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{itemName}</p>
                        {item.item_type && (
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full">
                            {item.item_type === 'course'
                              ? 'Curso'
                              : item.item_type === 'service'
                                ? 'Serviço'
                                : 'Produto'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500">Qtd: {item.quantity}</p>
                    </div>
                    <span className="font-bold">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                );
              })}
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

      {/* Main Card Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Module Filter Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {MODULE_FILTERS.map(filter => {
            const Icon = filter.icon;
            const isActive = activeModuleFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveModuleFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon size={16} />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Status Filters */}
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos os status</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map(renderOrderCard)}
            </div>
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
      </div>

      {/* Order Details Modal */}
      {renderOrderDetails()}
    </div>
  );
};
