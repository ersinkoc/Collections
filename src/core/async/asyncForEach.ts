import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously executes a function for each array element.
 * Uses Promise.allSettled to provide better error reporting with context about which elements failed.
 *
 * @param array - Array to iterate over
 * @param callback - Async callback function
 * @returns Promise that resolves when all callbacks complete
 * @throws {ValidationError} When array is not an array or callback is not a function
 * @throws {Error} When any callback function fails, with details about which indices failed
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

  // Use allSettled to execute all callbacks and provide better error context
  const results = await Promise.allSettled(
    array.map((item, index) => callback(item, index, array))
  );

  // Check for rejections and collect error details
  const errors: Array<{ index: number; error: any }> = [];

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      errors.push({ index, error: result.reason });
    }
  });

  // If any promises failed, throw a detailed error
  if (errors.length > 0) {
    const errorIndices = errors.map(e => e.index).join(', ');
    const errorMessages = errors.map(e =>
      e.error instanceof Error ? e.error.message : String(e.error)
    ).join('; ');

    throw new Error(
      `asyncForEach failed at ${errors.length} index(es) [${errorIndices}]: ${errorMessages}`
    );
  }
}