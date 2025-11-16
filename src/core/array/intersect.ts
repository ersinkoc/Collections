import { validateArray } from '../../utils/validators';

/**
 * Returns the intersection of multiple arrays.
 * Optimized with Set-based lookups for O(n) performance instead of O(n²).
 *
 * @param arrays - Arrays to intersect
 * @returns Array containing elements present in all arrays
 * @throws {ValidationError} When any argument is not an array
 *
 * @example
 * ```typescript
 * intersect([1, 2, 3], [2, 3, 4], [2, 3, 5]);
 * // Returns: [2, 3]
 * ```
 *
 * @complexity O(n) - Where n is total elements across all arrays
 * @since 1.0.0
 */
export function intersect<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) {
    return [];
  }

  for (let i = 0; i < arrays.length; i++) {
    validateArray(arrays[i], `arrays[${i}]`);
  }

  if (arrays.length === 1) {
    return [...arrays[0]!];
  }

  // Find the smallest array for optimization
  let smallestIndex = 0;
  let smallestSize = arrays[0]!.length;

  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i]!.length < smallestSize) {
      smallestSize = arrays[i]!.length;
      smallestIndex = i;
    }
  }

  // Convert all arrays (except smallest) to Sets for O(1) lookup
  const sets: Set<T>[] = [];
  for (let i = 0; i < arrays.length; i++) {
    if (i !== smallestIndex) {
      sets.push(new Set(arrays[i]));
    }
  }

  // Use Set to track seen items for O(1) duplicate checking
  const seen = new Set<T>();
  const result: T[] = [];
  const smallest = arrays[smallestIndex]!;

  for (const item of smallest) {
    // Skip if already seen (deduplication)
    if (seen.has(item)) {
      continue;
    }
    seen.add(item);

    // Check if item exists in all other arrays (using Set.has for O(1) lookup)
    let inAll = true;
    for (const set of sets) {
      if (!set.has(item)) {
        inAll = false;
        break;
      }
    }

    if (inAll) {
      result.push(item);
    }
  }

  return result;
}