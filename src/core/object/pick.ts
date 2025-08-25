import { validateObject, validateArray } from '../../utils/validators';

/**
 * Creates a new object with only the specified keys from the source object.
 * 
 * @param source - The source object
 * @param keys - Array of keys to pick
 * @returns New object with only the picked keys
 * @throws {ValidationError} When source is not an object or keys is not an array
 * 
 * @example
 * ```typescript
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
 * // Returns: { a: 1, c: 3 }
 * ```
 * 
 * @complexity O(k) - Where k is the number of keys to pick
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
      result[key] = source[key];
    }
  }

  return result;
}