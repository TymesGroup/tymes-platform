import { useEffect, useState, useCallback } from 'react';
import { userPreferences, analyticsStorage, csrfToken } from './supabase';

/**
 * Hook para gerenciar preferências do usuário com persistência
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<Record<string, unknown>>(() =>
    userPreferences.get()
  );

  const updatePreference = useCallback((key: string, value: unknown) => {
    userPreferences.set(key, value);
    setPreferences(userPreferences.get());
  }, []);

  const removePreference = useCallback((key: string) => {
    userPreferences.remove(key);
    setPreferences(userPreferences.get());
  }, []);

  const clearPreferences = useCallback(() => {
    userPreferences.clear();
    setPreferences({});
  }, []);

  return {
    preferences,
    updatePreference,
    removePreference,
    clearPreferences,
    // Helpers comuns
    theme: preferences.theme || 'system',
    setTheme: (theme: 'light' | 'dark' | 'system') => updatePreference('theme', theme),
    language: preferences.language || 'pt-BR',
    setLanguage: (lang: string) => updatePreference('language', lang),
    lastLoginEmail: preferences.lastLoginEmail || '',
  };
}

/**
 * Hook para tracking de analytics
 */
export function useAnalytics() {
  const trackEvent = useCallback((event: string, data?: Record<string, any>) => {
    analyticsStorage.trackEvent(event, data);
  }, []);

  const trackPageView = useCallback((page: string) => {
    analyticsStorage.trackEvent('page_view', { page, timestamp: new Date().toISOString() });
  }, []);

  const trackClick = useCallback((element: string, context?: string) => {
    analyticsStorage.trackEvent('click', { element, context });
  }, []);

  const trackError = useCallback((error: string, context?: Record<string, any>) => {
    analyticsStorage.trackEvent('error', { error, ...context });
  }, []);

  const getEvents = useCallback(() => {
    return analyticsStorage.getEvents();
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackError,
    getEvents,
  };
}

/**
 * Hook para gerenciar CSRF token
 */
export function useCsrfToken() {
  const [token, setToken] = useState<string | null>(() => csrfToken.get());

  const refreshToken = useCallback(() => {
    const newToken = csrfToken.refresh();
    setToken(newToken);
    return newToken;
  }, []);

  const validateToken = useCallback((tokenToValidate: string) => {
    return csrfToken.validate(tokenToValidate);
  }, []);

  return {
    token,
    refreshToken,
    validateToken,
  };
}

/**
 * Hook para monitorar atividade da sessão
 */
export function useSessionActivity() {
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  useEffect(() => {
    const INACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 minutos

    const checkActivity = () => {
      const stored = localStorage.getItem('tymes_last_activity');
      if (stored) {
        const lastTime = parseInt(stored, 10);
        const now = Date.now();
        const isStillActive = now - lastTime < INACTIVITY_THRESHOLD;
        setIsActive(isStillActive);
        setLastActivity(new Date(lastTime));
      }
    };

    // Check every minute
    const interval = setInterval(checkActivity, 60 * 1000);
    checkActivity();

    return () => clearInterval(interval);
  }, []);

  return {
    isActive,
    lastActivity,
    minutesSinceActivity: Math.floor((Date.now() - lastActivity.getTime()) / 60000),
  };
}

/**
 * Hook para persistir estado em localStorage/sessionStorage
 * Simplificado - não usa mais cookies para dados de estado
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options: {
    storage?: 'local' | 'session';
  } = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const { storage = 'local' } = options;

  const [state, setState] = useState<T>(() => {
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      const stored = storageObj.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignora erros de parsing
    }
    return defaultValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(prev => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;

        try {
          const serialized = JSON.stringify(newValue);
          const storageObj = storage === 'session' ? sessionStorage : localStorage;
          storageObj.setItem(key, serialized);
        } catch (e) {
          console.warn(`Failed to persist state for key "${key}":`, e);
        }

        return newValue;
      });
    },
    [key, storage]
  );

  // Sync with storage changes from other tabs
  useEffect(() => {
    if (storage !== 'local') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setState(JSON.parse(event.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storage]);

  return [state, setValue];
}
