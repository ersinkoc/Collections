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
): (...args: T) => void {
  validateFunction(fn, 'fn');
  validateNonNegativeInteger(limit, 'limit');

  let inThrottle = false;

  return (...args: T): void => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}