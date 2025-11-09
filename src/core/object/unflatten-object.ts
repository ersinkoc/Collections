import { validateObject } from '../../utils/validators';

/**
 * Options for unflattening objects.
 */
export interface UnflattenOptions {
  delimiter?: string;
}

/**
 * Unflattens a single-level object into a nested object.
 * 
 * @param source - The flattened object
 * @param options - Unflattening options
 * @returns Nested object structure
 * @throws {ValidationError} When source is not an object
 * 
 * @example
 * ```typescript
 * unflattenObject({ 'a.b.c': 1, 'd': 2 });
 * // Returns: { a: { b: { c: 1 } }, d: 2 }
 * ```
 * 
 * @complexity O(n*m) - Where n is number of keys and m is average key depth
 * @since 1.0.0
 */
export function unflattenObject(
  source: Record<string, unknown>,
  options: UnflattenOptions = {}
): Record<string, unknown> {
  validateObject(source, 'source');

  const { delimiter = '.' } = options;
  const result: Record<string, unknown> = {};

  // Validate against prototype pollution
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

  for (const flatKey in source) {
    if (!Object.prototype.hasOwnProperty.call(source, flatKey)) continue;

    const keys = flatKey.split(delimiter);

    // Check for dangerous keys in path
    for (const key of keys) {
      if (dangerousKeys.includes(key)) {
        throw new Error(`Unsafe property name detected: ${key}`);
      }
    }

    let current: any = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]!;
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1]!;
    current[lastKey] = source[flatKey];
  }

  return result;
}