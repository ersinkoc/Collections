import { joinToString, JoinOptions } from '../../core/array/join-to-string';
import { ValidationError } from '../../utils/errors';

describe('joinToString', () => {
  // Normal cases - basic functionality
  it('should join array elements with default separator', () => {
    expect(joinToString([1, 2, 3])).toBe('1, 2, 3');
    expect(joinToString(['a', 'b', 'c'])).toBe('a, b, c');
    expect(joinToString([true, false, null])).toBe('true, false, null');
  });

  it('should join array elements with custom separator', () => {
    expect(joinToString([1, 2, 3], { separator: ' | ' })).toBe('1 | 2 | 3');
    expect(joinToString(['a', 'b', 'c'], { separator: '-' })).toBe('a-b-c');
    expect(joinToString([1, 2, 3], { separator: '' })).toBe('123');
  });

  it('should add prefix and postfix', () => {
    expect(joinToString([1, 2, 3], { prefix: '[', postfix: ']' })).toBe('[1, 2, 3]');
    expect(joinToString(['a', 'b'], { prefix: '(', postfix: ')' })).toBe('(a, b)');
    expect(joinToString([1], { prefix: 'start:', postfix: ':end' })).toBe('start:1:end');
  });

  it('should combine separator, prefix, and postfix', () => {
    const options: JoinOptions<number> = {
      separator: ' | ',
      prefix: '{',
      postfix: '}'
    };
    expect(joinToString([1, 2, 3], options)).toBe('{1 | 2 | 3}');
  });

  it('should limit number of elements', () => {
    expect(joinToString([1, 2, 3, 4, 5], { limit: 3 })).toBe('1, 2, 3...');
    expect(joinToString(['a', 'b', 'c', 'd'], { limit: 2 })).toBe('a, b...');
    expect(joinToString([1, 2], { limit: 3 })).toBe('1, 2'); // Limit higher than array length
  });

  it('should use custom truncated string', () => {
    expect(joinToString([1, 2, 3, 4, 5], { limit: 3, truncated: ' [more]' })).toBe('1, 2, 3 [more]');
    expect(joinToString(['a', 'b', 'c'], { limit: 2, truncated: '..and more' })).toBe('a, b..and more');
  });

  it('should use custom transform function', () => {
    const transform = (item: number) => `#${item}`;
    expect(joinToString([1, 2, 3], { transform })).toBe('#1, #2, #3');
    
    const upperTransform = (item: string) => item.toUpperCase();
    expect(joinToString(['hello', 'world'], { transform: upperTransform })).toBe('HELLO, WORLD');
  });

  it('should provide index to transform function', () => {
    const transform = (item: string, index: number) => `${index}:${item}`;
    expect(joinToString(['a', 'b', 'c'], { transform })).toBe('0:a, 1:b, 2:c');
  });

  it('should combine all options together', () => {
    const options: JoinOptions<number> = {
      separator: ' | ',
      prefix: 'Numbers: [',
      postfix: ']',
      limit: 3,
      truncated: '...more',
      transform: (item, index) => `${index}=${item}`
    };
    expect(joinToString([10, 20, 30, 40, 50], options)).toBe('Numbers: [0=10 | 1=20 | 2=30...more]');
  });

  // Edge cases
  it('should handle empty array', () => {
    expect(joinToString([])).toBe('');
    expect(joinToString([], { prefix: '[', postfix: ']' })).toBe('[]');
    expect(joinToString([], { separator: '|', prefix: '(', postfix: ')' })).toBe('()');
  });

  it('should handle single element array', () => {
    expect(joinToString([42])).toBe('42');
    expect(joinToString(['hello'])).toBe('hello');
    expect(joinToString([42], { prefix: '[', postfix: ']' })).toBe('[42]');
  });

  it('should handle array with undefined and null values', () => {
    expect(joinToString([1, undefined, 3, null, 5])).toBe('1, undefined, 3, null, 5');
    expect(joinToString([null, undefined])).toBe('null, undefined');
  });

  it('should handle arrays with mixed types', () => {
    const mixed = [1, 'hello', true, null, { a: 1 }, [1, 2]];
    expect(joinToString(mixed)).toBe('1, hello, true, null, [object Object], 1,2');
  });

  it('should handle limit of 0 (shows all elements)', () => {
    // When limit is 0 or negative, all elements are shown
    expect(joinToString([1, 2, 3], { limit: 0 })).toBe('1, 2, 3');
    expect(joinToString([1, 2, 3], { limit: 0, prefix: '[', postfix: ']' })).toBe('[1, 2, 3]');
  });

  it('should handle negative limit (should show all elements)', () => {
    expect(joinToString([1, 2, 3, 4, 5], { limit: -1 })).toBe('1, 2, 3, 4, 5');
    expect(joinToString([1, 2, 3, 4, 5], { limit: -5 })).toBe('1, 2, 3, 4, 5');
  });

  it('should not add truncated string when limit equals array length', () => {
    expect(joinToString([1, 2, 3], { limit: 3 })).toBe('1, 2, 3');
    expect(joinToString([1, 2], { limit: 2, truncated: '...' })).toBe('1, 2');
  });

  // Transform function edge cases
  it('should handle transform function that returns empty string', () => {
    const transform = () => '';
    expect(joinToString([1, 2, 3], { transform })).toBe(', , ');
  });

  it('should handle transform function that returns complex strings', () => {
    const transform = (item: number) => `item_${item}_processed`;
    expect(joinToString([1, 2], { transform })).toBe('item_1_processed, item_2_processed');
  });

  it('should handle transform function with objects', () => {
    const objects = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }];
    const transform = (obj: { name: string; age: number }) => `${obj.name}(${obj.age})`;
    expect(joinToString(objects, { transform })).toBe('Alice(25), Bob(30)');
  });

  it('should handle transform function that uses array parameter', () => {
    const transform = (item: number, _index: number) => 
      `${item}/3`; // Simplified since we can't access array length in transform
    expect(joinToString([10, 20, 30], { transform })).toBe('10/3, 20/3, 30/3');
  });

  // Complex scenarios
  it('should work with nested arrays', () => {
    const nested = [[1, 2], [3, 4], [5, 6]];
    expect(joinToString(nested)).toBe('1,2, 3,4, 5,6');
    
    const transform = (arr: number[]) => `[${arr.join(',')}]`;
    expect(joinToString(nested, { transform })).toBe('[1,2], [3,4], [5,6]');
  });

  it('should work with objects and custom transform', () => {
    const users = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ];
    
    const transform = (user: typeof users[0]) => `${user.name} <${user.email}>`;
    const options: JoinOptions<typeof users[0]> = {
      transform,
      separator: '; ',
      prefix: 'Users: ',
      postfix: ''
    };
    
    expect(joinToString(users, options)).toBe('Users: Alice <alice@example.com>; Bob <bob@example.com>; Charlie <charlie@example.com>');
  });

  it('should handle Date objects', () => {
    const dates = [new Date('2023-01-01'), new Date('2023-06-15'), new Date('2023-12-31')];
    const transform = (date: Date) => date.toISOString().split('T')[0]!;
    expect(joinToString(dates, { transform })).toBe('2023-01-01, 2023-06-15, 2023-12-31');
  });

  // Performance with large arrays
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const result = joinToString(largeArray, { limit: 100 });
    const end = performance.now();
    
    expect(result).toMatch(/^0, 1, 2,.*99\.\.\.$/);
    expect(end - start).toBeLessThan(50); // Should complete quickly
  });

  it('should handle large arrays with complex transform efficiently', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `item${i}` }));
    const transform = (obj: { id: number; name: string }) => `${obj.id}:${obj.name}`;
    
    const start = performance.now();
    const result = joinToString(largeArray, { transform, limit: 50 });
    const end = performance.now();
    
    expect(result).toMatch(/^0:item0, 1:item1,.*49:item49\.\.\.$/);
    expect(end - start).toBeLessThan(50);
  });

  // Special characters and edge cases
  it('should handle strings with special characters', () => {
    const special = ['hello\nworld', 'tab\there', 'quote"test', "apostrophe's"];
    expect(joinToString(special)).toBe('hello\nworld, tab\there, quote"test, apostrophe\'s');
  });

  it('should handle empty strings', () => {
    expect(joinToString(['', 'a', '', 'b', ''])).toBe(', a, , b, ');
  });

  it('should handle arrays with only empty strings', () => {
    expect(joinToString(['', '', ''])).toBe(', , ');
  });

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(1000);
    const array = [longString, 'short', longString];
    const result = joinToString(array, { limit: 2, truncated: '...' });
    const expectedLength = longString.length + ', '.length + 'short'.length + '...'.length;
    expect(result).toHaveLength(expectedLength);
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => joinToString('not array' as any)).toThrow(ValidationError);
    expect(() => joinToString(null as any)).toThrow(ValidationError);
    expect(() => joinToString(undefined as any)).toThrow(ValidationError);
    expect(() => joinToString(42 as any)).toThrow(ValidationError);
    expect(() => joinToString({} as any)).toThrow(ValidationError);
  });

  // Options validation (these should not throw as options are optional)
  it('should handle invalid options gracefully', () => {
    expect(() => joinToString([1, 2, 3], {} as any)).not.toThrow();
    expect(() => joinToString([1, 2, 3], { separator: null } as any)).not.toThrow();
  });

  // Default behavior verification
  it('should use correct default values', () => {
    const array = [1, 2, 3];
    const withDefaults = joinToString(array, {});
    const withoutOptions = joinToString(array);
    
    expect(withDefaults).toBe(withoutOptions);
    expect(withDefaults).toBe('1, 2, 3'); // Default separator is ', '
  });

  it('should handle partial options objects', () => {
    expect(joinToString([1, 2, 3], { separator: '|' })).toBe('1|2|3');
    expect(joinToString([1, 2, 3], { prefix: '[' })).toBe('[1, 2, 3');
    expect(joinToString([1, 2, 3], { postfix: ']' })).toBe('1, 2, 3]');
    expect(joinToString([1, 2, 3], { limit: 2 })).toBe('1, 2...');
  });

  it('should maintain immutability of original array', () => {
    const original = [1, 2, 3];
    const originalCopy = [...original];
    
    joinToString(original, { transform: x => `modified_${x}` });
    
    expect(original).toEqual(originalCopy); // Original should be unchanged
  });

  it('should work with Symbol values', () => {
    const sym1 = Symbol('test1');
    const sym2 = Symbol('test2');
    const symbols = [sym1, sym2];
    
    const result = joinToString(symbols);
    expect(result).toContain('Symbol(test1)');
    expect(result).toContain('Symbol(test2)');
  });

  it('should handle BigInt values', () => {
    const bigInts = [BigInt(123), BigInt(456)];
    const result = joinToString(bigInts);
    expect(result).toBe('123, 456');
  });
});