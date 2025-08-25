import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously executes a function for each array element.
 * 
 * @param array - Array to iterate over
 * @param callback - Async callback function
 * @returns Promise that resolves when all callbacks complete
 * @throws {ValidationError} When array is not an array or callback is not a function
 * 
 * @example
 * ```typescript
 * const logAsync = async (x: number) => console.log(x);
 * await asyncForEach([1, 2, 3], logAsync);
 * ```
 * 
 * @complexity O(n) - Where n is the array length
 * @since 1.0.0
 */
export async function asyncForEach<T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<void>
): Promise<void> {
  validateArray(array, 'array');
  validateFunction(callback, 'callback');

  await Promise.all(
    array.map((item, index) => callback(item, index, array))
  );
}