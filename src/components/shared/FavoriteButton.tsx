import React from 'react';
import { Bookmark } from 'lucide-react';
import { useFavorites } from '../../lib/FavoritesContext';
import { useAuth } from '../../lib/AuthContext';

interface FavoriteButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBackground?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  size = 'md',
  className = '',
  showBackground = true,
}) => {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite, loading } = useFavorites();

  const isFav = isFavorited(productId);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loading) return;
    await toggleFavorite(productId);
  };

  if (!user) return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${showBackground ? 'bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-sm' : ''}
        rounded-full flex items-center justify-center
        transition-all duration-200
        hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isFav ? 'Remover dos salvos' : 'Salvar'}
    >
      <Bookmark
        size={iconSizes[size]}
        className={`transition-colors duration-200 ${
          isFav ? 'fill-indigo-500 text-indigo-500' : 'text-zinc-400 hover:text-indigo-400'
        }`}
      />
    </button>
  );
};
