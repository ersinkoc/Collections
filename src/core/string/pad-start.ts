import { validateString } from '../../utils/validators';

/**
 * Pads string on the left side if it's shorter than length.
 * Padding characters are truncated if they exceed length.
 * 
 * @param str - The string to pad
 * @param length - The padding length
 * @param chars - The string used as padding (defaults to space)
 * @returns The padded string
 * @throws {ValidationError} When first argument is not a string
 * 
 * @example
 * ```typescript
 * padStart('abc', 6); // '   abc'
 * padStart('abc', 6, '_-'); // '_-_abc'
 * padStart('abc', 3); // 'abc' (no padding needed)
 * padStart('abc', 2); // 'abc' (no truncation)
 * padStart('123', 8, '0'); // '00000123'
 * ```
 * 
 * @complexity O(n) - Where n is the target length
 * @since 1.0.0
 */
export function padStart(str: string, length: number, chars: string = ' '): string {
  validateString(str, 'str');

  // Validate length parameter to prevent Infinity and NaN
  if (!Number.isFinite(length)) {
    throw new Error('length must be a finite number');
  }

  // Use Array.from to get actual character count for Unicode support
  const actualLength = Array.from(str).length;

  if (length <= actualLength) {
    return str;
  }

  if (chars.length === 0) {
    return str;
  }

  const padLength = length - actualLength;
  
  // Repeat chars to cover the needed padding length
  let padding = '';
  while (padding.length < padLength) {
    padding += chars;
  }

  // Truncate padding if it's longer than needed
  if (padding.length > padLength) {
    padding = padding.slice(0, padLength);
  }

  return padding + str;
}