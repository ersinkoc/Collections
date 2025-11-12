import { validateObject } from '../../utils/validators';

/**
 * Gets the value at path of object. If the resolved value is undefined,
 * the defaultValue is returned in its place.
 * 
 * @param obj - The object to query
 * @param path - The path of the property to get (dot notation or array)
 * @param defaultValue - The value returned if the resolved value is undefined
 * @returns The resolved value or defaultValue
 * @throws {ValidationError} When first argument is not an object
 * 
 * @example
 * ```typescript
 * const obj = { a: { b: { c: 3 } } };
 * get(obj, 'a.b.c'); // 3
 * get(obj, ['a', 'b', 'c']); // 3
 * get(obj, 'a.b.d', 'default'); // 'default'
 * get(obj, 'x.y.z', null); // null
 * 
 * // Works with arrays too
 * const arr = [{ name: 'John' }, { name: 'Jane' }];
 * get(arr, '0.name'); // 'John'
 * get(arr, [1, 'name']); // 'Jane'
 * ```
 * 
 * @complexity O(d) - Where d is the depth of the path
 * @since 1.0.0
 */
export function get<T = any>(
  obj: any,
  path: string | Array<string | number>,
  defaultValue?: T
): T | undefined {
  // Allow null/undefined to return default value
  if (obj == null) {
    return defaultValue;
  }

  // Only validate if obj is not null/undefined
  if (typeof obj !== 'object') {
    validateObject(obj, 'obj');
  }

  // Convert string path to array
  let pathArray: Array<string | number>;
  
  if (typeof path === 'string') {
    // Handle dot notation, including array indices like 'a.0.b'
    pathArray = path.split('.').map(key => {
      // Try to convert to number if it looks like an array index
      const num = Number(key);
      return !isNaN(num) && Number.isInteger(num) && num >= 0 ? num : key;
    });
  } else {
    pathArray = path;
  }

  // Security: Validate against dangerous property access
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  for (const key of pathArray) {
    const keyStr = String(key);
    if (dangerousKeys.includes(keyStr)) {
      throw new Error(`Unsafe property name detected: ${keyStr}`);
    }
  }

  let current = obj;

  for (const key of pathArray) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }

    current = current[key];

    if (current === undefined) {
      return defaultValue;
    }
  }

  return current;
}