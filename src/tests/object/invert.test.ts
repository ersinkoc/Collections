import { invert } from '../../core/object/invert';
import { ValidationError } from '../../utils/errors';

describe('invert', () => {
  it('should invert object with string values', () => {
    const input = { a: '1', b: '2', c: '3' };
    const result = invert(input);
    
    expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
  });

  it('should invert object with number values', () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = invert(input);
    
    expect(result).toEqual({ 1: 'a', 2: 'b', 3: 'c' });
  });

  it('should invert object with mixed string and number values', () => {
    const input = { a: '1', b: 2, c: '3', d: 4 };
    const result = invert(input);
    
    expect(result).toEqual({ '1': 'a', 2: 'b', '3': 'c', 4: 'd' });
  });

  it('should handle empty object', () => {
    const input = {};
    const result = invert(input);
    
    expect(result).toEqual({});
  });

  it('should handle single property object', () => {
    const input = { key: 'value' };
    const result = invert(input);
    
    expect(result).toEqual({ value: 'key' });
  });

  it('should handle duplicate values by keeping last occurrence', () => {
    const input = { a: '1', b: '2', c: '1' };
    const result = invert(input);
    
    // The last key with value '1' should be kept
    expect(result).toEqual({ '1': 'c', '2': 'b' });
  });

  it('should handle numeric string keys and values', () => {
    const input = { '0': '1', '1': '0' };
    const result = invert(input);
    
    expect(result).toEqual({ '1': '0', '0': '1' });
  });

  it('should handle zero values', () => {
    const input = { a: 0, b: '0' };
    const result = invert(input);
    
    // Both numeric and string '0' will result in the same key, last one wins
    expect(result).toEqual({ 0: 'b' });
  });

  it('should handle negative number values', () => {
    const input = { a: -1, b: -2 };
    const result = invert(input);
    
    expect(result).toEqual({ '-1': 'a', '-2': 'b' });
  });

  it('should preserve key types in result values', () => {
    const input = { 'stringKey': '1', 123: '2' };
    const result = invert(input);
    
    expect(result).toEqual({ '1': 'stringKey', '2': '123' });
    expect(typeof result['1']).toBe('string');
    expect(typeof result['2']).toBe('string');
  });

  it('should only iterate over own properties', () => {
    const parent = { inherited: 'value' };
    const input = Object.create(parent);
    input.own = 'ownValue';
    
    const result = invert(input);
    
    expect(result).toEqual({ ownValue: 'own' });
    expect(result).not.toHaveProperty('value');
  });

  it('should handle large objects', () => {
    const input: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      input[`key${i}`] = i;
    }
    
    const result = invert(input);
    
    expect(Object.keys(result)).toHaveLength(1000);
    expect(result[0]).toBe('key0');
    expect(result[999]).toBe('key999');
  });

  // Edge cases
  it('should handle special string values', () => {
    const input = {
      empty: '',
      space: ' ',
      special: '@#$%',
      unicode: '🔥',
      newline: '\n'
    };
    const result = invert(input);
    
    expect(result).toEqual({
      '': 'empty',
      ' ': 'space',
      '@#$%': 'special',
      '🔥': 'unicode',
      '\n': 'newline'
    });
  });

  it('should handle very long string values', () => {
    const longValue = 'a'.repeat(1000);
    const input = { key: longValue };
    const result = invert(input);
    
    expect(result[longValue]).toBe('key');
  });

  // Error cases
  it('should throw ValidationError for null input', () => {
    expect(() => invert(null as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for undefined input', () => {
    expect(() => invert(undefined as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for string input', () => {
    expect(() => invert('string' as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for number input', () => {
    expect(() => invert(123 as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for boolean input', () => {
    expect(() => invert(true as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for array input', () => {
    expect(() => invert([1, 2, 3] as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for function input', () => {
    expect(() => invert((() => {}) as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle performance with large objects', () => {
    const input: Record<string, number> = {};
    for (let i = 0; i < 5000; i++) {
      input[`key${i}`] = i;
    }
    
    const start = performance.now();
    const result = invert(input);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(50); // Should complete in under 50ms
    expect(Object.keys(result)).toHaveLength(5000);
  });

  it('should maintain object integrity after inversion', () => {
    const input = { a: '1', b: '2', c: '3' };
    const result = invert(input);
    const doubleInvert = invert(result as any);
    
    expect(doubleInvert).toEqual(input);
  });

  it('should handle keys with special characters', () => {
    const input = {
      'key-with-dashes': '1',
      'key.with.dots': '2',
      'key with spaces': '3',
      'key_with_underscores': '4'
    };
    const result = invert(input);
    
    expect(result).toEqual({
      '1': 'key-with-dashes',
      '2': 'key.with.dots',
      '3': 'key with spaces',
      '4': 'key_with_underscores'
    });
  });

  it('should preserve original object immutability', () => {
    const input = { a: '1', b: '2' };
    const originalInput = { ...input };
    
    invert(input);
    
    expect(input).toEqual(originalInput);
  });

  it('should handle numeric zero as both key and value', () => {
    const input = { '0': 0 };
    const result = invert(input);
    
    expect(result).toEqual({ 0: '0' });
  });
});