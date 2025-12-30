import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import { dataCache, CACHE_KEYS } from '../../../lib/dataCache';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  description: string | null;
  created_by: string | null;
  store_id: string | null;
  stock: number | null;
  status: string | null;
  rating?: number | null;
  total_reviews?: number | null;
  created_at?: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  status: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Favorite {
  id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

// Hook para produtos - com cache instantâneo
export function useProducts(filters?: { category?: string; status?: string; storeId?: string }) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Initialize from cache immediately
    return dataCache.get<Product[]>(CACHE_KEYS.PRODUCTS) || [];
  });
  const [loading, setLoading] = useState(() => !dataCache.has(CACHE_KEYS.PRODUCTS));
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    try {
      // Only show loading if no cached data
      if (!dataCache.has(CACHE_KEYS.PRODUCTS)) {
        setLoading(true);
      }

      const data = await dataCache.getOrFetch<Product[]>(
        CACHE_KEYS.PRODUCTS,
        async () => {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return data || [];
        },
        { forceRefresh }
      );

      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Subscribe to cache updates
    const unsubscribe = dataCache.subscribe<Product[]>(CACHE_KEYS.PRODUCTS, setProducts);

    // Realtime subscription for updates
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts(true);
      })
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  // Apply filters client-side for instant filtering
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters?.status && product.status !== filters.status) return false;
      if (filters?.category && product.category !== filters.category) return false;
      if (filters?.storeId && product.store_id !== filters.storeId) return false;
      return true;
    });
  }, [products, filters?.status, filters?.category, filters?.storeId]);

  return { products: filteredProducts, loading, error, refetch: () => fetchProducts(true) };
}

// Hook para produto individual
export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(() => {
    if (!productId) return null;
    // Try to find in cached products first
    const products = dataCache.get<Product[]>(CACHE_KEYS.PRODUCTS);
    return products?.find(p => p.id === productId) || null;
  });
  const [loading, setLoading] = useState(() => {
    if (!productId) return false;
    const products = dataCache.get<Product[]>(CACHE_KEYS.PRODUCTS);
    return !products?.find(p => p.id === productId);
  });

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    // Check cache first
    const products = dataCache.get<Product[]>(CACHE_KEYS.PRODUCTS);
    const cached = products?.find(p => p.id === productId);
    if (cached) {
      setProduct(cached);
      setLoading(false);
      return;
    }

    // Fetch if not in cache
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [productId]);

  return { product, loading };
}

// Hook para meus produtos (vendedor) - com cache
export function useMyProducts() {
  const { user } = useAuth();
  const cacheKey = user?.id ? CACHE_KEYS.PRODUCTS_BY_USER(user.id) : '';

  const [products, setProducts] = useState<Product[]>(() => {
    if (!user?.id) return [];
    return dataCache.get<Product[]>(cacheKey) || [];
  });
  const [loading, setLoading] = useState(() => {
    if (!user?.id) return false;
    return !dataCache.has(cacheKey);
  });

  const fetchProducts = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) return;

      try {
        if (!dataCache.has(cacheKey)) setLoading(true);

        const data = await dataCache.getOrFetch<Product[]>(
          cacheKey,
          async () => {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('created_by', user.id)
              .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
          },
          { forceRefresh }
        );

        setProducts(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    },
    [user?.id, cacheKey]
  );

  useEffect(() => {
    fetchProducts();

    if (!user?.id) return;

    const unsubscribe = dataCache.subscribe<Product[]>(cacheKey, setProducts);

    return () => unsubscribe();
  }, [fetchProducts, user?.id, cacheKey]);

  const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, created_by: user.id })
      .select()
      .single();

    if (error) throw error;

    // Update cache
    dataCache.update<Product[]>(cacheKey, current => [data, ...(current || [])]);
    dataCache.update<Product[]>(CACHE_KEYS.PRODUCTS, current => [data, ...(current || [])]);

    return data;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update cache
    dataCache.update<Product[]>(cacheKey, current =>
      (current || []).map(p => (p.id === id ? data : p))
    );
    dataCache.update<Product[]>(CACHE_KEYS.PRODUCTS, current =>
      (current || []).map(p => (p.id === id ? data : p))
    );

    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    // Update cache
    dataCache.update<Product[]>(cacheKey, current => (current || []).filter(p => p.id !== id));
    dataCache.update<Product[]>(CACHE_KEYS.PRODUCTS, current =>
      (current || []).filter(p => p.id !== id)
    );
  };

  return {
    products,
    loading,
    refetch: () => fetchProducts(true),
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

// Hook para lojas em destaque - com cache
export function useStores() {
  const [stores, setStores] = useState<Store[]>(() => {
    return dataCache.get<Store[]>(CACHE_KEYS.STORES) || [];
  });
  const [loading, setLoading] = useState(() => !dataCache.has(CACHE_KEYS.STORES));

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!dataCache.has(CACHE_KEYS.STORES)) setLoading(true);

        const data = await dataCache.getOrFetch<Store[]>(CACHE_KEYS.STORES, async () => {
          const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('status', 'active')
            .limit(20);
          if (error) throw error;
          return data || [];
        });

        setStores(data);
      } catch (err) {
        console.error('Erro ao carregar lojas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();

    const unsubscribe = dataCache.subscribe<Store[]>(CACHE_KEYS.STORES, setStores);
    return () => unsubscribe();
  }, []);

  return { stores, loading };
}

