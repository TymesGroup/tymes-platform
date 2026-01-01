import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { useBag, BagItem } from './BagContext';
import { useUnifiedBag, UnifiedBagItem } from './UnifiedBagContext';

export interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface CheckoutState {
  isOpen: boolean;
  step: 'address' | 'payment' | 'review' | 'processing' | 'success';
  shippingAddress: ShippingAddress | null;
  paymentMethod: string | null;
  notes: string;
  loading: boolean;
  error: string | null;
  orderId: string | null;
}

interface CheckoutContextType extends CheckoutState {
  openCheckout: () => void;
  closeCheckout: () => void;
  setStep: (step: CheckoutState['step']) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: string) => void;
  setNotes: (notes: string) => void;
  createOrder: () => Promise<boolean>;
  processPayment: () => Promise<boolean>;
  resetCheckout: () => void;
  // Combined bag info
  allItems: CombinedBagItem[];
  combinedTotalAmount: number;
  combinedTotalItems: number;
  hasPhysicalProducts: boolean;
  hasDigitalItems: boolean;
}

export interface CombinedBagItem {
  id: string;
  type: 'product' | 'course' | 'service';
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  productId?: string;
  storeId?: string | null;
  sellerId?: string;
  sellerName?: string;
  duration?: string;
  category?: string;
}

