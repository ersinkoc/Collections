import { validateObject } from '../../utils/validators';

/**
 * Fills missing properties in source object with default values.
 * 
 * @param source - The source object
 * @param defaultValues - Object with default values
 * @returns New object with defaults applied
 * @throws {ValidationError} When source or defaultValues is not an object
 * 
 * @example
 * ```typescript
 * defaults({ a: 1 }, { a: 2, b: 3, c: 4 });
 * // Returns: { a: 1, b: 3, c: 4 }
 * ```
 * 
 * @complexity O(n) - Where n is the number of properties in defaults
 * @since 1.0.0
 */
export function defaults<T extends Record<string, unknown>, D extends Record<string, unknown>>(
  source: T,
  defaultValues: D
): T & D {
  validateObject(source, 'source');
  validateObject(defaultValues, 'defaultValues');

  const result = { ...source } as T & D;

  for (const key in defaultValues) {
    if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
      if (!(key in result) || result[key] === undefined) {
        (result as any)[key] = defaultValues[key];
      }
    }
  }

  return result;
}