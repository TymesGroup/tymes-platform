import React, { useState } from 'react';
import {
  Bookmark,
  ShoppingBag,
  Trash2,
  Eye,
  Package,
  GraduationCap,
  Briefcase,
  Clock,
} from 'lucide-react';
import { useFavorites, FavoriteItemType } from '../../lib/FavoritesContext';
import { useBag } from '../../lib/BagContext';
import { useUnifiedBag } from '../../lib/UnifiedBagContext';
import { useAuth } from '../../lib/AuthContext';
import { ProfileType } from '../../types';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';

interface SavesPageProps {
  onBack: () => void;
  onViewProduct?: (productId: string, moduleType: string) => void;
}

const MODULE_FILTERS = [
  { id: 'all', label: 'Todos', icon: Bookmark },
  { id: 'product', label: 'Shop', icon: ShoppingBag },
  { id: 'course', label: 'Class', icon: GraduationCap },
  { id: 'service', label: 'Work', icon: Briefcase },
];

const getItemIcon = (type: FavoriteItemType) => {
  switch (type) {
    case 'course':
      return GraduationCap;
    case 'service':
      return Briefcase;
    default:
      return Package;
  }
};

const getItemTypeColor = (type: FavoriteItemType) => {
  switch (type) {
    case 'course':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    case 'service':
      return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
    default:
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
  }
};

const getItemTypeLabel = (type: FavoriteItemType) => {
  switch (type) {
    case 'course':
      return 'Curso';
    case 'service':
      return 'Serviço';
    default:
      return 'Produto';
  }
};

export const SavesPage: React.FC<SavesPageProps> = ({ onBack, onViewProduct }) => {
  const { profile } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();
  const { addItem: addToBag, items: bagItems, openBag } = useBag();
  const { addItem: addToUnifiedBag, isInBag: isInUnifiedBag } = useUnifiedBag();
  const [activeFilter, setActiveFilter] = useState<'all' | FavoriteItemType>('all');

  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const isProductInBag = (productId: string) => {
    return bagItems.some(item => item.product_id === productId);
  };

  const handleAddToBag = async (itemId: string, itemType: FavoriteItemType) => {
    if (itemType === 'product') {
      await addToBag(itemId);
      openBag();
    } else {
      await addToUnifiedBag(itemType, itemId);
    }
  };

  const handleRemoveSaved = async (itemId: string, itemType: FavoriteItemType) => {
    await removeFavorite(itemId, itemType);
  };

  const handleViewItem = (itemId: string, itemType: FavoriteItemType) => {
    if (itemType === 'product') {
      window.location.href = `/${accountType}/shop/product/${itemId}`;
    } else if (itemType === 'course') {
      window.location.href = `/${accountType}/class/course/${itemId}`;
    } else if (itemType === 'service') {
      window.location.href = `/${accountType}/work/service/${itemId}`;
    }
  };

  // Filter saves by type
  const filteredSaves =
    activeFilter === 'all' ? favorites : favorites.filter(fav => fav.item_type === activeFilter);

  // Count by type
  const countByType = {
    all: favorites.length,
    product: favorites.filter(f => f.item_type === 'product').length,
    course: favorites.filter(f => f.item_type === 'course').length,
    service: favorites.filter(f => f.item_type === 'service').length,
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
        title="Meus Salvos"
        subtitle={`${favorites.length} ${favorites.length === 1 ? 'item salvo' : 'itens salvos'}`}
      />

      {/* Main Card Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {MODULE_FILTERS.map(filter => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            const count = countByType[filter.id as keyof typeof countByType];

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as 'all' | FavoriteItemType)}
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

        {/* Saves Grid */}
        {filteredSaves.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSaves.map(fav => {
                const ItemIcon = getItemIcon(fav.item_type);
                const typeColor = getItemTypeColor(fav.item_type);
                const inBag =
                  fav.item_type === 'product'
                    ? isProductInBag(fav.item_id)
                    : isInUnifiedBag(fav.item_type, fav.item_id);

                const itemName = fav.item_data?.name || getItemTypeLabel(fav.item_type);
                const itemPrice = fav.item_data?.price || 0;
                const itemImage = fav.item_data?.image;
                const itemCategory = fav.item_data?.category;
                const itemDuration = fav.item_data?.duration;

                return (
                  <div
                    key={`${fav.item_type}-${fav.item_id}`}
                    className="group bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Image */}
                    <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ItemIcon size={40} className="text-zinc-300 dark:text-zinc-700" />
                        </div>
                      )}

                      {/* Actions Overlay */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRemoveSaved(fav.item_id, fav.item_type)}
                          className="p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => handleViewItem(fav.item_id, fav.item_type)}
                          className="p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm"
                        >
                          <Eye size={14} />
                        </button>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <div className="p-1.5 rounded-lg bg-indigo-500 text-white shadow-sm">
                          <Bookmark size={12} fill="currentColor" />
                        </div>
                        {fav.item_type !== 'product' && (
                          <span
                            className={`text-[10px] font-medium px-2 py-1 rounded-lg ${typeColor}`}
                          >
                            {getItemTypeLabel(fav.item_type)}
                          </span>
                        )}
                      </div>

                      {/* Add to Bag Button */}
                      <button
                        onClick={() => !inBag && handleAddToBag(fav.item_id, fav.item_type)}
                        disabled={inBag}
                        className={`absolute bottom-2 right-2 p-2.5 rounded-lg shadow-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 transition-all ${
                          inBag
                            ? 'bg-green-500 text-white cursor-default'
                            : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                        {itemCategory || getItemTypeLabel(fav.item_type)}
                      </span>
                      <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-2">
                        {itemName}
                      </h3>
                      {itemDuration && (
                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                          <Clock size={12} /> {itemDuration}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">
                          {formatPrice(itemPrice)}
                        </p>
                        {inBag && (
                          <span className="text-[10px] text-green-600 font-medium">Na bolsa</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              title="Nenhum item salvo"
              description="Explore produtos, cursos e serviços e salve clicando no ícone de marcador"
              icon={Bookmark}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Backward compatibility export
export const FavoritesPage = SavesPage;
