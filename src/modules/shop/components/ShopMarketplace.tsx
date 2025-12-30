import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Store,
  ChevronRight,
  Sparkles,
  Star,
} from 'lucide-react';
import { ProfileType } from '../../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FeaturedStores } from './FeaturedStores';
import { QuickActions } from './QuickActions';
import { RecommendedProducts } from './RecommendedProducts';
import { DailyDeals } from './DailyDeals';
import { useProducts } from '../hooks/useShop';
import { useCart } from '../../../lib/CartContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { SkeletonProductCard } from '../../../design-system';

/**
 * ShopMarketplace Component
 *
 * A refined, minimalist marketplace with clean layout,
 * proper whitespace, and subtle visual hierarchy.
 */

interface ShopMarketplaceProps {
  profile: ProfileType | string;
  userId?: string;
  onNavigate?: (page: string) => void;
}

const CATEGORIES = [
  { id: 'Todos', name: 'All Products', icon: '📦' },
  { id: 'Eletrônicos', name: 'Electronics', icon: '💻' },
  { id: 'Acessórios', name: 'Accessories', icon: '🎧' },
  { id: 'Serviços', name: 'Services', icon: '🛠️' },
];

const TRENDING_SEARCHES = [
  'Smartphone',
  'Notebook',
  'Gaming Chair',
  'Mechanical Keyboard',
  'Monitor',
];

export const ShopMarketplace: React.FC<ShopMarketplaceProps> = ({
  profile,
  userId,
  onNavigate,
}) => {
  const isBusiness = profile === ProfileType.BUSINESS;
  const { products, loading } = useProducts({ status: 'active' });
  const { totalItems: cartCount, addItem, openCart } = useCart();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error adding to cart');
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      await toggleFavorite(productId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Please login to favorite');
    }
  };

  const handleViewDetails = (productId: string) => {
    onNavigate?.(`PRODUCT_DETAILS:${productId}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full max-w-xl">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-colors"
            />
          </div>

          {/* Trending Searches */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="text-xs text-zinc-500">Popular:</span>
            {TRENDING_SEARCHES.slice(0, 4).map(term => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-accent-100 dark:hover:bg-accent-900/30 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isBusiness && (
            <button
              onClick={() => onNavigate?.('INVENTORY')}
              className="flex items-center gap-2 bg-accent-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-accent-700 transition-colors"
            >
              <Store size={16} />
              My Store
            </button>
          )}

          <button
            onClick={() => openCart()}
            className="relative p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-accent-500 transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="text-zinc-600 dark:text-zinc-400" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Daily Deals */}
      <DailyDeals />

      {/* Recommended Products */}
      <RecommendedProducts />

      {/* Featured Stores */}
      <FeaturedStores />

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Categories</h2>
          <button className="text-sm text-accent-600 dark:text-accent-400 font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
            View all
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl text-left transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <h3
                className={`font-medium text-sm ${
                  selectedCategory === cat.id
                    ? 'text-accent-700 dark:text-accent-300'
                    : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {cat.name}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('Todos')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'Todos'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          All
        </button>
        <button className="px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5">
          <TrendingUp size={14} />
          Best Sellers
        </button>
        <button className="px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5">
          <Sparkles size={14} />
          New Arrivals
        </button>
        <button className="px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5">
          <Star size={14} />
          Top Rated
        </button>
      </div>

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {selectedCategory === 'Todos' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}{' '}
              found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isOwner={userId === product.created_by}
                isFavorite={isFavorited(product.id)}
                onAddToCart={() => handleAddToCart(product.id)}
                onToggleFavorite={() => handleToggleFavorite(product.id)}
                onViewDetails={() => handleViewDetails(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              title="No products found"
              description="Try adjusting your search or explore other categories."
              icon={Search}
            />
          </div>
        )}
      </section>

      {/* Business CTA */}
      {isBusiness && (
        <section className="rounded-xl bg-zinc-900 dark:bg-zinc-800 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Start selling on Tymes</h3>
              <p className="text-zinc-400">Reach thousands of customers and grow your business</p>
            </div>
            <button
              onClick={() => onNavigate?.('CREATE_PRODUCT')}
              className="bg-white text-zinc-900 px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-100 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Store size={18} />
              Start Selling
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ShopMarketplace;
