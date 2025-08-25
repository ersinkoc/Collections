import { validateObject } from '../../utils/validators';

/**
 * Options for flattening objects.
 */
export interface FlattenOptions {
  delimiter?: string;
  maxDepth?: number;
}

/**
 * Flattens a nested object into a single-level object.
 * 
 * @param source - The object to flatten
 * @param options - Flattening options
 * @returns Flattened object with concatenated keys
 * @throws {ValidationError} When source is not an object
 * 
 * @example
 * ```typescript
 * flattenObject({ a: { b: { c: 1 } }, d: 2 });
 * // Returns: { 'a.b.c': 1, d: 2 }
 * ```
 * 
 * @complexity O(n) - Where n is total number of properties
 * @since 1.0.0
 */
export function flattenObject(
  source: Record<string, unknown>,
  options: FlattenOptions = {}
): Record<string, unknown> {
  validateObject(source, 'source');

  const { delimiter = '.', maxDepth = Infinity } = options;
  const result: Record<string, unknown> = {};

  function flatten(obj: Record<string, unknown>, prefix: string = '', depth: number = 0): void {
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const value = obj[key];
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        !(value instanceof RegExp) &&
        depth < maxDepth
      ) {
        flatten(value as Record<string, unknown>, newKey, depth + 1);
      } else {
        result[newKey] = value;
      }
    }
  }

  flatten(source);
  return result;
}