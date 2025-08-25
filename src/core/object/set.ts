import { validateObject } from '../../utils/validators';

/**
 * Sets the value at path of object. If a portion of path doesn't exist,
 * it's created. Arrays are created for missing index properties while
 * objects are created for all other missing properties.
 * 
 * @param obj - The object to modify
 * @param path - The path of the property to set (dot notation or array)
 * @param value - The value to set
 * @returns The modified object (mutated)
 * @throws {ValidationError} When first argument is not an object
 * 
 * @example
 * ```typescript
 * const obj = {};
 * set(obj, 'a.b.c', 3);
 * // obj is now { a: { b: { c: 3 } } }
 * 
 * set(obj, ['a', 'b', 'd'], 4);
 * // obj is now { a: { b: { c: 3, d: 4 } } }
 * 
 * set(obj, 'items.0.name', 'John');
 * // obj is now { a: { b: { c: 3, d: 4 } }, items: [{ name: 'John' }] }
 * 
 * const arr = [];
 * set(arr, '0.name', 'Jane');
 * // arr is now [{ name: 'Jane' }]
 * ```
 * 
 * @complexity O(d) - Where d is the depth of the path
 * @since 1.0.0
 */
export function set<T extends object>(
  obj: T,
  path: string | Array<string | number>,
  value: any
): T {
  validateObject(obj, 'obj');

  if (obj == null) {
    return obj;
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
    return obj;
  }

  let current: any = obj;

  // Navigate to the parent of the target property
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i]!;
    const nextKey = pathArray[i + 1]!;
    
    if (current[key] == null || typeof current[key] !== 'object') {
      // Determine whether to create an array or object
      // Create array if next key is a number
      const isNextKeyArrayIndex = typeof nextKey === 'number' || 
        (typeof nextKey === 'string' && /^\d+$/.test(nextKey));
      
      current[key] = isNextKeyArrayIndex ? [] : {};
    }
    
    current = current[key];
  }

  // Set the final value
  const lastKey = pathArray[pathArray.length - 1]!;
  current[lastKey] = value;

  return obj;
}