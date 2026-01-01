import React from 'react';
import { ShoppingBag, Bookmark, Edit, Trash2, Star, Eye, Loader2 } from 'lucide-react';

/**
 * ProductCard Component
 * Card de produto com design moderno, hierarquia visual clara e interações suaves
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
  original_price?: number | null;
}

interface ProductCardProps {
  product: Product;
  isOwner?: boolean;
  isFavorite?: boolean;
  isAddingToCart?: boolean;
  compact?: boolean;
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
  isAddingToCart = false,
  compact = false,
  onEdit,
  onDelete,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
}) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';
  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : 0;

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
    if (!isAddingToCart) {
      onAddToCart?.(product);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product.id);
  };

  const handleCardClick = () => {
    onViewDetails?.(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-200 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div
        className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}
      >
        <img
          src={product.image || defaultImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-zinc-900/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-sm font-semibold text-white bg-zinc-800/90 px-4 py-2 rounded-lg">
              Esgotado
            </span>
          </div>
        )}

        {/* Quick Actions - Consumer View */}
        {!isOwner && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleFavoriteClick}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all shadow-lg ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-rose-500 hover:text-white'
              }`}
              aria-label={isFavorite ? 'Remover dos salvos' : 'Salvar'}
            >
              <Bookmark size={16} className={isFavorite ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleViewClick}
              className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-pink-600 hover:text-white transition-all backdrop-blur-md shadow-lg"
              aria-label="Ver detalhes"
            >
              <Eye size={16} />
            </button>
          </div>
        )}

        {/* Add to Cart Button */}
        {!isOwner && !isOutOfStock && (
          <button
            onClick={handleCartClick}
            disabled={isAddingToCart}
            className="absolute bottom-3 right-3 p-3 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-all duration-200 shadow-lg shadow-pink-500/30 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Adicionar à bolsa"
          >
            {isAddingToCart ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ShoppingBag size={18} />
            )}
          </button>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <div className="absolute bottom-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleEditClick}
              className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-pink-600 hover:text-white transition-all backdrop-blur-md shadow-lg"
              aria-label="Editar produto"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-rose-500 hover:text-white transition-all backdrop-blur-md shadow-lg"
              aria-label="Excluir produto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${compact ? 'p-3' : 'p-4'}`}>
        {/* Category */}
        <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
          {product.category}
        </span>

        {/* Name */}
        <h3
          className={`font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2 flex-1 leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors ${compact ? 'text-sm' : 'text-base'}`}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {!compact &&
          product.rating !== null &&
          product.rating !== undefined &&
          product.rating > 0 && (
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
        <div
          className={`flex items-end justify-between ${!compact ? 'pt-3 border-t border-zinc-100 dark:border-zinc-800' : ''}`}
        >
          <div>
            {!compact && (
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Preço
              </span>
            )}
            <div className="flex items-center gap-2">
              <p
                className={`font-bold text-zinc-900 dark:text-zinc-100 ${compact ? 'text-base' : 'text-lg'}`}
              >
                R$ {product.price.toFixed(2)}
              </p>
              {hasDiscount && !compact && (
                <span className="text-sm text-zinc-400 line-through">
                  R$ {product.original_price!.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {isOwner && !compact && (
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
