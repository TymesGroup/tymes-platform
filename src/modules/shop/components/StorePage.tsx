/**
 * StorePage - Página pública da loja
 * Mostra informações da loja e seus produtos
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Package,
  Users,
  MessageCircle,
  Share2,
  Store,
  Building2,
  CheckCircle,
  ShoppingBag,
  Heart,
  ExternalLink,
  Grid,
  List,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { ProfileType } from '../../../types';

interface StorePageProps {
  storeId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface StoreInfo {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  rating?: number;
  total_sales?: number;
  total_reviews?: number;
  owner_id: string;
  created_at: string;
  owner?: {
    id: string;
    name: string;
    avatar_url?: string;
    type: string;
    address_city?: string;
    address_state?: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  rating?: number;
  total_reviews?: number;
  category: string;
  sales_count?: number;
}

export const StorePage: React.FC<StorePageProps> = ({ storeId, onBack, onNavigate }) => {
  const { profile } = useAuth();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    setLoading(true);
    try {
      // Try to fetch store first
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select(
          `
          *,
          owner:profiles!stores_owner_id_fkey(id, name, avatar_url, type, address_city, address_state)
        `
        )
        .eq('id', storeId)
        .single();

      if (storeData) {
        setStore(storeData);

        // Fetch store products
        const { data: productsData } = await supabase
          .from('products')
          .select('id, name, price, image, rating, total_reviews, category, sales_count')
          .eq('store_id', storeId)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        setProducts(productsData || []);
      } else {
        // If no store, try to fetch seller profile
        const { data: sellerData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, type, address_city, address_state, created_at')
          .eq('id', storeId)
          .single();

        if (sellerData) {
          setStore({
            id: sellerData.id,
            name: sellerData.name,
            owner_id: sellerData.id,
            created_at: sellerData.created_at,
            owner: sellerData,
          });

          // Fetch seller products
          const { data: productsData } = await supabase
            .from('products')
            .select('id, name, price, image, rating, total_reviews, category, sales_count')
            .eq('created_by', storeId)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

          setProducts(productsData || []);
        }
      }
    } catch (error) {
      console.error('Error loading store:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts =
    activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  const totalSales = products.reduce((sum, p) => sum + (p.sales_count || 0), 0);
  const avgRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-16">
        <Store className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500 text-lg">Loja não encontrada</p>
        <button onClick={onBack} className="mt-4 text-pink-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  const defaultBanner = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200';
  const defaultLogo = null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-pink-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      {/* Store Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Banner */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-pink-500 to-rose-600 relative">
          {store.banner_url && (
            <img src={store.banner_url} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Store Info */}
        <div className="relative px-6 pb-6">
          {/* Logo */}
          <div className="absolute -top-16 left-6">
            {store.logo_url || store.owner?.avatar_url ? (
              <img
                src={store.logo_url || store.owner?.avatar_url}
                alt={store.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center">
                <Store size={48} className="text-white" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="px-4 py-2.5 rounded-xl border border-pink-600 text-pink-600 font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center gap-2">
              <MessageCircle size={18} /> Contatar
            </button>
          </div>

          {/* Info */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
              {store.owner?.type === 'BUSINESS' && (
                <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Building2 size={12} /> Loja Verificada
                </span>
              )}
            </div>

            {store.description && (
              <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl">{store.description}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-zinc-500 text-sm">
                  ({store.total_reviews || products.length} avaliações)
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Package size={18} />
                <span>{products.length} produtos</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <ShoppingBag size={18} />
                <span>{store.total_sales || totalSales}+ vendas</span>
              </div>
              {store.owner?.address_city && (
                <div className="flex items-center gap-1 text-zinc-500">
                  <MapPin size={18} />
                  <span>
                    {store.owner.address_city}, {store.owner.address_state}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-zinc-500">
                <Calendar size={18} />
                <span>Desde {formatDate(store.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Filters */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-pink-600 text-white'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div
            className={`p-4 ${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}
          >
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => onNavigate?.(`PRODUCT:${product.id}`)}
                className={`group text-left ${viewMode === 'list' ? 'flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}`}
              >
                <div
                  className={`${viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'} rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800`}
                >
                  <img
                    src={
                      product.image ||
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className={viewMode === 'grid' ? 'mt-3' : 'flex-1'}>
                  <p className="font-medium text-sm line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {product.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs">{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <span className="text-xs text-zinc-500">{product.category}</span>
                  </div>
                  <p className="text-pink-600 font-bold mt-1">{formatPrice(product.price)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Package className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
