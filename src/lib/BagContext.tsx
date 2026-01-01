import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { dataCache, CACHE_KEYS } from './dataCache';

export interface BagProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  stock: number | null;
  store_id: string | null;
}

export interface BagItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: BagProduct;
}

interface BagState {
  items: BagItem[];
  loading: boolean;
  isOpen: boolean;
}

interface BagContextType extends BagState {
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearBag: () => Promise<void>;
  openBag: () => void;
  closeBag: () => void;
  toggleBag: () => void;
  totalItems: number;
  totalAmount: number;
  refreshBag: () => Promise<void>;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

function formatBagItems(data: any[]): BagItem[] {
  return (data || []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity || 1,
    product: item.products,
  }));
}

export function BagProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cacheKey = user?.id ? CACHE_KEYS.CART(user.id) : '';

  // Initialize from cache immediately
  const [state, setState] = useState<BagState>(() => {
    if (!user?.id) return { items: [], loading: false, isOpen: false };
    const cached = dataCache.get<any[]>(cacheKey);
    return {
      items: cached ? formatBagItems(cached) : [],
      loading: !cached,
      isOpen: false,
    };
  });

  const fetchBag = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) {
        setState(s => ({ ...s, items: [], loading: false }));
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
              .from('cart_items')
              .select(
                `
              id, product_id, quantity,
              products:product_id (id, name, price, image, category, stock, store_id)
            `
              )
              .eq('user_id', user.id);

            if (error) throw error;
            return data || [];
          },
          { forceRefresh }
        );

        setState(s => ({ ...s, items: formatBagItems(data), loading: false }));
      } catch (err) {
        console.error('Error fetching bag:', err);
        setState(s => ({ ...s, loading: false }));
      }
    },
    [user?.id, cacheKey]
  );

  // Fetch bag on mount and user change
  useEffect(() => {
    fetchBag();

    if (!user?.id) return;

    // Subscribe to cache updates
    const unsubscribe = dataCache.subscribe<any[]>(cacheKey, data => {
      setState(s => ({ ...s, items: formatBagItems(data) }));
    });

    // Real-time subscription
    const channel = supabase
      .channel(`bag:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBag(true);
        }
      )
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchBag, cacheKey]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!user?.id) throw new Error('Faça login para adicionar à bolsa');

      // Check if item already exists
      const existingItem = state.items.find(item => item.product_id === productId);

      try {
        if (existingItem) {
          // Optimistic update
          setState(s => ({
            ...s,
            items: s.items.map(item =>
              item.product_id === productId
                ? { ...item, quantity: (item.quantity || 1) + quantity }
                : item
            ),
          }));

          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: (existingItem.quantity || 1) + quantity })
            .eq('id', existingItem.id);

          if (error) throw error;
        } else {
          // Insert new item
          const { data, error } = await supabase
            .from('cart_items')
            .insert({ user_id: user.id, product_id: productId, quantity })
            .select(
              `
            id, product_id, quantity,
            products:product_id (id, name, price, image, category, stock, store_id)
          `
            )
            .single();

          if (error) throw error;

          // Optimistic update
          setState(s => ({
            ...s,
            items: [...s.items, formatBagItems([data])[0]],
          }));
        }

        // Update cache
        fetchBag(true);
      } catch (err) {
        console.error('Error adding to bag:', err);
        fetchBag(true); // Revert on error
        throw err;
      }
    },
    [user?.id, state.items, fetchBag]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!user?.id) return;

      // Optimistic update
      setState(s => ({
        ...s,
        items: s.items.filter(item => item.id !== itemId),
      }));

      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Update cache
        dataCache.update<any[]>(cacheKey, current =>
          (current || []).filter((item: any) => item.id !== itemId)
        );
      } catch (err) {
        console.error('Error removing from bag:', err);
        fetchBag(true); // Revert on error
      }
    },
    [user?.id, cacheKey, fetchBag]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!user?.id || quantity < 1) return;

      // Optimistic update
      setState(s => ({
        ...s,
        items: s.items.map(item => (item.id === itemId ? { ...item, quantity } : item)),
      }));

      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Update cache
        dataCache.update<any[]>(cacheKey, current =>
          (current || []).map((item: any) => (item.id === itemId ? { ...item, quantity } : item))
        );
      } catch (err) {
        console.error('Error updating quantity:', err);
        fetchBag(true); // Revert on error
      }
    },
    [user?.id, cacheKey, fetchBag]
  );

  const clearBag = useCallback(async () => {
    if (!user?.id) return;

    // Optimistic update
    setState(s => ({ ...s, items: [] }));
    dataCache.set(cacheKey, []);

    try {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error clearing bag:', err);
      fetchBag(true); // Revert on error
    }
  }, [user?.id, cacheKey, fetchBag]);

  const openBag = useCallback(() => setState(s => ({ ...s, isOpen: true })), []);
  const closeBag = useCallback(() => setState(s => ({ ...s, isOpen: false })), []);
  const toggleBag = useCallback(() => setState(s => ({ ...s, isOpen: !s.isOpen })), []);

  const totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAmount = state.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <BagContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearBag,
        openBag,
        closeBag,
        toggleBag,
        totalItems,
        totalAmount,
        refreshBag: () => fetchBag(true),
      }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
}

// Re-export with old names for backward compatibility
export const CartProvider = BagProvider;
export const useCart = useBag;
export type CartItem = BagItem;
export type CartProduct = BagProduct;
