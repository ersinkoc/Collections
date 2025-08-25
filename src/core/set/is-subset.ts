import { validateSet } from '../../utils/validators';

/**
 * Checks if setA is a subset of setB.
 * 
 * @param setA - The potentially smaller set
 * @param setB - The potentially larger set
 * @returns True if all elements of setA are in setB
 * @throws {ValidationError} When either argument is not a Set
 * 
 * @example
 * ```typescript
 * isSubset(new Set([1, 2]), new Set([1, 2, 3]));
 * // Returns: true
 * ```
 * 
 * @complexity O(n) - Where n is the size of setA
 * @since 1.0.0
 */
export function isSubset<T>(setA: Set<T>, setB: Set<T>): boolean {
  validateSet(setA, 'setA');
  validateSet(setB, 'setB');

  if (setA.size > setB.size) {
    return false;
  }

  for (const item of setA) {
    if (!setB.has(item)) {
      return false;
    }
  }

  return true;
}