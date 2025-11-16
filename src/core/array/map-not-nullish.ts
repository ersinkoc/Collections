import { Selector } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Maps array elements and filters out null/undefined results.
 * 
 * @param array - The array to map
 * @param mapper - Function to transform elements
 * @returns Array with mapped non-nullish values
 * @throws {ValidationError} When array is not an array or mapper is not a function
 * 
 * @example
 * ```typescript
 * mapNotNullish([1, 2, 3, 4], x => x > 2 ? x * 2 : null);
 * // Returns: [6, 8]
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function mapNotNullish<T, R>(
  array: T[],
  mapper: Selector<T, R | null | undefined>
): R[] {
  validateArray(array, 'array');
  validateFunction(mapper, 'mapper');

  const result: R[] = [];

  for (let i = 0; i < array.length; i++) {
    let mapped: R | null | undefined;

    // Wrap mapper call to provide better error context
    try {
      mapped = mapper(array[i]!, i, array);
    } catch (error) {
      throw new Error(
        `Error in mapper function at index ${i}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    if (mapped !== null && mapped !== undefined) {
      result.push(mapped as R);
    }
  }

  return result;
}