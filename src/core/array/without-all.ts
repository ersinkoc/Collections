import { validateArray } from '../../utils/validators';

/**
 * Removes all specified values from array.
 * 
 * @param array - The array to remove values from
 * @param values - Values to remove
 * @returns New array without specified values
 * @throws {ValidationError} When array or values is not an array
 * 
 * @example
 * ```typescript
 * withoutAll([1, 2, 3, 4, 5], [2, 4]);
 * // Returns: [1, 3, 5]
 * ```
 * 
 * @complexity O(n*m) - Where n is array length and m is values length
 * @since 1.0.0
 */
export function withoutAll<T>(
  array: T[],
  values: T[]
): T[] {
  validateArray(array, 'array');
  validateArray(values, 'values');

  if (array.length === 0 || values.length === 0) {
    return [...array];
  }

  const valuesToRemove = new Set(values);
  return array.filter(item => !valuesToRemove.has(item));
}