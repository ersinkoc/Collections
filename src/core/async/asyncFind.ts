import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously finds the first element matching a predicate.
 * 
 * @param array - Array to search
 * @param predicate - Async predicate function
 * @returns Promise resolving to found element or undefined
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * const isEven = async (x: number) => x % 2 === 0;
 * await asyncFind([1, 3, 4, 5], isEven); // Returns: 4
 * ```
 * 
 * @complexity O(n) - Where n is the array length (worst case)
 * @since 1.0.0
 */
export async function asyncFind<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => Promise<boolean>
): Promise<T | undefined> {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  for (let i = 0; i < array.length; i++) {
    if (await predicate(array[i]!, i, array)) {
      return array[i]!;
    }
  }

  return undefined;
}