import { validateObject, validateFunction } from '../../utils/validators';

/**
 * Transforms object entries using a mapper function.
 * 
 * @param source - The source object
 * @param mapper - Function to transform each entry
 * @returns New object with transformed entries
 * @throws {ValidationError} When source is not an object or mapper is not a function
 * 
 * @example
 * ```typescript
 * mapEntries({ a: 1, b: 2 }, ([key, value]) => [key.toUpperCase(), value * 2]);
 * // Returns: { A: 2, B: 4 }
 * ```
 * 
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

  entries.forEach((entry, index) => {
    const [newKey, newValue] = mapper(entry, index);
    result[newKey] = newValue;
  });

  return result;
}