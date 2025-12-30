/**
 * Global Data Cache System
 * Provides instant data loading with background refresh
 * Supports module-based invalidation and configurable TTL
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
  module?: CacheModule;
};

type CacheListener<T> = (data: T) => void;

/**
 * Cache modules for intelligent invalidation
 * Each module groups related cache keys together
 */
export type CacheModule = 'shop' | 'class' | 'social' | 'work' | 'ai' | 'user' | 'global';

/**
 * Cache configuration options
 */
interface CacheOptions {
  ttl?: number;
  module?: CacheModule;
}

/**
 * Cache statistics for monitoring
 */
interface CacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  entriesByModule: Record<CacheModule | 'unassigned', number>;
  hitRate: number;
  missRate: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private listeners = new Map<string, Set<CacheListener<unknown>>>();
  private pendingFetches = new Map<string, Promise<unknown>>();
  private moduleKeyMap = new Map<CacheModule, Set<string>>();

  // Cache hit/miss tracking
  private hits = 0;
  private misses = 0;

  // Default TTL: 5 minutes (300,000ms)
  private readonly DEFAULT_TTL = 5 * 60 * 1000;

  // Module-specific TTLs (can be customized per module)
  private readonly MODULE_TTL: Record<CacheModule, number> = {
    shop: 5 * 60 * 1000, // 5 minutes - products change occasionally
    class: 10 * 60 * 1000, // 10 minutes - courses are more stable
    social: 2 * 60 * 1000, // 2 minutes - social content updates frequently
    work: 5 * 60 * 1000, // 5 minutes - services change occasionally
    ai: 15 * 60 * 1000, // 15 minutes - AI suggestions are stable
    user: 5 * 60 * 1000, // 5 minutes - user data
    global: 5 * 60 * 1000, // 5 minutes - default for global data
  };

  constructor() {
    // Initialize module key sets
    const modules: CacheModule[] = ['shop', 'class', 'social', 'work', 'ai', 'user', 'global'];
    modules.forEach(module => this.moduleKeyMap.set(module, new Set()));
  }

  /**
   * Get the TTL for a specific module or use default
   */
  private getTTL(module?: CacheModule, customTTL?: number): number {
    if (customTTL !== undefined) return customTTL;
    if (module) return this.MODULE_TTL[module];
    return this.DEFAULT_TTL;
  }

  /**
   * Get cached data instantly, optionally trigger background refresh
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      this.misses++;
      return null;
    }
    this.hits++;
    return entry.data;
  }

  /**
   * Check if cache is still valid (not expired)
   */
  isValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() < entry.expiresAt;
  }

  /**
   * Check if cache exists (even if expired)
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get time remaining until cache expires (in ms)
   * Returns 0 if expired or not found
   */
  getTimeToExpiry(key: string): number {
    const entry = this.cache.get(key);
    if (!entry) return 0;
    const remaining = entry.expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Set cache data with optional module association
   */
  set<T>(key: string, data: T, options: CacheOptions | number = {}): void {
    // Support legacy signature: set(key, data, ttl)
    const opts: CacheOptions = typeof options === 'number' ? { ttl: options } : options;

    const ttl = this.getTTL(opts.module, opts.ttl);

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      module: opts.module,
    };

    this.cache.set(key, entry as CacheEntry<unknown>);

    // Track key in module map for invalidation
    if (opts.module) {
      this.moduleKeyMap.get(opts.module)?.add(key);
    }

    this.notifyListeners(key, data);
  }

  /**
   * Update cache data partially (for arrays, merge; for objects, shallow merge)
   */
  update<T>(key: string, updater: (current: T | null) => T, options?: CacheOptions): void {
    const current = this.get<T>(key);
    const updated = updater(current);
    this.set(key, updated, options);
  }

  /**
   * Remove from cache
   */
  remove(key: string): void {
    const entry = this.cache.get(key);
    if (entry?.module) {
      this.moduleKeyMap.get(entry.module)?.delete(key);
    }
    this.cache.delete(key);
    this.pendingFetches.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingFetches.clear();
    this.moduleKeyMap.forEach(set => set.clear());
    this.resetStats();
  }

  /**
   * Invalidate all cache entries for a specific module
   * This is useful when a module's data changes and all related cache should be refreshed
   */
  invalidateModule(module: CacheModule): void {
    const keys = this.moduleKeyMap.get(module);
    if (!keys) return;

    keys.forEach(key => {
      this.cache.delete(key);
      this.pendingFetches.delete(key);
    });
    keys.clear();
  }

  /**
   * Invalidate cache entries matching a pattern
   * Useful for invalidating related keys (e.g., all user-specific data)
   */
  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    this.cache.forEach((entry, key) => {
      if (regex.test(key)) {
        if (entry.module) {
          this.moduleKeyMap.get(entry.module)?.delete(key);
        }
        this.cache.delete(key);
        this.pendingFetches.delete(key);
      }
    });
  }

  /**
   * Invalidate all cache entries for a specific user
   * Useful when user logs out or switches accounts
   */
  invalidateUser(userId: string): void {
    this.invalidatePattern(new RegExp(`[:_]${userId}($|:)`));
  }

  /**
   * Remove all expired entries from cache
   * Can be called periodically to free memory
   */
  pruneExpired(): number {
    const now = Date.now();
    let pruned = 0;

    this.cache.forEach((entry, key) => {
      if (now >= entry.expiresAt) {
        if (entry.module) {
          this.moduleKeyMap.get(entry.module)?.delete(key);
        }
        this.cache.delete(key);
        pruned++;
      }
    });

    return pruned;
  }

  /**
   * Subscribe to cache changes
   */
  subscribe<T>(key: string, listener: CacheListener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener as CacheListener<unknown>);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(listener as CacheListener<unknown>);
    };
  }

  /**
   * Notify all listeners of a cache update
   */
  private notifyListeners<T>(key: string, data: T): void {
    this.listeners.get(key)?.forEach(listener => {
      try {
        listener(data);
      } catch {
        // Silently handle listener errors in production
      }
    });
  }

  /**
   * Fetch with deduplication - prevents multiple simultaneous fetches for same key
   */
  async fetchOnce<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions | number = {}
  ): Promise<T> {
    // If there's already a pending fetch, wait for it
    const pending = this.pendingFetches.get(key);
    if (pending) {
      return pending as Promise<T>;
    }

    // Support legacy signature
    const opts: CacheOptions = typeof options === 'number' ? { ttl: options } : options;

    // Start new fetch
    const fetchPromise = fetcher()
      .then(data => {
        this.set(key, data, opts);
        this.pendingFetches.delete(key);
        return data;
      })
      .catch(err => {
        this.pendingFetches.delete(key);
        throw err;
      });

    this.pendingFetches.set(key, fetchPromise);
    return fetchPromise;
  }

  /**
   * Get data with stale-while-revalidate pattern
   * Returns cached data immediately, refreshes in background if stale
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; forceRefresh?: boolean; module?: CacheModule } = {}
  ): Promise<T> {
    const { forceRefresh = false, ...cacheOpts } = options;

    const cached = this.get<T>(key);
    const isValid = this.isValid(key);

    // If we have valid cache and not forcing refresh, return immediately
    if (cached !== null && isValid && !forceRefresh) {
      return cached;
    }

    // If we have stale cache, return it but refresh in background
    if (cached !== null && !forceRefresh) {
      this.fetchOnce(key, fetcher, cacheOpts).catch(() => {
        // Silently handle background refresh errors
      });
      return cached;
    }

    // No cache, must fetch
    return this.fetchOnce(key, fetcher, cacheOpts);
  }

  /**
   * Get cache statistics for monitoring and debugging
   */
  getStats(): CacheStats {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    const entriesByModule: Record<CacheModule | 'unassigned', number> = {
      shop: 0,
      class: 0,
      social: 0,
      work: 0,
      ai: 0,
      user: 0,
      global: 0,
      unassigned: 0,
    };

    this.cache.forEach(entry => {
      if (now < entry.expiresAt) {
        validEntries++;
      } else {
        expiredEntries++;
      }

      const module = entry.module || 'unassigned';
      entriesByModule[module]++;
    });

    const totalRequests = this.hits + this.misses;

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      entriesByModule,
      hitRate: totalRequests > 0 ? this.hits / totalRequests : 0,
      missRate: totalRequests > 0 ? this.misses / totalRequests : 0,
    };
  }

  /**
   * Reset hit/miss statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get the default TTL value (5 minutes)
   */
  getDefaultTTL(): number {
    return this.DEFAULT_TTL;
  }

  /**
   * Get the TTL for a specific module
   */
  getModuleTTL(module: CacheModule): number {
    return this.MODULE_TTL[module];
  }
}

