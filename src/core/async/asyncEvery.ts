import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously tests if all elements pass a predicate.
 * 
 * @param array - Array to test
 * @param predicate - Async predicate function
 * @returns Promise resolving to true if all elements pass
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * const isPositive = async (x: number) => x > 0;
 * await asyncEvery([1, 2, 3], isPositive); // Returns: true
 * ```
 * 
 * @complexity O(n) - Where n is the array length (worst case)
 * @since 1.0.0
 */
export async function asyncEvery<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => Promise<boolean>
): Promise<boolean> {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  for (let i = 0; i < array.length; i++) {
    if (!(await predicate(array[i]!, i, array))) {
      return false;
    }
  }

  return true;
}