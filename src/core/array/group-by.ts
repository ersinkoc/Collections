import { Selector } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Groups array elements by a key selector function.
 * 
 * @param array - The array to group
 * @param selector - Function to extract the grouping key
 * @returns Object with keys as group identifiers and values as arrays of grouped items
 * @throws {ValidationError} When array is not an array or selector is not a function
 * 
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 25 }
 * ];
 * groupBy(users, u => u.age);
 * // Returns: {
 * //   '25': [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
 * //   '30': [{ name: 'Bob', age: 30 }]
 * // }
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  selector: Selector<T, K>
): Record<K, T[]> {
  validateArray(array, 'array');
  validateFunction(selector, 'selector');

  const result = {} as Record<K, T[]>;

  for (let i = 0; i < array.length; i++) {
    const key = selector(array[i]!, i, array);
    
    if (!(key in result)) {
      result[key] = [];
    }
    
    result[key].push(array[i]!);
  }

  return result;
}