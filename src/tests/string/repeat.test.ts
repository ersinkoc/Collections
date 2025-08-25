import { repeat } from '../../core/string/repeat';
import { ValidationError } from '../../utils/errors';

describe('repeat', () => {
  it('should repeat string n times', () => {
    expect(repeat('abc', 3)).toBe('abcabcabc');
    expect(repeat('x', 5)).toBe('xxxxx');
    expect(repeat('hello', 2)).toBe('hellohello');
    expect(repeat('test', 1)).toBe('test');
  });

  it('should return empty string for zero repetitions', () => {
    expect(repeat('abc', 0)).toBe('');
    expect(repeat('hello', 0)).toBe('');
    expect(repeat('x', 0)).toBe('');
  });

  it('should return empty string for negative repetitions', () => {
    expect(repeat('abc', -1)).toBe('');
    expect(repeat('test', -5)).toBe('');
    expect(repeat('hello', -100)).toBe('');
  });

  it('should handle empty string input', () => {
    expect(repeat('', 3)).toBe('');
    expect(repeat('', 0)).toBe('');
    expect(repeat('', 10)).toBe('');
    expect(repeat('', -1)).toBe('');
  });

  it('should work with single character strings', () => {
    expect(repeat('a', 5)).toBe('aaaaa');
    expect(repeat('1', 3)).toBe('111');
    expect(repeat(' ', 4)).toBe('    ');
    expect(repeat('*', 7)).toBe('*******');
  });

  it('should work with multi-character strings', () => {
    expect(repeat('ab', 3)).toBe('ababab');
    expect(repeat('123', 2)).toBe('123123');
    expect(repeat('hello world', 2)).toBe('hello worldhello world');
  });

  it('should work with special characters', () => {
    expect(repeat('\\n', 3)).toBe('\\n\\n\\n');
    expect(repeat('\\t', 2)).toBe('\\t\\t');
    expect(repeat('\\\\', 4)).toBe('\\\\\\\\\\\\\\\\');
    expect(repeat('\"', 3)).toBe('\"\"\"');
    expect(repeat("'", 2)).toBe("''");
  });

  it('should work with unicode characters', () => {
    expect(repeat('€', 3)).toBe('€€€');
    expect(repeat('🚀', 2)).toBe('🚀🚀');
    expect(repeat('★', 4)).toBe('★★★★');
    expect(repeat('café', 2)).toBe('cafécafé');
  });

  it('should work with numeric strings', () => {
    expect(repeat('42', 3)).toBe('424242');
    expect(repeat('3.14', 2)).toBe('3.143.14');
    expect(repeat('-1', 4)).toBe('-1-1-1-1');
    expect(repeat('0', 5)).toBe('00000');
  });

  it('should throw ValidationError for non-string input', () => {
    expect(() => repeat(123 as any, 3)).toThrow(ValidationError);
    expect(() => repeat(null as any, 3)).toThrow(ValidationError);
    expect(() => repeat(undefined as any, 3)).toThrow(ValidationError);
    expect(() => repeat([] as any, 3)).toThrow(ValidationError);
    expect(() => repeat({} as any, 3)).toThrow(ValidationError);
    expect(() => repeat(true as any, 3)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-integer n', () => {
    expect(() => repeat('test', 3.5)).toThrow(ValidationError);
    expect(() => repeat('test', 3.14)).toThrow(ValidationError);
    expect(() => repeat('test', NaN)).toThrow(ValidationError);
    expect(() => repeat('test', Infinity)).toThrow(ValidationError);
    expect(() => repeat('test', -Infinity)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-number n', () => {
    expect(() => repeat('test', '3' as any)).toThrow(ValidationError);
    expect(() => repeat('test', null as any)).toThrow(ValidationError);
    expect(() => repeat('test', undefined as any)).toThrow(ValidationError);
    expect(() => repeat('test', {} as any)).toThrow(ValidationError);
    expect(() => repeat('test', [] as any)).toThrow(ValidationError);
    expect(() => repeat('test', true as any)).toThrow(ValidationError);
  });

  it('should handle large repetition counts efficiently', () => {
    const result = repeat('x', 1000);
    expect(result).toHaveLength(1000);
    expect(result).toBe('x'.repeat(1000));
  });

  it('should work with strings containing spaces', () => {
    expect(repeat('a b', 3)).toBe('a ba ba b');
    expect(repeat(' ', 5)).toBe('     ');
    expect(repeat('  ', 3)).toBe('      ');
  });

  it('should preserve exact behavior from documentation examples', () => {
    expect(repeat('abc', 3)).toBe('abcabcabc');
    expect(repeat('x', 5)).toBe('xxxxx');
    expect(repeat('hello', 0)).toBe('');
    expect(repeat('test', -1)).toBe('');
    expect(repeat('', 3)).toBe('');
  });

  it('should handle boundary conditions', () => {
    // Minimum valid repetition count
    expect(repeat('test', 1)).toBe('test');
    // Zero repetitions
    expect(repeat('test', 0)).toBe('');
    // Single character, single repetition
    expect(repeat('a', 1)).toBe('a');
    // Empty string, valid repetition
    expect(repeat('', 1)).toBe('');
  });

  it('should work with whitespace and control characters', () => {
    expect(repeat('\\r\\n', 2)).toBe('\\r\\n\\r\\n');
    expect(repeat('\\t', 3)).toBe('\\t\\t\\t');
    expect(repeat('\\f', 2)).toBe('\\f\\f');
    expect(repeat('\\v', 2)).toBe('\\v\\v');
  });

  it('should handle very large strings with small repetition counts', () => {
    const longString = 'a'.repeat(100);
    const result = repeat(longString, 2);
    expect(result).toHaveLength(200);
    expect(result).toBe(longString + longString);
  });

  it('should maintain string integrity with complex characters', () => {
    const complexString = 'Hello 🌍 World! 123 @#$%';
    const result = repeat(complexString, 2);
    expect(result).toBe(complexString + complexString);
    expect(result).toHaveLength(complexString.length * 2);
  });

  it('should work correctly with edge case integers', () => {
    expect(repeat('test', 0)).toBe('');
    expect(repeat('test', -0)).toBe('');
    expect(repeat('abc', Math.floor(2.9))).toBe('abcabc');
    expect(repeat('x', Math.floor(-1.5))).toBe('');
  });

  it('should handle performance-sensitive scenarios', () => {
    // Test with moderate size to ensure efficiency
    const result = repeat('abc123', 100);
    expect(result).toHaveLength(600);
    expect(result.startsWith('abc123abc123')).toBe(true);
    expect(result.endsWith('abc123abc123')).toBe(true);
  });
});