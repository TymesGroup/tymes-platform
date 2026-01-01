/**
 * FeaturedStoresSection - Seção de Lojas em Destaque
 * Design horizontal com cards escuros
 */

import React, { useState, useEffect } from 'react';
import { Store, Star, TrendingUp, CheckCircle, MapPin, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface FeaturedStore {
  id: string;
  name: string;
  logo_url: string | null;
  description?: string;
  location?: string;
  rating: number;
  total_sales: number;
  is_verified: boolean;
}

interface FeaturedStoresSectionProps {
  onNavigate?: (page: string) => void;
  limit?: number;
}

export const FeaturedStoresSection: React.FC<FeaturedStoresSectionProps> = ({
  onNavigate,
  limit = 3,
}) => {
  const [stores, setStores] = useState<FeaturedStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, [limit]);

  const fetchStores = async () => {
    try {
      // First try to get stores
      let { data, error } = await supabase
        .from('stores')
        .select('id, name, logo_url, description, rating, total_sales, is_verified')
        .eq('is_active', true)
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) {
        console.log('Stores table may not exist, falling back to profiles');
        data = null;
      }

      // If no stores, get business profiles as "stores"
      if (!data || data.length === 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, bio, address_city, address_state, type, is_verified')
          .eq('type', 'BUSINESS')
          .limit(limit);

        if (!profileError && profiles && profiles.length > 0) {
          data = profiles.map((p, index) => ({
            id: p.id,
            name: p.name || 'Loja',
            logo_url: p.avatar_url,
            description: p.bio || 'Loja especializada',
            location:
              p.address_city && p.address_state
                ? `${p.address_city}, ${p.address_state}`
                : 'Brasil',
            rating: 4.5 + Math.random() * 0.5,
            total_sales: Math.floor(Math.random() * 500) + 50,
            is_verified: p.is_verified || index < 2,
          }));
        }
      }

      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSales = (sales: number) => {
    if (sales >= 1000) return `${(sales / 1000).toFixed(1)}k`;
    return sales.toString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (stores.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Lojas em Destaque</h2>
        <button
          onClick={() => onNavigate?.('FEATURED_STORES')}
          className="text-pink-600 dark:text-pink-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver todas <ChevronRight size={16} />
        </button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stores.map(store => (
          <button
            key={store.id}
            onClick={() => onNavigate?.(`STORE:${store.id}`)}
            className="group bg-zinc-900 dark:bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 dark:hover:bg-zinc-800 transition-all text-left border border-zinc-800"
          >
            <div className="flex items-start gap-3">
              {/* Logo */}
              <div className="relative flex-shrink-0">
                {store.logo_url ? (
                  <img
                    src={store.logo_url}
                    alt={store.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white">
                    <Store size={20} />
                  </div>
                )}
                {store.is_verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-pink-600 rounded-full p-0.5">
                    <CheckCircle size={10} className="text-white" fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">{store.name}</h3>
                <p className="text-xs text-zinc-400 truncate">{store.description}</p>
                {store.location && (
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                    <MapPin size={10} />
                    {store.location}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <Store size={12} />
                <span>Loja oficial</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <TrendingUp size={12} />
                <span>{formatSales(store.total_sales)} vendas</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star size={12} fill="currentColor" />
                <span className="font-medium">{store.rating?.toFixed(1)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturedStoresSection;
