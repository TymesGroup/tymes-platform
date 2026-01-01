/**
 * FeaturedStoresPage - Página dedicada de Lojas em Destaque
 * Lista todas as lojas ativas com filtros e navegação
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Store,
  Star,
  TrendingUp,
  CheckCircle,
  Search,
  Filter,
  MapPin,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface StoreItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  rating: number;
  total_sales: number;
  is_verified: boolean;
  category: string | null;
}

interface FeaturedStoresPageProps {
  onNavigate?: (page: string) => void;
}

const CATEGORIES = ['Todas', 'Eletrônicos', 'Moda', 'Casa', 'Esportes', 'Games', 'Beleza'];
const SORT_OPTIONS = [
  { id: 'rating', label: 'Melhor Avaliadas' },
  { id: 'sales', label: 'Mais Vendas' },
  { id: 'name', label: 'Nome A-Z' },
  { id: 'recent', label: 'Mais Recentes' },
];

const GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-violet-500',
];

export const FeaturedStoresPage: React.FC<FeaturedStoresPageProps> = ({ onNavigate }) => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState('rating');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [selectedCategory, sortBy, showVerifiedOnly]);

  const fetchStores = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('stores')
        .select(
          'id, name, slug, description, logo_url, banner_url, rating, total_sales, is_verified, category'
        )
        .eq('is_active', true);

      if (selectedCategory !== 'Todas') {
        query = query.eq('category', selectedCategory);
      }

      if (showVerifiedOnly) {
        query = query.eq('is_verified', true);
      }

      switch (sortBy) {
        case 'sales':
          query = query.order('total_sales', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('rating', { ascending: false, nullsFirst: false });
      }

      const { data, error } = await query.limit(24);
      if (error) throw error;

      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSales = (sales: number) => {
    if (sales >= 1000) return `${(sales / 1000).toFixed(1)}k`;
    return sales.toString();
  };

  const getGradient = (index: number) => GRADIENTS[index % GRADIENTS.length];

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
          <div className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
            <Store className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Lojas em Destaque
            </h1>
            <p className="text-sm text-zinc-500">Vendedores verificados e bem avaliados</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar lojas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={e => setShowVerifiedOnly(e.target.checked)}
              className="rounded border-zinc-300"
            />
            <CheckCircle size={14} className="text-emerald-500" />
            Apenas verificadas
          </label>

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
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
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

      {/* Results Count */}
      <p className="text-sm text-zinc-500">
        {filteredStores.length}{' '}
        {filteredStores.length === 1 ? 'loja encontrada' : 'lojas encontradas'}
      </p>

      {/* Stores Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : filteredStores.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStores.map((store, index) => (
            <button
              key={store.id}
              onClick={() => onNavigate?.(`STORE:${store.id}`)}
              className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-pink-500/50 transition-all hover:shadow-lg text-left"
            >
              {/* Banner */}
              <div
                className={`h-20 bg-gradient-to-br ${getGradient(index)} relative overflow-hidden`}
              >
                {store.banner_url && (
                  <img
                    src={store.banner_url}
                    alt=""
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                {store.is_verified && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <CheckCircle size={10} />
                    Verificada
                  </div>
                )}
              </div>

              {/* Logo */}
              <div className="relative -mt-8 px-4">
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-900 shadow-lg overflow-hidden">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${getGradient(index)} flex items-center justify-center`}
                    >
                      <Store size={24} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 pt-2">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-pink-600 transition-colors line-clamp-1">
                  {store.name}
                </h3>

                {store.category && <p className="text-xs text-zinc-500 mb-2">{store.category}</p>}

                {store.description && (
                  <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{store.description}</p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="font-bold">{store.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-500">
                    <TrendingUp size={12} />
                    <span>{formatSales(store.total_sales || 0)} vendas</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
          <Store size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Nenhuma loja encontrada
          </h3>
          <p className="text-zinc-500">Tente ajustar os filtros ou a busca</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedStoresPage;