// Singleton instance
export const dataCache = new DataCache();

/**
 * Cache key generators organized by module
 * Each key function returns a string that can be used with dataCache methods
 */
export const CACHE_KEYS = {
  // Shop module keys
  PRODUCTS: 'shop:products',
  PRODUCTS_BY_USER: (userId: string) => `shop:products:user:${userId}`,
  PRODUCT: (id: string) => `shop:product:${id}`,
  CART: (userId: string) => `shop:cart:${userId}`,
  STORES: 'shop:stores',
  STORE_BY_USER: (userId: string) => `shop:store:user:${userId}`,

  // Class module keys
  COURSES: 'class:courses',
  COURSES_BY_USER: (userId: string) => `class:courses:user:${userId}`,

  // Social module keys
  POSTS: 'social:posts',
  POSTS_BY_USER: (userId: string) => `social:posts:user:${userId}`,

  // Work module keys
  PROJECTS: 'work:projects',
  PROJECTS_BY_USER: (userId: string) => `work:projects:user:${userId}`,
  TASKS: 'work:tasks',
  TASKS_BY_USER: (userId: string) => `work:tasks:user:${userId}`,

  // User module keys
  FAVORITES: (userId: string) => `user:favorites:${userId}`,
  USER_STATS: (userId: string) => `user:stats:${userId}`,

  // AI module keys
  AI_CONVERSATIONS: (userId: string) => `ai:conversations:${userId}`,
  AI_SUGGESTIONS: (userId: string) => `ai:suggestions:${userId}`,
} as const;

/**
 * Helper to get the module from a cache key
 * Returns the module prefix or undefined if not found
 */
export function getModuleFromKey(key: string): CacheModule | undefined {
  const prefix = key.split(':')[0];
  const validModules: CacheModule[] = ['shop', 'class', 'social', 'work', 'ai', 'user', 'global'];
  return validModules.includes(prefix as CacheModule) ? (prefix as CacheModule) : undefined;
}

/**
 * Helper to create cache options with module auto-detection
 */
export function createCacheOptions(key: string, customTTL?: number): CacheOptions {
  const module = getModuleFromKey(key);
  return {
    module,
    ttl: customTTL,
  };
}
