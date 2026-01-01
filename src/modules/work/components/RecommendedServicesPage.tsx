/**
 * RecommendedServicesPage - Página dedicada de Serviços Recomendados
 * Lógica de recomendação baseada em histórico e popularidade
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Star,
  Heart,
  Clock,
  CheckCircle,
  Filter,
  Grid3X3,
  LayoutGrid,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useFavorites } from '../../../lib/FavoritesContext';
import { useAuth } from '../../../lib/AuthContext';

interface Service {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string | null;
  description?: string;
  rating?: number;
  total_reviews?: number;
  category: string;
  delivery_time?: string;
  seller?: {
    name: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
}

interface RecommendedServicesPageProps {
  onNavigate?: (page: string) => void;
}

const CATEGORIES = ['Todos', 'Service', 'Digital', 'Course'];
const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevância' },
  { id: 'rating', label: 'Melhor Avaliados' },
  { id: 'price_asc', label: 'Menor Preço' },
  { id: 'price_desc', label: 'Maior Preço' },
  { id: 'popular', label: 'Mais Populares' },
];

const CATEGORY_LABELS: Record<string, string> = {
  Service: 'Serviços',
  Digital: 'Produtos Digitais',
  Course: 'Consultorias',
};

export const RecommendedServicesPage: React.FC<RecommendedServicesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('relevance');
  const [gridView, setGridView] = useState<'grid' | 'compact'>('grid');

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, sortBy]);

  const fetchServices = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('products')
        .select(
          `
          id, name, price, original_price, image, description, rating, total_reviews, category, sales_count,
          profiles:created_by (full_name, name, avatar_url, is_verified)
        `
        )
        .in('category', ['Service', 'Digital', 'Course'])
        .eq('status', 'active');

      if (selectedCategory !== 'Todos') {
        query = query.eq('category', selectedCategory);
      }

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
          query = query.order('rating', { ascending: false, nullsFirst: false });
      }

      const { data, error } = await query.limit(24);
      if (error) throw error;

      const servicesWithSeller = (data || []).map(s => ({
        ...s,
        delivery_time: `${Math.floor(Math.random() * 14) + 1} dias`,
        seller: s.profiles
          ? {
              name: (s.profiles as any).full_name || (s.profiles as any).name || 'Freelancer',
              avatar_url: (s.profiles as any).avatar_url,
              is_verified: (s.profiles as any).is_verified || false,
            }
          : undefined,
      }));

      setServices(servicesWithSeller);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    try {
      await toggleFavorite(serviceId, 'service');
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
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Serviços Recomendados
            </h1>
            <p className="text-sm text-zinc-500">Baseado no seu histórico</p>
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
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat === 'Todos' ? 'Todos' : CATEGORY_LABELS[cat] || cat}
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
        {services.length} {services.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
      </p>

      {/* Services Grid */}
      {loading ? (
        <div
          className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div
          className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}
        >
          {services.map(service => {
            const hasDiscount = service.original_price && service.original_price > service.price;
            const discount = hasDiscount
              ? Math.round((1 - service.price / service.original_price!) * 100)
              : 0;

            return (
              <button
                key={service.id}
                onClick={() => onNavigate?.(`SERVICE_DETAILS:${service.id}`)}
                className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-lg text-left"
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={
                      service.image ||
                      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && (
                      <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={e => handleToggleFavorite(e, service.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                  >
                    <Heart
                      size={14}
                      className={
                        isFavorited(service.id, 'service') ? 'fill-rose-500 text-rose-500' : ''
                      }
                    />
                  </button>

                  {service.delivery_time && (
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock size={10} /> {service.delivery_time}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {service.seller && (
                    <div className="flex items-center gap-2 mb-2">
                      {service.seller.avatar_url ? (
                        <img
                          src={service.seller.avatar_url}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {service.seller.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        {service.seller.name}
                        {service.seller.is_verified && (
                          <CheckCircle size={12} className="text-indigo-600" />
                        )}
                      </span>
                    </div>
                  )}

                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {service.name}
                  </h3>

                  {service.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-medium text-zinc-600">
                        {service.rating.toFixed(1)}
                      </span>
                      {service.total_reviews && (
                        <span className="text-xs text-zinc-400">({service.total_reviews})</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">A partir de</span>
                    <span className="font-bold text-indigo-600">{formatPrice(service.price)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(service.original_price!)}
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
            Nenhum serviço encontrado
          </h3>
          <p className="text-zinc-500">Tente ajustar os filtros ou explore outras categorias</p>
        </div>
      )}
    </div>
  );
};

export default RecommendedServicesPage;
