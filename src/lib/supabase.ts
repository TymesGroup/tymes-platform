import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// ============================================================================
// STORAGE CONFIGURATION - Unified and Consistent
// ============================================================================

const AUTH_STORAGE_KEY = 'tymes-auth-token';
const SESSION_VERSION_KEY = 'tymes-session-version';

/**
 * Generate a unique session version to detect stale sessions across tabs
 */
function generateSessionVersion(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Unified storage that uses localStorage as primary with cross-tab sync
 * Cookies are NOT used for auth tokens (security best practice for SPAs)
 */
const unifiedStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
      // Update session version to notify other tabs
      localStorage.setItem(SESSION_VERSION_KEY, generateSessionVersion());
    } catch (e) {
      console.warn('Storage setItem failed:', e);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
      // Update session version to notify other tabs
      localStorage.setItem(SESSION_VERSION_KEY, generateSessionVersion());
    } catch (e) {
      console.warn('Storage removeItem failed:', e);
    }
  },
};

// ============================================================================
// SUPABASE CLIENT - Optimized Configuration
// ============================================================================

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: unifiedStorage,
      storageKey: AUTH_STORAGE_KEY,
      flowType: 'pkce',
      // Debug mode only in development
      debug: import.meta.env.DEV,
    },
    global: {
      headers: {
        'x-client-info': 'tymes-platform',
      },
    },
    // Realtime configuration for better connection handling
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// ============================================================================
// CROSS-TAB SESSION SYNCHRONIZATION
// ============================================================================

/**
 * Listen for storage changes from other tabs
 * This ensures all tabs stay in sync with auth state
 */
if (typeof window !== 'undefined') {
  let lastKnownVersion = localStorage.getItem(SESSION_VERSION_KEY);

  window.addEventListener('storage', async event => {
    // Only react to session version changes
    if (event.key === SESSION_VERSION_KEY && event.newValue !== lastKnownVersion) {
      lastKnownVersion = event.newValue;

      // Check if session was cleared (logout in another tab)
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!authData) {
        // Session was cleared - force refresh to sync state
        console.log('🔄 Session cleared in another tab, syncing...');
        await supabase.auth.signOut({ scope: 'local' });
        window.location.reload();
      } else {
        // Session was updated - refresh to get new session
        console.log('🔄 Session updated in another tab, refreshing...');
        await supabase.auth.refreshSession();
      }
    }
  });

  // Handle visibility change - refresh session when tab becomes visible
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // Check if token needs refresh (within 5 minutes of expiry)
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
        const fiveMinutes = 5 * 60 * 1000;

        if (expiresAt - Date.now() < fiveMinutes) {
          console.log('🔄 Token expiring soon, refreshing...');
          await supabase.auth.refreshSession();
        }
      }
    }
  });
}

// ============================================================================
// USER PREFERENCES - Persistent Settings (NOT auth-related)
// ============================================================================

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
    try {
      const prefs = userPreferences.get();
      prefs[key] = value;
      prefs._updatedAt = new Date().toISOString();
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save preference:', e);
    }
  },

  remove: (key: string): void => {
    try {
      const prefs = userPreferences.get();
      delete prefs[key];
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch {}
  },

  clear: (): void => {
    try {
      localStorage.removeItem(PREFERENCES_KEY);
    } catch {}
  },
};

// ============================================================================
// ANALYTICS STORAGE - Local Event Tracking
// ============================================================================

const ANALYTICS_KEY = 'tymes_analytics';

interface AnalyticsEvent {
  event: string;
  data?: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
}

// Session ID for analytics (not auth-related)
function getAnalyticsSessionId(): string {
  const SESSION_ID_KEY = 'tymes_analytics_session';
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
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
        sessionId: getAnalyticsSessionId(),
      });

      // Keep only the last 100 events
      const trimmed = events.slice(-100);
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
    } catch (e) {
      // Silent fail for analytics
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
    try {
      localStorage.removeItem(ANALYTICS_KEY);
    } catch {}
  },
};

// ============================================================================
// CSRF TOKEN - For Form Security
// ============================================================================

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

// Initialize CSRF token on load
if (typeof window !== 'undefined' && !csrfToken.get()) {
  csrfToken.generate();
}

// ============================================================================
// CLEANUP UTILITIES
// ============================================================================

/**
 * Clear all application data (for logout or data reset)
 */
export function clearAllAppData(): void {
  // Clear localStorage items
  const keysToRemove = [
    AUTH_STORAGE_KEY,
    SESSION_VERSION_KEY,
    PREFERENCES_KEY,
    ANALYTICS_KEY,
    'tymes_last_activity',
    'tymes_saved_accounts',
    'tymes_saved_credentials',
  ];

  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch {}
  });

  // Clear any sb- prefixed items (Supabase internal)
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-') || key.startsWith('tymes-')) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  });

  // Clear sessionStorage
  sessionStorage.clear();
}

/**
 * Check if there's a valid session stored
 */
export function hasStoredSession(): boolean {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return false;

    const parsed = JSON.parse(authData);
    return !!(parsed?.access_token && parsed?.refresh_token);
  } catch {
    return false;
  }
}
