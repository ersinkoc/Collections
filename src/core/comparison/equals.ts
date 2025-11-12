/**
 * Deep equality check for any values with circular reference detection.
 *
 * @param a - First value
 * @param b - Second value
 * @param seenPairs - WeakMap to track compared pairs (internal use)
 * @returns True if values are deeply equal
 *
 * @example
 * ```typescript
 * equals([1, 2, { a: 3 }], [1, 2, { a: 3 }]);
 * // Returns: true
 *
 * // Handles circular references
 * const a: any = { x: 1 };
 * a.self = a;
 * const b: any = { x: 1 };
 * b.self = b;
 * equals(a, b); // Returns: true without stack overflow
 * ```
 *
 * @complexity O(n) - Where n is total number of properties/elements
 * @since 1.0.0
 */
export function equals(
  a: unknown,
  b: unknown,
  seenPairs: WeakMap<object, Set<object>> = new WeakMap()
): boolean {
  if (a === b) return true;

  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;

  if (typeof a !== typeof b) return false;

  // Check for circular references for objects
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    const aObj = a as object;
    const bObj = b as object;

    // Check if we've already compared this pair
    if (seenPairs.has(aObj)) {
      const compared = seenPairs.get(aObj)!;
      if (compared.has(bObj)) {
        return true; // Assume equal if we're in a cycle
      }
    } else {
      seenPairs.set(aObj, new Set());
    }
    seenPairs.get(aObj)!.add(bObj);
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!equals(a[i], b[i], seenPairs)) return false;
    }
    return true;
  }

  // Ensure both are objects but not arrays
  if (Array.isArray(a) || Array.isArray(b)) return false;

  // Handle Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // Handle Set - use deep equality for Set members
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const valueA of a) {
      let found = false;
      for (const valueB of b) {
        if (equals(valueA, valueB, seenPairs)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  // Handle Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      // For Map keys, we need deep equality as well
      let keyFound = false;
      for (const [bKey, bValue] of b) {
        if (equals(key, bKey, seenPairs) && equals(value, bValue, seenPairs)) {
          keyFound = true;
          break;
        }
      }
      if (!keyFound) return false;
    }
    return true;
  }

  // Handle plain objects
  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;

    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    // Use Set for O(1) lookup instead of O(n) includes
    const bKeySet = new Set(bKeys);
    for (const key of aKeys) {
      if (!bKeySet.has(key)) return false;
      if (!equals(aObj[key], bObj[key], seenPairs)) return false;
    }

    return true;
  }

  return false;
}