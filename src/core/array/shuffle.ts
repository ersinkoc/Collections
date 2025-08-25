import { validateArray } from '../../utils/validators';

/**
 * Randomly shuffles array using Fisher-Yates algorithm.
 * 
 * @param array - The array to shuffle
 * @returns New shuffled array
 * @throws {ValidationError} When array is not an array
 * 
 * @example
 * ```typescript
 * shuffle([1, 2, 3, 4, 5]);
 * // Returns: [3, 1, 5, 2, 4] (random order)
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function shuffle<T>(array: T[]): T[] {
  validateArray(array, 'array');

  if (array.length <= 1) {
    return [...array];
  }

  const result = [...array];

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
}