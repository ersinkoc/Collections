import { validateSet } from '../../utils/validators';

/**
 * Returns the difference between two sets (A - B).
 * Elements that are in A but not in B.
 * 
 * @param setA - The first set
 * @param setB - The second set
 * @returns New set containing elements in A but not in B
 * @throws {ValidationError} When either argument is not a Set
 * 
 * @example
 * ```typescript
 * difference(new Set([1, 2, 3]), new Set([2, 3, 4]));
 * // Returns: Set { 1 }
 * ```
 * 
 * @complexity O(n) - Where n is the size of setB
 * @since 1.0.0
 */
export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  validateSet(setA, 'setA');
  validateSet(setB, 'setB');

  const result = new Set<T>();

  for (const item of setA) {
    if (!setB.has(item)) {
      result.add(item);
    }
  }

  return result;
}