// Hook para loja do usuário - com cache
export function useMyStore() {
  const { user } = useAuth();
  const cacheKey = user?.id ? CACHE_KEYS.STORE_BY_USER(user.id) : '';

  const [store, setStore] = useState<Store | null>(() => {
    if (!user?.id) return null;
    return dataCache.get<Store | null>(cacheKey);
  });
  const [loading, setLoading] = useState(() => {
    if (!user?.id) return false;
    return !dataCache.has(cacheKey);
  });

  useEffect(() => {
    if (!user?.id) {
      setStore(null);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        if (!dataCache.has(cacheKey)) setLoading(true);

        const data = await dataCache.getOrFetch<Store | null>(cacheKey, async () => {
          const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('owner_id', user.id)
            .maybeSingle();
          if (error) throw error;
          return data;
        });

        setStore(data);
      } catch (err) {
        console.error('Erro ao carregar loja:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();

    const unsubscribe = dataCache.subscribe<Store | null>(cacheKey, setStore);
    return () => unsubscribe();
  }, [user?.id, cacheKey]);

  const createStore = async (storeData: Omit<Store, 'id' | 'created_at' | 'owner_id'>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('stores')
      .insert({ ...storeData, owner_id: user.id })
      .select()
      .single();

    if (error) throw error;

    dataCache.set(cacheKey, data);
    setStore(data);
    return data;
  };

  const updateStore = async (updates: Partial<Store>) => {
    if (!store?.id) throw new Error('Loja não encontrada');

    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', store.id)
      .select()
      .single();

    if (error) throw error;

    dataCache.set(cacheKey, data);
    setStore(data);
    return data;
  };

  return { store, loading, createStore, updateStore };
}

// Hook para pedidos do usuário
export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (
            id, product_id, quantity, price,
            products:product_id (id, name, image, category)
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (shippingAddress: object, paymentMethod: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(
        `
        id, product_id, quantity,
        products:product_id (id, name, price)
      `
      )
      .eq('user_id', user.id);

    if (cartError) throw cartError;
    if (!cartItems?.length) throw new Error('Carrinho vazio');

    const total = cartItems.reduce(
      (sum, item: any) => sum + (item.products?.price || 0) * (item.quantity || 1),
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
        status: 'pending',
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity || 1,
      price: item.products?.price || 0,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) throw itemsError;

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    await fetchOrders();
    return order;
  };

  return { orders, loading, createOrder, refetch: fetchOrders };
}

// Hook para vendas (vendedor)
export function useSales() {
  const { user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = useCallback(async () => {
    if (!user?.id) {
      setSales([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Get orders that contain products from this seller
      const { data: myProducts } = await supabase
        .from('products')
        .select('id')
        .eq('created_by', user.id);

      if (!myProducts?.length) {
        setSales([]);
        setLoading(false);
        return;
      }

      const productIds = myProducts.map(p => p.id);

      const { data, error } = await supabase
        .from('order_items')
        .select(
          `
          *,
          orders (id, user_id, status, created_at, shipping_address),
          products:product_id (id, name, image, price)
        `
        )
        .in('product_id', productIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (err) {
      console.error('Erro ao carregar vendas:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

    if (error) throw error;
    await fetchSales();
  };

  return { sales, loading, updateOrderStatus, refetch: fetchSales };
}
