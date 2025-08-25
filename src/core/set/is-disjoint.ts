import { validateSet } from '../../utils/validators';

/**
 * Checks if two sets are disjoint (have no common elements).
 * 
 * @param setA - The first set
 * @param setB - The second set
 * @returns True if sets have no common elements
 * @throws {ValidationError} When either argument is not a Set
 * 
 * @example
 * ```typescript
 * isDisjoint(new Set([1, 2, 3]), new Set([4, 5, 6]));
 * // Returns: true
 * ```
 * 
 * @complexity O(min(n, m)) - Where n and m are the sizes of the sets
 * @since 1.0.0
 */
export function isDisjoint<T>(setA: Set<T>, setB: Set<T>): boolean {
  validateSet(setA, 'setA');
  validateSet(setB, 'setB');

  // Optimize by iterating over the smaller set
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];

  for (const item of smaller) {
    if (larger.has(item)) {
      return false;
    }
  }

  return true;
}