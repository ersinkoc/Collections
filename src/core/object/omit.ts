import { validateObject, validateArray } from '../../utils/validators';
import { deepClone } from './deep-clone';

/**
 * Creates a new object with specified keys omitted from the source object.
 * Values are deeply cloned to prevent shared references.
 *
 * @param source - The source object
 * @param keys - Array of keys to omit
 * @returns New object without the omitted keys (deep cloned)
 * @throws {ValidationError} When source is not an object or keys is not an array
 *
 * @example
 * ```typescript
 * omit({ a: 1, b: 2, c: 3 }, ['b']);
 * // Returns: { a: 1, c: 3 }
 * ```
 *
 * @note Values are deep cloned to prevent data corruption from shared references
 * @complexity O(n * m) - Where n is the number of properties, m is the average value size
 * @since 1.0.0
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  source: T,
  keys: K[]
): Omit<T, K> {
  validateObject(source, 'source');
  validateArray(keys, 'keys');

  const keysToOmit = new Set(keys);
  const result = {} as Omit<T, K>;

  // Handle string/number keys
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key) && !keysToOmit.has(key as unknown as K)) {
      (result as Record<string, unknown>)[key] = deepClone(source[key]);
    }
  }

  // Handle symbol keys
  const symbols = Object.getOwnPropertySymbols(source);
  for (const sym of symbols) {
    if (!keysToOmit.has(sym as unknown as K)) {
      (result as Record<string | symbol, unknown>)[sym] = deepClone((source as Record<string | symbol, unknown>)[sym]);
    }
  }

  return result;
}