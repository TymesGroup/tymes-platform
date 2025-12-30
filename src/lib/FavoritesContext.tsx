import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { dataCache, CACHE_KEYS } from './dataCache';

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  rating: number | null;
  store_id: string | null;
}

export interface Favorite {
  id: string;
  product_id: string;
  created_at: string;
  product?: FavoriteProduct;
}

interface FavoritesState {
  favorites: Favorite[];
  favoriteIds: Set<string>;
  loading: boolean;
}

interface FavoritesContextType extends FavoritesState {
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorited: (productId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function formatFavorites(data: any[]): { favorites: Favorite[]; favoriteIds: Set<string> } {
  const favorites: Favorite[] = (data || []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    created_at: item.created_at,
    product: item.products,
  }));
  const favoriteIds = new Set(favorites.map(f => f.product_id));
  return { favorites, favoriteIds };
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cacheKey = user?.id ? CACHE_KEYS.FAVORITES(user.id) : '';

  // Initialize from cache immediately
  const [state, setState] = useState<FavoritesState>(() => {
    if (!user?.id) return { favorites: [], favoriteIds: new Set(), loading: false };
    const cached = dataCache.get<any[]>(cacheKey);
    if (cached) {
      const { favorites, favoriteIds } = formatFavorites(cached);
      return { favorites, favoriteIds, loading: false };
    }
    return { favorites: [], favoriteIds: new Set(), loading: true };
  });

  const fetchFavorites = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) {
        setState({ favorites: [], favoriteIds: new Set(), loading: false });
        return;
      }

      // Only show loading if no cached data
      if (!dataCache.has(cacheKey)) {
        setState(s => ({ ...s, loading: true }));
      }

      try {
        const data = await dataCache.getOrFetch<any[]>(
          cacheKey,
          async () => {
            const { data, error } = await supabase
              .from('favorites')
              .select(
                `
              id, product_id, created_at,
              products:product_id (id, name, price, image, category, rating, store_id)
            `
              )
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
          },
          { forceRefresh }
        );

        const { favorites, favoriteIds } = formatFavorites(data);
        setState({ favorites, favoriteIds, loading: false });
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setState(s => ({ ...s, loading: false }));
      }
    },
    [user?.id, cacheKey]
  );

  // Fetch favorites on mount and user change
  useEffect(() => {
    fetchFavorites();

    if (!user?.id) return;

    // Subscribe to cache updates
    const unsubscribe = dataCache.subscribe<any[]>(cacheKey, data => {
      const { favorites, favoriteIds } = formatFavorites(data);
      setState(s => ({ ...s, favorites, favoriteIds }));
    });

    // Real-time subscription
    const channel = supabase
      .channel(`favorites:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchFavorites(true);
        }
      )
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchFavorites, cacheKey]);

  const addFavorite = useCallback(
    async (productId: string) => {
      if (!user?.id) throw new Error('Faça login para favoritar');

      // Optimistic update
      setState(s => ({
        ...s,
        favoriteIds: new Set([...s.favoriteIds, productId]),
      }));

      try {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
        fetchFavorites(true);
      } catch (err) {
        console.error('Error adding favorite:', err);
        // Revert optimistic update
        setState(s => {
          const newIds = new Set(s.favoriteIds);
          newIds.delete(productId);
          return { ...s, favoriteIds: newIds };
        });
        throw err;
      }
    },
    [user?.id, fetchFavorites]
  );

  const removeFavorite = useCallback(
    async (productId: string) => {
      if (!user?.id) return;

      // Optimistic update
      setState(s => {
        const newIds = new Set(s.favoriteIds);
        newIds.delete(productId);
        return {
          ...s,
          favoriteIds: newIds,
          favorites: s.favorites.filter(f => f.product_id !== productId),
        };
      });

      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        // Update cache
        dataCache.update<any[]>(cacheKey, current =>
          (current || []).filter((item: any) => item.product_id !== productId)
        );
      } catch (err) {
        console.error('Error removing favorite:', err);
        fetchFavorites(true); // Revert on error
      }
    },
    [user?.id, cacheKey, fetchFavorites]
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (state.favoriteIds.has(productId)) {
        await removeFavorite(productId);
      } else {
        await addFavorite(productId);
      }
    },
    [state.favoriteIds, addFavorite, removeFavorite]
  );

  const isFavorited = useCallback(
    (productId: string) => {
      return state.favoriteIds.has(productId);
    },
    [state.favoriteIds]
  );

  return (
    <FavoritesContext.Provider
      value={{
        ...state,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorited,
        refreshFavorites: () => fetchFavorites(true),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
