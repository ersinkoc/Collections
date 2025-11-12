import { validateArray } from '../../utils/validators';
import { ValidationError } from '../../utils/errors';

/**
 * Helper function to calculate factorial for error messages
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Generates all permutations of an array.
 * Limited to arrays with 12 or fewer elements to prevent memory exhaustion.
 *
 * @param array - The array to generate permutations from
 * @returns Array of all permutations
 * @throws {ValidationError} When array is not an array or length exceeds 12
 *
 * @example
 * ```typescript
 * permutations([1, 2, 3]);
 * // Returns: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
 * ```
 *
 * @note Maximum array length is 12 to prevent memory exhaustion (12! = 479M permutations)
 * @complexity O(n! * n) - Factorial time complexity
 * @since 1.0.0
 */
export function permutations<T>(array: T[]): T[][] {
  validateArray(array, 'array');

  // Prevent memory exhaustion: 13! = 6.2 billion permutations
  if (array.length > 12) {
    throw new ValidationError(
      'Array length must not exceed 12 elements to prevent memory exhaustion. ' +
      `Got ${array.length} elements, which would generate ${factorial(array.length)} permutations.`
    );
  }

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