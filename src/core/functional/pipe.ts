import { validateFunction } from '../../utils/validators';

/**
 * Pipes functions from left to right.
 * 
 * @param fns - Functions to pipe
 * @returns Piped function
 * @throws {ValidationError} When any argument is not a function
 * 
 * @example
 * ```typescript
 * const add = (x: number) => x + 1;
 * const multiply = (x: number) => x * 2;
 * const piped = pipe(add, multiply);
 * piped(3); // Returns: 8 (add first: 3+1=4, then multiply: 4*2=8)
 * ```
 * 
 * @complexity O(n) - Where n is the number of functions
 * @since 1.0.0
 */
export function pipe<T>(...fns: Array<(arg: any) => any>): (arg: T) => any {
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
    let result: any = fns[0]!(arg);
    
    for (let i = 1; i < fns.length; i++) {
      result = fns[i]!(result);
    }
    
    return result;
  };
}