import { Predicate } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Splits an array into two arrays based on a predicate function.
 * 
 * @param array - The array to partition
 * @param predicate - Function to determine which partition an element belongs to
 * @returns Tuple of two arrays: [elements that satisfy predicate, elements that don't]
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * partition([1, 2, 3, 4, 5], x => x % 2 === 0);
 * // Returns: [[2, 4], [1, 3, 5]]
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function partition<T>(
  array: T[],
  predicate: Predicate<T>
): [T[], T[]] {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  const truthy: T[] = [];
  const falsy: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const element = array[i]!;
    if (predicate(element, i, array)) {
      truthy.push(element);
    } else {
      falsy.push(element);
    }
  }

  return [truthy, falsy];
}