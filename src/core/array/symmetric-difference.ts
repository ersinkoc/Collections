import { validateArray } from '../../utils/validators';

/**
 * Returns the symmetric difference of multiple arrays (elements that appear in exactly one array).
 * Elements that appear in multiple arrays are excluded from the result.
 * 
 * @param ...arrays - Arrays to find symmetric difference of
 * @returns Array containing elements that appear in exactly one input array
 * @throws {ValidationError} When any argument is not an array
 * 
 * @example
 * ```typescript
 * symmetricDifference([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [1, 5]
 * symmetricDifference(['a', 'b'], ['b', 'c'], ['c', 'd']); // ['a', 'd']
 * symmetricDifference([1, 2], [3, 4]); // [1, 2, 3, 4]
 * ```
 * 
 * @complexity O(n) - Where n is total number of elements across all arrays
 * @since 1.0.0
 */
export function symmetricDifference<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) {
    return [];
  }

  for (let i = 0; i < arrays.length; i++) {
    validateArray(arrays[i], `arrays[${i}]`);
  }

  if (arrays.length === 1) {
    return [...arrays[0]!];
  }

  // Count occurrences of each element across all arrays
  const counts = new Map<T, number>();
  const firstOccurrence = new Map<T, number>(); // Track which array first contained each element

  for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex++) {
    const array = arrays[arrayIndex]!;
    const seen = new Set<T>(); // Track elements seen in current array to avoid double counting

    for (const item of array) {
      if (!seen.has(item)) {
        seen.add(item);
        counts.set(item, (counts.get(item) || 0) + 1);
        
        if (!firstOccurrence.has(item)) {
          firstOccurrence.set(item, arrayIndex);
        }
      }
    }
  }

  // Collect elements that appear exactly once, maintaining order of first appearance
  const elementsToInclude: Array<{ element: T; arrayIndex: number }> = [];

  for (const [element, count] of counts) {
    if (count === 1) {
      elementsToInclude.push({
        element,
        arrayIndex: firstOccurrence.get(element)!
      });
    }
  }

  // Sort by array index and original order to maintain predictable results
  elementsToInclude.sort((a, b) => {
    if (a.arrayIndex !== b.arrayIndex) {
      return a.arrayIndex - b.arrayIndex;
    }
    // For elements in the same array, maintain original order
    return arrays[a.arrayIndex]!.indexOf(a.element) - arrays[a.arrayIndex]!.indexOf(b.element);
  });

  return elementsToInclude.map(item => item.element);
}