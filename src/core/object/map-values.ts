import { validateObject, validateFunction } from '../../utils/validators';

/**
 * Transforms object values using a mapper function.
 * 
 * @param source - The source object
 * @param mapper - Function to transform each value
 * @returns New object with transformed values
 * @throws {ValidationError} When source is not an object or mapper is not a function
 * 
 * @example
 * ```typescript
 * mapValues({ a: 1, b: 2 }, value => value * 2);
 * // Returns: { a: 2, b: 4 }
 * ```
 * 
 * @complexity O(n) - Where n is the number of properties
 * @since 1.0.0
 */
export function mapValues<T extends Record<string, unknown>, V>(
  source: T,
  mapper: (value: T[keyof T], key: string, index: number) => V
): Record<keyof T, V> {
  validateObject(source, 'source');
  validateFunction(mapper, 'mapper');

  const result: Record<keyof T, V> = {} as Record<keyof T, V>;
  const entries = Object.entries(source) as Array<[string, T[keyof T]]>;

  entries.forEach(([key, value], index) => {
    (result as any)[key] = mapper(value, key, index);
  });

  return result;
}