import { validateFunction, validatePositiveInteger } from '../../utils/validators';
import { TimeoutError } from '../../utils/errors';

/**
 * Adds timeout to an async function.
 * 
 * @param fn - Async function to add timeout to
 * @param ms - Timeout in milliseconds
 * @returns Promise that resolves with function result or rejects with TimeoutError
 * @throws {ValidationError} When fn is not a function
 * @throws {RangeError} When ms is not a positive integer
 * 
 * @example
 * ```typescript
 * const slowFunction = async () => {
 *   await new Promise(resolve => setTimeout(resolve, 2000));
 *   return 'done';
 * };
 * 
 * const result = await timeout(slowFunction, 1000); // Throws TimeoutError
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export async function timeout<T>(
  fn: () => Promise<T>,
  ms: number
): Promise<T> {
  validateFunction(fn, 'fn');
  validatePositiveInteger(ms, 'ms');

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(`Function timed out after ${ms}ms`));
    }, ms);

    fn()
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}