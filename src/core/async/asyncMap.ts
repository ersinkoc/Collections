import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously maps array elements using a transformation function.
 * 
 * @param array - Array to map
 * @param mapper - Async mapper function
 * @returns Promise resolving to mapped array
 * @throws {ValidationError} When array is not an array or mapper is not a function
 * 
 * @example
 * ```typescript
 * const double = async (x: number) => x * 2;
 * await asyncMap([1, 2, 3], double); // Returns: [2, 4, 6]
 * ```
 * 
 * @complexity O(n) - Where n is the array length
 * @since 1.0.0
 */
export async function asyncMap<T, U>(
  array: T[],
  mapper: (item: T, index: number, array: T[]) => Promise<U>
): Promise<U[]> {
  validateArray(array, 'array');
  validateFunction(mapper, 'mapper');

  return Promise.all(
    array.map((item, index) => mapper(item, index, array))
  );
}