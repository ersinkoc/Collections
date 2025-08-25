import { Predicate } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Takes elements from the end of array while predicate is true.
 * 
 * @param array - The array to take elements from
 * @param predicate - Function to test each element
 * @returns New array with elements from end while predicate is true
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * takeLastWhile([1, 2, 3, 4, 5], x => x > 2);
 * // Returns: [3, 4, 5]
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function takeLastWhile<T>(
  array: T[],
  predicate: Predicate<T>
): T[] {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  let startIndex = array.length;

  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i]!, i, array)) {
      startIndex = i + 1;
      break;
    }
    startIndex = i;
  }

  return array.slice(startIndex);
}