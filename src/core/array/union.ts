import { validateArray } from '../../utils/validators';

/**
 * Returns the union of multiple arrays (unique elements from all arrays).
 * 
 * @param arrays - Arrays to union
 * @returns Array containing unique elements from all arrays
 * @throws {ValidationError} When any argument is not an array
 * 
 * @example
 * ```typescript
 * union([1, 2, 3], [2, 3, 4], [3, 4, 5]);
 * // Returns: [1, 2, 3, 4, 5]
 * ```
 * 
 * @complexity O(n) - Linear time complexity using Set
 * @since 1.0.0
 */
export function union<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) {
    return [];
  }

  for (let i = 0; i < arrays.length; i++) {
    validateArray(arrays[i], `arrays[${i}]`);
  }

  const seen = new Set<T>();
  const result: T[] = [];

  for (const array of arrays) {
    for (const item of array) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
  }

  return result;
}