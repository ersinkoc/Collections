import { validateArray, validatePositiveInteger } from '../../utils/validators';

/**
 * Splits an array into chunks of specified size.
 * 
 * @param array - The array to split into chunks
 * @param size - The size of each chunk
 * @returns Array of chunks
 * @throws {ValidationError} When array is not an array
 * @throws {RangeError} When size is not a positive integer
 * 
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2);
 * // Returns: [[1, 2], [3, 4], [5]]
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function chunk<T>(array: T[], size: number): T[][] {
  validateArray(array, 'array');
  validatePositiveInteger(size, 'size');

  if (array.length === 0) {
    return [];
  }

  const result: T[][] = [];
  const length = array.length;

  for (let i = 0; i < length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}