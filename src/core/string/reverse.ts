import { validateString } from '../../utils/validators';

/**
 * Reverses a string.
 * Handles Unicode characters correctly by reversing the string as a whole.
 * 
 * @param str - The string to reverse
 * @returns The reversed string
 * @throws {ValidationError} When argument is not a string
 * 
 * @example
 * ```typescript
 * reverse('hello'); // 'olleh'
 * reverse('abc123'); // '321cba'
 * reverse(''); // ''
 * reverse('a'); // 'a'
 * reverse('Hello World!'); // '!dlroW olleH'
 * ```
 * 
 * @complexity O(n) - Where n is string length
 * @since 1.0.0
 */
export function reverse(str: string): string {
  validateString(str, 'str');

  if (str.length <= 1) {
    return str;
  }

  // Use Array.from to properly handle Unicode code points (surrogate pairs, emojis, etc.)
  // This correctly handles multi-byte characters unlike split('')
  return Array.from(str).reverse().join('');
}