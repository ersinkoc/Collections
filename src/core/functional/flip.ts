import { validateFunction } from '../../utils/validators';

/**
 * Creates a function that invokes the given function with arguments reversed.
 * Useful for creating right-to-left versions of functions or changing argument order.
 * 
 * @param fn - The function to flip arguments for
 * @returns A new function with reversed argument order
 * @throws {ValidationError} When argument is not a function
 * 
 * @example
 * ```typescript
 * const divide = (a: number, b: number) => a / b;
 * const flippedDivide = flip(divide);
 * 
 * divide(10, 2); // 5
 * flippedDivide(10, 2); // 0.2 (same as divide(2, 10))
 * 
 * // Useful with array methods
 * const subtract = (a: number, b: number) => a - b;
 * const flippedSubtract = flip(subtract);
 * 
 * [1, 2, 3].reduce(subtract, 10); // 4 (10 - 1 - 2 - 3)
 * [1, 2, 3].reduce(flippedSubtract, 10); // 16 (1 + 2 + 3 + 10)
 * ```
 * 
 * @complexity O(1) - Function creation is constant time
 * @since 1.0.0
 */
export function flip<T extends any[], R>(
  fn: (...args: T) => R
): (...args: [...T]) => R {
  validateFunction(fn, 'fn');

  return (...args: T): R => {
    // Reverse the arguments and call the original function
    const reversedArgs = [...args].reverse() as T;
    return fn(...reversedArgs);
  };
}