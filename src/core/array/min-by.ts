import { Selector } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Finds the minimum element based on a selector function.
 * 
 * @param array - The array to search
 * @param selector - Function to extract the comparison value
 * @returns The element with minimum value, or undefined if array is empty
 * @throws {ValidationError} When array is not an array or selector is not a function
 * 
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 20 }
 * ];
 * minBy(users, u => u.age);
 * // Returns: { name: 'Charlie', age: 20 }
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function minBy<T>(
  array: T[],
  selector: Selector<T, number>
): T | undefined {
  validateArray(array, 'array');
  validateFunction(selector, 'selector');

  if (array.length === 0) {
    return undefined;
  }

  let minElement = array[0]!;
  let minValue = selector(minElement, 0, array);

  for (let i = 1; i < array.length; i++) {
    const element = array[i]!;
    const value = selector(element, i, array);
    
    if (value < minValue) {
      minValue = value;
      minElement = element;
    }
  }

  return minElement;
}