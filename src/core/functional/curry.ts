import { validateFunction } from '../../utils/validators';

/**
 * Curries a function, allowing partial application.
 * 
 * @param fn - Function to curry
 * @returns Curried function
 * @throws {ValidationError} When fn is not a function
 * 
 * @example
 * ```typescript
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curried = curry(add);
 * curried(1)(2)(3); // Returns: 6
 * curried(1, 2)(3); // Returns: 6
 * curried(1)(2, 3); // Returns: 6
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function curry<T extends (...args: any[]) => any>(
  fn: T
): (...args: any[]) => any {
  validateFunction(fn, 'fn');

  const curried = (...args: any[]): any => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    
    return (...nextArgs: any[]) => {
      return curried(...args, ...nextArgs);
    };
  };

  return curried;
}