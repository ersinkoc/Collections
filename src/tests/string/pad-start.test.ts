import { padStart } from '../../core/string/pad-start';
import { ValidationError } from '../../utils/errors';

describe('padStart', () => {
  it('should pad string with spaces by default', () => {
    expect(padStart('abc', 6)).toBe('   abc');
    expect(padStart('hello', 10)).toBe('     hello');
  });

  it('should pad string with custom characters', () => {
    expect(padStart('abc', 6, '0')).toBe('000abc');
    expect(padStart('123', 8, '0')).toBe('00000123');
    expect(padStart('test', 8, '-=')).toBe('-=-=test');
  });

  it('should not pad if string is already long enough', () => {
    expect(padStart('abc', 3)).toBe('abc');
    expect(padStart('hello', 5)).toBe('hello');
    expect(padStart('toolong', 3)).toBe('toolong');
  });

  it('should handle empty string', () => {
    expect(padStart('', 5)).toBe('     ');
    expect(padStart('', 3, 'x')).toBe('xxx');
  });

  it('should handle zero or negative target length', () => {
    expect(padStart('abc', 0)).toBe('abc');
    expect(padStart('abc', -5)).toBe('abc');
  });

  it('should handle empty padding characters', () => {
    expect(padStart('abc', 6, '')).toBe('abc');
  });

  it('should truncate padding if it exceeds needed length', () => {
    expect(padStart('abc', 6, '_-')).toBe('_-_abc');
    expect(padStart('x', 4, '123456')).toBe('123x');
  });

  it('should work with single character padding', () => {
    expect(padStart('5', 3, '0')).toBe('005');
    expect(padStart('test', 6, '*')).toBe('**test');
  });

  it('should handle multi-character padding correctly', () => {
    expect(padStart('abc', 9, '123')).toBe('123123abc');
    expect(padStart('test', 10, 'xy')).toBe('xyxyxytest');
  });

  it('should work with special characters', () => {
    expect(padStart('hello', 8, '*')).toBe('***hello'); // Use simpler character
    expect(padStart('test', 8, '\\n')).toBe('\\n\\ntest'); // '\\n' is 2 chars, need 4 more = 2 repetitions
  });

  it('should throw ValidationError for non-string input', () => {
    expect(() => padStart(123 as any, 5)).toThrow(ValidationError);
    expect(() => padStart(null as any, 5)).toThrow(ValidationError);
    expect(() => padStart(undefined as any, 5)).toThrow(ValidationError);
    expect(() => padStart([] as any, 5)).toThrow(ValidationError);
  });

  it('should handle edge cases', () => {
    expect(padStart('a', 1)).toBe('a');
    expect(padStart('abc', 100, 'x')).toHaveLength(100);
    expect(padStart('abc', 100, 'x')).toMatch(/^x+abc$/);
  });

  it('should maintain original string when target length is equal', () => {
    const original = 'exactly8';
    expect(padStart(original, 8)).toBe(original); // Same string content
    // When no padding is needed, the original string is returned unchanged
  });

  it('should work with numeric strings', () => {
    expect(padStart('42', 5, '0')).toBe('00042');
    expect(padStart('3.14', 8, '0')).toBe('00003.14');
  });
});