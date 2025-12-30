import React, { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  Zap,
  Briefcase,
  ChevronRight,
  Sparkles,
  Monitor,
  Star,
  Clock,
  Users,
  Heart,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { ProfileType } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  created_by: string | null;
  description?: string;
}

interface WorkMarketplaceProps {
  profile: ProfileType | string;
  userId?: string;
  onNavigate?: (page: string) => void;
}

const HERO_BANNERS = [
  {
    id: 1,
    title: 'Encontre o Freelancer Ideal',
    subtitle: 'Profissionais verificados para o seu projeto',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    icon: Briefcase,
    badge: 'Top Talents',
  },
  {
    id: 2,
    title: 'Serviços Digitais Premium',
    subtitle: 'Soluções prontas para o seu negócio',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: Sparkles,
    badge: 'Destaque',
  },
  {
    id: 3,
    title: 'Consultoria Especializada',
    subtitle: 'Experts prontos para ajudar você',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    icon: Monitor,
    badge: 'Premium',
  },
];

const FEATURED_CATEGORIES = [
  {
    id: 'Service',
    name: 'Serviços Freelancer',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-600',
    count: '1.8k+',
  },
  {
    id: 'Digital',
    name: 'Produtos Digitais',
    icon: '💎',
    color: 'from-purple-500 to-indigo-600',
    count: '2.5k+',
  },
  {
    id: 'Course',
    name: 'Consultorias',
    icon: '📊',
    color: 'from-emerald-500 to-teal-600',
    count: '3.2k+',
  },
];

const TRENDING_SEARCHES = [
  'Logo Design',
  'Desenvolvimento Web',
  'Marketing Digital',
  'Consultoria SEO',
  'Copywriting',
];

const MOCK_SERVICES = [
  {
    id: '1',
    name: 'Desenvolvimento de Sites',
    price: 2500,
    category: 'Service',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description: 'Sites responsivos e modernos',
    rating: 4.9,
    reviews: 128,
    deliveryTime: '7 dias',
    freelancer: {
      name: 'Carlos Dev',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      verified: true,
    },
  },
  {
    id: '2',
    name: 'Design de Logo Profissional',
    price: 450,
    category: 'Service',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
    description: 'Identidade visual única',
    rating: 4.8,
    reviews: 256,
    deliveryTime: '3 dias',
    freelancer: {
      name: 'Ana Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      verified: true,
    },
  },
  {
    id: '3',
    name: 'Gestão de Redes Sociais',
    price: 1200,
    category: 'Service',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    description: 'Estratégia completa de social media',
    rating: 4.7,
    reviews: 89,
    deliveryTime: '30 dias',
    freelancer: {
      name: 'Julia Marketing',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      verified: true,
    },
  },
  {
    id: '4',
    name: 'Template Notion Premium',
    price: 79,
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    description: 'Organize sua vida e projetos',
    rating: 4.9,
    reviews: 512,
    deliveryTime: 'Imediato',
    freelancer: {
      name: 'Pedro Templates',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      verified: false,
    },
  },
  {
    id: '5',
    name: 'Consultoria de Negócios',
    price: 500,
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    description: '1h de consultoria estratégica',
    rating: 5.0,
    reviews: 45,
    deliveryTime: 'Agendado',
    freelancer: {
      name: 'Roberto CEO',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
      verified: true,
    },
  },
  {
    id: '6',
    name: 'Pack de Ícones SVG',
    price: 29,
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    description: '+500 ícones vetoriais',
    rating: 4.6,
    reviews: 234,
    deliveryTime: 'Imediato',
    freelancer: {
      name: 'Icons Studio',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      verified: true,
    },
  },
];

const FEATURED_FREELANCERS = [
  {
    id: '1',
    name: 'Carlos Dev',
    specialty: 'Desenvolvimento Full Stack',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    services: 8,
    clients: 156,
    rating: 4.9,
    location: 'São Paulo, SP',
    verified: true,
  },
  {
    id: '2',
    name: 'Ana Designer',
    specialty: 'UI/UX & Branding',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    services: 12,
    clients: 234,
    rating: 4.8,
    location: 'Rio de Janeiro, RJ',
    verified: true,
  },
  {
    id: '3',
    name: 'Roberto CEO',
    specialty: 'Consultoria Empresarial',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
    services: 5,
    clients: 89,
    rating: 5.0,
    location: 'Curitiba, PR',
    verified: true,
  },
];

