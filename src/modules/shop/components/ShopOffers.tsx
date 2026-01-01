/**
 * ShopOffers - Página dedicada de Ofertas Relâmpago
 * Design minimalista com listagem, filtros e navegação
 */

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  Filter,
  ChevronDown,
  Heart,
  ShoppingBag,
  Star,
  ArrowLeft,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Search,
  Tag,
  TrendingDown,
  Percent,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ProfileType } from '../../../types';
import { useBag } from '../../../lib/BagContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  image: string | null;
  created_by: string | null;
  rating?: number;
  total_reviews?: number;
  stock?: number;
  sales_count?: number;
}

interface ShopOffersProps {
  profile: ProfileType | string;
  userId?: string;
  onNavigate?: (page: string) => void;
}

const DISCOUNT_FILTERS = [
  { id: 'all', label: 'Todos', min: 0 },
  { id: '10', label: '10%+', min: 10 },
  { id: '20', label: '20%+', min: 20 },
  { id: '30', label: '30%+', min: 30 },
  { id: '50', label: '50%+', min: 50 },
];

const SORT_OPTIONS = [
  { id: 'discount', label: 'Maior Desconto' },
  { id: 'price_asc', label: 'Menor Preço' },
  { id: 'price_desc', label: 'Maior Preço' },
  { id: 'rating', label: 'Mais Avaliados' },
  { id: 'sales', label: 'Mais Vendidos' },
];

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'Eletrônicos', label: 'Eletrônicos' },
  { id: 'Acessórios', label: 'Acessórios' },
  { id: 'Moda', label: 'Moda' },
  { id: 'Casa', label: 'Casa' },
];

export const ShopOffers: React.FC<ShopOffersProps> = ({ profile, userId, onNavigate }) => {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [discountFilter, setDiscountFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [gridView, setGridView] = useState<'grid' | 'compact'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 45 });

  const { addItem } = useBag();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          hours = 5;
          minutes = 23;
          seconds = 45;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .not('original_price', 'is', null)
        .gt('original_price', 0)
        .order('sales_count', { ascending: false });

      if (error) throw error;

      // Filter products with actual discounts
      const dealsWithDiscount = (data || []).filter(
        p => p.original_price && p.price && p.original_price > p.price
      );

      setOffers(dealsWithDiscount);
    } catch (error) {
      console.error('Error fetching offers:', error);
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

  const getDiscount = (price: number, originalPrice: number) =>
    Math.round((1 - price / originalPrice) * 100);

  // Filter and sort offers
  const filteredOffers = offers
    .filter(offer => {
      const discount = getDiscount(offer.price, offer.original_price!);
      const minDiscount = DISCOUNT_FILTERS.find(f => f.id === discountFilter)?.min || 0;
      const matchesDiscount = discount >= minDiscount;
      const matchesCategory = categoryFilter === 'all' || offer.category === categoryFilter;
      return matchesDiscount && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return getDiscount(b.price, b.original_price!) - getDiscount(a.price, a.original_price!);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'sales':
          return (b.sales_count || 0) - (a.sales_count || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate?.('VITRINE')}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Ofertas Relâmpago</h1>
          <p className="text-sm text-zinc-500">Aproveite os melhores descontos</p>
        </div>
      </div>

      {/* Timer Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Zap className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Ofertas por Tempo Limitado</h2>
              <p className="text-white/80 text-sm">Não perca essas oportunidades!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
            <Clock className="text-white" size={18} />
            <div className="flex items-center gap-1 text-white font-mono text-lg font-bold">
              <span className="bg-white/30 px-3 py-1.5 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/30 px-3 py-1.5 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/30 px-3 py-1.5 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
          <Percent className="mx-auto mb-2 text-rose-500" size={24} />
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {offers.length > 0
              ? Math.max(...offers.map(o => getDiscount(o.price, o.original_price!)))
              : 0}
            %
          </p>
          <p className="text-xs text-zinc-500">Maior Desconto</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
          <Tag className="mx-auto mb-2 text-amber-500" size={24} />
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{offers.length}</p>
          <p className="text-xs text-zinc-500">Ofertas Ativas</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
          <TrendingDown className="mx-auto mb-2 text-emerald-500" size={24} />
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {offers.length > 0 ? formatPrice(Math.min(...offers.map(o => o.price))) : 'R$ 0'}
          </p>
          <p className="text-xs text-zinc-500">A partir de</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        {/* Discount Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {DISCOUNT_FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setDiscountFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                discountFilter === filter.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-zinc-100 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-rose-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-zinc-100 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-rose-500"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setGridView('grid')}
              className={`p-1.5 rounded transition-colors ${gridView === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setGridView('compact')}
              className={`p-1.5 rounded transition-colors ${gridView === 'compact' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-zinc-500">
        {filteredOffers.length}{' '}
        {filteredOffers.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
      </p>

      {/* Products Grid */}
      {filteredOffers.length > 0 ? (
        <div
          className={`grid gap-4 ${
            gridView === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}
        >
          {filteredOffers.map(offer => {
            const discount = getDiscount(offer.price, offer.original_price!);
            const soldPercentage =
              offer.stock && offer.stock > 0
                ? Math.min(
                    ((offer.sales_count || 0) / (offer.stock + (offer.sales_count || 0))) * 100,
                    95
                  )
                : 50;

            return (
              <button
                key={offer.id}
                onClick={() => onNavigate?.(`PRODUCT_DETAILS:${offer.id}`)}
                className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-rose-500/50 transition-all hover:shadow-lg text-left"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={
                      offer.image ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
                    }
                    alt={offer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                    <Zap size={10} fill="currentColor" />-{discount}%
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => handleToggleFavorite(e, offer.id)}
                      className="p-1.5 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <Heart
                        size={14}
                        className={
                          isFavorited(offer.id, 'product') ? 'fill-rose-500 text-rose-500' : ''
                        }
                      />
                    </button>
                    <button
                      onClick={e => handleAddToCart(e, offer.id)}
                      disabled={addingToCart === offer.id}
                      className="p-1.5 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-2 line-clamp-2">
                    {offer.name}
                  </h3>

                  {/* Rating */}
                  {offer.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {offer.rating.toFixed(1)}
                        {offer.total_reviews && ` (${offer.total_reviews})`}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-rose-600">{formatPrice(offer.price)}</span>
                    <span className="text-xs text-zinc-400 line-through">
                      {formatPrice(offer.original_price!)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Vendidos: {offer.sales_count || 0}</span>
                      <span>{soldPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <EmptyState
            title="Nenhuma oferta encontrada"
            description="Tente ajustar os filtros ou volte mais tarde."
            icon={Tag}
          />
        </div>
      )}
    </div>
  );
};

export default ShopOffers;
