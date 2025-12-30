import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from './CartContext';
import { AuthProvider } from './AuthContext';

// Mock Supabase client
const mockFrom = vi.fn();
const mockChannel = vi.fn();
const mockRemoveChannel = vi.fn();

vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      refreshSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
    from: (table: string) => mockFrom(table),
    channel: (name: string) => mockChannel(name),
    removeChannel: (channel: unknown) => mockRemoveChannel(channel),
  },
  userPreferences: {
    get: vi.fn(() => ({})),
    set: vi.fn(),
  },
  analyticsStorage: {
    trackEvent: vi.fn(),
  },
}));

// Mock preloadData
vi.mock('./preloadData', () => ({
  preloadPublicData: vi.fn(() => Promise.resolve()),
  preloadUserData: vi.fn(() => Promise.resolve()),
  clearUserData: vi.fn(),
}));

// Mock crypto
vi.mock('./crypto', () => ({
  encryptValue: vi.fn((val: string) => Promise.resolve(`encrypted_${val}`)),
  decryptValue: vi.fn((val: string) => Promise.resolve(val.replace('encrypted_', ''))),
  clearEncryptionKey: vi.fn(),
}));

// Mock dataCache
vi.mock('./dataCache', () => ({
  dataCache: {
    get: vi.fn(() => null),
    has: vi.fn(() => false),
    set: vi.fn(),
    getOrFetch: vi.fn((key: string, fetcher: () => Promise<unknown>) => fetcher()),
    subscribe: vi.fn(() => vi.fn()),
    update: vi.fn(),
  },
  CACHE_KEYS: {
    CART: (userId: string) => `cart_${userId}`,
  },
}));

// Mock AuthContext to provide a user
const mockUser = { id: 'test-user-123', email: 'test@example.com' };

vi.mock('./AuthContext', async () => {
  const actual = await vi.importActual('./AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      user: mockUser,
      profile: null,
      session: null,
      loading: false,
      accounts: [],
    })),
  };
});

// Test component to access cart context
function TestComponent({ onCart }: { onCart?: (cart: ReturnType<typeof useCart>) => void }) {
  const cart = useCart();
  React.useEffect(() => {
    onCart?.(cart);
  }, [cart, onCart]);

  return (
    <div>
      <span data-testid="loading">{cart.loading ? 'loading' : 'ready'}</span>
      <span data-testid="total-items">{cart.totalItems}</span>
      <span data-testid="total-amount">{cart.totalAmount}</span>
      <span data-testid="is-open">{cart.isOpen ? 'open' : 'closed'}</span>
      <span data-testid="items-count">{cart.items.length}</span>
    </div>
  );
}

