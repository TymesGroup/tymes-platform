import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Custom storage com cookies persistentes e seguros
const customStorage = {
  getItem: (key: string): string | null => {
    // Primeiro tenta localStorage
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;

    // Fallback para cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.trim().split('=');
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  },

  setItem: (key: string, value: string): void => {
    // Salva no localStorage
    localStorage.setItem(key, value);

    // Também salva em cookie persistente (30 dias)
    const maxAge = 30 * 24 * 60 * 60; // 30 dias em segundos
    const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
    const sameSite = 'SameSite=Lax;'; // Lax permite navegação normal, Strict bloqueia links externos

    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; ${secure} ${sameSite}`;
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
    // Remove o cookie setando max-age=0
    document.cookie = `${key}=; path=/; max-age=0;`;
  },
};

// Configuração de persistência de preferências do usuário
const PREFERENCES_KEY = 'tymes_user_preferences';

export const userPreferences = {
  get: (): Record<string, unknown> => {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  set: (key: string, value: unknown): void => {
    const prefs = userPreferences.get();
    prefs[key] = value;
    prefs._updatedAt = new Date().toISOString();

    // Salva no localStorage
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));

    // Também persiste em cookie (90 dias para preferências)
    const maxAge = 90 * 24 * 60 * 60;
    const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
    document.cookie = `${PREFERENCES_KEY}=${encodeURIComponent(JSON.stringify(prefs))}; path=/; max-age=${maxAge}; ${secure} SameSite=Lax;`;
  },

  remove: (key: string): void => {
    const prefs = userPreferences.get();
    delete prefs[key];
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  },

  clear: (): void => {
    localStorage.removeItem(PREFERENCES_KEY);
    document.cookie = `${PREFERENCES_KEY}=; path=/; max-age=0;`;
  },
};

// Analytics/tracking configuration (respecting privacy)
const ANALYTICS_KEY = 'tymes_analytics';

interface AnalyticsEvent {
  event: string;
  data?: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
}

export const analyticsStorage = {
  trackEvent: (event: string, data?: Record<string, unknown>): void => {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];

      events.push({
        event,
        data,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
      });

      // Keep only the last 100 events
      const trimmed = events.slice(-100);
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Analytics storage error:', e);
    }
  },

  getEvents: (): AnalyticsEvent[] => {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  clear: (): void => {
    localStorage.removeItem(ANALYTICS_KEY);
  },
};

// Generate or retrieve a unique session ID
function getSessionId(): string {
  const SESSION_ID_KEY = 'tymes_session_id';
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

// Token CSRF para segurança adicional
const CSRF_KEY = 'tymes_csrf_token';

export const csrfToken = {
  generate: (): string => {
    const token = `csrf_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(CSRF_KEY, token);
    return token;
  },

  get: (): string | null => {
    return sessionStorage.getItem(CSRF_KEY);
  },

  validate: (token: string): boolean => {
    const stored = sessionStorage.getItem(CSRF_KEY);
    return stored === token;
  },

  refresh: (): string => {
    return csrfToken.generate();
  },
};

// Inicializa CSRF token na carga
if (typeof window !== 'undefined' && !csrfToken.get()) {
  csrfToken.generate();
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: customStorage,
    storageKey: 'tymes-auth-token',
    // Configurações de fluxo
    flowType: 'pkce', // Mais seguro que implicit
  },
  global: {
    headers: {
      'x-client-info': 'tymes-platform',
    },
  },
});

// Listener para refresh automático de sessão
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 Token refreshed automatically');
  }

  if (event === 'SIGNED_IN' && session) {
    // Registra evento de login para analytics
    analyticsStorage.trackEvent('user_signed_in', {
      userId: session.user.id,
      method: session.user.app_metadata?.provider || 'email',
    });
  }

  if (event === 'SIGNED_OUT') {
    analyticsStorage.trackEvent('user_signed_out');
  }
});
