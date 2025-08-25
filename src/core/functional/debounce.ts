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
): (...args: T) => void {
  validateFunction(fn, 'fn');
  validateNonNegativeInteger(delay, 'delay');

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}