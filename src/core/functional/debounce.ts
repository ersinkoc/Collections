import { validateFunction, validateNonNegativeInteger } from '../../utils/validators';

/**
 * Debounces a function call, delaying execution until after delay has elapsed.
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * @throws {ValidationError} When fn is not a function
 * @throws {RangeError} When delay is not a non-negative integer
 * 
 * @example
 * ```typescript
 * const search = (query: string) => console.log('Searching for:', query);
 * const debouncedSearch = debounce(search, 300);
 * debouncedSearch('a'); // Delayed execution
 * debouncedSearch('ab'); // Cancels previous, delays this
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function debounce<T extends unknown[], R>(
  fn: (...args: T) => R,
  delay: number
): ((...args: T) => void) & { cancel: () => void; flush: () => void } {
  validateFunction(fn, 'fn');
  validateNonNegativeInteger(delay, 'delay');

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: T | null = null;

  const debouncedFn = (...args: T): void => {
    lastArgs = args;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (lastArgs !== null) {
        try {
          fn(...lastArgs);
        } finally {
          // Always clear lastArgs even if fn throws, to prevent memory leak
          lastArgs = null;
        }
      }
      timeoutId = null;
    }, delay);
  };

  // Cancel any pending execution
  debouncedFn.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  // Execute immediately with last args
  debouncedFn.flush = () => {
    if (timeoutId !== null && lastArgs !== null) {
      clearTimeout(timeoutId);
      try {
        fn(...lastArgs);
      } finally {
        // Always clear state even if fn throws, to prevent memory leak
        timeoutId = null;
        lastArgs = null;
      }
    }
  };

  return debouncedFn;
}