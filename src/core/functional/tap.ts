import { validateFunction } from '../../utils/validators';

/**
 * Executes a function with the given value, then returns the value unchanged.
 * Useful for debugging, logging, or performing side effects in function pipelines.
 * 
 * @param value - The value to pass through
 * @param fn - The function to execute with the value
 * @returns The original value unchanged
 * @throws {ValidationError} When second argument is not a function
 * 
 * @example
 * ```typescript
 * // Debugging in a pipeline
 * const result = pipe(
 *   [1, 2, 3, 4, 5],
 *   arr => arr.filter(x => x > 2),
 *   arr => tap(arr, console.log), // Logs [3, 4, 5] but doesn't change the value
 *   arr => arr.map(x => x * 2)
 * ); // [6, 8, 10]
 * 
 * // Logging intermediate results
 * const processUser = (user: User) => 
 *   pipe(
 *     user,
 *     validateUser,
 *     user => tap(user, u => console.log('Validated:', u.name)),
 *     enrichUserData,
 *     user => tap(user, u => console.log('Enriched:', u.metadata)),
 *     saveUser
 *   );
 * 
 * // Side effects without breaking the chain
 * const data = [1, 2, 3]
 *   .map(x => x * 2)
 *   .map(x => tap(x, val => metrics.record('processing', val)))
 *   .filter(x => x > 4); // [6]
 * ```
 * 
 * @complexity O(1) + complexity of fn
 * @since 1.0.0
 */
export function tap<T>(value: T, fn: (value: T) => void): T {
  validateFunction(fn, 'fn');

  fn(value);
  return value;
}