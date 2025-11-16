import { validateObject, validateFunction } from '../../utils/validators';

/**
 * Transforms object keys using a mapper function.
 *
 * @param source - The source object
 * @param mapper - Function to transform each key
 * @returns New object with transformed keys
 * @throws {ValidationError} When source is not an object or mapper is not a function
 * @throws {Error} When mapper produces duplicate keys (would cause data loss)
 *
 * @example
 * ```typescript
 * mapKeys({ a: 1, b: 2 }, key => key.toUpperCase());
 * // Returns: { A: 1, B: 2 }
 * ```
 *
 * @note Throws an error if mapper produces duplicate keys to prevent silent data loss
 * @complexity O(n) - Where n is the number of properties
 * @since 1.0.0
 */
export function mapKeys<T extends Record<string, unknown>, K extends string>(
  source: T,
  mapper: (key: string, value: T[keyof T], index: number) => K
): Record<K, T[keyof T]> {
  validateObject(source, 'source');
  validateFunction(mapper, 'mapper');

  const result: Record<K, T[keyof T]> = {} as Record<K, T[keyof T]>;
  const entries = Object.entries(source) as Array<[string, T[keyof T]]>;
  const seenKeys = new Set<K>();

  entries.forEach(([key, value], index) => {
    const newKey = mapper(key, value, index);

    // Check for duplicate keys to prevent silent data loss
    if (seenKeys.has(newKey)) {
      throw new Error(
        `Mapper produced duplicate key '${newKey}' for original keys (including '${key}'). ` +
        'Cannot map keys with duplicates as this would cause data loss.'
      );
    }

    seenKeys.add(newKey);
    result[newKey] = value;
  });

  return result;
}