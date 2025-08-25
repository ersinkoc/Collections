import { Selector } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Finds the maximum element based on a selector function.
 * 
 * @param array - The array to search
 * @param selector - Function to extract the comparison value
 * @returns The element with maximum value, or undefined if array is empty
 * @throws {ValidationError} When array is not an array or selector is not a function
 * 
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 20 }
 * ];
 * maxBy(users, u => u.age);
 * // Returns: { name: 'Bob', age: 30 }
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function maxBy<T>(
  array: T[],
  selector: Selector<T, number>
): T | undefined {
  validateArray(array, 'array');
  validateFunction(selector, 'selector');

  if (array.length === 0) {
    return undefined;
  }

  let maxElement = array[0]!;
  let maxValue = selector(maxElement, 0, array);

  for (let i = 1; i < array.length; i++) {
    const element = array[i]!;
    const value = selector(element, i, array);
    
    if (value > maxValue) {
      maxValue = value;
      maxElement = element;
    }
  }

  return maxElement;
}