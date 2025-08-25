/**
 * Creates a function that always returns the same value.
 * Useful for providing default values, placeholder functions, or creating predicates.
 * 
 * @param value - The value to always return
 * @returns A function that always returns the given value
 * 
 * @example
 * ```typescript
 * const alwaysTrue = constant(true);
 * const alwaysFive = constant(5);
 * const alwaysNull = constant(null);
 * 
 * alwaysTrue(); // true
 * alwaysTrue('any', 'arguments'); // true (ignores arguments)
 * 
 * // Useful with array methods
 * [1, 2, 3].map(constant(0)); // [0, 0, 0]
 * [1, 2, 3].filter(constant(true)); // [1, 2, 3]
 * [1, 2, 3].filter(constant(false)); // []
 * 
 * // Create default value providers
 * const getDefaultUser = constant({ name: 'Anonymous', id: -1 });
 * const user = someCondition ? fetchUser() : getDefaultUser();
 * ```
 * 
 * @complexity O(1) - Always constant time
 * @since 1.0.0
 */
export function constant<T>(value: T): (...args: any[]) => T {
  return () => value;
}