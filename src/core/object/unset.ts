import { validateObject } from '../../utils/validators';

/**
 * Removes the property at path of object. If the property is successfully
 * removed, the function returns true; otherwise, it returns false.
 * 
 * @param obj - The object to modify
 * @param path - The path of the property to unset (dot notation or array)
 * @returns True if property was removed, false otherwise
 * @throws {ValidationError} When first argument is not an object
 * 
 * @example
 * ```typescript
 * const obj = { a: { b: { c: 3, d: 4 } } };
 * unset(obj, 'a.b.c'); // true
 * // obj is now { a: { b: { d: 4 } } }
 * 
 * unset(obj, ['a', 'b', 'd']); // true
 * // obj is now { a: { b: {} } }
 * 
 * unset(obj, 'a.b.x'); // false (property doesn't exist)
 * 
 * const arr = [{ name: 'John' }, { name: 'Jane' }];
 * unset(arr, '0.name'); // true
 * // arr is now [{}', { name: 'Jane' }]
 * ```
 * 
 * @complexity O(d) - Where d is the depth of the path
 * @since 1.0.0
 */
export function unset<T extends object>(
  obj: T,
  path: string | Array<string | number>
): boolean {
  validateObject(obj, 'obj');

  if (obj == null) {
    return false;
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

  if (pathArray.length === 0) {
    return false;
  }

  // Security: Validate against prototype pollution
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  for (const key of pathArray) {
    const keyStr = String(key);
    if (dangerousKeys.includes(keyStr)) {
      throw new Error(`Unsafe property name detected: ${keyStr}`);
    }
  }

  // Special case for single-level path
  if (pathArray.length === 1) {
    const key = pathArray[0]!;
    if (key in obj) {
      if (Array.isArray(obj) && typeof key === 'number') {
        // For arrays, use splice to remove the element
        (obj as any[]).splice(key, 1);
      } else {
        // For objects, use delete
        delete (obj as any)[key];
      }
      return true;
    }
    return false;
  }

  let current: any = obj;

  // Navigate to the parent of the target property
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i]!;
    
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return false; // Path doesn't exist
    }
    
    current = current[key];
  }

  // Remove the final property
  const lastKey = pathArray[pathArray.length - 1]!;
  
  if (current != null && typeof current === 'object' && lastKey in current) {
    if (Array.isArray(current) && typeof lastKey === 'number') {
      // For arrays, use splice to remove the element
      current.splice(lastKey, 1);
    } else {
      // For objects, use delete
      delete current[lastKey];
    }
    return true;
  }

  return false;
}