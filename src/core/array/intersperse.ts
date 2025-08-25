import { validateArray } from '../../utils/validators';

/**
 * Inserts a separator element between each pair of elements in an array.
 * Useful for creating comma-separated lists or adding delimiters.
 * 
 * @param array - The array to intersperse
 * @param separator - The element to insert between array elements
 * @returns New array with separator elements interspersed
 * @throws {ValidationError} When first argument is not an array
 * 
 * @example
 * ```typescript
 * intersperse([1, 2, 3, 4], 0); // [1, 0, 2, 0, 3, 0, 4]
 * intersperse(['a', 'b', 'c'], ','); // ['a', ',', 'b', ',', 'c']
 * intersperse([1], 0); // [1] (single element, no separator added)
 * intersperse([], 0); // [] (empty array)
 * ```
 * 
 * @complexity O(n) - Where n is array length
 * @since 1.0.0
 */
export function intersperse<T>(array: T[], separator: T): T[] {
  validateArray(array, 'array');

  if (array.length <= 1) {
    return [...array];
  }

  const result: T[] = [];
  
  for (let i = 0; i < array.length; i++) {
    result.push(array[i]!);
    
    // Add separator after each element except the last one
    if (i < array.length - 1) {
      result.push(separator);
    }
  }

  return result;
}