const initialState: CheckoutState = {
  isOpen: false,
  step: 'address',
  shippingAddress: null,
  paymentMethod: null,
  notes: '',
  loading: false,
  error: null,
  orderId: null,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const { items: bagItems, totalAmount: bagTotal, clearBag, closeBag } = useBag();
  const {
    items: unifiedItems,
    totalAmount: unifiedTotal,
    clearBag: clearUnifiedBag,
  } = useUnifiedBag();
  const [state, setState] = useState<CheckoutState>(initialState);

  // Combine bag items from both sources
  const allItems: CombinedBagItem[] = [
    // Products from regular bag
    ...bagItems.map((item: BagItem) => ({
      id: item.id,
      type: 'product' as const,
      name: item.product?.name || 'Produto',
      price: item.product?.price || 0,
      quantity: item.quantity || 1,
      image: item.product?.image || null,
      productId: item.product_id,
      storeId: item.product?.store_id,
      category: item.product?.category,
    })),
    // Courses and services from unified bag
    ...unifiedItems.map((item: UnifiedBagItem) => ({
      id: item.id,
      type: item.item_type,
      name: item.item_data?.name || 'Item',
      price: item.item_data?.price || 0,
      quantity: item.quantity,
      image: item.item_data?.image || null,
      productId: item.item_id,
      sellerId: item.item_data?.seller_id,
      sellerName: item.item_data?.seller_name,
      duration: item.item_data?.duration,
      category: item.item_data?.category,
    })),
  ];

  const combinedTotalAmount = bagTotal + unifiedTotal;
  const combinedTotalItems =
    bagItems.reduce((sum, item) => sum + (item.quantity || 1), 0) +
    unifiedItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasPhysicalProducts = bagItems.length > 0;
  const hasDigitalItems = unifiedItems.length > 0;

  const openCheckout = useCallback(() => {
    // Pre-fill address from profile if available
    const address: ShippingAddress | null = profile?.address_street
      ? {
          street: profile.address_street || '',
          number: profile.address_number || '',
          complement: profile.address_complement || '',
          neighborhood: profile.address_neighborhood || '',
          city: profile.address_city || '',
          state: profile.address_state || '',
          zip_code: profile.address_zip_code || '',
        }
      : null;

    setState(s => ({
      ...s,
      isOpen: true,
      step: 'address',
      shippingAddress: address,
      error: null,
    }));
    closeBag();
  }, [profile, closeBag]);

  const closeCheckout = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
  }, []);

  const setStep = useCallback((step: CheckoutState['step']) => {
    setState(s => ({ ...s, step, error: null }));
  }, []);

  const setShippingAddress = useCallback((address: ShippingAddress) => {
    setState(s => ({ ...s, shippingAddress: address }));
  }, []);

  const setPaymentMethod = useCallback((method: string) => {
    setState(s => ({ ...s, paymentMethod: method }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState(s => ({ ...s, notes }));
  }, []);

  const createOrder = useCallback(async (): Promise<boolean> => {
    if (!user?.id || allItems.length === 0) {
      setState(s => ({ ...s, error: 'Bolsa vazia ou usuário não autenticado' }));
      return false;
    }

    // Only require address for physical products
    if (hasPhysicalProducts && !state.shippingAddress) {
      setState(s => ({ ...s, error: 'Endereço de entrega não informado' }));
      return false;
    }

    if (!state.paymentMethod) {
      setState(s => ({ ...s, error: 'Método de pagamento não selecionado' }));
      return false;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    try {
      let mainOrderId: string | null = null;

      // Create order for physical products (shop bag)
      if (bagItems.length > 0) {
        const storeId = bagItems[0]?.product?.store_id || null;

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            store_id: storeId,
            total_amount: bagTotal,
            status: 'pending',
            payment_method: state.paymentMethod,
            shipping_address: state.shippingAddress as any,
            notes: state.notes || null,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        mainOrderId = order.id;

        // Create order items for products
        const orderItems = bagItems.map((item: BagItem) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity || 1,
          unit_price: item.product?.price || 0,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;

        await clearBag();
      }

      // Create order for digital items (unified bag - courses/services)
      if (unifiedItems.length > 0) {
        const { data: unifiedOrder, error: unifiedOrderError } = await (supabase as any)
          .from('unified_orders')
          .insert({
            user_id: user.id,
            total_amount: unifiedTotal,
            status: 'pending',
            payment_method: state.paymentMethod,
          })
          .select()
          .single();

        if (unifiedOrderError) throw unifiedOrderError;

        if (!mainOrderId) mainOrderId = unifiedOrder.id;

        // Create order items for courses/services
        const unifiedOrderItems = unifiedItems.map((item: UnifiedBagItem) => ({
          order_id: unifiedOrder.id,
          item_type: item.item_type,
          item_id: item.item_id,
          item_name: item.item_data?.name || 'Item',
          item_image: item.item_data?.image,
          quantity: item.quantity,
          unit_price: item.item_data?.price || 0,
          seller_id: item.item_data?.seller_id,
        }));

        const { error: unifiedItemsError } = await (supabase as any)
          .from('unified_order_items')
          .insert(unifiedOrderItems);

        if (unifiedItemsError) throw unifiedItemsError;

        await clearUnifiedBag();
      }

      setState(s => ({
        ...s,
        loading: false,
        step: 'processing',
        orderId: mainOrderId,
      }));

      return true;
    } catch (err: any) {
      console.error('Error creating order:', err);
      setState(s => ({
        ...s,
        loading: false,
        error: err.message || 'Erro ao criar pedido',
      }));
      return false;
    }
  }, [
    user?.id,
    allItems,
    bagItems,
    unifiedItems,
    bagTotal,
    unifiedTotal,
    hasPhysicalProducts,
    state.shippingAddress,
    state.paymentMethod,
    state.notes,
    clearBag,
    clearUnifiedBag,
  ]);

  const processPayment = useCallback(async (): Promise<boolean> => {
    if (!state.orderId) {
      setState(s => ({ ...s, error: 'Pedido não encontrado' }));
      return false;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    try {
      // Simulate payment processing (in real app, this would call payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update order status to paid
      if (bagItems.length > 0 || hasPhysicalProducts) {
        await supabase.from('orders').update({ status: 'paid' }).eq('id', state.orderId);
      }

      if (unifiedItems.length > 0 || hasDigitalItems) {
        await (supabase as any)
          .from('unified_orders')
          .update({ status: 'paid' })
          .eq('id', state.orderId);
      }

      setState(s => ({
        ...s,
        loading: false,
        step: 'success',
      }));

      return true;
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setState(s => ({
        ...s,
        loading: false,
        error: err.message || 'Erro ao processar pagamento',
      }));
      return false;
    }
  }, [state.orderId, bagItems, unifiedItems, hasPhysicalProducts, hasDigitalItems]);

  const resetCheckout = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        openCheckout,
        closeCheckout,
        setStep,
        setShippingAddress,
        setPaymentMethod,
        setNotes,
        createOrder,
        processPayment,
        resetCheckout,
        allItems,
        combinedTotalAmount,
        combinedTotalItems,
        hasPhysicalProducts,
        hasDigitalItems,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}

// Re-export with old name for backward compatibility
export type CombinedCartItem = CombinedBagItem;
