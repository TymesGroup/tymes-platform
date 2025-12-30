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

/**
 * GlobalHeader Component
 *
 * A refined header with cart, favorites, and orders buttons.
 * Clean, minimal design with subtle interactions.
 */

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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (!user) return null;

  return (
    <>
      {/* Header Buttons */}
      <div className="hidden md:flex fixed top-0 right-0 z-40 items-center gap-1 p-2 bg-white dark:bg-zinc-900 rounded-bl-xl border-l border-b border-zinc-200 dark:border-zinc-800">
        {/* Favorites */}
        <button
          onClick={onNavigateToFavorites}
          className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Favorites"
        >
          <Heart size={18} className="text-zinc-600 dark:text-zinc-400" />
          {favorites.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {favorites.length > 99 ? '99' : favorites.length}
            </span>
          )}
        </button>

        {/* Orders */}
        <button
          onClick={onNavigateToOrders}
          className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Orders"
        >
          <Package size={18} className="text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Cart */}
        <button
          onClick={() => setShowCartPanel(true)}
          className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart size={18} className="text-zinc-600 dark:text-zinc-400" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {totalItems > 99 ? '99' : totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Cart Side Panel */}
      {showCartPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowCartPanel(false)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-zinc-900 z-50 shadow-xl flex flex-col border-l border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-zinc-900 dark:text-zinc-100" />
                <div>
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Cart</h2>
                  <p className="text-xs text-zinc-500">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCartPanel(false)}
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} className="text-zinc-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart size={24} className="text-zinc-400" />
                  </div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                    Cart is empty
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">Add products to start shopping</p>
                  <button
                    onClick={() => setShowCartPanel(false)}
                    className="px-4 py-2 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-md bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-zinc-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {item.product?.name || 'Product'}
                        </h4>
                        <p className="font-semibold text-accent-600 text-sm mt-0.5">
                          {formatPrice(item.product?.price || 0)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-0.5 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))
                              }
                              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-l-md transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-medium">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-r-md transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={clearCart}
                    className="w-full text-xs text-zinc-500 hover:text-red-500 py-2 transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-800/30">
                {/* Summary */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">Total</span>
                    <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Checkout */}
                <button
                  onClick={() => {
                    setShowCartPanel(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full py-2.5 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Checkout
                </button>

                <button
                  onClick={() => setShowCartPanel(false)}
                  className="w-full mt-2 py-2 text-zinc-600 dark:text-zinc-400 text-sm hover:text-accent-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  Continue Shopping
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
