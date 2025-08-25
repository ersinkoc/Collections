/**
 * Returns the minimum of given values.
 * 
 * @param values - Values to compare
 * @returns The minimum value
 * 
 * @example
 * ```typescript
 * minOf(1, 5, 3, 9, 2);
 * // Returns: 1
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function minOf<T>(...values: T[]): T | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return values.reduce((min, current) => {
    if (current < min) {
      return current;
    }
    return min;
  });
}