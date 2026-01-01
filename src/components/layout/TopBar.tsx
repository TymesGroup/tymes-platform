/**
 * TopBar Component - Apple-inspired Design
 * Barra superior fixa com busca global inteligente e ações rápidas
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  X,
  Bookmark,
  Package,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Loader2,
  ArrowRight,
  Bell,
  Clock,
  FileText,
  Bot,
  LayoutDashboard,
  Settings,
  User,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useBag } from '../../lib/BagContext';
import { useUnifiedBag } from '../../lib/UnifiedBagContext';
import { useFavorites } from '../../lib/FavoritesContext';
import { useAuth } from '../../lib/AuthContext';
import { ProfileType } from '../../types';
import {
  globalSearch,
  getRecentSearches,
  markSearchClicked,
  clearSearchHistory,
  removeFromHistory,
  type SearchResult,
  type SearchHistoryItem,
} from '../../lib/searchService';

interface TopBarProps {
  onNavigateToCheckout: () => void;
  onNavigateToOrders: () => void;
  onNavigateToSaves: () => void;
  onNavigateToProduct?: (productId: string) => void;
  onNavigateToModule?: (moduleId: string) => void;
}

// Mapeamento de ícones por tipo/módulo
const TYPE_ICONS: Record<string, React.ElementType> = {
  module: LayoutDashboard,
  page: FileText,
  product: ShoppingBag,
  course: GraduationCap,
  service: Briefcase,
  user: User,
  post: MessageSquare,
};

const MODULE_ICONS: Record<string, React.ElementType> = {
  shop: ShoppingBag,
  class: GraduationCap,
  work: Briefcase,
  social: Users,
  ai: Bot,
  dashboard: LayoutDashboard,
  settings: Settings,
};

// Cores por tipo
const TYPE_COLORS: Record<string, string> = {
  module: 'from-indigo-500 to-purple-500',
  page: 'from-blue-500 to-cyan-500',
  product: 'from-pink-500 to-rose-500',
  course: 'from-emerald-500 to-teal-500',
  service: 'from-amber-500 to-orange-500',
  user: 'from-violet-500 to-purple-500',
  post: 'from-sky-500 to-blue-500',
};

export const TopBar: React.FC<TopBarProps> = ({
  onNavigateToOrders,
  onNavigateToSaves,
  onNavigateToProduct,
  onNavigateToModule,
}) => {
  const { user, profile } = useAuth();
  const { totalItems: bagTotalItems } = useBag();
  const { totalItems: unifiedTotalItems } = useUnifiedBag();
  const { favorites } = useFavorites();

  // Combined bag count from both bags
  const totalItems = bagTotalItems + unifiedTotalItems;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  // Carregar histórico recente ao abrir
  useEffect(() => {
    if (user && showResults && !searchQuery) {
      loadRecentSearches();
    }
  }, [user, showResults, searchQuery]);

  const loadRecentSearches = async () => {
    if (!user) return;
    const recent = await getRecentSearches(user.id, 8);
    setRecentSearches(recent);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const results = await globalSearch({
          query,
          accountType,
          userId: user?.id,
          filters: { limit: 15 },
        });
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }

      setIsSearching(false);
    },
    [accountType, user?.id]
  );

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const handleResultClick = async (result: SearchResult) => {
    if (user) {
      await markSearchClicked(user.id, searchQuery || result.title, {
        type: result.type,
        id: result.id,
        title: result.title,
        module: result.module,
      });
    }

    setShowResults(false);
    setSearchQuery('');

    const path = result.path.replace(':account', accountType);

    if (result.type === 'module' && onNavigateToModule) {
      onNavigateToModule(result.module || result.id);
    } else if (result.type === 'product' && onNavigateToProduct) {
      onNavigateToProduct(result.id);
    } else {
      window.location.href = path;
    }
  };

  const handleRecentClick = (item: SearchHistoryItem) => {
    if (item.result_id && item.result_type) {
      const path = item.module
        ? `/${accountType}/${item.module}/${item.result_type}/${item.result_id}`
        : `/${accountType}/${item.result_type}/${item.result_id}`;
      window.location.href = path;
    } else {
      setSearchQuery(item.query);
    }
    setShowResults(false);
  };

  const handleClearHistory = async () => {
    if (!user) return;
    await clearSearchHistory(user.id);
    setRecentSearches([]);
  };

  const handleRemoveFromHistory = async (e: React.MouseEvent, searchId: string) => {
    e.stopPropagation();
    if (!user) return;
    await removeFromHistory(user.id, searchId);
    setRecentSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const getResultIcon = (result: SearchResult) => {
    if (result.module && MODULE_ICONS[result.module]) {
      return MODULE_ICONS[result.module];
    }
    return TYPE_ICONS[result.type] || FileText;
  };

  const getResultColor = (result: SearchResult) => {
    return TYPE_COLORS[result.type] || 'from-gray-500 to-gray-600';
  };

  const groupedResults = searchResults.reduce(
    (acc, result) => {
      const group = result.type;
      if (!acc[group]) acc[group] = [];
      acc[group].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  const typeLabels: Record<string, string> = {
    module: 'Módulos',
    page: 'Páginas',
    product: 'Produtos',
    course: 'Cursos',
    service: 'Serviços',
    user: 'Pessoas',
    post: 'Posts',
  };

  if (!user) return null;

  return (
    <header className="hidden md:flex fixed top-6 left-[460px] right-6 z-30 h-14 mx-auto max-w-[1200px]">
      <div className="h-full bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl backdrop-saturate-150 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-[#d2d2d7]/50 dark:border-[#424245]/50 px-4 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
            T
          </div>
          <span className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Tymes
          </span>
        </div>

        <div className="w-px h-6 bg-[#d2d2d7] dark:bg-[#424245]" />

        {/* Global Search */}
        <div ref={searchRef} className="flex-1 max-w-xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Buscar em tudo... ⌘K"
              className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2d2d2d] text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#d2d2d7] dark:hover:bg-[#424245] transition-colors"
              >
                <X size={14} className="text-[#86868b]" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1d1d1f] rounded-2xl shadow-2xl border border-[#d2d2d7] dark:border-[#424245] overflow-hidden z-50">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-[#0066cc]" />
                  <span className="ml-2 text-[14px] text-[#86868b]">Buscando...</span>
                </div>
              ) : searchQuery.length >= 2 && searchResults.length > 0 ? (
                <div className="max-h-[450px] overflow-y-auto">
                  {Object.entries(groupedResults).map(([type, results]) => (
                    <div
                      key={type}
                      className="p-2 border-b border-[#d2d2d7]/50 dark:border-[#424245]/50 last:border-0"
                    >
                      <p className="px-3 py-1.5 text-[11px] font-medium text-[#86868b] uppercase tracking-wide flex items-center gap-2">
                        {React.createElement(TYPE_ICONS[type] || FileText, { size: 12 })}
                        {typeLabels[type] || type}
                      </p>
                      {results.map(result => {
                        const Icon = getResultIcon(result);
                        return (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors group"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getResultColor(result)} flex items-center justify-center text-white flex-shrink-0 overflow-hidden`}
                            >
                              {result.image ? (
                                <img
                                  src={result.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Icon size={20} />
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                                {result.title}
                              </p>
                              <p className="text-[12px] text-[#86868b] truncate">
                                {result.subtitle}
                                {result.price && (
                                  <span className="ml-2 font-semibold text-[#0066cc]">
                                    {formatPrice(result.price)}
                                  </span>
                                )}
                              </p>
                            </div>
                            <ArrowRight
                              size={16}
                              className="text-[#86868b] opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="py-8 text-center">
                  <Search size={32} className="mx-auto text-[#86868b] mb-2" />
                  <p className="text-[14px] text-[#86868b]">
                    Nenhum resultado para "{searchQuery}"
                  </p>
                  <p className="text-[12px] text-[#86868b] mt-1">Tente buscar por outro termo</p>
                </div>
              ) : recentSearches.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-1.5">
                      <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide flex items-center gap-2">
                        <Clock size={12} />
                        Pesquisas Recentes
                      </p>
                      <button
                        onClick={handleClearHistory}
                        className="text-[11px] text-[#0066cc] hover:underline"
                      >
                        Limpar
                      </button>
                    </div>
                    {recentSearches.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleRecentClick(item)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] dark:bg-[#2d2d2d] flex items-center justify-center">
                          {item.clicked ? (
                            <TrendingUp size={16} className="text-[#0066cc]" />
                          ) : (
                            <Clock size={16} className="text-[#86868b]" />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                            {item.query}
                          </p>
                          {item.result_title && (
                            <p className="text-[12px] text-[#86868b] truncate">
                              → {item.result_title}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={e => handleRemoveFromHistory(e, item.id)}
                          className="p-1.5 rounded-lg hover:bg-[#d2d2d7] dark:hover:bg-[#424245] opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} className="text-[#86868b]" />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search size={32} className="mx-auto text-[#86868b] mb-2" />
                  <p className="text-[14px] text-[#86868b]">
                    Busque por módulos, páginas, produtos...
                  </p>
                  <p className="text-[12px] text-[#86868b] mt-1">Digite pelo menos 2 caracteres</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              window.location.href = `/${accountType}/notifications`;
            }}
            className="relative p-2.5 rounded-xl text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors group"
            title="Notificações"
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={onNavigateToSaves}
            className="relative p-2.5 rounded-xl text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors group"
            title="Salvos"
          >
            <Bookmark size={20} className="group-hover:scale-110 transition-transform" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {favorites.length > 99 ? '99+' : favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={onNavigateToOrders}
            className="relative p-2.5 rounded-xl text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors group"
            title="Pedidos"
          >
            <Package size={20} className="group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => {
              window.location.href = `/${accountType}/bag`;
            }}
            className="relative p-2.5 rounded-xl text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2d] transition-colors group"
            title="Bolsa"
          >
            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#0066cc] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
