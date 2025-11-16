import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Asynchronously filters an array based on a predicate.
 * Uses Promise.allSettled to provide better error reporting with context about which elements failed.
 *
 * @param array - Array to filter
 * @param predicate - Async predicate function
 * @returns Promise resolving to filtered array
 * @throws {ValidationError} When array is not an array or predicate is not a function
 * @throws {Error} When any predicate function fails, with details about which indices failed
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

  // Use allSettled to execute all predicates and provide better error context
  const results = await Promise.allSettled(
    array.map(async (item, index) => {
      const shouldInclude = await predicate(item, index, array);
      return { item, shouldInclude, index };
    })
  );

  // Check for rejections and collect error details
  const errors: Array<{ index: number; error: any }> = [];
  const filtered: T[] = [];

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      errors.push({ index, error: result.reason });
    } else if (result.value.shouldInclude) {
      filtered.push(result.value.item);
    }
  });

  // If any promises failed, throw a detailed error
  if (errors.length > 0) {
    const errorIndices = errors.map(e => e.index).join(', ');
    const errorMessages = errors.map(e =>
      e.error instanceof Error ? e.error.message : String(e.error)
    ).join('; ');

    throw new Error(
      `asyncFilter failed at ${errors.length} index(es) [${errorIndices}]: ${errorMessages}`
    );
  }

  return filtered;
}