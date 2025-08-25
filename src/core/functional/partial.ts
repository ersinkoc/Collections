import { validateFunction } from '../../utils/validators';

/**
 * Creates a partially applied function.
 * 
 * @param fn - Function to partially apply
 * @param args - Arguments to apply
 * @returns Partially applied function
 * @throws {ValidationError} When fn is not a function
 * 
 * @example
 * ```typescript
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const partialAdd = partial(add, 1, 2);
 * partialAdd(3); // Returns: 6
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function partial<T extends (...args: any[]) => any>(
  fn: T,
  ...partialArgs: any[]
): (...remainingArgs: any[]) => ReturnType<T> {
  validateFunction(fn, 'fn');

  return (...remainingArgs: any[]): ReturnType<T> => {
    return fn(...partialArgs, ...remainingArgs);
  };
}