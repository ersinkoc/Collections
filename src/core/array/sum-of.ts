import { Selector } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Sums array elements using a selector function.
 * 
 * @param array - The array to sum
 * @param selector - Function to extract numeric value from each element
 * @returns Sum of selected values
 * @throws {ValidationError} When array is not an array or selector is not a function
 * 
 * @example
 * ```typescript
 * const items = [
 *   { name: 'Apple', price: 1.5 },
 *   { name: 'Banana', price: 0.8 },
 *   { name: 'Orange', price: 1.2 }
 * ];
 * sumOf(items, item => item.price);
 * // Returns: 3.5
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function sumOf<T>(
  array: T[],
  selector: Selector<T, number>
): number {
  validateArray(array, 'array');
  validateFunction(selector, 'selector');

  let sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += selector(array[i]!, i, array);
  }

  return sum;
}