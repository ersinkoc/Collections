import { validateFunction } from '../../utils/validators';

/**
 * Curries a function, allowing partial application.
 *
 * @param fn - Function to curry
 * @param arity - Optional arity override (number of expected arguments)
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
 *
 * // With default parameters, specify arity explicitly
 * const addWithDefault = (a: number, b: number, c = 0) => a + b + c;
 * const curried2 = curry(addWithDefault, 3);  // Force arity of 3
 * ```
 *
 * @note fn.length doesn't count parameters with default values.
 *       For functions with defaults, pass explicit arity parameter.
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function curry<T extends (...args: any[]) => any>(
  fn: T,
  arity?: number
): (...args: any[]) => any {
  validateFunction(fn, 'fn');

  const expectedArity = arity !== undefined ? arity : fn.length;

  const curried = (...args: any[]): any => {
    if (args.length >= expectedArity) {
      return fn(...args);
    }

    return (...nextArgs: any[]) => {
      return curried(...args, ...nextArgs);
    };
  };

  return curried;
}