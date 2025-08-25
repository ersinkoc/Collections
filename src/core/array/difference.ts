import { validateArray } from '../../utils/validators';

/**
 * Returns elements from the first array that are not present in any of the other arrays.
 * Maintains the original order of the first array and removes duplicates.
 * 
 * @param array - The array to get differences from
 * @param ...others - Arrays to exclude elements from
 * @returns Array containing elements from first array not in others
 * @throws {ValidationError} When any argument is not an array
 * 
 * @example
 * ```typescript
 * difference([1, 2, 3, 4], [2, 3], [4, 5]); // [1]
 * difference(['a', 'b', 'c'], ['b'], ['c', 'd']); // ['a']
 * difference([1, 2, 2, 3], [2]); // [1, 3] (duplicates removed)
 * ```
 * 
 * @complexity O(n + m) - Where n is first array length and m is total other elements
 * @since 1.0.0
 */
export function difference<T>(array: T[], ...others: T[][]): T[] {
  validateArray(array, 'array');
  
  for (let i = 0; i < others.length; i++) {
    validateArray(others[i], `others[${i}]`);
  }

  if (array.length === 0) {
    return [];
  }

  if (others.length === 0) {
    return [...array];
  }

  // Combine all exclusion arrays into a single Set for O(1) lookup
  const excludeSet = new Set<T>();
  for (const otherArray of others) {
    for (const item of otherArray) {
      excludeSet.add(item);
    }
  }

  const result: T[] = [];
  const seen = new Set<T>();

  for (const item of array) {
    if (!excludeSet.has(item) && !seen.has(item)) {
      result.push(item);
      seen.add(item);
    }
  }

  return result;
}