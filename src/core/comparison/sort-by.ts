import { Comparator } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Sorts array using a comparator function.
 * 
 * @param array - The array to sort
 * @param comparator - Function to compare elements
 * @returns New sorted array
 * @throws {ValidationError} When array is not an array or comparator is not a function
 * 
 * @example
 * ```typescript
 * sortBy([3, 1, 4, 1, 5], (a, b) => a - b);
 * // Returns: [1, 1, 3, 4, 5]
 * ```
 * 
 * @complexity O(n log n) - Typical sort complexity
 * @since 1.0.0
 */
export function sortBy<T>(
  array: T[],
  comparator: Comparator<T>
): T[] {
  validateArray(array, 'array');
  validateFunction(comparator, 'comparator');

  return [...array].sort(comparator);
}