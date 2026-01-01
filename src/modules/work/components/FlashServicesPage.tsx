/**
 * FlashServicesPage - Página dedicada de Serviços em Promoção
 * Lista todos os serviços com desconto
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Zap,
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

interface Service {
  id: string;
  name: string;
  price: number;
  original_price: number;
  image: string | null;
  description?: string;
  rating?: number;
  reviews_count?: number;
  delivery_time?: string;
  category: string;
  seller?: {
    name: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
}

interface FlashServicesPageProps {
  onNavigate?: (page: string) => void;
}

const CATEGORIES = ['Todos', 'Service', 'Digital', 'Course'];
const SORT_OPTIONS = [
  { id: 'discount', label: 'Maior Desconto' },
  { id: 'price_asc', label: 'Menor Preço' },
  { id: 'price_desc', label: 'Maior Preço' },
  { id: 'rating', label: 'Melhor Avaliados' },
];

// Mock data fallback
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Desenvolvimento de Website Profissional',
    price: 2500,
    original_price: 3500,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    description: 'Sites responsivos e modernos',
    rating: 4.9,
    reviews_count: 128,
    delivery_time: '7 dias',
    category: 'Service',
    seller: { name: 'Carlos Dev', avatar_url: null, is_verified: true },
  },
  {
    id: '2',
    name: 'Design de Logo Profissional',
    price: 450,
    original_price: 699,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    description: 'Identidade visual única',
    rating: 4.8,
    reviews_count: 256,
    delivery_time: '3 dias',
    category: 'Service',
    seller: { name: 'Ana Designer', avatar_url: null, is_verified: true },
  },
  {
    id: '3',
    name: 'Gestão de Redes Sociais - Mensal',
    price: 1200,
    original_price: 1800,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    description: 'Estratégia completa de social media',
    rating: 4.7,
    reviews_count: 89,
    delivery_time: '30 dias',
    category: 'Service',
    seller: { name: 'Julia Marketing', avatar_url: null, is_verified: true },
  },
  {
    id: '4',
    name: 'Template Notion Premium',
    price: 79,
    original_price: 149,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    description: 'Organize sua vida e projetos',
    rating: 4.9,
    reviews_count: 512,
    delivery_time: 'Imediato',
    category: 'Digital',
    seller: { name: 'Pedro Templates', avatar_url: null, is_verified: false },
  },
  {
    id: '5',
    name: 'Consultoria de Negócios - 1h',
    price: 500,
    original_price: 800,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    description: 'Consultoria estratégica personalizada',
    rating: 5.0,
    reviews_count: 45,
    delivery_time: 'Agendado',
    category: 'Course',
    seller: { name: 'Roberto CEO', avatar_url: null, is_verified: true },
  },
  {
    id: '6',
    name: 'Pack de Ícones SVG Premium',
    price: 29,
    original_price: 59,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    description: '+500 ícones vetoriais',
    rating: 4.6,
    reviews_count: 234,
    delivery_time: 'Imediato',
    category: 'Digital',
    seller: { name: 'Icons Studio', avatar_url: null, is_verified: true },
  },
  {
    id: '7',
    name: 'Edição de Vídeo Profissional',
    price: 350,
    original_price: 500,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    description: 'Vídeos para YouTube e redes sociais',
    rating: 4.8,
    reviews_count: 167,
    delivery_time: '5 dias',
    category: 'Service',
    seller: { name: 'Video Pro', avatar_url: null, is_verified: true },
  },
  {
    id: '8',
    name: 'Curso de Marketing Digital',
    price: 197,
    original_price: 397,
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800',
    description: 'Do básico ao avançado',
    rating: 4.7,
    reviews_count: 892,
    delivery_time: 'Acesso imediato',
    category: 'Course',
    seller: { name: 'Marketing Academy', avatar_url: null, is_verified: true },
  },
];

export const FlashServicesPage: React.FC<FlashServicesPageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('discount');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 30, seconds: 15 });
  const { isFavorited, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchServices();
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
          hours = 6;
          minutes = 30;
          seconds = 15;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          'id, name, price, original_price, image, description, rating, total_reviews, category, created_by'
        )
        .in('category', ['Service', 'Digital', 'Course'])
        .eq('status', 'active')
        .order('rating', { ascending: false, nullsFirst: false });

      if (error) throw error;

      const processedServices = (data || []).map(s => {
        const price = Number(s.price) || 199.9;
        const originalPrice = Number(s.original_price) || Math.round(price * 1.5 * 100) / 100;
        return {
          ...s,
          price: price,
          original_price:
            originalPrice > price ? originalPrice : Math.round(price * 1.5 * 100) / 100,
          delivery_time: `${Math.floor(Math.random() * 14) + 1} dias`,
          rating: Number(s.rating) || 4.5 + Math.random() * 0.5,
          reviews_count: s.total_reviews || Math.floor(Math.random() * 100) + 10,
          seller: { name: 'Freelancer Pro', avatar_url: null, is_verified: true },
        };
      });

      setServices(processedServices.length > 0 ? processedServices : MOCK_SERVICES);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(MOCK_SERVICES);
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

  const getDiscount = (price: number, originalPrice: number) =>
    Math.round((1 - price / originalPrice) * 100);

  // Filter and sort
  const filteredServices = services
    .filter(s => selectedCategory === 'Todos' || s.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return getDiscount(b.price, b.original_price) - getDiscount(a.price, a.original_price);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

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
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-600" size={24} />
            <h1 className="text-2xl font-bold">Serviços em Promoção</h1>
          </div>
          <p className="text-zinc-500 text-sm mt-1">
            {filteredServices.length} serviços com desconto especial
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl">
          <Clock size={16} />
          <div className="flex items-center gap-1 font-mono text-sm font-bold">
            <span className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat === 'Service'
                ? 'Serviços'
                : cat === 'Digital'
                  ? 'Digitais'
                  : cat === 'Course'
                    ? 'Cursos'
                    : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm border-0 focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow' : ''}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow' : ''}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
        >
          {filteredServices.map(service => {
            const discount = getDiscount(service.price, service.original_price);

            return (
              <button
                key={service.id}
                onClick={() => onNavigate?.(`SERVICE_DETAILS:${service.id}`)}
                className={`group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-lg text-left ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'}`}
                >
                  <img
                    src={
                      service.image ||
                      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Zap size={12} fill="currentColor" />-{discount}%
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={e => handleToggleFavorite(e, service.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Heart
                      size={16}
                      className={
                        isFavorited(service.id, 'service') ? 'fill-rose-500 text-rose-500' : ''
                      }
                    />
                  </button>

                  {/* Delivery Time */}
                  {service.delivery_time && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                      <Clock size={12} /> {service.delivery_time}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Seller */}
                  {service.seller && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {service.seller.name.charAt(0)}
                      </div>
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

                  {service.description && (
                    <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{service.description}</p>
                  )}

                  {/* Rating */}
                  {service.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="font-medium text-sm">{service.rating.toFixed(1)}</span>
                      </div>
                      {service.reviews_count && (
                        <span className="text-xs text-zinc-400">
                          ({service.reviews_count} avaliações)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs text-zinc-500">A partir de</span>
                    <span className="font-bold text-lg text-indigo-600">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-sm text-zinc-400 line-through">
                      {formatPrice(service.original_price)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {filteredServices.length === 0 && !loading && (
        <div className="text-center py-16">
          <Zap size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
            Nenhum serviço em promoção
          </h3>
          <p className="text-zinc-500 text-sm mt-1">Volte mais tarde para conferir novas ofertas</p>
        </div>
      )}
    </div>
  );
};

export default FlashServicesPage;
