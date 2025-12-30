import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { dataCache, CACHE_KEYS } from './dataCache';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  stock: number | null;
  store_id: string | null;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: CartProduct;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  isOpen: boolean;
}

interface CartContextType extends CartState {
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  totalAmount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function formatCartItems(data: any[]): CartItem[] {
  return (data || []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity || 1,
    product: item.products,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cacheKey = user?.id ? CACHE_KEYS.CART(user.id) : '';

  // Initialize from cache immediately
  const [state, setState] = useState<CartState>(() => {
    if (!user?.id) return { items: [], loading: false, isOpen: false };
    const cached = dataCache.get<any[]>(cacheKey);
    return {
      items: cached ? formatCartItems(cached) : [],
      loading: !cached,
      isOpen: false,
    };
  });

  const fetchCart = useCallback(
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

        setState(s => ({ ...s, items: formatCartItems(data), loading: false }));
      } catch (err) {
        console.error('Error fetching cart:', err);
        setState(s => ({ ...s, loading: false }));
      }
    },
    [user?.id, cacheKey]
  );

  // Fetch cart on mount and user change
  useEffect(() => {
    fetchCart();

    if (!user?.id) return;

    // Subscribe to cache updates
    const unsubscribe = dataCache.subscribe<any[]>(cacheKey, data => {
      setState(s => ({ ...s, items: formatCartItems(data) }));
    });

    // Real-time subscription
    const channel = supabase
      .channel(`cart:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchCart(true);
        }
      )
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchCart, cacheKey]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!user?.id) throw new Error('Faça login para adicionar ao carrinho');

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
            items: [...s.items, formatCartItems([data])[0]],
          }));
        }

        // Update cache
        fetchCart(true);
      } catch (err) {
        console.error('Error adding to cart:', err);
        fetchCart(true); // Revert on error
        throw err;
      }
    },
    [user?.id, state.items, fetchCart]
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
        console.error('Error removing from cart:', err);
        fetchCart(true); // Revert on error
      }
    },
    [user?.id, cacheKey, fetchCart]
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
        fetchCart(true); // Revert on error
      }
    },
    [user?.id, cacheKey, fetchCart]
  );

  const clearCart = useCallback(async () => {
    if (!user?.id) return;

    // Optimistic update
    setState(s => ({ ...s, items: [] }));
    dataCache.set(cacheKey, []);

    try {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error clearing cart:', err);
      fetchCart(true); // Revert on error
    }
  }, [user?.id, cacheKey, fetchCart]);

  const openCart = useCallback(() => setState(s => ({ ...s, isOpen: true })), []);
  const closeCart = useCallback(() => setState(s => ({ ...s, isOpen: false })), []);
  const toggleCart = useCallback(() => setState(s => ({ ...s, isOpen: !s.isOpen })), []);

  const totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAmount = state.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        totalAmount,
        refreshCart: () => fetchCart(true),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
