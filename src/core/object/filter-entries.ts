import { validateObject, validateFunction } from '../../utils/validators';

/**
 * Filters object entries based on a predicate function.
 * 
 * @param source - The source object
 * @param predicate - Function to test each entry
 * @returns New object with filtered entries
 * @throws {ValidationError} When source is not an object or predicate is not a function
 * 
 * @example
 * ```typescript
 * filterEntries({ a: 1, b: 2, c: 3 }, ([key, value]) => value > 1);
 * // Returns: { b: 2, c: 3 }
 * ```
 * 
 * @complexity O(n) - Where n is the number of properties
 * @since 1.0.0
 */
export function filterEntries<T extends Record<string, unknown>>(
  source: T,
  predicate: (entry: [string, T[keyof T]], index: number) => boolean
): Partial<T> {
  validateObject(source, 'source');
  validateFunction(predicate, 'predicate');

  const result: Partial<T> = {};
  const entries = Object.entries(source) as Array<[string, T[keyof T]]>;

  entries.forEach((entry, index) => {
    if (predicate(entry, index)) {
      const [key, value] = entry;
      (result as any)[key] = value;
    }
  });

  return result;
}