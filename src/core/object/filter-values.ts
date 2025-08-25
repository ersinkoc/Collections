import { validateObject, validateFunction } from '../../utils/validators';

/**
 * Filters object by values using a predicate function.
 * 
 * @param source - The source object
 * @param predicate - Function to test each value
 * @returns New object with filtered values
 * @throws {ValidationError} When source is not an object or predicate is not a function
 * 
 * @example
 * ```typescript
 * filterValues({ a: 1, b: 2, c: 3 }, value => value > 1);
 * // Returns: { b: 2, c: 3 }
 * ```
 * 
 * @complexity O(n) - Where n is the number of properties
 * @since 1.0.0
 */
export function filterValues<T extends Record<string, unknown>>(
  source: T,
  predicate: (value: T[keyof T], index: number) => boolean
): Partial<T> {
  validateObject(source, 'source');
  validateFunction(predicate, 'predicate');

  const result: Partial<T> = {};
  const entries = Object.entries(source) as Array<[string, T[keyof T]]>;

  entries.forEach(([key, value], index) => {
    if (predicate(value, index)) {
      (result as any)[key] = value;
    }
  });

  return result;
}