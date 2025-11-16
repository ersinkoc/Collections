import { validateArray } from '../../utils/validators';

/**
 * Unzips an array of tuples into separate arrays.
 * Handles variable-length tuples by using the maximum tuple length.
 *
 * @param array - Array of tuples to unzip
 * @returns Array of arrays where each contains elements from the same position
 * @throws {ValidationError} When array is not an array
 * @throws {Error} When array contains non-array-like elements
 *
 * @example
 * ```typescript
 * unzip([[1, 'a'], [2, 'b'], [3, 'c']]);
 * // Returns: [[1, 2, 3], ['a', 'b', 'c']]
 *
 * // Handles variable-length tuples:
 * unzip([[1, 'a'], [2, 'b', true], [3]]);
 * // Returns: [[1, 2, 3], ['a', 'b', undefined], [undefined, true, undefined]]
 * ```
 *
 * @complexity O(n*m) - Where n is array length and m is max tuple size
 * @since 1.0.0
 */
export function unzip<T extends readonly unknown[]>(
  array: T[]
): { [K in keyof T]: Array<T[K]> } {
  validateArray(array, 'array');

  if (array.length === 0) {
    return [] as unknown as { [K in keyof T]: Array<T[K]> };
  }

  // Validate all elements are array-like and find maximum tuple length
  let maxTupleLength = 0;
  for (let i = 0; i < array.length; i++) {
    const tuple = array[i];
    if (!Array.isArray(tuple) && (!tuple || typeof tuple.length !== 'number')) {
      throw new Error(
        `Element at index ${i} is not array-like. Expected array or array-like object, got ${typeof tuple}`
      );
    }
    maxTupleLength = Math.max(maxTupleLength, tuple.length);
  }

  const result: unknown[][] = Array.from({ length: maxTupleLength }, () => []);

  for (const tuple of array) {
    for (let i = 0; i < maxTupleLength; i++) {
      result[i]!.push(tuple[i]);
    }
  }

  return result as { [K in keyof T]: Array<T[K]> };
}