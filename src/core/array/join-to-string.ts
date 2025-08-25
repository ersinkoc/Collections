import { validateArray } from '../../utils/validators';

/**
 * Options for joining array to string.
 */
export interface JoinOptions<T> {
  separator?: string;
  prefix?: string;
  postfix?: string;
  limit?: number;
  truncated?: string;
  transform?: (item: T, index: number) => string;
}

/**
 * Joins array elements to string with advanced options.
 * 
 * @param array - The array to join
 * @param options - Join options
 * @returns Joined string
 * @throws {ValidationError} When array is not an array
 * 
 * @example
 * ```typescript
 * joinToString([1, 2, 3], { 
 *   separator: ', ',
 *   prefix: '[',
 *   postfix: ']'
 * });
 * // Returns: "[1, 2, 3]"
 * ```
 * 
 * @complexity O(n) - Linear time complexity
 * @since 1.0.0
 */
export function joinToString<T>(
  array: T[],
  options: JoinOptions<T> = {}
): string {
  validateArray(array, 'array');

  const {
    separator = ', ',
    prefix = '',
    postfix = '',
    limit = -1,
    truncated = '...',
    transform = (item: T) => String(item)
  } = options;

  if (array.length === 0) {
    return prefix + postfix;
  }

  const effectiveLimit = limit > 0 ? Math.min(limit, array.length) : array.length;
  const parts: string[] = [];

  for (let i = 0; i < effectiveLimit; i++) {
    parts.push(transform(array[i]!, i));
  }

  let result = prefix + parts.join(separator);
  
  if (limit > 0 && limit < array.length) {
    result += truncated;
  }
  
  result += postfix;

  return result;
}