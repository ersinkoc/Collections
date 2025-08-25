import { validateSet } from '../../utils/validators';

/**
 * Checks if setA is a superset of setB.
 * 
 * @param setA - The potentially larger set
 * @param setB - The potentially smaller set
 * @returns True if all elements of setB are in setA
 * @throws {ValidationError} When either argument is not a Set
 * 
 * @example
 * ```typescript
 * isSuperset(new Set([1, 2, 3]), new Set([1, 2]));
 * // Returns: true
 * ```
 * 
 * @complexity O(n) - Where n is the size of setB
 * @since 1.0.0
 */
export function isSuperset<T>(setA: Set<T>, setB: Set<T>): boolean {
  validateSet(setA, 'setA');
  validateSet(setB, 'setB');

  if (setA.size < setB.size) {
    return false;
  }

  for (const item of setB) {
    if (!setA.has(item)) {
      return false;
    }
  }

  return true;
}