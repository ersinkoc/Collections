import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously maps array elements using a transformation function.
 * Uses Promise.allSettled to provide better error reporting with context about which elements failed.
 *
 * @param array - Array to map
 * @param mapper - Async mapper function
 * @returns Promise resolving to mapped array
 * @throws {ValidationError} When array is not an array or mapper is not a function
 * @throws {Error} When any mapper function fails, with details about which indices failed
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

  // Use allSettled to execute all promises and provide better error context
  const results = await Promise.allSettled(
    array.map((item, index) => mapper(item, index, array))
  );

  // Check for rejections and collect error details
  const errors: Array<{ index: number; error: any }> = [];
  const values: U[] = [];

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      errors.push({ index, error: result.reason });
    } else {
      values.push(result.value);
    }
  });

  // If any promises failed, throw a detailed error
  if (errors.length > 0) {
    const errorIndices = errors.map(e => e.index).join(', ');
    const errorMessages = errors.map(e =>
      e.error instanceof Error ? e.error.message : String(e.error)
    ).join('; ');

    throw new Error(
      `asyncMap failed at ${errors.length} index(es) [${errorIndices}]: ${errorMessages}`
    );
  }

  return values;
}