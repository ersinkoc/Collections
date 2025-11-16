import { validateFunction } from '../../utils/validators';

/**
 * Creates a function that can only be called once.
 * If the first call throws an error, subsequent calls will re-throw the same error.
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
 * @note If the first call throws an error, subsequent calls re-throw the same error
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function once<T extends unknown[], R>(
  fn: (...args: T) => R
): ((...args: T) => R | undefined) & { called: boolean } {
  validateFunction(fn, 'fn');

  let called = false;
  let result: R;
  let error: any;

  const onceFn = (...args: T): R | undefined => {
    if (!called) {
      called = true;
      try {
        result = fn(...args);
        return result;
      } catch (err) {
        error = err;
        throw err;
      }
    }

    // If first call threw, re-throw the same error
    if (error !== undefined) {
      throw error;
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