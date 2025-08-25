import { Predicate } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Takes elements from the beginning of array while predicate is true.
 * 
 * @param array - The array to take elements from
 * @param predicate - Function to test each element
 * @returns New array with elements while predicate is true
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * takeWhile([1, 2, 3, 4, 5], x => x < 4);
 * // Returns: [1, 2, 3]
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function takeWhile<T>(
  array: T[],
  predicate: Predicate<T>
): T[] {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const element = array[i]!;
    if (!predicate(element, i, array)) {
      break;
    }
    result.push(element);
  }

  return result;
}