import { validateObject, validateArray } from '../../utils/validators';
import { deepClone } from './deep-clone';

/**
 * Creates a new object with only the specified keys from the source object.
 * Values are deeply cloned to prevent shared references.
 *
 * @param source - The source object
 * @param keys - Array of keys to pick
 * @returns New object with only the picked keys (deep cloned)
 * @throws {ValidationError} When source is not an object or keys is not an array
 *
 * @example
 * ```typescript
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
 * // Returns: { a: 1, c: 3 }
 * ```
 *
 * @note Values are deep cloned to prevent data corruption from shared references
 * @complexity O(k * m) - Where k is the number of keys, m is the average value size
 * @since 1.0.0
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  source: T,
  keys: K[]
): Pick<T, K> {
  validateObject(source, 'source');
  validateArray(keys, 'keys');

  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = deepClone(source[key]);
    }
  }

  return result;
}