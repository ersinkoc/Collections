import { validateString } from '../../utils/validators';
import { ValidationError } from '../../utils/errors';

/**
 * Repeats the given string n times.
 * Returns an empty string if n is 0 or negative.
 * Maximum result size is limited to 100MB to prevent memory exhaustion.
 *
 * @param str - The string to repeat
 * @param n - The number of times to repeat the string
 * @returns The repeated string
 * @throws {ValidationError} When first argument is not a string, n is not an integer, or result would exceed size limit
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
 * @note Maximum result size is 100MB (52,428,800 characters) to prevent memory exhaustion
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

  // Prevent memory exhaustion: limit total string size to 100MB
  // (1 char in JS strings is 2 bytes UTF-16, so 52,428,800 chars ≈ 100MB)
  const MAX_STRING_SIZE = 52_428_800; // ~100MB
  const resultSize = str.length * n;

  if (resultSize > MAX_STRING_SIZE) {
    throw new ValidationError(
      `Result string would exceed maximum size of ${MAX_STRING_SIZE} characters. ` +
      `Requested: ${str.length} × ${n} = ${resultSize} characters.`
    );
  }

  let result = '';
  for (let i = 0; i < n; i++) {
    result += str;
  }

  return result;
}