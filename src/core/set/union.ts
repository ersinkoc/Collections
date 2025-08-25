import { validateSet } from '../../utils/validators';

/**
 * Returns the union of two sets.
 * Elements that are in either A or B or both.
 * 
 * @param setA - The first set
 * @param setB - The second set
 * @returns New set containing all elements from both sets
 * @throws {ValidationError} When either argument is not a Set
 * 
 * @example
 * ```typescript
 * union(new Set([1, 2, 3]), new Set([2, 3, 4]));
 * // Returns: Set { 1, 2, 3, 4 }
 * ```
 * 
 * @complexity O(n + m) - Where n and m are the sizes of the sets
 * @since 1.0.0
 */
export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  validateSet(setA, 'setA');
  validateSet(setB, 'setB');

  const result = new Set<T>(setA);
  
  for (const item of setB) {
    result.add(item);
  }

  return result;
}