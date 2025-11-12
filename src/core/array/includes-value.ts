import { validateArray } from '../../utils/validators';
import { deepEquals } from '../object/deep-equals';

/**
 * Checks if array includes a value using deep equality.
 * 
 * @param array - The array to search in
 * @param value - The value to search for
 * @returns True if value is found using deep equality
 * @throws {ValidationError} When array is not an array
 * 
 * @example
 * ```typescript
 * includesValue([{ a: 1 }, { b: 2 }], { a: 1 });
 * // Returns: true
 * ```
 * 
 * @complexity O(n*m) - Where n is array length and m is object depth
 * @since 1.0.0
 */
export function includesValue<T>(
  array: T[],
  value: T
): boolean {
  validateArray(array, 'array');

  for (const item of array) {
    if (deepEquals(item, value)) {
      return true;
    }
  }

  return false;
}