import { validateArray } from '../../utils/validators';

/**
 * Zips multiple arrays into an array of tuples.
 * 
 * @param arrays - Arrays to zip together
 * @returns Array of tuples containing elements from same positions
 * @throws {ValidationError} When any argument is not an array
 * 
 * @example
 * ```typescript
 * zip([1, 2, 3], ['a', 'b', 'c'], [true, false, true]);
 * // Returns: [[1, 'a', true], [2, 'b', false], [3, 'c', true]]
 * ```
 * 
 * @complexity O(n*m) - Where n is shortest array length and m is number of arrays
 * @since 1.0.0
 */
export function zip<T extends readonly unknown[]>(
  ...arrays: { [K in keyof T]: T[K][] }
): T[] {
  if (arrays.length === 0) {
    return [];
  }

  for (let i = 0; i < arrays.length; i++) {
    validateArray(arrays[i], `arrays[${i}]`);
  }

  if (arrays.some(arr => arr.length === 0)) {
    return [];
  }

  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result: T[] = [];

  for (let i = 0; i < minLength; i++) {
    const tuple = arrays.map(arr => arr[i]) as unknown as T;
    result.push(tuple);
  }

  return result;
}