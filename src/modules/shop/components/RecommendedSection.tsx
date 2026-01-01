/**
 * RecommendedSection - Seção de Produtos Recomendados refinada
 * Design minimalista com dados reais do Supabase
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, ShoppingBag, Star, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useBag } from '../../../lib/BagContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { ShowcaseSection } from '../../../components/ui/ShowcaseSection';

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
}

interface RecommendedSectionProps {
  onNavigate?: (page: string) => void;
  limit?: number;
  userId?: string;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  onNavigate,
  limit = 4,
  userId,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useBag();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [limit]);

  const fetchProducts = async () => {
    try {
      let { data, error } = await supabase
        .from('products')
        .select(
          'id, name, price, original_price, image, rating, total_reviews, category, is_bestseller'
        )
        .eq('status', 'active')
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;

      // If no products with rating, get all products
      if (!data || data.length === 0) {
        const { data: allProducts, error: allError } = await supabase
          .from('products')
          .select(
            'id, name, price, original_price, image, rating, total_reviews, category, is_bestseller'
          )
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!allError) {
          data = allProducts;
        }
      }

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

  if (loading) {
    return (
      <ShowcaseSection title="Recomendados para Você" icon={Sparkles} iconColor="text-amber-500">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </ShowcaseSection>
    );
  }

  // Don't render if no products available
  if (products.length === 0) return null;

  const displayProducts = products;

  return (
    <ShowcaseSection
      title="Recomendados para Você"
      subtitle="Baseado no seu histórico"
      icon={Sparkles}
      iconColor="text-amber-500"
      onViewAll={() => onNavigate?.('RECOMMENDED')}
      viewAllLabel="Ver mais"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayProducts.map(product => {
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
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={
                    product.image ||
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
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

                {/* Favorite Button */}
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

                {/* Quick Add */}
                <button
                  onClick={e => handleAddToCart(e, product.id)}
                  disabled={addingToCart === product.id}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-pink-600 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-700 disabled:opacity-50"
                >
                  <ShoppingBag size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-1.5 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.total_reviews && (
                      <span className="text-xs text-zinc-400">({product.total_reviews})</span>
                    )}
                  </div>
                )}

                {/* Price */}
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
    </ShowcaseSection>
  );
};

export default RecommendedSection;
