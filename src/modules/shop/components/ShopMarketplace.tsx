import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Store,
  ChevronRight,
  Sparkles,
  Star,
  Search,
  Clock,
  Zap,
  Award,
  Heart,
  Filter,
  Grid3X3,
  LayoutGrid,
} from 'lucide-react';
import { ProfileType } from '../../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FlashDeals } from './FlashDeals';
import { RecommendedSection } from './RecommendedSection';
import { FeaturedStoresSection } from './FeaturedStoresSection';
import { useProducts } from '../hooks/useShop';
import { useBag } from '../../../lib/BagContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { SkeletonProductCard } from '../../../design-system';

/**
 * ShopMarketplace - Vitrine Principal do Módulo Shop
 * Design moderno com foco em descoberta, escaneabilidade e conversão
 */

interface ShopMarketplaceProps {
  profile: ProfileType | string;
  userId?: string;
  onNavigate?: (page: string) => void;
}

const HERO_BANNERS = [
  {
    id: 1,
    title: 'Ofertas Imperdíveis',
    subtitle: 'Até 70% de desconto em produtos selecionados',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    badge: 'Promoção',
    cta: 'Ver Ofertas',
  },
  {
    id: 2,
    title: 'Novidades da Semana',
    subtitle: 'Descubra os lançamentos mais recentes',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    badge: 'Novo',
    cta: 'Explorar',
  },
  {
    id: 3,
    title: 'Frete Grátis',
    subtitle: 'Em compras acima de R$ 100',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    badge: 'Especial',
    cta: 'Aproveitar',
  },
];

const CATEGORIES = [
  { id: 'Todos', name: 'Todos', icon: '🛍️', color: 'from-zinc-500 to-zinc-600' },
  { id: 'Eletrônicos', name: 'Eletrônicos', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { id: 'Acessórios', name: 'Acessórios', icon: '🎧', color: 'from-purple-500 to-pink-500' },
  { id: 'Serviços', name: 'Serviços', icon: '🛠️', color: 'from-amber-500 to-orange-500' },
  { id: 'Moda', name: 'Moda', icon: '👕', color: 'from-rose-500 to-red-500' },
  { id: 'Casa', name: 'Casa', icon: '🏠', color: 'from-emerald-500 to-teal-500' },
];

const QUICK_FILTERS = [
  { id: 'all', label: 'Todos', icon: null },
  { id: 'bestseller', label: 'Mais Vendidos', icon: TrendingUp },
  { id: 'new', label: 'Novidades', icon: Sparkles },
  { id: 'rated', label: 'Bem Avaliados', icon: Star },
  { id: 'deals', label: 'Ofertas', icon: Zap },
];

export const ShopMarketplace: React.FC<ShopMarketplaceProps> = ({
  profile,
  userId,
  onNavigate,
}) => {
  const isBusiness = profile === ProfileType.BUSINESS;
  const { products, loading } = useProducts({ status: 'active' });
  const { totalItems: bagCount, addItem, openBag } = useBag();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [gridView, setGridView] = useState<'grid' | 'compact'>('grid');
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = async (productId: string) => {
    setIsAddingToCart(productId);
    try {
      await addItem(productId);
      // Não abre o modal - apenas adiciona à bolsa
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao adicionar à bolsa');
    } finally {
      setIsAddingToCart(null);
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      await toggleFavorite(productId, 'product');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Faça login para favoritar');
    }
  };

  const handleViewDetails = (productId: string) => {
    onNavigate?.(`PRODUCT_DETAILS:${productId}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesCategory;
  });

  const banner = HERO_BANNERS[currentBanner];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Bar - Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isBusiness && (
            <button
              onClick={() => onNavigate?.('INVENTORY')}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25"
            >
              <Store size={18} />
              Minha Loja
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setGridView('grid')}
              className={`p-2 rounded-md transition-colors ${gridView === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
            >
              <LayoutGrid size={18} className="text-zinc-600 dark:text-zinc-400" />
            </button>
            <button
              onClick={() => setGridView('compact')}
              className={`p-2 rounded-md transition-colors ${gridView === 'compact' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
            >
              <Grid3X3 size={18} className="text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>

          {/* Bag Button */}
          <button
            onClick={() => openBag()}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-pink-500 transition-all shadow-sm"
          >
            <ShoppingBag className="text-zinc-600 dark:text-zinc-400" size={20} />
            <span className="hidden sm:inline text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bolsa
            </span>
            {bagCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} transition-all duration-700`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        </div>

        <div className="relative h-full flex items-center px-6 md:px-10">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Zap size={12} /> {banner.badge}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {banner.title}
            </h1>
            <p className="text-white/90 text-sm md:text-base mb-4">{banner.subtitle}</p>
            <button className="bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-semibold hover:bg-zinc-100 transition-all shadow-lg flex items-center gap-2 text-sm">
              {banner.cta}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Banner Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <FlashDeals onNavigate={onNavigate} />

      {/* Recommended Products */}
      <RecommendedSection onNavigate={onNavigate} userId={userId} />

      {/* Featured Stores */}
      <FeaturedStoresSection onNavigate={onNavigate} />

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Categorias</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${
                selectedCategory === cat.id ? 'ring-2 ring-pink-500 shadow-lg' : 'hover:shadow-md'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90`} />
              <div className="relative">
                <span className="text-2xl md:text-3xl block mb-1">{cat.icon}</span>
                <span className="text-white text-xs md:text-sm font-medium">{cat.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {QUICK_FILTERS.map(filter => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {Icon && <Icon size={14} />}
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {selectedCategory === 'Todos' ? 'Todos os Produtos' : selectedCategory}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>
          <button className="text-sm text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Ver todos <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div
            className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}
          >
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isOwner={userId === product.created_by}
                isFavorite={isFavorited(product.id, 'product')}
                isAddingToCart={isAddingToCart === product.id}
                onAddToCart={() => handleAddToCart(product.id)}
                onToggleFavorite={() => handleToggleFavorite(product.id)}
                onViewDetails={() => handleViewDetails(product.id)}
                compact={gridView === 'compact'}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
            <EmptyState
              title="Nenhum produto encontrado"
              description="Tente ajustar seus filtros ou explore outras categorias."
              icon={Search}
            />
          </div>
        )}
      </section>

      {/* Business CTA */}
      {isBusiness && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 p-6 md:p-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Comece a vender no Tymes
              </h3>
              <p className="text-white/90">
                Alcance milhares de clientes e faça seu negócio crescer
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('CREATE_PRODUCT')}
              className="bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 transition-all shadow-xl whitespace-nowrap flex items-center gap-2"
            >
              <Store size={20} />
              Criar Produto
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ShopMarketplace;
