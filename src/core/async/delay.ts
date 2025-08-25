/**
 * Creates a promise that resolves after a specified delay.
 * 
 * @param ms - Delay in milliseconds
 * @returns Promise that resolves after the delay
 * @throws {Error} When ms is not a positive number
 * 
 * @example
 * ```typescript
 * await delay(1000); // Wait 1 second
 * console.log('Delayed execution');
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function delay(ms: number): Promise<void> {
  if (typeof ms !== 'number' || ms < 0 || !isFinite(ms)) {
    throw new Error('ms must be a non-negative finite number');
  }

  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}