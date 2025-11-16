import { validateFunction, validatePositiveInteger, validateNonNegativeInteger } from '../../utils/validators';

/**
 * Options for retry functionality.
 */
export interface RetryOptions {
  attempts: number;
  delay?: number;
  backoff?: (attempt: number) => number;
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Retries a function with configurable options.
 * 
 * @param fn - Function to retry
 * @param options - Retry options
 * @returns Promise that resolves with function result or rejects with last error
 * @throws {ValidationError} When fn is not a function
 * @throws {RangeError} When attempts is not a positive integer
 * 
 * @example
 * ```typescript
 * const fetchData = async () => {
 *   if (Math.random() > 0.7) throw new Error('Network error');
 *   return 'data';
 * };
 * const result = await retry(fetchData, { attempts: 3, delay: 1000 });
 * ```
 * 
 * @complexity O(n) - Where n is the number of attempts
 * @since 1.0.0
 */
export async function retry<T>(
  fn: () => Promise<T> | T,
  options: RetryOptions
): Promise<T> {
  validateFunction(fn, 'fn');
  validatePositiveInteger(options.attempts, 'options.attempts');
  
  if (options.delay !== undefined) {
    validateNonNegativeInteger(options.delay, 'options.delay');
  }

  const {
    attempts,
    delay = 0,
    backoff = () => delay,
    shouldRetry = () => true
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === attempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      const waitTime = backoff(attempt);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // Unreachable: loop always returns or throws on last iteration
  // Kept to satisfy TypeScript's control flow analysis
  throw lastError!;
}