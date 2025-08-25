import { validateObject } from '../../utils/validators';

/**
 * Inverts an object's keys and values.
 * 
 * @param source - The object to invert
 * @returns New object with inverted keys and values
 * @throws {ValidationError} When source is not an object
 * 
 * @example
 * ```typescript
 * invert({ a: '1', b: '2', c: '3' });
 * // Returns: { '1': 'a', '2': 'b', '3': 'c' }
 * ```
 * 
 * @complexity O(n) - Where n is the number of properties
 * @since 1.0.0
 */
export function invert<T extends Record<string, string | number>>(
  source: T
): Record<string | number, keyof T> {
  validateObject(source, 'source');

  const result: Record<string | number, keyof T> = {};

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      (result as any)[value] = key;
    }
  }

  return result;
}