export const WorkMarketplace: React.FC<WorkMarketplaceProps> = ({
  profile,
  userId,
  onNavigate,
}) => {
  const isBusiness = profile === ProfileType.BUSINESS;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const workCategories = ['Digital', 'Service', 'Course'];
  const filteredProducts = products.filter(product => {
    const isWorkItem = workCategories.includes(product.category);
    if (!isWorkItem) return false;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Use mock services if no real products
  const displayServices =
    filteredProducts.length > 0
      ? filteredProducts
      : MOCK_SERVICES.filter(s => {
          const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory === 'Todos' || s.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const banner = HERO_BANNERS[currentBanner];
  const Icon = banner.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header com Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Buscar serviços, freelancers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
            />
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-zinc-500">Popular:</span>
            {TRENDING_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isBusiness && (
            <button
              onClick={() => onNavigate?.('MY_SERVICES')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              <Briefcase size={18} /> Meus Serviços
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} transition-all duration-1000`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        </div>
        <div className="relative h-full flex items-center px-8 md:px-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Clock size={14} /> {banner.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {banner.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">{banner.subtitle}</p>
            <button className="bg-white text-zinc-900 px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 transition-all shadow-xl flex items-center gap-2 group">
              Ver Serviços{' '}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Icon size={80} className="text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentBanner ? 'w-8 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categorias em Destaque</h2>
          <button className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Ver todas <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:scale-105 ${selectedCategory === cat.id ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:shadow-lg'}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              ></div>
              <div className="relative">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.count} disponíveis</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Freelancers */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Freelancers em Destaque</h2>
          <button className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Ver todos <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_FREELANCERS.map(freelancer => (
            <div
              key={freelancer.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {freelancer.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">{freelancer.name}</h3>
                  <p className="text-sm text-zinc-500">{freelancer.specialty}</p>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} />
                    {freelancer.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-zinc-500">
                  <Briefcase size={14} />
                  <span>{freelancer.services} serviços</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <Users size={14} />
                  <span>{freelancer.clients} clientes</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="font-medium">{freelancer.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('Todos')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'Todos' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'}`}
        >
          Todos
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2">
          <TrendingUp size={14} /> Mais Procurados
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2">
          <Sparkles size={14} /> Novos Talentos
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2">
          <Star size={14} /> Mais Avaliados
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2">
          <Zap size={14} /> Entrega Rápida
        </button>
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'Todos'
                ? 'Todos os Serviços'
                : FEATURED_CATEGORIES.find(c => c.id === selectedCategory)?.name ||
                  selectedCategory}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {displayServices.length}{' '}
              {displayServices.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
            </p>
          </div>
        </div>

        {displayServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(displayServices as typeof MOCK_SERVICES).map(service => (
              <div
                key={service.id}
                onClick={() => onNavigate?.(`SERVICE_DETAILS:${service.id}`)}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={
                      service.image ||
                      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(service.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={
                        favorites.includes(service.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }
                    />
                  </button>
                  {'deliveryTime' in service && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                      <Clock size={12} /> {service.deliveryTime}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {'freelancer' in service && (
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={service.freelancer.avatar}
                        alt={service.freelancer.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        {service.freelancer.name}
                        {service.freelancer.verified && (
                          <CheckCircle size={14} className="text-indigo-600" />
                        )}
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{service.name}</h3>
                  <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                    {service.description || 'Serviço profissional de alta qualidade'}
                  </p>
                  {'rating' in service && (
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="font-medium">{service.rating}</span>
                      </div>
                      <span className="text-zinc-400">({service.reviews} avaliações)</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="text-xs text-zinc-500">A partir de</span>
                      <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                        R$ {service.price.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              title="Nenhum serviço encontrado"
              description="Tente ajustar seus filtros de busca ou explore outras categorias."
              icon={Search}
            />
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      {isBusiness && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ofereça seus serviços no Tymes
              </h3>
              <p className="text-white/90 text-lg">
                Alcance milhares de clientes e faça seu negócio crescer
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('CREATE_SERVICE')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-zinc-100 transition-all shadow-xl whitespace-nowrap flex items-center gap-2"
            >
              <Briefcase size={20} /> Criar Serviço
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
