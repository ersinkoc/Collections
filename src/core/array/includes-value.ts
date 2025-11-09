import { validateArray } from '../../utils/validators';

/**
 * Deep equality check for any value type.
 */
function deepEquals(a: unknown, b: unknown): boolean {
  // Handle strict equality
  if (a === b) return true;

  // Handle NaN (NaN !== NaN, but we want them to be equal)
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
  }

  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;

  if (typeof a !== typeof b) return false;

  if (typeof a === 'object' && typeof b === 'object') {
    // Handle Date objects
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    // Handle RegExp objects
    if (a instanceof RegExp && b instanceof RegExp) {
      return a.source === b.source && a.flags === b.flags;
    }

    // Handle Set objects with deep comparison
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (const valueA of a) {
        let found = false;
        for (const valueB of b) {
          if (deepEquals(valueA, valueB)) {
            found = true;
            break;
          }
        }
        if (!found) return false;
      }
      return true;
    }

    // Handle Map objects with deep comparison
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (const [keyA, valueA] of a) {
        let found = false;
        for (const [keyB, valueB] of b) {
          if (deepEquals(keyA, keyB) && deepEquals(valueA, valueB)) {
            found = true;
            break;
          }
        }
        if (!found) return false;
      }
      return true;
    }

    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;

    // Handle arrays
    if (Array.isArray(aObj) && Array.isArray(bObj)) {
      if (aObj.length !== bObj.length) return false;
      for (let i = 0; i < aObj.length; i++) {
        if (!deepEquals(aObj[i], bObj[i])) return false;
      }
      return true;
    }

    if (Array.isArray(aObj) || Array.isArray(bObj)) return false;

    // Handle plain objects
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    // Use Set for O(1) lookup instead of O(n) includes
    const bKeySet = new Set(bKeys);
    for (const key of aKeys) {
      if (!bKeySet.has(key)) return false;
      if (!deepEquals(aObj[key], bObj[key])) return false;
    }

    return true;
  }

  return false;
}

/**
 * Checks if array includes a value using deep equality.
 * 
 * @param array - The array to search in
 * @param value - The value to search for
 * @returns True if value is found using deep equality
 * @throws {ValidationError} When array is not an array
 * 
 * @example
 * ```typescript
 * includesValue([{ a: 1 }, { b: 2 }], { a: 1 });
 * // Returns: true
 * ```
 * 
 * @complexity O(n*m) - Where n is array length and m is object depth
 * @since 1.0.0
 */
export function includesValue<T>(
  array: T[],
  value: T
): boolean {
  validateArray(array, 'array');

  for (const item of array) {
    if (deepEquals(item, value)) {
      return true;
    }
  }

  return false;
}