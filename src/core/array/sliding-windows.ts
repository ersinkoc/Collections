import { validateArray, validatePositiveInteger } from '../../utils/validators';

/**
 * Creates sliding window views of an array.
 * 
 * @param array - The array to create windows from
 * @param size - Size of each window
 * @param step - Step between windows (default: 1)
 * @returns Array of windows
 * @throws {ValidationError} When array is not an array
 * @throws {RangeError} When size or step is not a positive integer
 * 
 * @example
 * ```typescript
 * slidingWindows([1, 2, 3, 4, 5], 3, 1);
 * // Returns: [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 * 
 * slidingWindows([1, 2, 3, 4, 5], 2, 2);
 * // Returns: [[1, 2], [3, 4]]
 * ```
 * 
 * @complexity O(n*m) - Where n is array length and m is window size
 * @since 1.0.0
 */
export function slidingWindows<T>(
  array: T[],
  size: number,
  step: number = 1
): T[][] {
  validateArray(array, 'array');
  validatePositiveInteger(size, 'size');
  validatePositiveInteger(step, 'step');

  if (array.length === 0 || size > array.length) {
    return [];
  }

  const result: T[][] = [];

  for (let i = 0; i <= array.length - size; i += step) {
    result.push(array.slice(i, i + size));
  }

  return result;
}