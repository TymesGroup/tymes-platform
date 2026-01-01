import React from 'react';
import { Sparkles, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { useBag } from '../../../lib/BagContext';
import { useFavorites } from '../../../lib/FavoritesContext';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
  badge?: string;
}

interface RecommendedProductsProps {
  onNavigate?: (page: string) => void;
}

const RECOMMENDED: RecommendedProduct[] = [
  {
    id: 'rec-1',
    name: 'Curso Completo de React',
    price: 299.9,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    discount: 30,
    badge: 'Mais Vendido',
  },
  {
    id: 'rec-2',
    name: 'Design System Pro',
    price: 149.9,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    badge: 'Novo',
  },
  {
    id: 'rec-3',
    name: 'Consultoria UX/UI',
    price: 499.9,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    discount: 20,
  },
  {
    id: 'rec-4',
    name: 'Template Landing Page',
    price: 79.9,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    badge: 'Popular',
  },
];

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ onNavigate }) => {
  const { isFavorited, toggleFavorite } = useFavorites();

  const handleProductClick = (productId: string) => {
    onNavigate?.(`PRODUCT_DETAILS:${productId}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      await toggleFavorite(productId, 'product');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Faça login para favoritar');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500" size={24} />
          <div>
            <h2 className="text-xl font-bold">Recomendados para Você</h2>
            <p className="text-zinc-500 text-sm">Baseado no seu histórico</p>
          </div>
        </div>
        <button className="text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm">
          Ver mais <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {RECOMMENDED.map(product => (
          <button
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-pink-500/50 transition-all hover:shadow-lg text-left"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                {product.discount && (
                  <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow">
                    -{product.discount}%
                  </span>
                )}
                {product.badge && (
                  <span className="bg-pink-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={e => handleFavoriteClick(e, product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
              >
                <Heart
                  size={14}
                  className={
                    isFavorited(product.id, 'product') ? 'fill-rose-500 text-rose-500' : ''
                  }
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                {product.discount && (
                  <span className="text-xs text-zinc-400 line-through">
                    R$ {(product.price / (1 - product.discount / 100)).toFixed(2)}
                  </span>
                )}
                <span className="font-bold text-pink-600">R$ {product.price.toFixed(2)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
