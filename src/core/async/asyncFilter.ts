import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously filters an array based on a predicate.
 * 
 * @param array - Array to filter
 * @param predicate - Async predicate function
 * @returns Promise resolving to filtered array
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * 
 * @example
 * ```typescript
 * const isEven = async (x: number) => x % 2 === 0;
 * await asyncFilter([1, 2, 3, 4], isEven); // Returns: [2, 4]
 * ```
 * 
 * @complexity O(n) - Where n is the array length
 * @since 1.0.0
 */
export async function asyncFilter<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => Promise<boolean>
): Promise<T[]> {
  validateArray(array, 'array');
  validateFunction(predicate, 'predicate');

  const results = await Promise.all(
    array.map(async (item, index) => {
      const shouldInclude = await predicate(item, index, array);
      return { item, shouldInclude };
    })
  );

  return results
    .filter(result => result.shouldInclude)
    .map(result => result.item);
}