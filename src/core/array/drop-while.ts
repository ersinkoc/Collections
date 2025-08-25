import { Predicate } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Drops elements from the beginning of array while predicate is true.
 * 
 * @param array - The array to drop elements from
 * @param predicate - Function to test each element
 * @returns New array with elements after predicate becomes false
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * dropWhile([1, 2, 3, 4, 5], x => x < 3);
 * // Returns: [3, 4, 5]
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function dropWhile<T>(
  array: T[],
  predicate: Predicate<T>
): T[] {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  let dropIndex = 0;
  
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i]!, i, array)) {
      dropIndex = i;
      break;
    }
    dropIndex = i + 1;
  }

  return array.slice(dropIndex);
}