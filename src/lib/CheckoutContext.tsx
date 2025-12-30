import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { useCart, CartItem } from './CartContext';

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
  step: 'address' | 'payment' | 'review' | 'success';
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
  resetCheckout: () => void;
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
  const { items, totalAmount, clearCart, closeCart } = useCart();
  const [state, setState] = useState<CheckoutState>(initialState);

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
    closeCart();
  }, [profile, closeCart]);

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
    if (!user?.id || items.length === 0) {
      setState(s => ({ ...s, error: 'Carrinho vazio ou usuário não autenticado' }));
      return false;
    }

    if (!state.shippingAddress) {
      setState(s => ({ ...s, error: 'Endereço de entrega não informado' }));
      return false;
    }

    if (!state.paymentMethod) {
      setState(s => ({ ...s, error: 'Método de pagamento não selecionado' }));
      return false;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    try {
      // Get store_id from first item (assuming single store checkout)
      const storeId = items[0]?.product?.store_id || null;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          store_id: storeId,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: state.paymentMethod,
          shipping_address: state.shippingAddress,
          notes: state.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item: CartItem) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity || 1,
        unit_price: item.product?.price || 0,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      setState(s => ({
        ...s,
        loading: false,
        step: 'success',
        orderId: order.id,
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
    items,
    totalAmount,
    state.shippingAddress,
    state.paymentMethod,
    state.notes,
    clearCart,
  ]);

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
        resetCheckout,
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
