import { validateFunction } from '../../utils/validators';

/**
 * Composes functions from right to left.
 * 
 * @param fns - Functions to compose
 * @returns Composed function
 * @throws {ValidationError} When any argument is not a function
 * 
 * @example
 * ```typescript
 * const add = (x: number) => x + 1;
 * const multiply = (x: number) => x * 2;
 * const composed = compose(add, multiply);
 * composed(3); // Returns: 7 (multiply first: 3*2=6, then add: 6+1=7)
 * ```
 * 
 * @complexity O(n) - Where n is the number of functions
 * @since 1.0.0
 */
export function compose<T>(...fns: Array<(arg: any) => any>): (arg: T) => any {
  if (fns.length === 0) {
    return (arg: T) => arg;
  }

  for (let i = 0; i < fns.length; i++) {
    validateFunction(fns[i], `fns[${i}]`);
  }

  if (fns.length === 1) {
    return fns[0]!;
  }

  return (arg: T) => {
    let result: any = fns[fns.length - 1]!(arg);
    
    for (let i = fns.length - 2; i >= 0; i--) {
      result = fns[i]!(result);
    }
    
    return result;
  };
}