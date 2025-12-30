import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, userPreferences, analyticsStorage } from './supabase';
import { preloadPublicData, preloadUserData, clearUserData } from './preloadData';
import { encryptValue, decryptValue, clearEncryptionKey } from './crypto';
import type { Tables } from './database.types';

export type Profile = Tables<'profiles'>;

// Session time constants
const SESSION_TIMEOUT_WARNING = 25 * 60 * 1000; // 25 minutes - warning before expiration
const SESSION_ACTIVITY_INTERVAL = 5 * 60 * 1000; // 5 minutes - activity check interval
const LAST_ACTIVITY_KEY = 'tymes_last_activity';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCOUNTS_KEY = 'tymes_saved_accounts';
const CREDENTIALS_KEY = 'tymes_saved_credentials';

// Function to update last activity
const updateLastActivity = () => {
  const now = Date.now();
  localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

  // Também salva em cookie para persistência cross-tab
  const maxAge = 30 * 24 * 60 * 60; // 30 dias
  const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
  document.cookie = `${LAST_ACTIVITY_KEY}=${now}; path=/; max-age=${maxAge}; ${secure} SameSite=Lax;`;
};

// Function to get last activity
const getLastActivity = (): number => {
  const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
  return stored ? parseInt(stored, 10) : Date.now();
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    accounts: [],
  });

  const pendingPwdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update activity on user interactions
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      updateLastActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Check and refresh session periodically
  useEffect(() => {
    const checkAndRefreshSession = async () => {
      if (!state.session) return;

      const lastActivity = getLastActivity();
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      // Se houve atividade recente, tenta renovar o token
      if (timeSinceActivity < SESSION_TIMEOUT_WARNING) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.warn('Session refresh failed:', error.message);
          } else if (data.session) {
            console.log('🔄 Session refreshed successfully');
            analyticsStorage.trackEvent('session_refreshed');
          }
        } catch (e) {
          console.warn('Session refresh error:', e);
        }
      }
    };

    // Check every 5 minutes
    activityIntervalRef.current = setInterval(checkAndRefreshSession, SESSION_ACTIVITY_INTERVAL);

    // Também verifica quando a aba volta a ficar visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndRefreshSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.session]);

  // Load accounts from storage
  const loadAccounts = useCallback((): StoredAccount[] => {
    try {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  // Save accounts to storage
  const saveAccounts = useCallback((accounts: StoredAccount[]) => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }, []);

  // Save credentials (async with encryption)
  const saveCredentials = useCallback(async (id: string, email: string, password: string) => {
    try {
      const data = localStorage.getItem(CREDENTIALS_KEY);
      const creds = data ? JSON.parse(data) : {};
      const encryptedPwd = await encryptValue(password);
      creds[id] = { email, pwd: encryptedPwd };
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch (e) {
      // Silent fail - credentials won't be saved but app continues
    }
  }, []);

  // Get credentials (async with decryption)
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

  // Remove credentials
  const removeCredentials = useCallback((id: string) => {
    try {
      const data = localStorage.getItem(CREDENTIALS_KEY);
      if (!data) return;
      const creds = JSON.parse(data);
      delete creds[id];
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch {}
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    localStorage.removeItem(ACCOUNTS_KEY);
    localStorage.removeItem(CREDENTIALS_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    localStorage.removeItem('tymes_user_preferences');
    localStorage.removeItem('tymes_analytics');

    // Clear encryption key from session storage
    clearEncryptionKey();

    // Clear all Supabase items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.startsWith('tymes-')) {
        localStorage.removeItem(key);
      }
    });

    // Clear related cookies
    const cookiesToClear = [
      'tymes-auth-token',
      LAST_ACTIVITY_KEY,
      'tymes_user_preferences',
      'tymes_session_id',
    ];

    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; path=/; max-age=0;`;
    });

    // Clear sessionStorage
    sessionStorage.clear();

    setState({ user: null, profile: null, session: null, loading: false, accounts: [] });

    analyticsStorage.trackEvent('all_data_cleared');
  }, []);

  // Fetch profile from Supabase (always fresh data)
  const fetchProfile = useCallback(
    async (userId: string, session: Session) => {
      // Always fetch fresh data from Supabase
      let profile = null;
      for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (data) {
          profile = data;
          break;
        }
        if (error) console.error('Profile fetch error:', error);
        await new Promise(r => setTimeout(r, 500));
      }

      if (!mountedRef.current) return;

      setState(s => ({ ...s, user: session.user, profile, session, loading: false }));

      // Update saved accounts with fresh data
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

  // Initialize auth state
  useEffect(() => {
    mountedRef.current = true;

    // Load saved accounts
    const accounts = loadAccounts();
    setState(s => ({ ...s, accounts }));

    // Preload public data immediately for instant page loads
    preloadPublicData().catch(console.error);

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mountedRef.current) {
        setState(s => (s.loading ? { ...s, loading: false } : s));
      }
    }, 5000);

    // Get current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mountedRef.current) return;
      if (error) {
        console.error('Session error:', error);
        setState(s => ({ ...s, loading: false }));
        return;
      }
      if (session?.user) {
        // Preload user data for instant page loads
        preloadUserData(session.user.id).catch(console.error);
        fetchProfile(session.user.id, session);
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      if (event === 'SIGNED_OUT') {
        // Clear user-specific cache on logout
        if (state.user?.id) {
          clearUserData(state.user.id);
        }
        setState(s => ({ ...s, user: null, profile: null, session: null, loading: false }));
        return;
      }

      if (session?.user) {
        // Preload user data on login
        preloadUserData(session.user.id).catch(console.error);
        await fetchProfile(session.user.id, session);
      }
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [loadAccounts, fetchProfile]);

  // Sign up
  async function signUp(
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
  ) {
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
      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err.message || 'Erro ao criar conta', name: 'AuthError', status: 500 },
      };
    }
  }

  // Sign in
  async function signIn(email: string, password: string) {
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

      // Save "remember me" preference implicitly
      userPreferences.set('rememberLogin', true);
      userPreferences.set('lastLoginEmail', email);

      analyticsStorage.trackEvent('login_success', { method: 'email' });

      return { data, error: null };
    } catch (err: any) {
      setState(s => ({ ...s, loading: false }));
      return {
        data: null,
        error: { message: err.message || 'Erro ao fazer login', name: 'AuthError', status: 500 },
      };
    }
  }

  // Sign out
  async function signOut() {
    analyticsStorage.trackEvent('logout_initiated');
    const { error } = await supabase.auth.signOut();

    // Clear session data but keep preferences
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    document.cookie = `${LAST_ACTIVITY_KEY}=; path=/; max-age=0;`;

    return { error };
  }

  // Add another account
  async function addAccount(email: string, password: string) {
    try {
      setState(s => ({ ...s, loading: true }));
      await supabase.auth.signOut();
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
  }

  // Switch account
  async function switchAccount(accountId: string) {
    const creds = await getCredentials(accountId);
    if (!creds) {
      removeAccount(accountId);
      return;
    }

    try {
      setState(s => ({ ...s, loading: true }));
      await supabase.auth.signOut();
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
  }

  // Remove account
  function removeAccount(accountId: string) {
    const accounts = loadAccounts().filter(a => a.id !== accountId);
    saveAccounts(accounts);
    removeCredentials(accountId);
    setState(s => ({ ...s, accounts }));
  }

  // Update profile - saves to Supabase and updates local state
  async function updateProfile(data: ProfileUpdateData): Promise<{ error: any }> {
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

      if (error) {
        return { error };
      }

      // Update local state immediately
      setState(s => ({ ...s, profile: updatedProfile }));

      // Update saved accounts list
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
  }

  // Refresh profile from database
  async function refreshProfile(): Promise<void> {
    if (!state.user?.id || !state.session) return;
    await fetchProfile(state.user.id, state.session);
  }

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
