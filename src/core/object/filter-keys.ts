import { validateObject, validateFunction } from '../../utils/validators';

/**
 * Filters object by keys using a predicate function.
 * 
 * @param source - The source object
 * @param predicate - Function to test each key
 * @returns New object with filtered keys
 * @throws {ValidationError} When source is not an object or predicate is not a function
 * 
 * @example
 * ```typescript
 * filterKeys({ a: 1, b: 2, c: 3 }, key => key !== 'b');
 * // Returns: { a: 1, c: 3 }
 * ```
 * 
 * @complexity O(n) - Where n is the number of properties
 * @since 1.0.0
 */
export function filterKeys<T extends Record<string, unknown>>(
  source: T,
  predicate: (key: string, index: number) => boolean
): Partial<T> {
  validateObject(source, 'source');
  validateFunction(predicate, 'predicate');

  const result: Partial<T> = {};
  const keys = Object.keys(source);

  keys.forEach((key, index) => {
    if (predicate(key, index)) {
      (result as any)[key] = source[key];
    }
  });

  return result;
}