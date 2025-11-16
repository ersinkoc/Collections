import { validateObject } from '../../utils/validators';
import { ValidationError } from '../../utils/errors';

/**
 * Checks if value is a plain object (not Date, Array, RegExp, etc.)
 */
function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Fills missing properties in source object with default values.
 * Property descriptors from source are preserved.
 *
 * @param source - The source object (must be a plain object)
 * @param defaultValues - Object with default values (must be a plain object)
 * @returns New object with defaults applied
 * @throws {ValidationError} When source or defaultValues is not a plain object or contains unsafe keys
 *
 * @example
 * ```typescript
 * defaults({ a: 1 }, { a: 2, b: 3, c: 4 });
 * // Returns: { a: 1, b: 3, c: 4 }
 * ```
 *
 * @note Property descriptors (writable, enumerable, configurable) from source are preserved
 * @note Only accepts plain objects (not Date, Array, RegExp, or class instances)
 * @complexity O(n) - Where n is the number of properties in defaults
 * @since 1.0.0
 */
export function defaults<T extends Record<string, unknown>, D extends Record<string, unknown>>(
  source: T,
  defaultValues: D
): T & D {
  validateObject(source, 'source');
  validateObject(defaultValues, 'defaultValues');

  // Additional validation: ensure both are plain objects (not Date, Array, etc.)
  if (!isPlainObject(source)) {
    throw new ValidationError(
      `Expected source to be an object, got ${typeof source}`,
      { source }
    );
  }
  if (!isPlainObject(defaultValues)) {
    throw new ValidationError(
      `Expected defaultValues to be an object, got ${typeof defaultValues}`,
      { defaultValues }
    );
  }

  // Preserve property descriptors by using Object.create and defineProperties
  const result = Object.create(Object.getPrototypeOf(source));

  // Copy all properties from source with their descriptors
  const sourceDescriptors = Object.getOwnPropertyDescriptors(source);
  Object.defineProperties(result, sourceDescriptors);

  // Security: Validate against prototype pollution
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

  for (const key in defaultValues) {
    if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
      // Check for dangerous keys
      if (dangerousKeys.includes(key)) {
        throw new ValidationError(
          `Unsafe property name detected: ${key}`,
          { propertyName: key }
        );
      }

      if (!(key in result) || result[key] === undefined) {
        (result as any)[key] = defaultValues[key];
      }
    }
  }

  return result;
}