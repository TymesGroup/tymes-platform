import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import {
  supabase,
  userPreferences,
  analyticsStorage,
  clearAllAppData,
  hasStoredSession,
} from './supabase';
import { preloadPublicData, preloadUserData, clearUserData } from './preloadData';
import { encryptValue, decryptValue, clearEncryptionKey } from './crypto';
import { dataCache } from './dataCache';
import type { Tables } from './database.types';

export type Profile = Tables<'profiles'>;

// ============================================================================
// CONSTANTS
// ============================================================================

const LAST_ACTIVITY_KEY = 'tymes_last_activity';
const ACCOUNTS_KEY = 'tymes_saved_accounts';
const CREDENTIALS_KEY = 'tymes_saved_credentials';

// Session refresh interval: 4 minutes (tokens typically expire in 1 hour)
const SESSION_REFRESH_INTERVAL = 4 * 60 * 1000;

// ============================================================================
// TYPES
// ============================================================================

interface StoredAccount {
  id: string;
  email: string;
  name: string;
  type: string;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  accounts: StoredAccount[];
}

interface ProfileUpdateData {
  name?: string;
  phone?: string;
  birth_date?: string | null;
  address_street?: string | null;
  address_number?: string | null;
  address_complement?: string | null;
  address_neighborhood?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip_code?: string | null;
}

