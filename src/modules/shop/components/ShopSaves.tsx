import React from 'react';
import { Bookmark, Trash2, ShoppingBag } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useFavorites } from '../../../lib/FavoritesContext';
import { useBag } from '../../../lib/BagContext';

interface ShopSavesProps {
  userId: string;
}

export const ShopSaves: React.FC<ShopSavesProps> = ({ userId }) => {
  const { favorites, loading, toggleFavorite } = useFavorites();
  const { addItem } = useBag();

  const handleRemoveSaved = async (productId: string) => {
    try {
      await toggleFavorite(productId);
    } catch (error) {
      console.error('Erro ao remover salvo:', error);
    }
  };

  const handleAddToBag = async (productId: string) => {
    try {
      await addItem(productId);
    } catch (error) {
      console.error('Erro ao adicionar à bolsa:', error);
      alert(error instanceof Error ? error.message : 'Erro ao adicionar à bolsa');
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
        title="Salvos"
        subtitle={`${favorites.length} ${favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}`}
      />

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(fav => (
            <div key={fav.id} className="relative group">
              <ProductCard
                product={fav.product!}
                onAddToCart={() => handleAddToBag(fav.product_id)}
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleAddToBag(fav.product_id)}
                  className="p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
                  title="Adicionar à bolsa"
                >
                  <ShoppingBag size={16} />
                </button>
                <button
                  onClick={() => handleRemoveSaved(fav.product_id)}
                  className="p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
                  title="Remover dos salvos"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <EmptyState
            title="Sua lista de salvos está vazia"
            description="Explore o marketplace e salve produtos clicando no ícone de marcador."
            icon={Bookmark}
          />
        </div>
      )}
    </div>
  );
};

// Backward compatibility export
export const ShopFavorites = ShopSaves;
