import { validateFunction } from '../../utils/validators';

/**
 * Options for memoization.
 */
export interface MemoizeOptions<T extends unknown[]> {
  keyGenerator?: (...args: T) => string;
  maxSize?: number;
}

/**
 * Memoizes a function, caching results for same inputs.
 * 
 * @param fn - Function to memoize
 * @param options - Memoization options
 * @returns Memoized function
 * @throws {ValidationError} When fn is not a function
 * 
 * @example
 * ```typescript
 * const expensive = (n: number): number => {
 *   console.log('Computing...');
 *   return n * n;
 * };
 * const memoized = memoize(expensive);
 * memoized(5); // Logs "Computing...", returns 25
 * memoized(5); // Returns 25 from cache
 * ```
 * 
 * @complexity O(1) - Constant time for cache hits
 * @since 1.0.0
 */
export function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  options: MemoizeOptions<T> = {}
): ((...args: T) => R) & { cache: Map<string, R>; clear: () => void } {
  validateFunction(fn, 'fn');

  const {
    keyGenerator = (...args: T) => JSON.stringify(args),
    maxSize = Infinity
  } = options;

  const cache = new Map<string, R>();

  const memoized = (...args: T): R => {
    let key: string;
    try {
      key = keyGenerator(...args);
    } catch (error) {
      // If key generation fails (e.g., circular reference in JSON.stringify),
      // execute function without caching
      return fn(...args);
    }

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);

    // Handle async functions (Promises) specially
    if (result instanceof Promise) {
      // For promises, handle rejection by removing from cache
      const promiseResult = result as unknown as Promise<unknown>;
      promiseResult.catch(() => {
        // Remove from cache if promise rejects
        cache.delete(key);
      });
    }

    if (cache.size >= maxSize) {
      // Remove the first (oldest) entry
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}