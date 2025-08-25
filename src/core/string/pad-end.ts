import { validateString } from '../../utils/validators';

/**
 * Pads string on the right side if it's shorter than length.
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
 * padEnd('abc', 6); // 'abc   '
 * padEnd('abc', 6, '_-'); // 'abc_-_'
 * padEnd('abc', 3); // 'abc' (no padding needed)
 * padEnd('abc', 2); // 'abc' (no truncation)
 * padEnd('123', 8, '0'); // '12300000'
 * ```
 * 
 * @complexity O(n) - Where n is the target length
 * @since 1.0.0
 */
export function padEnd(str: string, length: number, chars: string = ' '): string {
  validateString(str, 'str');

  if (length <= str.length) {
    return str;
  }

  if (chars.length === 0) {
    return str;
  }

  const padLength = length - str.length;
  
  // Repeat chars to cover the needed padding length
  let padding = '';
  while (padding.length < padLength) {
    padding += chars;
  }

  // Truncate padding if it's longer than needed
  if (padding.length > padLength) {
    padding = padding.slice(0, padLength);
  }

  return str + padding;
}