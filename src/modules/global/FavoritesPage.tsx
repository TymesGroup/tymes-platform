import React from 'react';
import { Heart, ShoppingCart, Trash2, Eye, Package, Search } from 'lucide-react';
import { useFavorites } from '../../lib/FavoritesContext';
import { useCart } from '../../lib/CartContext';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';

interface FavoritesPageProps {
  onBack: () => void;
  onViewProduct?: (productId: string, moduleType: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onBack, onViewProduct }) => {
  const { favorites, loading, removeFavorite } = useFavorites();
  const { addItem, items: cartItems, openCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product_id === productId);
  };

  const handleAddToCart = async (productId: string) => {
    await addItem(productId);
    openCart();
  };

  const handleRemoveFavorite = async (productId: string) => {
    await removeFavorite(productId);
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
        title="Meus Favoritos"
        subtitle={`${favorites.length} ${favorites.length === 1 ? 'item salvo' : 'itens salvos'}`}
      />

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(fav => {
            const product = fav.product;
            if (!product) return null;

            const inCart = isInCart(fav.product_id);

            return (
              <div
                key={fav.id}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-lg"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-zinc-300 dark:text-zinc-700" />
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveFavorite(fav.product_id)}
                      className="p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
                      title="Remover dos favoritos"
                    >
                      <Trash2 size={16} />
                    </button>
                    {onViewProduct && (
                      <button
                        onClick={() => onViewProduct(fav.product_id, product.category)}
                        className="p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
                        title="Ver detalhes"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </div>

                  {/* Favorite Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="p-2 rounded-full bg-rose-500 text-white shadow-sm">
                      <Heart size={14} fill="currentColor" />
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => !inCart && handleAddToCart(fav.product_id)}
                    disabled={inCart}
                    className={`absolute bottom-3 right-3 p-3 rounded-full shadow-sm backdrop-blur-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 transition-all ${
                      inCart
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                    {product.category}
                  </span>

                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mt-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div>
                      <span className="text-xs text-zinc-500">Preço</span>
                      <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {inCart && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        No carrinho
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <EmptyState
            title="Nenhum favorito salvo"
            description="Explore os produtos e serviços e adicione aos favoritos clicando no ícone de coração"
            icon={Heart}
          />
        </div>
      )}
    </div>
  );
};
