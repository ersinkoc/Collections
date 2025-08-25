/**
 * Deep equality check for any values.
 * 
 * @param a - First value
 * @param b - Second value
 * @returns True if values are deeply equal
 * 
 * @example
 * ```typescript
 * equals([1, 2, { a: 3 }], [1, 2, { a: 3 }]);
 * // Returns: true
 * ```
 * 
 * @complexity O(n) - Where n is total number of properties/elements
 * @since 1.0.0
 */
export function equals(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;

  if (typeof a !== typeof b) return false;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!equals(a[i], b[i])) return false;
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

  // Handle Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const value of a) {
      if (!b.has(value)) return false;
    }
    return true;
  }

  // Handle Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      if (!b.has(key) || !equals(value, b.get(key))) return false;
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

    for (const key of aKeys) {
      if (!bKeys.includes(key)) return false;
      if (!equals(aObj[key], bObj[key])) return false;
    }

    return true;
  }

  return false;
}