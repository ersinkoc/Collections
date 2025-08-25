/**
 * Returns the maximum of given values.
 * 
 * @param values - Values to compare
 * @returns The maximum value
 * 
 * @example
 * ```typescript
 * maxOf(1, 5, 3, 9, 2);
 * // Returns: 9
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function maxOf<T>(...values: T[]): T | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return values.reduce((max, current) => {
    if (current > max) {
      return current;
    }
    return max;
  });
}