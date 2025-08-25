import { validateArray } from '../../utils/validators';

/**
 * Returns the intersection of multiple arrays.
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
 * @complexity O(n*m) - Where n is total elements and m is number of arrays
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

  const result: T[] = [];
  const smallest = arrays[smallestIndex]!;

  for (const item of smallest) {
    let inAll = true;
    
    for (let i = 0; i < arrays.length; i++) {
      if (i === smallestIndex) continue;
      
      if (!arrays[i]!.includes(item)) {
        inAll = false;
        break;
      }
    }
    
    if (inAll && !result.includes(item)) {
      result.push(item);
    }
  }

  return result;
}