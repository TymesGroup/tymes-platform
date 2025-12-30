/**
 * GlobalHeader Component - Apple-inspired Design
 * Header com carrinho, favoritos e pedidos no estilo Apple
 */

import React, { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  Package,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../../lib/CartContext';
import { useFavorites } from '../../lib/FavoritesContext';
import { useAuth } from '../../lib/AuthContext';

interface GlobalHeaderProps {
  onNavigateToCheckout: () => void;
  onNavigateToOrders: () => void;
  onNavigateToFavorites: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  onNavigateToCheckout,
  onNavigateToOrders,
  onNavigateToFavorites,
}) => {
  const { user } = useAuth();
  const { items, totalItems, totalAmount, removeItem, updateQuantity, clearCart } = useCart();
  const { favorites } = useFavorites();
  const [showCartPanel, setShowCartPanel] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  if (!user) return null;

  return (
    <>
      <div className="hidden md:flex fixed top-0 right-0 z-40 items-center gap-1 p-2 bg-[#f5f5f7]/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl rounded-bl-2xl border-l border-b border-[#d2d2d7] dark:border-[#424245]">
        <button
          onClick={onNavigateToFavorites}
          className="relative p-2.5 rounded-xl hover:bg-white dark:hover:bg-[#2d2d2d] transition-colors"
        >
          <Heart size={18} className="text-[#1d1d1f] dark:text-[#f5f5f7]" />
          {favorites.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {favorites.length > 99 ? '99' : favorites.length}
            </span>
          )}
        </button>
        <button
          onClick={onNavigateToOrders}
          className="relative p-2.5 rounded-xl hover:bg-white dark:hover:bg-[#2d2d2d] transition-colors"
        >
          <Package size={18} className="text-[#1d1d1f] dark:text-[#f5f5f7]" />
        </button>
        <button
          onClick={() => setShowCartPanel(true)}
          className="relative p-2.5 rounded-xl hover:bg-white dark:hover:bg-[#2d2d2d] transition-colors"
        >
          <ShoppingCart size={18} className="text-[#1d1d1f] dark:text-[#f5f5f7]" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0066cc] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {totalItems > 99 ? '99' : totalItems}
            </span>
          )}
        </button>
      </div>

      {showCartPanel && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowCartPanel(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-[#1d1d1f] z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#d2d2d7] dark:border-[#424245]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2d2d2d] flex items-center justify-center">
                  <ShoppingCart size={20} className="text-[#1d1d1f] dark:text-[#f5f5f7]" />
                </div>
                <div>
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Carrinho
                  </h2>
                  <p className="text-[12px] text-[#86868b]">
                    {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCartPanel(false)}
                className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors"
              >
                <X size={20} className="text-[#86868b]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] dark:bg-[#2d2d2d] flex items-center justify-center mb-4">
                    <ShoppingCart size={28} className="text-[#86868b]" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                    Carrinho vazio
                  </h3>
                  <p className="text-[14px] text-[#86868b] mb-6">Adicione produtos para começar</p>
                  <button
                    onClick={() => setShowCartPanel(false)}
                    className="px-6 py-2.5 bg-[#0066cc] text-white rounded-full text-[14px] hover:bg-[#0055b3] transition-colors"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-[#f5f5f7] dark:bg-[#2d2d2d] rounded-2xl"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#1d1d1f] overflow-hidden flex-shrink-0">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-[#86868b]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                          {item.product?.name || 'Produto'}
                        </h4>
                        <p className="text-[15px] font-semibold text-[#0066cc] mt-0.5">
                          {formatPrice(item.product?.price || 0)}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-white dark:bg-[#1d1d1f] rounded-lg border border-[#d2d2d7] dark:border-[#424245]">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))
                              }
                              className="p-1.5 hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] rounded-l-lg transition-colors"
                            >
                              <Minus size={14} className="text-[#86868b]" />
                            </button>
                            <span className="w-8 text-center text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="p-1.5 hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] rounded-r-lg transition-colors"
                            >
                              <Plus size={14} className="text-[#86868b]" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-[#86868b] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={clearCart}
                    className="w-full text-[13px] text-[#86868b] hover:text-red-500 py-2 transition-colors"
                  >
                    Limpar carrinho
                  </button>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#d2d2d7] dark:border-[#424245] p-5 bg-[#f5f5f7] dark:bg-[#2d2d2d]">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#86868b]">Subtotal</span>
                    <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#86868b]">Frete</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#d2d2d7] dark:border-[#424245]">
                    <span className="text-[15px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Total
                    </span>
                    <span className="text-[20px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCartPanel(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3 bg-[#0066cc] text-white rounded-full hover:bg-[#0055b3] transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Finalizar compra
                </button>
                <button
                  onClick={() => setShowCartPanel(false)}
                  className="w-full mt-3 py-2.5 text-[#0066cc] text-[14px] hover:underline flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  Continuar comprando
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default GlobalHeader;
