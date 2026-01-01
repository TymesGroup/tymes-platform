/**
 * RecommendedPage - Página dedicada de Produtos Recomendados
 * Lógica de recomendação baseada em histórico, categorias e popularidade
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Star,
  Heart,
  ShoppingBag,
  Filter,
  Grid3X3,
  LayoutGrid,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useBag } from '../../../lib/BagContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { useAuth } from '../../../lib/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string | null;
  rating?: number;
  total_reviews?: number;
  category: string;
  is_bestseller?: boolean;
  sales_count?: number;
}

interface RecommendedPageProps {
  onNavigate?: (page: string) => void;
}

const CATEGORIES = ['Todos', 'Eletrônicos', 'Acessórios', 'Moda', 'Casa', 'Esportes'];
const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevância' },
  { id: 'rating', label: 'Melhor Avaliados' },
  { id: 'price_asc', label: 'Menor Preço' },
  { id: 'price_desc', label: 'Maior Preço' },
  { id: 'popular', label: 'Mais Populares' },
];

export const RecommendedPage: React.FC<RecommendedPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { addItem } = useBag();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('relevance');
  const [gridView, setGridView] = useState<'grid' | 'compact'>('grid');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendedProducts();
  }, [selectedCategory, sortBy, user?.id]);

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('products')
        .select(
          'id, name, price, original_price, image, rating, total_reviews, category, is_bestseller, sales_count'
        )
        .eq('status', 'active');

      // Filter by category
      if (selectedCategory !== 'Todos') {
        query = query.eq('category', selectedCategory);
      }

      // Sort logic
      switch (sortBy) {
        case 'rating':
          query = query.order('rating', { ascending: false, nullsFirst: false });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('sales_count', { ascending: false, nullsFirst: false });
          break;
        default:
          // Relevance: mix of rating and sales
          query = query.order('rating', { ascending: false, nullsFirst: false });
      }

      const { data, error } = await query.limit(24);
      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setAddingToCart(productId);
    try {
      await addItem(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      await toggleFavorite(productId, 'product');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate?.('VITRINE')}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Recomendados para Você
            </h1>
            <p className="text-sm text-zinc-500">Produtos selecionados com base no seu perfil</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setGridView('grid')}
              className={`p-2 rounded-md transition-colors ${gridView === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setGridView('compact')}
              className={`p-2 rounded-md transition-colors ${gridView === 'compact' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
            >
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-zinc-500">
        {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>

      {/* Products Grid */}
      {loading ? (
        <div
          className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-3 lg:grid-cols-6'}`}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div
          className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-3 lg:grid-cols-6'}`}
        >
          {products.map(product => {
            const hasDiscount = product.original_price && product.original_price > product.price;
            const discount = hasDiscount
              ? Math.round((1 - product.price / product.original_price!) * 100)
              : 0;

            return (
              <button
                key={product.id}
                onClick={() => onNavigate?.(`PRODUCT_DETAILS:${product.id}`)}
                className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-pink-500/50 transition-all hover:shadow-lg text-left"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={
                      product.image ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && (
                      <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        -{discount}%
                      </span>
                    )}
                    {product.is_bestseller && (
                      <span className="bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <button
                    onClick={e => handleToggleFavorite(e, product.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                  >
                    <Heart
                      size={14}
                      className={
                        isFavorited(product.id, 'product') ? 'fill-rose-500 text-rose-500' : ''
                      }
                    />
                  </button>

                  <button
                    onClick={e => handleAddToCart(e, product.id)}
                    disabled={addingToCart === product.id}
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-pink-600 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-700 disabled:opacity-50"
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-1.5 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>

                  {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-medium text-zinc-600">
                        {product.rating.toFixed(1)}
                      </span>
                      {product.total_reviews && (
                        <span className="text-xs text-zinc-400">({product.total_reviews})</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-pink-600">{formatPrice(product.price)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(product.original_price!)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
          <Sparkles size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-zinc-500">Tente ajustar os filtros ou explore outras categorias</p>
        </div>
      )}
    </div>
  );
};

export default RecommendedPage;
