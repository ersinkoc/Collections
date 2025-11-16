import { validateObject, validateFunction } from '../../utils/validators';

/**
 * Transforms object entries using a mapper function.
 *
 * @param source - The source object
 * @param mapper - Function to transform each entry
 * @returns New object with transformed entries
 * @throws {ValidationError} When source is not an object or mapper is not a function
 * @throws {Error} When mapper produces duplicate keys (would cause data loss)
 *
 * @example
 * ```typescript
 * mapEntries({ a: 1, b: 2 }, ([key, value]) => [key.toUpperCase(), value * 2]);
 * // Returns: { A: 2, B: 4 }
 * ```
 *
 * @note Throws an error if mapper produces duplicate keys to prevent silent data loss
 * @complexity O(n) - Where n is the number of properties
 * @since 1.0.0
 */
export function mapEntries<T extends Record<string, unknown>, K extends string, V>(
  source: T,
  mapper: (entry: [string, T[keyof T]], index: number) => [K, V]
): Record<K, V> {
  validateObject(source, 'source');
  validateFunction(mapper, 'mapper');

  const result: Record<K, V> = {} as Record<K, V>;
  const entries = Object.entries(source) as Array<[string, T[keyof T]]>;
  const seenKeys = new Set<K>();

  entries.forEach((entry, index) => {
    const [newKey, newValue] = mapper(entry, index);

    // Check for duplicate keys to prevent silent data loss
    if (seenKeys.has(newKey)) {
      throw new Error(
        `Mapper produced duplicate key '${newKey}' for entry at index ${index}. ` +
        'Cannot map entries with duplicate keys as this would cause data loss.'
      );
    }

    seenKeys.add(newKey);
    result[newKey] = newValue;
  });

  return result;
}