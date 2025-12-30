import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, CreditCard } from 'lucide-react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useCart } from '../../../lib/CartContext';
import { useAuth } from '../../../lib/AuthContext';
import { ProfileType } from '../../../types';

interface ShopCartProps {
  onNavigate?: (page: string) => void;
}

export const ShopCart: React.FC<ShopCartProps> = ({ onNavigate }) => {
  const { items, loading, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { profile } = useAuth();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      // Navegar para a página de checkout
      const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';
      window.location.hash = `/${accountType}/checkout`;
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Carrinho de Compras"
        subtitle={`${items.length} ${items.length === 1 ? 'item' : 'itens'} no carrinho`}
      />

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                  <img
                    src={
                      item.product?.image ||
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
                    }
                    alt={item.product?.name || 'Produto'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.product?.name || 'Produto'}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">{item.product?.category}</p>
                  <p className="font-bold text-indigo-600 mt-2">
                    R$ {(item.product?.price || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-zinc-500 hover:text-rose-500 transition-colors"
            >
              Limpar carrinho
            </button>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>R$ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Frete</span>
                  <span className="text-emerald-500">Grátis</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Finalizar Compra
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                <Package size={14} />
                <span>Entrega estimada: 3-5 dias úteis</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <EmptyState
            title="Seu carrinho está vazio"
            description="Explore o marketplace e adicione produtos ao seu carrinho."
            icon={ShoppingCart}
          />
          <button
            onClick={() => onNavigate?.('VITRINE')}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            Explorar Produtos
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
