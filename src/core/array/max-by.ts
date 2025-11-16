import { Selector } from '../../types/common';
import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Finds the maximum element based on a selector function.
 * NaN values are explicitly handled - elements with NaN selector values are skipped.
 *
 * @param array - The array to search
 * @param selector - Function to extract the comparison value
 * @returns The element with maximum value, or undefined if array is empty or all values are NaN
 * @throws {ValidationError} When array is not an array or selector is not a function
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 20 }
 * ];
 * maxBy(users, u => u.age);
 * // Returns: { name: 'Bob', age: 30 }
 *
 * // NaN handling:
 * maxBy([{ v: NaN }, { v: 5 }, { v: 3 }], x => x.v);
 * // Returns: { v: 5 } (NaN is skipped)
 * ```
 *
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function maxBy<T>(
  array: T[],
  selector: Selector<T, number>
): T | undefined {
  validateArray(array, 'array');
  validateFunction(selector, 'selector');

  if (array.length === 0) {
    return undefined;
  }

  let maxElement: T | undefined = undefined;
  let maxValue = -Infinity;

  for (let i = 0; i < array.length; i++) {
    const element = array[i]!;
    let value: number;

    // Wrap selector call to provide better error context
    try {
      value = selector(element, i, array);
    } catch (error) {
      throw new Error(
        `Error in selector function at index ${i}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Skip NaN values explicitly - NaN comparisons are unreliable
    if (isNaN(value)) {
      continue;
    }

    if (value > maxValue) {
      maxValue = value;
      maxElement = element;
    }
  }

  return maxElement;
}