import { validateFunction } from '../../utils/validators';

/**
 * Creates a function that can only be called once.
 * 
 * @param fn - Function to call once
 * @returns Function that can only be called once
 * @throws {ValidationError} When fn is not a function
 * 
 * @example
 * ```typescript
 * const initialize = once(() => console.log('Initializing...'));
 * initialize(); // Logs "Initializing..."
 * initialize(); // No output, already called
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function once<T extends unknown[], R>(
  fn: (...args: T) => R
): ((...args: T) => R | undefined) & { called: boolean } {
  validateFunction(fn, 'fn');

  let called = false;
  let result: R;

  const onceFn = (...args: T): R | undefined => {
    if (!called) {
      called = true;
      result = fn(...args);
      return result;
    }
    return result;
  };

  Object.defineProperty(onceFn, 'called', {
    get: () => called,
    enumerable: true,
    configurable: false
  });

  return onceFn as ((...args: T) => R | undefined) & { called: boolean };
}