interface AuthContextType extends AuthState {
  signUp: (
    email: string,
    password: string,
    metadata: {
      name: string;
      document: string;
      phone: string;
      type: 'PERSONAL' | 'BUSINESS';
      birth_date: string;
      address_street: string;
      address_number: string;
      address_complement?: string;
      address_neighborhood: string;
      address_city: string;
      address_state: string;
      address_zip_code: string;
      address_country?: string;
    }
  ) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  addAccount: (email: string, password: string) => Promise<{ data: any; error: any }>;
  switchAccount: (accountId: string) => Promise<void>;
  removeAccount: (accountId: string) => void;
  clearAllData: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function updateLastActivity(): void {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch {}
}

function getLastActivity(): number {
  try {
    const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
    return stored ? parseInt(stored, 10) : Date.now();
  } catch {
    return Date.now();
  }
}

// ============================================================================
// AUTH PROVIDER
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    initialized: false,
    accounts: [],
  });

  const pendingPwdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializingRef = useRef(false);

  // ============================================================================
  // ACCOUNT MANAGEMENT
  // ============================================================================

  const loadAccounts = useCallback((): StoredAccount[] => {
    try {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  const saveAccounts = useCallback((accounts: StoredAccount[]) => {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {}
  }, []);

  const saveCredentials = useCallback(async (id: string, email: string, password: string) => {
    try {
      const data = localStorage.getItem(CREDENTIALS_KEY);
      const creds = data ? JSON.parse(data) : {};
      const encryptedPwd = await encryptValue(password);
      creds[id] = { email, pwd: encryptedPwd };
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch {}
  }, []);

  const getCredentials = useCallback(
    async (id: string): Promise<{ email: string; password: string } | null> => {
      try {
        const data = localStorage.getItem(CREDENTIALS_KEY);
        if (!data) return null;
        const creds = JSON.parse(data);
        if (!creds[id]) return null;
        const password = await decryptValue(creds[id].pwd);
        return { email: creds[id].email, password };
      } catch {
        return null;
      }
    },
    []
  );

  const removeCredentials = useCallback((id: string) => {
    try {
      const data = localStorage.getItem(CREDENTIALS_KEY);
      if (!data) return;
      const creds = JSON.parse(data);
      delete creds[id];
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch {}
  }, []);

  // ============================================================================
  // PROFILE FETCHING
  // ============================================================================

  const fetchProfile = useCallback(
    async (userId: string, session: Session): Promise<Profile | null> => {
      // Try up to 3 times with exponential backoff
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (error) {
            console.warn(`Profile fetch attempt ${attempt + 1} failed:`, error.message);
            if (attempt < 2) {
              await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500));
              continue;
            }
          }

          return data;
        } catch (e) {
          console.warn(`Profile fetch attempt ${attempt + 1} error:`, e);
          if (attempt < 2) {
            await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500));
          }
        }
      }
      return null;
    },
    []
  );

  const updateStateWithProfile = useCallback(
    (session: Session, profile: Profile | null) => {
      if (!mountedRef.current) return;

      setState(s => ({
        ...s,
        user: session.user,
        profile,
        session,
        loading: false,
        initialized: true,
      }));

      // Update saved accounts
      if (profile) {
        const accs = loadAccounts();
        const idx = accs.findIndex(a => a.id === profile.id);
        const account: StoredAccount = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          type: profile.type,
          avatar_url: profile.avatar_url,
        };

        if (idx >= 0) {
          accs[idx] = account;
        } else {
          accs.push(account);
        }

        saveAccounts(accs);

        if (pendingPwdRef.current) {
          saveCredentials(profile.id, profile.email, pendingPwdRef.current);
          pendingPwdRef.current = null;
        }

        setState(s => ({ ...s, accounts: accs }));
      }
    },
    [loadAccounts, saveAccounts, saveCredentials]
  );

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn('Session refresh failed:', error.message);
        return;
      }
      if (data.session && mountedRef.current) {
        setState(s => ({ ...s, session: data.session }));
      }
    } catch (e) {
      console.warn('Session refresh error:', e);
    }
  }, []);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    mountedRef.current = true;

    // Prevent double initialization
    if (initializingRef.current) return;
    initializingRef.current = true;

    // Load saved accounts
    const accounts = loadAccounts();
    setState(s => ({ ...s, accounts }));

    // Preload public data immediately
    preloadPublicData().catch(console.error);

    // Safety timeout - if initialization takes too long, stop loading
    const timeout = setTimeout(() => {
      if (mountedRef.current) {
        setState(s => (s.loading ? { ...s, loading: false, initialized: true } : s));
      }
    }, 5000);

    // Initialize auth state
    const initAuth = async () => {
      try {
        // Check if we have a stored session first
        if (!hasStoredSession()) {
          if (mountedRef.current) {
            setState(s => ({ ...s, loading: false, initialized: true }));
          }
          return;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          if (mountedRef.current) {
            setState(s => ({ ...s, loading: false, initialized: true }));
          }
          return;
        }

        if (session?.user) {
          // Preload user data
          preloadUserData(session.user.id).catch(console.error);

          // Fetch profile
          const profile = await fetchProfile(session.user.id, session);
          updateStateWithProfile(session, profile);
        } else {
          if (mountedRef.current) {
            setState(s => ({ ...s, loading: false, initialized: true }));
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        if (mountedRef.current) {
          setState(s => ({ ...s, loading: false, initialized: true }));
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!mountedRef.current) return;

      console.log('🔔 Auth event:', event);

      switch (event) {
        case 'SIGNED_OUT':
          // Clear all cache
          dataCache.clear();
          setState(s => {
            // Clear user-specific cache if we had a user
            if (s.user?.id) {
              clearUserData(s.user.id);
            }
            return {
              ...s,
              user: null,
              profile: null,
              session: null,
              loading: false,
              initialized: true,
            };
          });
          break;

        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            // Only fetch profile on SIGNED_IN, not on every token refresh
            if (event === 'SIGNED_IN') {
              preloadUserData(session.user.id).catch(console.error);
              const profile = await fetchProfile(session.user.id, session);
              updateStateWithProfile(session, profile);
            } else {
              // Just update session on token refresh
              setState(s => ({ ...s, session }));
            }
          }
          break;

        case 'USER_UPDATED':
          if (session?.user) {
            const profile = await fetchProfile(session.user.id, session);
            updateStateWithProfile(session, profile);
          }
          break;

        case 'INITIAL_SESSION':
          // Handled by initAuth above
          break;
      }
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [loadAccounts, fetchProfile, updateStateWithProfile]);

  // ============================================================================
  // ACTIVITY TRACKING & SESSION REFRESH
  // ============================================================================

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => updateLastActivity();

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Periodic session refresh when user is active
  useEffect(() => {
    if (!state.session) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    refreshIntervalRef.current = setInterval(() => {
      const lastActivity = getLastActivity();
      const now = Date.now();

      // Only refresh if user was active in the last 10 minutes
      if (now - lastActivity < 10 * 60 * 1000) {
        refreshSession();
      }
    }, SESSION_REFRESH_INTERVAL);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [state.session, refreshSession]);

  // ============================================================================
  // AUTH METHODS
  // ============================================================================

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      metadata: {
        name: string;
        document: string;
        phone: string;
        type: 'PERSONAL' | 'BUSINESS';
        birth_date: string;
        address_street: string;
        address_number: string;
        address_complement?: string;
        address_neighborhood: string;
        address_city: string;
        address_state: string;
        address_zip_code: string;
        address_country?: string;
      }
    ) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              ...metadata,
              address_country: metadata.address_country || 'Brasil',
            },
          },
        });

        if (error) return { data, error };

        pendingPwdRef.current = password;
        analyticsStorage.trackEvent('signup_success', { type: metadata.type });

        return { data, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: { message: err.message || 'Erro ao criar conta', name: 'AuthError', status: 500 },
        };
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setState(s => ({ ...s, loading: true }));

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          setState(s => ({ ...s, loading: false }));
          analyticsStorage.trackEvent('login_failed', { reason: error.message });
          return { data: null, error };
        }

        pendingPwdRef.current = password;
        updateLastActivity();

        userPreferences.set('lastLoginEmail', email);
        analyticsStorage.trackEvent('login_success', { method: 'email' });

        // Fetch profile immediately after successful login
        // The onAuthStateChange will also fire, but we handle it here for faster UX
        if (data.session?.user) {
          preloadUserData(data.session.user.id).catch(console.error);
          const profile = await fetchProfile(data.session.user.id, data.session);
          updateStateWithProfile(data.session, profile);
        }

        return { data, error: null };
      } catch (err: any) {
        setState(s => ({ ...s, loading: false }));
        return {
          data: null,
          error: { message: err.message || 'Erro ao fazer login', name: 'AuthError', status: 500 },
        };
      }
    },
    [fetchProfile, updateStateWithProfile]
  );

  const signOut = useCallback(async () => {
    analyticsStorage.trackEvent('logout_initiated');

    // Clear user data before signing out
    if (state.user?.id) {
      clearUserData(state.user.id);
    }

    // Clear all cache
    dataCache.clear();

    const { error } = await supabase.auth.signOut();

    // Clear activity tracking
    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch {}

    return { error };
  }, [state.user?.id]);

  const addAccount = useCallback(async (email: string, password: string) => {
    try {
      setState(s => ({ ...s, loading: true }));
      await supabase.auth.signOut({ scope: 'local' });
      await new Promise(r => setTimeout(r, 100));

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setState(s => ({ ...s, loading: false }));
        return { data: null, error };
      }

      pendingPwdRef.current = password;
      return { data, error: null };
    } catch (err: any) {
      setState(s => ({ ...s, loading: false }));
      return {
        data: null,
        error: {
          message: err.message || 'Erro ao adicionar conta',
          name: 'AuthError',
          status: 500,
        },
      };
    }
  }, []);

  const switchAccount = useCallback(
    async (accountId: string) => {
      const creds = await getCredentials(accountId);
      if (!creds) {
        removeAccount(accountId);
        return;
      }

      try {
        setState(s => ({ ...s, loading: true }));
        await supabase.auth.signOut({ scope: 'local' });
        await new Promise(r => setTimeout(r, 100));

        const { error } = await supabase.auth.signInWithPassword({
          email: creds.email,
          password: creds.password,
        });

        if (error) {
          setState(s => ({ ...s, loading: false }));
          if (error.message?.includes('Invalid')) {
            removeAccount(accountId);
          }
        }
      } catch (err) {
        console.error('Switch error:', err);
        setState(s => ({ ...s, loading: false }));
      }
    },
    [getCredentials]
  );

  const removeAccount = useCallback(
    (accountId: string) => {
      const accounts = loadAccounts().filter(a => a.id !== accountId);
      saveAccounts(accounts);
      removeCredentials(accountId);
      setState(s => ({ ...s, accounts }));
    },
    [loadAccounts, saveAccounts, removeCredentials]
  );

  const clearAllData = useCallback(() => {
    // Clear all app data
    clearAllAppData();
    clearEncryptionKey();
    dataCache.clear();

    setState({
      user: null,
      profile: null,
      session: null,
      loading: false,
      initialized: true,
      accounts: [],
    });

    analyticsStorage.trackEvent('all_data_cleared');
  }, []);

  const updateProfile = useCallback(
    async (data: ProfileUpdateData): Promise<{ error: any }> => {
      if (!state.profile?.id) {
        return { error: { message: 'Usuário não autenticado' } };
      }

      try {
        const { data: updatedProfile, error } = await supabase
          .from('profiles')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', state.profile.id)
          .select()
          .single();

        if (error) return { error };

        setState(s => ({ ...s, profile: updatedProfile }));

        // Update saved accounts
        if (updatedProfile) {
          const accs = loadAccounts();
          const idx = accs.findIndex(a => a.id === updatedProfile.id);
          if (idx >= 0) {
            accs[idx] = {
              id: updatedProfile.id,
              email: updatedProfile.email,
              name: updatedProfile.name,
              type: updatedProfile.type,
              avatar_url: updatedProfile.avatar_url,
            };
            saveAccounts(accs);
            setState(s => ({ ...s, accounts: accs }));
          }
        }

        return { error: null };
      } catch (err: any) {
        return { error: { message: err.message || 'Erro ao atualizar perfil' } };
      }
    },
    [state.profile?.id, loadAccounts, saveAccounts]
  );

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!state.user?.id || !state.session) return;
    const profile = await fetchProfile(state.user.id, state.session);
    if (profile && mountedRef.current) {
      setState(s => ({ ...s, profile }));
    }
  }, [state.user?.id, state.session, fetchProfile]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue = useMemo(
    () => ({
      ...state,
      signUp,
      signIn,
      signOut,
      addAccount,
      switchAccount,
      removeAccount,
      clearAllData,
      updateProfile,
      refreshProfile,
      refreshSession,
    }),
    [
      state,
      signUp,
      signIn,
      signOut,
      addAccount,
      switchAccount,
      removeAccount,
      clearAllData,
      updateProfile,
      refreshProfile,
      refreshSession,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
