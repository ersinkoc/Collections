import { validateObject } from '../../utils/validators';
import { deepClone } from './deep-clone';

/**
 * Checks if a value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Deep merges multiple objects recursively.
 * Later objects' properties overwrite earlier ones.
 * Arrays are replaced, not merged.
 * 
 * @param targets - Objects to merge
 * @returns Merged object
 * @throws {ValidationError} When any argument is not an object
 * 
 * @example
 * ```typescript
 * deepMerge(
 *   { a: 1, b: { c: 2 } },
 *   { b: { d: 3 }, e: 4 }
 * );
 * // Returns: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 * 
 * @complexity O(n*m) - Where n is total properties and m is depth
 * @since 1.0.0
 */
export function deepMerge<T = any>(
  ...targets: any[]
): T {
  const seen = new WeakMap<object, any>();
  return deepMergeWithRefs(seen, ...targets);
}

/**
 * Internal deep merge with circular reference tracking
 */
function deepMergeWithRefs<T = any>(
  seen: WeakMap<object, any>,
  ...targets: any[]
): T {
  if (targets.length === 0) {
    return {} as T;
  }

  // Validate all inputs are objects
  for (let i = 0; i < targets.length; i++) {
    if (targets[i] !== undefined && targets[i] !== null) {
      validateObject(targets[i], `target[${i}]`);
    }
  }

  const result: Record<string, unknown> = {};

  for (const target of targets) {
    if (!target) continue;

    const keys = Object.keys(target);
    for (const key of keys) {
      const sourceValue = target[key];
      const targetValue = result[key];

      if (isPlainObject(sourceValue)) {
        // Check for circular reference
        if (seen.has(sourceValue)) {
          // Return the cached result or the original reference for circular refs
          result[key] = seen.get(sourceValue) ?? sourceValue;
          continue;
        }

        // Mark as being processed to prevent infinite recursion
        seen.set(sourceValue, sourceValue); // Temporary marker

        let merged: any;
        if (isPlainObject(targetValue)) {
          merged = deepMergeWithRefs(
            seen,
            targetValue as Record<string, unknown>,
            sourceValue as Record<string, unknown>
          );
        } else {
          // Deep clone the source object
          merged = deepMergeWithRefs(seen, {}, sourceValue as Record<string, unknown>);
        }

        // Update with the actual merged result
        seen.set(sourceValue, merged);
        result[key] = merged;
      } else {
        // For non-plain-objects, handle based on type:
        // - Arrays: deep clone to prevent shared references
        // - Date/RegExp/Classes: preserve reference (standard JavaScript behavior)
        // - Primitives: assign directly
        if (typeof sourceValue === 'object' && sourceValue !== null) {
          // Deep clone arrays to prevent shared mutations
          if (Array.isArray(sourceValue)) {
            result[key] = deepClone(sourceValue);
          } else {
            // Preserve reference for Date, RegExp, and class instances
            // This matches standard JavaScript object spreading behavior
            result[key] = sourceValue;
          }
        } else {
          // Primitive values can be assigned directly
          result[key] = sourceValue;
        }
      }
    }
  }

  return result as T;
}