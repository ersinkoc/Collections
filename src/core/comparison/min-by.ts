import { Comparator } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Finds the minimum element using a comparator function.
 * 
 * @param array - The array to search
 * @param comparator - Function to compare elements
 * @returns The minimum element, or undefined if array is empty
 * @throws {ValidationError} When array is not an array or comparator is not a function
 * 
 * @example
 * ```typescript
 * minBy(['apple', 'pie', 'banana'], (a, b) => a.length - b.length);
 * // Returns: 'pie'
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function minBy<T>(
  array: T[],
  comparator: Comparator<T>
): T | undefined {
  validateArray(array, 'array');
  validateFunction(comparator, 'comparator');

  if (array.length === 0) {
    return undefined;
  }

  let minElement = array[0]!;

  for (let i = 1; i < array.length; i++) {
    if (comparator(array[i]!, minElement) < 0) {
      minElement = array[i]!;
    }
  }

  return minElement;
}