describe('CartContext Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Default mock for channel subscription
    mockChannel.mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    });
  });

  describe('Initial State', () => {
    it('should start with empty cart', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-amount')).toHaveTextContent('0');
      expect(screen.getByTestId('is-open')).toHaveTextContent('closed');
    });

    it('should load existing cart items', async () => {
      const mockCartItems = [
        {
          id: 'item-1',
          product_id: 'prod-1',
          quantity: 2,
          products: {
            id: 'prod-1',
            name: 'Test Product',
            price: 100,
            image: null,
            category: 'test',
            stock: 10,
            store_id: 'store-1',
          },
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: mockCartItems, error: null }),
        }),
      });

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      });

      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-amount')).toHaveTextContent('200');
    });
  });

  describe('Add Item Flow', () => {
    it('should add new item to cart', async () => {
      const newItem = {
        id: 'new-item-1',
        product_id: 'prod-1',
        quantity: 1,
        products: {
          id: 'prod-1',
          name: 'New Product',
          price: 50,
          image: null,
          category: 'test',
          stock: 5,
          store_id: 'store-1',
        },
      };

      // Initial empty cart
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: newItem, error: null }),
          }),
        }),
      });

      let cartContext: ReturnType<typeof useCart> | null = null;

      render(
        <CartProvider>
          <TestComponent
            onCart={cart => {
              cartContext = cart;
            }}
          />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        await cartContext!.addItem('prod-1', 1);
      });

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
    });

    it('should update quantity for existing item', async () => {
      const existingItem = {
        id: 'item-1',
        product_id: 'prod-1',
        quantity: 1,
        products: {
          id: 'prod-1',
          name: 'Existing Product',
          price: 100,
          image: null,
          category: 'test',
          stock: 10,
          store_id: 'store-1',
        },
      };

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [existingItem], error: null }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      let cartContext: ReturnType<typeof useCart> | null = null;

      render(
        <CartProvider>
          <TestComponent
            onCart={cart => {
              cartContext = cart;
            }}
          />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      });

      await act(async () => {
        await cartContext!.addItem('prod-1', 2);
      });

      // Verify update was called
      expect(mockFrom).toHaveBeenCalledWith('cart_items');
    });
  });

  describe('Remove Item Flow', () => {
    it('should remove item from cart', async () => {
      const existingItem = {
        id: 'item-1',
        product_id: 'prod-1',
        quantity: 1,
        products: {
          id: 'prod-1',
          name: 'Product to Remove',
          price: 100,
          image: null,
          category: 'test',
          stock: 10,
          store_id: 'store-1',
        },
      };

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [existingItem], error: null }),
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      let cartContext: ReturnType<typeof useCart> | null = null;

      render(
        <CartProvider>
          <TestComponent
            onCart={cart => {
              cartContext = cart;
            }}
          />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      });

      await act(async () => {
        await cartContext!.removeItem('item-1');
      });

      // Item should be removed optimistically
      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      });
    });
  });

  describe('Update Quantity Flow', () => {
    it('should update item quantity', async () => {
      const existingItem = {
        id: 'item-1',
        product_id: 'prod-1',
        quantity: 1,
        products: {
          id: 'prod-1',
          name: 'Product',
          price: 100,
          image: null,
          category: 'test',
          stock: 10,
          store_id: 'store-1',
        },
      };

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [existingItem], error: null }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      let cartContext: ReturnType<typeof useCart> | null = null;

      render(
        <CartProvider>
          <TestComponent
            onCart={cart => {
              cartContext = cart;
            }}
          />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      });

      await act(async () => {
        await cartContext!.updateQuantity('item-1', 5);
      });

      // Quantity should be updated optimistically
      await waitFor(() => {
        expect(screen.getByTestId('total-items')).toHaveTextContent('5');
      });
    });
  });

  describe('Clear Cart Flow', () => {
    it('should clear all items from cart', async () => {
      const existingItems = [
        {
          id: 'item-1',
          product_id: 'prod-1',
          quantity: 2,
          products: {
            id: 'prod-1',
            name: 'Product 1',
            price: 100,
            image: null,
            category: 'test',
            stock: 10,
            store_id: 'store-1',
          },
        },
        {
          id: 'item-2',
          product_id: 'prod-2',
          quantity: 1,
          products: {
            id: 'prod-2',
            name: 'Product 2',
            price: 50,
            image: null,
            category: 'test',
            stock: 5,
            store_id: 'store-1',
          },
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: existingItems, error: null }),
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      let cartContext: ReturnType<typeof useCart> | null = null;

      render(
        <CartProvider>
          <TestComponent
            onCart={cart => {
              cartContext = cart;
            }}
          />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      });

      await act(async () => {
        await cartContext!.clearCart();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('0');
        expect(screen.getByTestId('total-items')).toHaveTextContent('0');
        expect(screen.getByTestId('total-amount')).toHaveTextContent('0');
      });
    });
  });

  describe('Cart UI State', () => {
    it('should toggle cart open/close state', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      let cartContext: ReturnType<typeof useCart> | null = null;

      render(
        <CartProvider>
          <TestComponent
            onCart={cart => {
              cartContext = cart;
            }}
          />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('is-open')).toHaveTextContent('closed');

      act(() => {
        cartContext!.openCart();
      });

      expect(screen.getByTestId('is-open')).toHaveTextContent('open');

      act(() => {
        cartContext!.closeCart();
      });

      expect(screen.getByTestId('is-open')).toHaveTextContent('closed');

      act(() => {
        cartContext!.toggleCart();
      });

      expect(screen.getByTestId('is-open')).toHaveTextContent('open');
    });
  });

  describe('Total Calculations', () => {
    it('should calculate totals correctly', async () => {
      const cartItems = [
        {
          id: 'item-1',
          product_id: 'prod-1',
          quantity: 3,
          products: {
            id: 'prod-1',
            name: 'Product 1',
            price: 100,
            image: null,
            category: 'test',
            stock: 10,
            store_id: 'store-1',
          },
        },
        {
          id: 'item-2',
          product_id: 'prod-2',
          quantity: 2,
          products: {
            id: 'prod-2',
            name: 'Product 2',
            price: 75,
            image: null,
            category: 'test',
            stock: 5,
            store_id: 'store-1',
          },
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: cartItems, error: null }),
        }),
      });

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      });

      // Total items: 3 + 2 = 5
      expect(screen.getByTestId('total-items')).toHaveTextContent('5');

      // Total amount: (3 * 100) + (2 * 75) = 300 + 150 = 450
      expect(screen.getByTestId('total-amount')).toHaveTextContent('450');
    });
  });
});
