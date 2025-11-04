interface CacheConfig {
  ttl?: number;
  storage?: 'localStorage' | 'sessionStorage' | 'memory';
}

class CacheManager {
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

  set(key: string, value: any, config?: CacheConfig): void {
    const ttl = config?.ttl || 3600000;
    const expiry = Date.now() + ttl;
    const storage = config?.storage || 'memory';

    const cacheData = {
      value,
      expiry,
    };

    if (storage === 'localStorage' && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(cacheData));
      } catch (error) {
        console.error('localStorage error:', error);
      }
    } else if (storage === 'sessionStorage' && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(key, JSON.stringify(cacheData));
      } catch (error) {
        console.error('sessionStorage error:', error);
      }
    } else {
      this.memoryCache.set(key, cacheData);
    }
  }

  get<T = any>(key: string, config?: CacheConfig): T | null {
    const storage = config?.storage || 'memory';
    let cacheData: { value: any; expiry: number } | null = null;

    if (storage === 'localStorage' && typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        if (item) cacheData = JSON.parse(item);
      } catch (error) {
        console.error('localStorage error:', error);
      }
    } else if (storage === 'sessionStorage' && typeof window !== 'undefined') {
      try {
        const item = sessionStorage.getItem(key);
        if (item) cacheData = JSON.parse(item);
      } catch (error) {
        console.error('sessionStorage error:', error);
      }
    } else {
      cacheData = this.memoryCache.get(key) || null;
    }

    if (!cacheData) return null;

    if (Date.now() > cacheData.expiry) {
      this.remove(key, config);
      return null;
    }

    return cacheData.value as T;
  }

  remove(key: string, config?: CacheConfig): void {
    const storage = config?.storage || 'memory';

    if (storage === 'localStorage' && typeof window !== 'undefined') {
      localStorage.removeItem(key);
    } else if (storage === 'sessionStorage' && typeof window !== 'undefined') {
      sessionStorage.removeItem(key);
    } else {
      this.memoryCache.delete(key);
    }
  }

  clear(config?: CacheConfig): void {
    const storage = config?.storage || 'memory';

    if (storage === 'localStorage' && typeof window !== 'undefined') {
      localStorage.clear();
    } else if (storage === 'sessionStorage' && typeof window !== 'undefined') {
      sessionStorage.clear();
    } else {
      this.memoryCache.clear();
    }
  }

  has(key: string, config?: CacheConfig): boolean {
    return this.get(key, config) !== null;
  }
}

export const cache = new CacheManager();

export function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  config?: CacheConfig
): Promise<T> {
  const cached = cache.get<T>(key, config);
  
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  return fetcher().then((data) => {
    cache.set(key, data, config);
    return data;
  });
}
