import { Predicate } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Drops elements from the end of array while predicate is true.
 * 
 * @param array - The array to drop elements from
 * @param predicate - Function to test each element
 * @returns New array with elements before predicate becomes false from the end
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * dropLastWhile([1, 2, 3, 4, 5], x => x > 3);
 * // Returns: [1, 2, 3]
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function dropLastWhile<T>(
  array: T[],
  predicate: Predicate<T>
): T[] {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  let dropIndex = array.length;
  
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i]!, i, array)) {
      dropIndex = i + 1;
      break;
    }
    dropIndex = i;
  }

  return array.slice(0, dropIndex);
}