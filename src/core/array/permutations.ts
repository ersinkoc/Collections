import { validateArray } from '../../utils/validators';

/**
 * Generates all permutations of an array.
 * 
 * @param array - The array to generate permutations from
 * @returns Array of all permutations
 * @throws {ValidationError} When array is not an array
 * 
 * @example
 * ```typescript
 * permutations([1, 2, 3]);
 * // Returns: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
 * ```
 * 
 * @complexity O(n! * n) - Factorial time complexity
 * @since 1.0.0
 */
export function permutations<T>(array: T[]): T[][] {
  validateArray(array, 'array');

  if (array.length === 0) {
    return [[]];
  }

  if (array.length === 1) {
    return [[array[0]!]];
  }

  const result: T[][] = [];

  for (let i = 0; i < array.length; i++) {
    const current = array[i]!;
    const remaining = array.slice(0, i).concat(array.slice(i + 1));
    const subPermutations = permutations(remaining);

    for (const perm of subPermutations) {
      result.push([current, ...perm]);
    }
  }

  return result;
}