import { validateSet } from '../../utils/validators';

/**
 * Returns the intersection of two sets.
 * Elements that are in both A and B.
 * 
 * @param setA - The first set
 * @param setB - The second set
 * @returns New set containing elements in both A and B
 * @throws {ValidationError} When either argument is not a Set
 * 
 * @example
 * ```typescript
 * intersection(new Set([1, 2, 3]), new Set([2, 3, 4]));
 * // Returns: Set { 2, 3 }
 * ```
 * 
 * @complexity O(min(n, m)) - Where n and m are the sizes of the sets
 * @since 1.0.0
 */
export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  validateSet(setA, 'setA');
  validateSet(setB, 'setB');

  const result = new Set<T>();
  
  // Optimize by iterating over the smaller set
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];

  for (const item of smaller) {
    if (larger.has(item)) {
      result.add(item);
    }
  }

  return result;
}