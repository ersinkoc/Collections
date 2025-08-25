import { padEnd } from '../../core/string/pad-end';
import { ValidationError } from '../../utils/errors';

describe('padEnd', () => {
  it('should pad string with spaces by default', () => {
    expect(padEnd('abc', 6)).toBe('abc   ');
    expect(padEnd('hello', 10)).toBe('hello     ');
    expect(padEnd('test', 8)).toBe('test    ');
  });

  it('should pad string with custom characters', () => {
    expect(padEnd('abc', 6, '0')).toBe('abc000');
    expect(padEnd('123', 8, '0')).toBe('12300000');
    expect(padEnd('test', 8, '_-')).toBe('test_-_-');
  });

  it('should not pad if string is already long enough', () => {
    expect(padEnd('abc', 3)).toBe('abc');
    expect(padEnd('hello', 5)).toBe('hello');
    expect(padEnd('toolong', 3)).toBe('toolong');
  });

  it('should handle empty string', () => {
    expect(padEnd('', 5)).toBe('     ');
    expect(padEnd('', 3, 'x')).toBe('xxx');
    expect(padEnd('', 0)).toBe('');
  });

  it('should handle zero or negative target length', () => {
    expect(padEnd('abc', 0)).toBe('abc');
    expect(padEnd('abc', -5)).toBe('abc');
    expect(padEnd('hello', -1)).toBe('hello');
  });

  it('should handle empty padding characters', () => {
    expect(padEnd('abc', 6, '')).toBe('abc');
    expect(padEnd('test', 10, '')).toBe('test');
  });

  it('should truncate padding if it exceeds needed length', () => {
    expect(padEnd('abc', 6, '_-')).toBe('abc_-_');
    expect(padEnd('x', 4, '123456')).toBe('x123');
    expect(padEnd('test', 7, 'xyz')).toBe('testxyz');
  });

  it('should work with single character padding', () => {
    expect(padEnd('5', 3, '0')).toBe('500');
    expect(padEnd('test', 6, '*')).toBe('test**');
    expect(padEnd('a', 5, '#')).toBe('a####');
  });

  it('should handle multi-character padding correctly', () => {
    expect(padEnd('abc', 9, '123')).toBe('abc123123');
    expect(padEnd('test', 10, 'xy')).toBe('testxyxyxy');
    expect(padEnd('hi', 8, 'abc')).toBe('hiabcabc');
  });

  it('should work with special characters', () => {
    expect(padEnd('hello', 8, '*')).toBe('hello***');
    expect(padEnd('test', 8, '-')).toBe('test----');
    expect(padEnd('a', 5, '_')).toBe('a____');
  });

  it('should work with unicode characters', () => {
    expect(padEnd('hello', 8, '€')).toBe('hello€€€');
    expect(padEnd('test', 8, '🚀')).toBe('test🚀🚀'); // 🚀 is 2 chars, so need 4 more = 2 emojis
    expect(padEnd('', 3, '★')).toBe('★★★');
  });

  it('should handle complex unicode strings', () => {
    expect(padEnd('café', 6, '·')).toBe('café··');
    expect(padEnd('naïve', 8, '→')).toBe('naïve→→→');
  });

  it('should throw ValidationError for non-string input', () => {
    expect(() => padEnd(123 as any, 5)).toThrow(ValidationError);
    expect(() => padEnd(null as any, 5)).toThrow(ValidationError);
    expect(() => padEnd(undefined as any, 5)).toThrow(ValidationError);
    expect(() => padEnd([] as any, 5)).toThrow(ValidationError);
    expect(() => padEnd({} as any, 5)).toThrow(ValidationError);
    expect(() => padEnd(true as any, 5)).toThrow(ValidationError);
  });

  it('should handle edge cases', () => {
    expect(padEnd('a', 1)).toBe('a');
    expect(padEnd('abc', 100, 'x')).toHaveLength(100);
    expect(padEnd('abc', 100, 'x')).toMatch(/^abc.*x+$/);
    expect(padEnd('test', 1000, '0')).toHaveLength(1000);
    expect(padEnd('test', 1000, '0')).toMatch(/^test0+$/);
  });

  it('should maintain original string when target length is equal', () => {
    const original = 'exactly8';
    expect(padEnd(original, 8)).toBe(original);
    expect(padEnd('same', 4)).toBe('same');
  });

  it('should work with numeric strings', () => {
    expect(padEnd('42', 5, '0')).toBe('42000');
    expect(padEnd('3.14', 8, '0')).toBe('3.140000'); // 3.14 is 4 chars, need 4 more = 4 zeros
    expect(padEnd('-123', 7, '0')).toBe('-123000');
  });

  it('should handle large padding requirements efficiently', () => {
    const result = padEnd('test', 50, 'x');
    expect(result).toHaveLength(50);
    expect(result.startsWith('test')).toBe(true);
    expect(result.substring(4)).toBe('x'.repeat(46));
  });

  it('should work with whitespace characters', () => {
    expect(padEnd('test', 8, '\\t')).toBe('test\\t\\t'); // \\t is 2 chars, need 4 more = 2 tabs
    expect(padEnd('a', 4, ' ')).toBe('a   ');
    expect(padEnd('hello', 11, '\\n')).toBe('hello\\n\\n\\n'); // \\n is 2 chars, need 6 more = 3 newlines
  });

  it('should preserve exact behavior from examples in documentation', () => {
    expect(padEnd('abc', 6)).toBe('abc   ');
    expect(padEnd('abc', 6, '_-')).toBe('abc_-_');
    expect(padEnd('abc', 3)).toBe('abc');
    expect(padEnd('abc', 2)).toBe('abc');
    expect(padEnd('123', 8, '0')).toBe('12300000');
  });

  it('should handle boundary conditions', () => {
    // String with length 0, pad to 0
    expect(padEnd('', 0)).toBe('');
    // String with length 1, pad to 1
    expect(padEnd('a', 1)).toBe('a');
    // Exact match of string length
    expect(padEnd('exact', 5)).toBe('exact');
    // Single character string with single character padding
    expect(padEnd('a', 2, 'b')).toBe('ab');
  });

  it('should work correctly with repeated multi-character patterns', () => {
    expect(padEnd('start', 11, 'abc')).toBe('startabcabc');
    expect(padEnd('x', 7, '12345')).toBe('x123451');
    expect(padEnd('test', 12, 'xyz')).toBe('testxyzxyzxy');
  });
});