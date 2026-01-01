import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { dataCache, CACHE_KEYS } from './dataCache';

export type FavoriteItemType = 'product' | 'course' | 'service';

export interface FavoriteItem {
  id: string;
  item_id: string;
  item_type: FavoriteItemType;
  created_at: string;
  item_data?: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category?: string;
    duration?: string;
    instructor?: string;
    freelancer?: string;
  };
}

interface FavoritesState {
  favorites: FavoriteItem[];
  favoriteIds: Map<string, Set<string>>; // Map<item_type, Set<item_id>>
  loading: boolean;
}

interface FavoritesContextType extends FavoritesState {
  addFavorite: (itemId: string, itemType?: FavoriteItemType) => Promise<void>;
  removeFavorite: (itemId: string, itemType?: FavoriteItemType) => Promise<void>;
  toggleFavorite: (itemId: string, itemType?: FavoriteItemType) => Promise<void>;
  isFavorited: (itemId: string, itemType?: FavoriteItemType) => boolean;
  refreshFavorites: () => Promise<void>;
  getFavoritesByType: (itemType: FavoriteItemType) => FavoriteItem[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function createFavoriteIdsMap(favorites: FavoriteItem[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  map.set('product', new Set());
  map.set('course', new Set());
  map.set('service', new Set());

  favorites.forEach(fav => {
    const set = map.get(fav.item_type) || new Set();
    set.add(fav.item_id);
    map.set(fav.item_type, set);
  });

  return map;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cacheKey = user?.id ? CACHE_KEYS.FAVORITES(user.id) : '';

  const [state, setState] = useState<FavoritesState>(() => {
    const defaultMap = new Map<string, Set<string>>();
    defaultMap.set('product', new Set());
    defaultMap.set('course', new Set());
    defaultMap.set('service', new Set());

    if (!user?.id) return { favorites: [], favoriteIds: defaultMap, loading: false };

    const cached = dataCache.get<FavoriteItem[]>(cacheKey);
    if (cached) {
      return {
        favorites: cached,
        favoriteIds: createFavoriteIdsMap(cached),
        loading: false,
      };
    }
    return { favorites: [], favoriteIds: defaultMap, loading: true };
  });

  const fetchFavorites = useCallback(
    async (forceRefresh = false) => {
      const defaultMap = new Map<string, Set<string>>();
      defaultMap.set('product', new Set());
      defaultMap.set('course', new Set());
      defaultMap.set('service', new Set());

      if (!user?.id) {
        setState({ favorites: [], favoriteIds: defaultMap, loading: false });
        return;
      }

      if (!dataCache.has(cacheKey)) {
        setState(s => ({ ...s, loading: true }));
      }

      try {
        const data = await dataCache.getOrFetch<FavoriteItem[]>(
          cacheKey,
          async () => {
            // Fetch all favorites
            // Note: Using 'any' type assertion because the database schema may not be updated yet
            const { data: favoritesData, error } = (await supabase
              .from('favorites')
              .select('id, item_id, item_type, created_at')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })) as any;

            if (error) {
              // Fallback to old schema if new columns don't exist
              const { data: oldFavoritesData, error: oldError } = await supabase
                .from('favorites')
                .select('id, product_id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

              if (oldError) throw oldError;

              // Map old schema to new format
              const favorites = (oldFavoritesData || []).map((f: any) => ({
                id: f.id,
                item_id: f.product_id,
                item_type: 'product' as FavoriteItemType,
                created_at: f.created_at,
              }));

              return favorites;
            }

            const favorites = (favoritesData || []).map((f: any) => ({
              id: f.id,
              item_id: f.item_id || f.product_id,
              item_type: (f.item_type || 'product') as FavoriteItemType,
              created_at: f.created_at,
            }));

            // Fetch item details for each type
            const productIds = favorites.filter(f => f.item_type === 'product').map(f => f.item_id);
            const courseIds = favorites.filter(f => f.item_type === 'course').map(f => f.item_id);
            const serviceIds = favorites.filter(f => f.item_type === 'service').map(f => f.item_id);

            // Fetch products
            let productsMap: Record<string, any> = {};
            if (productIds.length > 0) {
              const { data: products } = await supabase
                .from('products')
                .select('id, name, price, image, category')
                .in('id', productIds);
              productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            }

            // Fetch courses
            let coursesMap: Record<string, any> = {};
            if (courseIds.length > 0) {
              const { data: courses } = (await supabase
                .from('courses')
                .select('id, title, price, thumbnail, category, duration, instructor')
                .in('id', courseIds)) as any;
              coursesMap = (courses || []).reduce(
                (acc: any, c: any) => ({
                  ...acc,
                  [c.id]: {
                    id: c.id,
                    name: c.title,
                    price: c.price,
                    image: c.thumbnail,
                    category: c.category,
                    duration: c.duration,
                    instructor: c.instructor,
                  },
                }),
                {}
              );
            }

            // Fetch services (products with type = 'service' or from services table)
            let servicesMap: Record<string, any> = {};
            if (serviceIds.length > 0) {
              const { data: services } = await supabase
                .from('products')
                .select('id, name, price, image, category')
                .in('id', serviceIds);
              servicesMap = (services || []).reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
            }

            // Map favorites with item data
            return favorites.map(fav => {
              let itemData;
              if (fav.item_type === 'product') {
                itemData = productsMap[fav.item_id];
              } else if (fav.item_type === 'course') {
                itemData = coursesMap[fav.item_id];
              } else if (fav.item_type === 'service') {
                itemData = servicesMap[fav.item_id];
              }

              return {
                ...fav,
                item_data: itemData,
              };
            });
          },
          { forceRefresh }
        );

        setState({
          favorites: data,
          favoriteIds: createFavoriteIdsMap(data),
          loading: false,
        });
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setState(s => ({ ...s, loading: false }));
      }
    },
    [user?.id, cacheKey]
  );

  useEffect(() => {
    fetchFavorites();

    if (!user?.id) return;

    const unsubscribe = dataCache.subscribe<FavoriteItem[]>(cacheKey, data => {
      setState(s => ({
        ...s,
        favorites: data,
        favoriteIds: createFavoriteIdsMap(data),
      }));
    });

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
    async (itemId: string, itemType: FavoriteItemType = 'product') => {
      if (!user?.id) throw new Error('Faça login para favoritar');

      // Optimistic update
      setState(s => {
        const newMap = new Map(s.favoriteIds);
        const set = new Set(newMap.get(itemType) || []);
        set.add(itemId);
        newMap.set(itemType, set);
        return { ...s, favoriteIds: newMap };
      });

      try {
        // Try new schema first, fallback to old schema
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        } as any);

        if (error) {
          // Fallback to old schema
          const { error: oldError } = await supabase.from('favorites').insert({
            user_id: user.id,
            product_id: itemId,
          });
          if (oldError) throw oldError;
        }
        fetchFavorites(true);
      } catch (err) {
        console.error('Error adding favorite:', err);
        // Revert optimistic update
        setState(s => {
          const newMap = new Map(s.favoriteIds);
          const set = new Set(newMap.get(itemType) || []);
          set.delete(itemId);
          newMap.set(itemType, set);
          return { ...s, favoriteIds: newMap };
        });
        throw err;
      }
    },
    [user?.id, fetchFavorites]
  );

  const removeFavorite = useCallback(
    async (itemId: string, itemType: FavoriteItemType = 'product') => {
      if (!user?.id) return;

      // Optimistic update
      setState(s => {
        const newMap = new Map(s.favoriteIds);
        const set = new Set(newMap.get(itemType) || []);
        set.delete(itemId);
        newMap.set(itemType, set);
        return {
          ...s,
          favoriteIds: newMap,
          favorites: s.favorites.filter(f => !(f.item_id === itemId && f.item_type === itemType)),
        };
      });

      try {
        // Try new schema first - use match for multiple conditions
        const deleteQuery = supabase.from('favorites').delete().eq('user_id', user.id);

        // Add item_id and item_type filters using match
        const { error } = await (deleteQuery as any)
          .eq('item_id', itemId)
          .eq('item_type', itemType);

        if (error) {
          // Fallback to old schema
          const { error: oldError } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', itemId);
          if (oldError) throw oldError;
        }

        dataCache.update<FavoriteItem[]>(cacheKey, current =>
          (current || []).filter(item => !(item.item_id === itemId && item.item_type === itemType))
        );
      } catch (err) {
        console.error('Error removing favorite:', err);
        fetchFavorites(true);
      }
    },
    [user?.id, cacheKey, fetchFavorites]
  );

  const toggleFavorite = useCallback(
    async (itemId: string, itemType: FavoriteItemType = 'product') => {
      const set = state.favoriteIds.get(itemType);
      if (set?.has(itemId)) {
        await removeFavorite(itemId, itemType);
      } else {
        await addFavorite(itemId, itemType);
      }
    },
    [state.favoriteIds, addFavorite, removeFavorite]
  );

  const isFavorited = useCallback(
    (itemId: string, itemType: FavoriteItemType = 'product') => {
      const set = state.favoriteIds.get(itemType);
      return set?.has(itemId) || false;
    },
    [state.favoriteIds]
  );

  const getFavoritesByType = useCallback(
    (itemType: FavoriteItemType) => {
      return state.favorites.filter(f => f.item_type === itemType);
    },
    [state.favorites]
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
        getFavoritesByType,
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
