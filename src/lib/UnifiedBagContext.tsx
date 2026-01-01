/**
 * Unified Bag Context
 * Bolsa unificada para produtos, cursos e serviços
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

export type ItemType = 'product' | 'course' | 'service';

export interface BagItemData {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category?: string;
  seller_id?: string;
  seller_name?: string;
  duration?: string; // for courses
  delivery_time?: string; // for services
}

export interface UnifiedBagItem {
  id: string;
  item_type: ItemType;
  item_id: string;
  quantity: number;
  item_data?: BagItemData;
}

interface BagState {
  items: UnifiedBagItem[];
  loading: boolean;
  isOpen: boolean;
}

interface UnifiedBagContextType extends BagState {
  addItem: (itemType: ItemType, itemId: string, quantity?: number) => Promise<void>;
  removeItem: (bagItemId: string) => Promise<void>;
  updateQuantity: (bagItemId: string, quantity: number) => Promise<void>;
  clearBag: () => Promise<void>;
  openBag: () => void;
  closeBag: () => void;
  toggleBag: () => void;
  totalItems: number;
  totalAmount: number;
  refreshBag: () => Promise<void>;
  isInBag: (itemType: ItemType, itemId: string) => boolean;
  checkout: () => Promise<string | null>;
}

const UnifiedBagContext = createContext<UnifiedBagContextType | undefined>(undefined);

export function UnifiedBagProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<BagState>({
    items: [],
    loading: true,
    isOpen: false,
  });

  // Fetch item details based on type
  const fetchItemData = async (itemType: ItemType, itemId: string): Promise<BagItemData | null> => {
    try {
      if (itemType === 'product' || itemType === 'service') {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image, category, created_by, profiles:created_by(name)')
          .eq('id', itemId)
          .single();

        if (error) throw error;
        return {
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.image,
          category: data.category,
          seller_id: data.created_by,
          seller_name: (data.profiles as any)?.name,
        };
      } else if (itemType === 'course') {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, price, thumbnail, created_by, duration, profiles:created_by(name)')
          .eq('id', itemId)
          .single();

        if (error) throw error;
        return {
          id: data.id,
          name: data.title,
          price: data.price || 0,
          image: data.thumbnail,
          duration: data.duration,
          seller_id: data.created_by,
          seller_name: (data.profiles as any)?.name,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching item data:', error);
      return null;
    }
  };

  // Fetch bag with item details
  const fetchBag = useCallback(async () => {
    if (!user?.id) {
      setState(s => ({ ...s, items: [], loading: false }));
      return;
    }

    setState(s => ({ ...s, loading: true }));

    try {
      const { data, error } = await (supabase as any)
        .from('unified_cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch item details for each bag item
      const itemsWithData = await Promise.all(
        (data || []).map(async (item: any) => {
          const itemData = await fetchItemData(item.item_type as ItemType, item.item_id);
          return { ...item, item_data: itemData } as UnifiedBagItem;
        })
      );

      setState(s => ({ ...s, items: itemsWithData, loading: false }));
    } catch (error) {
      console.error('Error fetching bag:', error);
      setState(s => ({ ...s, loading: false }));
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBag();
  }, [fetchBag]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`unified_bag:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'unified_cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchBag()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchBag]);

  const addItem = useCallback(
    async (itemType: ItemType, itemId: string, quantity = 1) => {
      if (!user?.id) throw new Error('Faça login para adicionar à bolsa');

      // Check if already in bag
      const existing = state.items.find(
        item => item.item_type === itemType && item.item_id === itemId
      );

      try {
        if (existing) {
          // For courses and services, don't allow duplicates
          if (itemType === 'course' || itemType === 'service') {
            throw new Error('Este item já está na sua bolsa');
          }

          // Update quantity for products
          const { error } = await (supabase as any)
            .from('unified_cart_items')
            .update({
              quantity: existing.quantity + quantity,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (error) throw error;
        } else {
          const { error } = await (supabase as any).from('unified_cart_items').insert({
            user_id: user.id,
            item_type: itemType,
            item_id: itemId,
            quantity: itemType === 'course' || itemType === 'service' ? 1 : quantity,
          });

          if (error) throw error;
        }

        await fetchBag();
      } catch (error) {
        console.error('Error adding to bag:', error);
        throw error;
      }
    },
    [user?.id, state.items, fetchBag]
  );

  const removeItem = useCallback(
    async (bagItemId: string) => {
      if (!user?.id) return;

      try {
        const { error } = await (supabase as any)
          .from('unified_cart_items')
          .delete()
          .eq('id', bagItemId)
          .eq('user_id', user.id);

        if (error) throw error;

        setState(s => ({
          ...s,
          items: s.items.filter(item => item.id !== bagItemId),
        }));
      } catch (error) {
        console.error('Error removing from bag:', error);
      }
    },
    [user?.id]
  );

  const updateQuantity = useCallback(
    async (bagItemId: string, quantity: number) => {
      if (!user?.id || quantity < 1) return;

      try {
        const { error } = await (supabase as any)
          .from('unified_cart_items')
          .update({ quantity, updated_at: new Date().toISOString() })
          .eq('id', bagItemId)
          .eq('user_id', user.id);

        if (error) throw error;

        setState(s => ({
          ...s,
          items: s.items.map(item => (item.id === bagItemId ? { ...item, quantity } : item)),
        }));
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    [user?.id]
  );

  const clearBag = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await (supabase as any)
        .from('unified_cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setState(s => ({ ...s, items: [] }));
    } catch (error) {
      console.error('Error clearing bag:', error);
    }
  }, [user?.id]);

  const checkout = useCallback(async (): Promise<string | null> => {
    if (!user?.id || state.items.length === 0) return null;

    try {
      // Create order
      const { data: order, error: orderError } = await (supabase as any)
        .from('unified_orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        item_type: item.item_type,
        item_id: item.item_id,
        item_name: item.item_data?.name || 'Item',
        item_image: item.item_data?.image,
        quantity: item.quantity,
        unit_price: item.item_data?.price || 0,
        seller_id: item.item_data?.seller_id,
      }));

      const { error: itemsError } = await (supabase as any)
        .from('unified_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear bag
      await clearBag();

      return order.id;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }, [user?.id, state.items, clearBag]);

  const openBag = useCallback(() => setState(s => ({ ...s, isOpen: true })), []);
  const closeBag = useCallback(() => setState(s => ({ ...s, isOpen: false })), []);
  const toggleBag = useCallback(() => setState(s => ({ ...s, isOpen: !s.isOpen })), []);

  const isInBag = useCallback(
    (itemType: ItemType, itemId: string) => {
      return state.items.some(item => item.item_type === itemType && item.item_id === itemId);
    },
    [state.items]
  );

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce((sum, item) => {
    const price = item.item_data?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <UnifiedBagContext.Provider
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
        refreshBag: fetchBag,
        isInBag,
        checkout,
      }}
    >
      {children}
    </UnifiedBagContext.Provider>
  );
}

export function useUnifiedBag() {
  const context = useContext(UnifiedBagContext);
  if (!context) {
    throw new Error('useUnifiedBag must be used within a UnifiedBagProvider');
  }
  return context;
}

// Re-export with old names for backward compatibility
export const UnifiedCartProvider = UnifiedBagProvider;
export const useUnifiedCart = useUnifiedBag;
export type UnifiedCartItem = UnifiedBagItem;
export type CartItemData = BagItemData;
