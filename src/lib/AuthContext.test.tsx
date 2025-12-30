import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock Supabase client
const mockSignUp = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockRefreshSession = vi.fn();
const mockFrom = vi.fn();

vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signInWithPassword: (...args: unknown[]) => mockSignIn(...args),
      signOut: () => mockSignOut(),
      getSession: () => mockGetSession(),
      onAuthStateChange: (callback: unknown) => mockOnAuthStateChange(callback),
      refreshSession: () => mockRefreshSession(),
    },
    from: (table: string) => mockFrom(table),
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

// Test component to access auth context
function TestComponent({ onAuth }: { onAuth?: (auth: ReturnType<typeof useAuth>) => void }) {
  const auth = useAuth();
  React.useEffect(() => {
    onAuth?.(auth);
  }, [auth, onAuth]);

  return (
    <div>
      <span data-testid="loading">{auth.loading ? 'loading' : 'ready'}</span>
      <span data-testid="user">{auth.user?.email || 'no-user'}</span>
      <span data-testid="profile">{auth.profile?.name || 'no-profile'}</span>
    </div>
  );
}

describe('AuthContext Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    // Default mock implementations
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockRefreshSession.mockResolvedValue({ data: { session: null }, error: null });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial State', () => {
    it('should start with loading state and no user', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially loading
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      // After initialization
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should restore session from existing auth', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token-123',
      };

      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        type: 'PERSONAL',
        avatar_url: null,
      };

      mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
          }),
        }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toHaveTextContent('Test User');
      });
    });
  });

  describe('Sign In Flow', () => {
    it('should sign in user successfully', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token-123',
      };

      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        type: 'PERSONAL',
        avatar_url: null,
      };

      mockSignIn.mockResolvedValue({ data: { session: mockSession }, error: null });
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
          }),
        }),
      });

      let authContext: ReturnType<typeof useAuth> | null = null;

      render(
        <AuthProvider>
          <TestComponent
            onAuth={auth => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      // Perform sign in
      await act(async () => {
        const result = await authContext!.signIn('test@example.com', 'password123');
        expect(result.error).toBeNull();
      });

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle sign in error', async () => {
      mockSignIn.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials', name: 'AuthError', status: 401 },
      });

      let authContext: ReturnType<typeof useAuth> | null = null;

      render(
        <AuthProvider>
          <TestComponent
            onAuth={auth => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        const result = await authContext!.signIn('test@example.com', 'wrong-password');
        expect(result.error).toBeTruthy();
        expect(result.error.message).toBe('Invalid credentials');
      });
    });
  });

  describe('Sign Up Flow', () => {
    it('should sign up user successfully', async () => {
      const mockData = {
        user: { id: 'new-user-123', email: 'new@example.com' },
        session: null,
      };

      mockSignUp.mockResolvedValue({ data: mockData, error: null });

      let authContext: ReturnType<typeof useAuth> | null = null;

      render(
        <AuthProvider>
          <TestComponent
            onAuth={auth => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        const result = await authContext!.signUp('new@example.com', 'password123', {
          name: 'New User',
          document: '12345678900',
          phone: '11999999999',
          type: 'PERSONAL',
          birth_date: '1990-01-01',
          address_street: 'Test Street',
          address_number: '123',
          address_neighborhood: 'Test Neighborhood',
          address_city: 'Test City',
          address_state: 'SP',
          address_zip_code: '01234567',
        });
        expect(result.error).toBeNull();
      });

      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  describe('Sign Out Flow', () => {
    it('should sign out user successfully', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      let authContext: ReturnType<typeof useAuth> | null = null;

      render(
        <AuthProvider>
          <TestComponent
            onAuth={auth => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        const result = await authContext!.signOut();
        expect(result.error).toBeNull();
      });

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('Clear All Data', () => {
    it('should clear all stored data', async () => {
      localStorage.setItem('tymes_saved_accounts', JSON.stringify([{ id: '1' }]));
      localStorage.setItem('tymes_saved_credentials', JSON.stringify({ '1': {} }));

      let authContext: ReturnType<typeof useAuth> | null = null;

      render(
        <AuthProvider>
          <TestComponent
            onAuth={auth => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      act(() => {
        authContext!.clearAllData();
      });

      expect(localStorage.getItem('tymes_saved_accounts')).toBeNull();
      expect(localStorage.getItem('tymes_saved_credentials')).toBeNull();
    });
  });
});
