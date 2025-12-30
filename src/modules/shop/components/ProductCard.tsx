import React from 'react';
import { ShoppingCart, Heart, Edit, Trash2, Star, Eye } from 'lucide-react';

/**
 * ProductCard Component
 *
 * A refined, minimalist product card with clean typography,
 * subtle hover states, and essential information only.
 */

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  created_by?: string | null;
  description?: string | null;
  rating?: number | null;
  total_reviews?: number | null;
  stock?: number | null;
  status?: string | null;
}

interface ProductCardProps {
  product: Product;
  isOwner?: boolean;
  isFavorite?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isOwner = false,
  isFavorite = false,
  onEdit,
  onDelete,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
}) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';
  const isOutOfStock = product.stock === 0;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultImage;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(product.id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product.id);
  };

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md flex flex-col h-full">
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
        <img
          src={product.image || defaultImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-zinc-900/60 flex items-center justify-center">
            <span className="text-sm font-medium text-white bg-zinc-800 px-3 py-1.5 rounded-md">
              Esgotado
            </span>
          </div>
        )}

        {/* Quick Actions - Consumer View */}
        {!isOwner && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-red-500 hover:text-white'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleViewClick}
              className="p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-accent-600 hover:text-white transition-colors backdrop-blur-sm"
              aria-label="View details"
            >
              <Eye size={16} />
            </button>
          </div>
        )}

        {/* Add to Cart Button */}
        {!isOwner && !isOutOfStock && (
          <button
            onClick={handleCartClick}
            className="absolute bottom-3 right-3 p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-accent-600 hover:text-white transition-all duration-200 backdrop-blur-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <div className="absolute bottom-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleEditClick}
              className="p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-accent-600 hover:text-white transition-colors backdrop-blur-sm"
              aria-label="Edit product"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-sm"
              aria-label="Delete product"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="p-4 flex flex-col flex-1 cursor-pointer"
        onClick={() => onViewDetails?.(product.id)}
      >
        {/* Category */}
        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2 flex-1 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating !== null && product.rating !== undefined && product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={12}
                  className={
                    star <= (product.rating || 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-zinc-300 dark:text-zinc-600'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              ({product.total_reviews || 0})
            </span>
          </div>
        )}

        {/* Price & Status */}
        <div className="flex items-end justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Preço</span>
            <p className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
              R$ {product.price.toFixed(2)}
            </p>
          </div>

          {isOwner && (
            <div className="text-right">
              <span
                className={`text-xs font-medium ${
                  product.status === 'active'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-zinc-400'
                }`}
              >
                {product.status === 'active'
                  ? 'Ativo'
                  : product.status === 'out_of_stock'
                    ? 'Sem estoque'
                    : 'Inativo'}
              </span>
              {product.stock !== null && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.stock} un.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
