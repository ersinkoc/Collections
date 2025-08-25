import { validateSet } from '../../utils/validators';

/**
 * Returns the symmetric difference between two sets.
 * Elements that are in either A or B but not in both.
 * 
 * @param setA - The first set
 * @param setB - The second set
 * @returns New set containing elements in either set but not both
 * @throws {ValidationError} When either argument is not a Set
 * 
 * @example
 * ```typescript
 * symmetricDifference(new Set([1, 2, 3]), new Set([2, 3, 4]));
 * // Returns: Set { 1, 4 }
 * ```
 * 
 * @complexity O(n + m) - Where n and m are the sizes of the sets
 * @since 1.0.0
 */
export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  validateSet(setA, 'setA');
  validateSet(setB, 'setB');

  const result = new Set<T>();

  // Add elements from setA that are not in setB
  for (const item of setA) {
    if (!setB.has(item)) {
      result.add(item);
    }
  }

  // Add elements from setB that are not in setA
  for (const item of setB) {
    if (!setA.has(item)) {
      result.add(item);
    }
  }

  return result;
}