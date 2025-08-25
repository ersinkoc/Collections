import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously reduces an array to a single value.
 * 
 * @param array - Array to reduce
 * @param reducer - Async reducer function
 * @param initialValue - Initial accumulator value
 * @returns Promise resolving to reduced value
 * @throws {ValidationError} When array is not an array or reducer is not a function
 * 
 * @example
 * ```typescript
 * const asyncSum = async (acc: number, x: number) => acc + x;
 * await asyncReduce([1, 2, 3], asyncSum, 0); // Returns: 6
 * ```
 * 
 * @complexity O(n) - Where n is the array length
 * @since 1.0.0
 */
export async function asyncReduce<T, U>(
  array: T[],
  reducer: (accumulator: U, item: T, index: number, array: T[]) => Promise<U>,
  initialValue: U
): Promise<U> {
  validateArray(array, 'array');
  validateFunction(reducer, 'reducer');

  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    accumulator = await reducer(accumulator, array[i]!, i, array);
  }

  return accumulator;
}