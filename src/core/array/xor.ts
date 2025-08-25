import { validateArray } from '../../utils/validators';

/**
 * Returns the XOR (exclusive or) of two arrays.
 * Elements that appear in either array but not in both.
 * This is equivalent to symmetric difference for two arrays.
 * 
 * @param array1 - The first array
 * @param array2 - The second array
 * @returns Array containing elements in either array but not both
 * @throws {ValidationError} When any argument is not an array
 * 
 * @example
 * ```typescript
 * xor([1, 2, 3], [2, 3, 4]); // [1, 4]
 * xor(['a', 'b', 'c'], ['b', 'c', 'd']); // ['a', 'd']
 * xor([1, 2], [3, 4]); // [1, 2, 3, 4]
 * xor([1, 2, 2], [2, 3, 3]); // [1, 3] (duplicates removed)
 * ```
 * 
 * @complexity O(n + m) - Where n and m are array lengths
 * @since 1.0.0
 */
export function xor<T>(array1: T[], array2: T[]): T[] {
  validateArray(array1, 'array1');
  validateArray(array2, 'array2');

  if (array1.length === 0 && array2.length === 0) {
    return [];
  }

  if (array1.length === 0) {
    return [...new Set(array2)];
  }

  if (array2.length === 0) {
    return [...new Set(array1)];
  }

  const set1 = new Set(array1);
  const set2 = new Set(array2);
  const result: T[] = [];

  // Add elements from array1 that are not in array2
  for (const item of set1) {
    if (!set2.has(item)) {
      result.push(item);
    }
  }

  // Add elements from array2 that are not in array1
  for (const item of set2) {
    if (!set1.has(item)) {
      result.push(item);
    }
  }

  return result;
}