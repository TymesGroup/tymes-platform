import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';

interface CartButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({
  productId,
  size = 'md',
  variant = 'icon',
  className = '',
}) => {
  const { user } = useAuth();
  const { addItem, items, loading } = useCart();

  const isInCart = items.some(item => item.product_id === productId);

  const sizeClasses = {
    sm: variant === 'icon' ? 'w-7 h-7' : 'px-3 py-1.5 text-xs',
    md: variant === 'icon' ? 'w-9 h-9' : 'px-4 py-2 text-sm',
    lg: variant === 'icon' ? 'w-11 h-11' : 'px-5 py-2.5 text-base',
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
    await addItem(productId, 1);
  };

  if (!user) return null;

  if (variant === 'full') {
    return (
      <button
        onClick={handleClick}
        disabled={loading || isInCart}
        className={`
          ${sizeClasses[size]}
          ${
            isInCart
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }
          rounded-lg font-medium
          transition-all duration-200
          flex items-center justify-center gap-2
          disabled:opacity-70 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isInCart ? (
          <>
            <ShoppingCart size={iconSizes[size]} />
            No carrinho
          </>
        ) : (
          <>
            <Plus size={iconSizes[size]} />
            Adicionar
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || isInCart}
      className={`
        ${sizeClasses[size]}
        ${
          isInCart
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }
        rounded-full flex items-center justify-center
        transition-all duration-200
        hover:scale-110 active:scale-95
        disabled:opacity-70 disabled:cursor-not-allowed
        shadow-sm
        ${className}
      `}
      title={isInCart ? 'Já no carrinho' : 'Adicionar ao carrinho'}
    >
      {isInCart ? <ShoppingCart size={iconSizes[size]} /> : <Plus size={iconSizes[size]} />}
    </button>
  );
};
