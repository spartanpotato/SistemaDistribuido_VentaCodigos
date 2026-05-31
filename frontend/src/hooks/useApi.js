import { useState, useEffect, useCallback, useRef } from 'react';

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useApi = (fetchFn, dependencies = [], options = {}) => {
  const { skip = false, cache: enableCache = true, retries = 2 } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);

  const getCacheKey = useCallback(() => {
    return fetchFn.toString();
  }, [fetchFn]);

  const fetchData = useCallback(async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    try {
      const cacheKey = getCacheKey();

      // Verificar cache
      if (enableCache && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      // Hacer fetch
      const result = await fetchFn();
      setData(result);

      // Guardar en cache
      if (enableCache) {
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
      }

      retryCountRef.current = 0;
    } catch (err) {
      if (retryCountRef.current < retries) {
        retryCountRef.current += 1;
        setTimeout(() => fetchData(), 1000 * Math.pow(2, retryCountRef.current));
      } else {
        setError(err.message || 'Error fetching data');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, skip, enableCache, retries, getCacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};
