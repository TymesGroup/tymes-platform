/**
 * useSessionActivity Hook
 *
 * Tracks user activity and manages session refresh
 * Updates last activity timestamp on user interactions
 */

import { useEffect, useRef, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, analyticsStorage } from '../supabase';

const SESSION_TIMEOUT_WARNING = 25 * 60 * 1000; // 25 minutes
const SESSION_ACTIVITY_INTERVAL = 5 * 60 * 1000; // 5 minutes
const LAST_ACTIVITY_KEY = 'tymes_last_activity';

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  const now = Date.now();
  localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

  // Also save in cookie for cross-tab persistence
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
  document.cookie = `${LAST_ACTIVITY_KEY}=${now}; path=/; max-age=${maxAge}; ${secure} SameSite=Lax;`;
}

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number {
  const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
  return stored ? parseInt(stored, 10) : Date.now();
}

/**
 * Clear activity data
 */
export function clearActivityData(): void {
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  document.cookie = `${LAST_ACTIVITY_KEY}=; path=/; max-age=0;`;
}

/**
 * Hook to track user activity and refresh session
 */
export function useSessionActivity(session: Session | null): void {
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track user interactions
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

  // Periodic session refresh
  useEffect(() => {
    const checkAndRefreshSession = async () => {
      if (!session) return;

      const lastActivity = getLastActivity();
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      // Refresh if there was recent activity
      if (timeSinceActivity < SESSION_TIMEOUT_WARNING) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.warn('Session refresh failed:', error.message);
          } else if (data.session) {
            analyticsStorage.trackEvent('session_refreshed');
          }
        } catch (e) {
          console.warn('Session refresh error:', e);
        }
      }
    };

    // Check every 5 minutes
    activityIntervalRef.current = setInterval(checkAndRefreshSession, SESSION_ACTIVITY_INTERVAL);

    // Also check when tab becomes visible
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
  }, [session]);
}

export default useSessionActivity;
