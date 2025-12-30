/**
 * Preload critical data on app initialization
 * This ensures instant page loads by caching data upfront
 */

import { supabase } from './supabase';
import { dataCache, CACHE_KEYS, createCacheOptions } from './dataCache';

// Preload all public data (products, courses, stores)
export async function preloadPublicData(): Promise<void> {
  const promises = [
    // Products - shop module
    dataCache.fetchOnce(
      CACHE_KEYS.PRODUCTS,
      async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(100);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.PRODUCTS)
    ),

    // Courses - class module
    dataCache.fetchOnce(
      CACHE_KEYS.COURSES,
      async () => {
        const { data } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.COURSES)
    ),

    // Stores - shop module
    dataCache.fetchOnce(
      CACHE_KEYS.STORES,
      async () => {
        const { data } = await supabase.from('stores').select('*').eq('status', 'active').limit(20);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.STORES)
    ),

    // Posts - social module
    dataCache.fetchOnce(
      CACHE_KEYS.POSTS,
      async () => {
        const { data } = await supabase
          .from('posts')
          .select(
            `
          *,
          profiles (name, avatar_url, type),
          post_likes (user_id)
        `
          )
          .order('created_at', { ascending: false })
          .limit(50);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.POSTS)
    ),
  ];

  await Promise.allSettled(promises);
}

// Preload user-specific data after login
export async function preloadUserData(userId: string): Promise<void> {
  const promises = [
    // User's cart - shop module
    dataCache.fetchOnce(
      CACHE_KEYS.CART(userId),
      async () => {
        const { data } = await supabase
          .from('cart_items')
          .select(
            `
          id, product_id, quantity,
          products:product_id (id, name, price, image, category, stock, store_id)
        `
          )
          .eq('user_id', userId);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.CART(userId))
    ),

    // User's favorites - user module
    dataCache.fetchOnce(
      CACHE_KEYS.FAVORITES(userId),
      async () => {
        const { data } = await supabase
          .from('favorites')
          .select(
            `
          id, product_id, created_at,
          products:product_id (id, name, price, image, category, rating, store_id)
        `
          )
          .eq('user_id', userId);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.FAVORITES(userId))
    ),

    // User's products (if seller) - shop module
    dataCache.fetchOnce(
      CACHE_KEYS.PRODUCTS_BY_USER(userId),
      async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('created_by', userId)
          .order('created_at', { ascending: false });
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.PRODUCTS_BY_USER(userId))
    ),

    // User's projects - work module
    dataCache.fetchOnce(
      CACHE_KEYS.PROJECTS_BY_USER(userId),
      async () => {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false });
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.PROJECTS_BY_USER(userId))
    ),

    // User's tasks - work module
    dataCache.fetchOnce(
      CACHE_KEYS.TASKS_BY_USER(userId),
      async () => {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.TASKS_BY_USER(userId))
    ),

    // User's store - shop module
    dataCache.fetchOnce(
      CACHE_KEYS.STORE_BY_USER(userId),
      async () => {
        const { data } = await supabase
          .from('stores')
          .select('*')
          .eq('owner_id', userId)
          .maybeSingle();
        return data;
      },
      createCacheOptions(CACHE_KEYS.STORE_BY_USER(userId))
    ),

    // AI conversations - ai module
    dataCache.fetchOnce(
      CACHE_KEYS.AI_CONVERSATIONS(userId),
      async () => {
        const { data } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(20);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.AI_CONVERSATIONS(userId))
    ),

    // AI suggestions - ai module
    dataCache.fetchOnce(
      CACHE_KEYS.AI_SUGGESTIONS(userId),
      async () => {
        const { data } = await supabase
          .from('ai_suggestions')
          .select('*')
          .eq('user_id', userId)
          .eq('is_dismissed', false)
          .order('priority', { ascending: false })
          .limit(10);
        return data || [];
      },
      createCacheOptions(CACHE_KEYS.AI_SUGGESTIONS(userId))
    ),
  ];

  await Promise.allSettled(promises);
}

// Clear user data on logout - uses module-based invalidation
export function clearUserData(userId: string): void {
  // Use the new invalidateUser method for comprehensive cleanup
  dataCache.invalidateUser(userId);
}
