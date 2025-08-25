import { validateArray } from '../../utils/validators';

/**
 * Unzips an array of tuples into separate arrays.
 * 
 * @param array - Array of tuples to unzip
 * @returns Array of arrays where each contains elements from the same position
 * @throws {ValidationError} When array is not an array
 * 
 * @example
 * ```typescript
 * unzip([[1, 'a'], [2, 'b'], [3, 'c']]);
 * // Returns: [[1, 2, 3], ['a', 'b', 'c']]
 * ```
 * 
 * @complexity O(n*m) - Where n is array length and m is tuple size
 * @since 1.0.0
 */
export function unzip<T extends readonly unknown[]>(
  array: T[]
): { [K in keyof T]: Array<T[K]> } {
  validateArray(array, 'array');

  if (array.length === 0) {
    return [] as unknown as { [K in keyof T]: Array<T[K]> };
  }

  const tupleLength = array[0]!.length;
  const result: unknown[][] = Array.from({ length: tupleLength }, () => []);

  for (const tuple of array) {
    for (let i = 0; i < tupleLength; i++) {
      result[i]!.push(tuple[i]);
    }
  }

  return result as { [K in keyof T]: Array<T[K]> };
}