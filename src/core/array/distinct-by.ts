import { Selector } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Returns unique elements based on a key selector function.
 * 
 * @param array - The array to get unique elements from
 * @param selector - Function to extract the comparison key
 * @returns Array with unique elements based on selector
 * @throws {ValidationError} When array is not an array or selector is not a function
 * 
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice2' }
 * ];
 * distinctBy(users, u => u.id);
 * // Returns: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 * 
 * @complexity O(n) - Linear time complexity using Set
 * @since 1.0.0
 */
export function distinctBy<T, K>(
  array: T[],
  selector: Selector<T, K>
): T[] {
  validateArray(array, 'array');
  validateFunction(selector, 'selector');

  if (array.length === 0) {
    return [];
  }

  const seen = new Set<K>();
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const element = array[i]!;
    const key = selector(element, i, array);
    
    if (!seen.has(key)) {
      seen.add(key);
      result.push(element);
    }
  }

  return result;
}