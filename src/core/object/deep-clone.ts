import { validateDefined } from '../../utils/validators';

/**
 * Creates a deep clone of a value with circular reference detection.
 *
 * @param value - The value to clone
 * @param seen - WeakMap to track circular references (internal use)
 * @returns Deep cloned value
 * @throws {ArgumentError} When value is undefined
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(obj);
 * cloned.b.c = 3;
 * console.log(obj.b.c); // Still 2
 *
 * // Handles circular references
 * const circular: any = { a: 1 };
 * circular.self = circular;
 * const clonedCircular = deepClone(circular); // Works without stack overflow
 * ```
 *
 * @complexity O(n) - Where n is total number of properties/elements
 * @since 1.0.0
 */
export function deepClone<T>(value: T, seen: WeakMap<object, any> = new WeakMap()): T {
  validateDefined(value, 'value');

  // Handle primitives and null
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Check for circular reference
  if (seen.has(value as object)) {
    return seen.get(value as object);
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
    const clonedArray: any[] = [];
    seen.set(value as object, clonedArray);
    value.forEach(item => clonedArray.push(deepClone(item, seen)));
    return clonedArray as T;
  }

  // Handle Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    seen.set(value as object, clonedSet);
    value.forEach(item => clonedSet.add(deepClone(item, seen)));
    return clonedSet as T;
  }

  // Handle Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    seen.set(value as object, clonedMap);
    value.forEach((val, key) => clonedMap.set(deepClone(key, seen), deepClone(val, seen)));
    return clonedMap as T;
  }

  // Handle plain objects
  const clonedObj: any = {};
  seen.set(value as object, clonedObj);
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clonedObj[key] = deepClone(value[key], seen);
    }
  }

  return clonedObj as T;
}