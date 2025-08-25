import { validateArray } from '../../utils/validators';

/**
 * Deep equality check for any value type.
 */
function deepEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  
  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;
  
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    
    if (Array.isArray(aObj) && Array.isArray(bObj)) {
      if (aObj.length !== bObj.length) return false;
      for (let i = 0; i < aObj.length; i++) {
        if (!deepEquals(aObj[i], bObj[i])) return false;
      }
      return true;
    }
    
    if (Array.isArray(aObj) || Array.isArray(bObj)) return false;
    
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    
    if (aKeys.length !== bKeys.length) return false;
    
    for (const key of aKeys) {
      if (!bKeys.includes(key)) return false;
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