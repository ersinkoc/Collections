import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously tests if at least one element passes a predicate.
 * 
 * @param array - Array to test
 * @param predicate - Async predicate function
 * @returns Promise resolving to true if any element passes
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * const isEven = async (x: number) => x % 2 === 0;
 * await asyncSome([1, 3, 4], isEven); // Returns: true
 * ```
 * 
 * @complexity O(n) - Where n is the array length (worst case)
 * @since 1.0.0
 */
export async function asyncSome<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => Promise<boolean>
): Promise<boolean> {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  for (let i = 0; i < array.length; i++) {
    if (await predicate(array[i]!, i, array)) {
      return true;
    }
  }

  return false;
}