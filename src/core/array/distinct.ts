import { validateArray } from '../../utils/validators';

/**
 * Returns unique elements from an array.
 * 
 * @param array - The array to get unique elements from
 * @returns Array with unique elements
 * @throws {ValidationError} When array is not an array
 * 
 * @example
 * ```typescript
 * distinct([1, 2, 2, 3, 3, 3, 4]);
 * // Returns: [1, 2, 3, 4]
 * ```
 * 
 * @complexity O(n) - Linear time complexity using Set
 * @since 1.0.0
 */
export function distinct<T>(array: T[]): T[] {
  validateArray(array, 'array');
  
  if (array.length === 0) {
    return [];
  }

  return Array.from(new Set(array));
}