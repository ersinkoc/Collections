import { validateFunction, validateNonNegativeInteger } from '../../utils/validators';

/**
 * Throttles a function call, ensuring it's called at most once per interval.
 * 
 * @param fn - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 * @throws {ValidationError} When fn is not a function
 * @throws {RangeError} When limit is not a non-negative integer
 * 
 * @example
 * ```typescript
 * const scroll = (event: Event) => console.log('Scrolling');
 * const throttledScroll = throttle(scroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function throttle<T extends unknown[], R>(
  fn: (...args: T) => R,
  limit: number
): ((...args: T) => void) & { cancel: () => void } {
  validateFunction(fn, 'fn');
  validateNonNegativeInteger(limit, 'limit');

  let inThrottle = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttledFn = (...args: T): void => {
    if (!inThrottle) {
      try {
        fn(...args);
      } catch (error) {
        // Reset throttle state on error to allow retry
        inThrottle = false;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        throw error;
      }
      inThrottle = true;
      timeoutId = setTimeout(() => {
        inThrottle = false;
        timeoutId = null;
      }, limit);
    }
  };

  // Cancel throttle and reset state
  throttledFn.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    inThrottle = false;
  };

  return throttledFn;
}