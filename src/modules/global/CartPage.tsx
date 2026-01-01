/**
 * CartPage - Página da bolsa de compras unificada
 * Mostra produtos, cursos e serviços em uma única bolsa
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Package,
  GraduationCap,
  Briefcase,
  Users,
  Clock,
  Heart,
} from 'lucide-react';
import { useBag } from '../../lib/BagContext';
import { useUnifiedBag, ItemType } from '../../lib/UnifiedBagContext';
import { useAuth } from '../../lib/AuthContext';
import { ProfileType } from '../../types';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';

interface BagPageProps {
  onBack: () => void;
  onCheckout: () => void;
}

const MODULE_FILTERS = [
  { id: 'all', label: 'Todos', icon: ShoppingBag },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'class', label: 'Class', icon: GraduationCap },
  { id: 'work', label: 'Work', icon: Briefcase },
];

const getItemIcon = (type: ItemType | 'product') => {
  switch (type) {
    case 'course':
      return GraduationCap;
    case 'service':
      return Briefcase;
    default:
      return Package;
  }
};

const getItemTypeLabel = (type: string) => {
  switch (type) {
    case 'course':
      return 'Curso';
    case 'service':
      return 'Serviço';
    default:
      return 'Produto';
  }
};

const getItemTypeColor = (type: string) => {
  switch (type) {
    case 'course':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    case 'service':
      return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
    default:
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
  }
};

export const BagPage: React.FC<BagPageProps> = ({ onBack, onCheckout }) => {
  const { profile } = useAuth();
  const {
    items: bagItems,
    totalAmount: bagTotal,
    removeItem: removeBagItem,
    updateQuantity: updateBagQuantity,
    loading: bagLoading,
  } = useBag();
  const {
    items: unifiedItems,
    totalAmount: unifiedTotal,
    removeItem: removeUnifiedItem,
    updateQuantity: updateUnifiedQuantity,
    loading: unifiedLoading,
  } = useUnifiedBag();

  const [activeFilter, setActiveFilter] = useState('all');
  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const loading = bagLoading || unifiedLoading;
  const totalAmount = bagTotal + unifiedTotal;
  const totalItems =
    bagItems.reduce((sum, item) => sum + (item.quantity || 1), 0) +
    unifiedItems.reduce((sum, item) => sum + item.quantity, 0);

  // Combine all items for display
  type CombinedItem = {
    id: string;
    type: 'product' | 'course' | 'service';
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    source: 'bag' | 'unified';
    duration?: string;
    sellerName?: string;
  };

  const allItems: CombinedItem[] = [
    ...bagItems.map(item => ({
      id: item.id,
      type: 'product' as const,
      name: item.product?.name || 'Produto',
      price: item.product?.price || 0,
      quantity: item.quantity || 1,
      image: item.product?.image || null,
      source: 'bag' as const,
    })),
    ...unifiedItems.map(item => ({
      id: item.id,
      type: item.item_type,
      name: item.item_data?.name || 'Item',
      price: item.item_data?.price || 0,
      quantity: item.quantity,
      image: item.item_data?.image || null,
      source: 'unified' as const,
      duration: item.item_data?.duration,
      sellerName: item.item_data?.seller_name,
    })),
  ];

  // Filter items by module
  const filteredItems =
    activeFilter === 'all'
      ? allItems
      : allItems.filter(item => {
          if (activeFilter === 'shop') return item.type === 'product';
          if (activeFilter === 'class') return item.type === 'course';
          if (activeFilter === 'work') return item.type === 'service';
          return true;
        });

  const handleRemoveItem = async (item: CombinedItem) => {
    if (item.source === 'bag') {
      await removeBagItem(item.id);
    } else {
      await removeUnifiedItem(item.id);
    }
  };

  const handleUpdateQuantity = async (item: CombinedItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (item.source === 'bag') {
      await updateBagQuantity(item.id, newQuantity);
    } else {
      await updateUnifiedQuantity(item.id, newQuantity);
    }
  };

  const handleViewItem = (item: CombinedItem) => {
    if (item.type === 'product') {
      window.location.href = `/${accountType}/shop/product/${item.id}`;
    } else if (item.type === 'course') {
      window.location.href = `/${accountType}/class/course/${item.id}`;
    } else if (item.type === 'service') {
      window.location.href = `/${accountType}/work/service/${item.id}`;
    }
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
        title="Bolsa de Compras"
        subtitle={`${totalItems} ${totalItems === 1 ? 'item' : 'itens'} na bolsa`}
      />

      {/* Main Card Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {MODULE_FILTERS.map(filter => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            const count =
              filter.id === 'all'
                ? allItems.length
                : allItems.filter(item => {
                    if (filter.id === 'shop') return item.type === 'product';
                    if (filter.id === 'class') return item.type === 'course';
                    if (filter.id === 'work') return item.type === 'service';
                    return false;
                  }).length;

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon size={16} />
                {filter.label}
                {count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {allItems.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 py-16">
          <EmptyState
            title="Bolsa vazia"
            description="Adicione produtos, cursos ou serviços à sua bolsa"
            icon={ShoppingBag}
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Explorar
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {filteredItems.map(item => {
              const ItemIcon = getItemIcon(item.type);
              const typeLabel = getItemTypeLabel(item.type);
              const typeColor = getItemTypeColor(item.type);

              return (
                <div
                  key={`${item.source}-${item.id}`}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div
                      onClick={() => handleViewItem(item)}
                      className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 cursor-pointer"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ItemIcon size={32} className="text-zinc-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor}`}
                          >
                            {typeLabel}
                          </span>
                          <h4
                            onClick={() => handleViewItem(item)}
                            className="font-medium mt-1 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
                          >
                            {item.name}
                          </h4>
                          {item.sellerName && (
                            <p className="text-xs text-zinc-500 mt-1">por {item.sellerName}</p>
                          )}
                          {item.duration && (
                            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                              <Clock size={12} /> {item.duration}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        {/* Quantity - only for products */}
                        {item.type === 'product' ? (
                          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors disabled:opacity-50"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-zinc-500">Qtd: 1</span>
                        )}

                        <span className="font-bold text-lg text-indigo-600">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Resumo</h3>

              <div className="space-y-3 mb-6">
                {bagItems.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 flex items-center gap-2">
                      <Package size={14} />
                      Produtos ({bagItems.reduce((sum, i) => sum + (i.quantity || 1), 0)})
                    </span>
                    <span>{formatPrice(bagTotal)}</span>
                  </div>
                )}
                {unifiedItems.filter(i => i.item_type === 'course').length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 flex items-center gap-2">
                      <GraduationCap size={14} />
                      Cursos ({unifiedItems.filter(i => i.item_type === 'course').length})
                    </span>
                    <span>
                      {formatPrice(
                        unifiedItems
                          .filter(i => i.item_type === 'course')
                          .reduce((sum, i) => sum + (i.item_data?.price || 0), 0)
                      )}
                    </span>
                  </div>
                )}
                {unifiedItems.filter(i => i.item_type === 'service').length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 flex items-center gap-2">
                      <Briefcase size={14} />
                      Serviços ({unifiedItems.filter(i => i.item_type === 'service').length})
                    </span>
                    <span>
                      {formatPrice(
                        unifiedItems
                          .filter(i => i.item_type === 'service')
                          .reduce((sum, i) => sum + (i.item_data?.price || 0), 0)
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-indigo-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Finalizar Compra
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onBack}
                className="w-full mt-3 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Continuar Comprando
              </button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                Pagamento seguro • Garantia de satisfação
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Re-export with old name for backward compatibility
export const CartPage = BagPage;
export default BagPage;
