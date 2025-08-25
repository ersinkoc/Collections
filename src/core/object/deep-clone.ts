import { validateDefined } from '../../utils/validators';

/**
 * Creates a deep clone of a value.
 * 
 * @param value - The value to clone
 * @returns Deep cloned value
 * @throws {ArgumentError} When value is undefined
 * 
 * @example
 * ```typescript
 * const obj = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(obj);
 * cloned.b.c = 3;
 * console.log(obj.b.c); // Still 2
 * ```
 * 
 * @complexity O(n) - Where n is total number of properties/elements
 * @since 1.0.0
 */
export function deepClone<T>(value: T): T {
  validateDefined(value, 'value');

  // Handle primitives and null
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as T;
  }

  // Handle Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    value.forEach(item => clonedSet.add(deepClone(item)));
    return clonedSet as T;
  }

  // Handle Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    value.forEach((val, key) => clonedMap.set(deepClone(key), deepClone(val)));
    return clonedMap as T;
  }

  // Handle plain objects
  const clonedObj: any = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clonedObj[key] = deepClone(value[key]);
    }
  }

  return clonedObj as T;
}