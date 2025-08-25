import { validateString } from '../../utils/validators';
import { ValidationError } from '../../utils/errors';

/**
 * Repeats the given string n times.
 * Returns an empty string if n is 0 or negative.
 * 
 * @param str - The string to repeat
 * @param n - The number of times to repeat the string
 * @returns The repeated string
 * @throws {ValidationError} When first argument is not a string or n is not an integer
 * 
 * @example
 * ```typescript
 * repeat('abc', 3); // 'abcabcabc'
 * repeat('x', 5); // 'xxxxx'
 * repeat('hello', 0); // ''
 * repeat('test', -1); // ''
 * repeat('', 3); // ''
 * ```
 * 
 * @complexity O(n * m) - Where n is repeat count and m is string length
 * @since 1.0.0
 */
export function repeat(str: string, n: number): string {
  validateString(str, 'str');

  if (!Number.isInteger(n)) {
    throw new ValidationError('n must be an integer');
  }

  if (n <= 0 || str.length === 0) {
    return '';
  }

  let result = '';
  for (let i = 0; i < n; i++) {
    result += str;
  }

  return result;
}