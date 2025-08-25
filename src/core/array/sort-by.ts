import { Selector, Comparator } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Sorts array by a selector function or comparator.
 * 
 * @param array - The array to sort
 * @param selector - Function to extract comparison value or comparator function
 * @param descending - Sort in descending order (default: false)
 * @returns New sorted array
 * @throws {ValidationError} When array is not an array or selector is not a function
 * 
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Charlie', age: 30 },
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 35 }
 * ];
 * sortBy(users, u => u.age);
 * // Returns: [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 30 }, { name: 'Bob', age: 35 }]
 * ```
 * 
 * @complexity O(n log n) - Typical sort complexity
 * @since 1.0.0
 */
export function sortBy<T>(
  array: T[],
  selector: Selector<T, number | string> | Comparator<T>,
  descending: boolean = false
): T[] {
  validateArray(array, 'array');
  validateFunction(selector, 'selector');

  if (array.length <= 1) {
    return [...array];
  }

  const result = [...array];

  // Check if selector is a comparator (takes 2 arguments)
  if (selector.length === 2) {
    const comparator = selector as Comparator<T>;
    result.sort((a, b) => {
      const compareResult = comparator(a, b);
      return descending ? -compareResult : compareResult;
    });
  } else {
    const valueSelector = selector as Selector<T, number | string>;
    result.sort((a, b) => {
      const aValue = valueSelector(a, 0, array);
      const bValue = valueSelector(b, 0, array);
      
      let compareResult: number;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        compareResult = aValue - bValue;
      } else {
        compareResult = String(aValue).localeCompare(String(bValue));
      }
      
      return descending ? -compareResult : compareResult;
    });
  }

  return result;
}