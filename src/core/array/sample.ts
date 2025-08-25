import { validateArray, validatePositiveInteger } from '../../utils/validators';
import { RangeError } from '../../utils/errors';

/**
 * Returns a random sample from array.
 * 
 * @param array - The array to sample from
 * @param count - Number of elements to sample (default: 1)
 * @returns Array of sampled elements
 * @throws {ValidationError} When array is not an array
 * @throws {RangeError} When count is invalid or larger than array length
 * 
 * @example
 * ```typescript
 * sample([1, 2, 3, 4, 5], 2);
 * // Returns: [3, 1] (random)
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function sample<T>(array: T[], count: number = 1): T[] {
  validateArray(array, 'array');
  validatePositiveInteger(count, 'count');

  if (count > array.length) {
    throw new RangeError(
      `Sample count (${count}) cannot be larger than array length (${array.length})`,
      { count, arrayLength: array.length }
    );
  }

  if (array.length === 0 || count === 0) {
    return [];
  }

  // Create a copy to avoid modifying original
  const copy = [...array];
  const result: T[] = [];

  // Fisher-Yates shuffle for first 'count' elements
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * (copy.length - i)) + i;
    [copy[i], copy[randomIndex]] = [copy[randomIndex]!, copy[i]!];
    result.push(copy[i]!);
  }

  return result;
}