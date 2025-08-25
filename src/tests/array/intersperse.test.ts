import { intersperse } from '../../core/array/intersperse';
import { ValidationError } from '../../utils/errors';

describe('intersperse', () => {
  it('should insert separator between elements', () => {
    expect(intersperse([1, 2, 3, 4], 0)).toEqual([1, 0, 2, 0, 3, 0, 4]);
    expect(intersperse(['a', 'b', 'c'], '-')).toEqual(['a', '-', 'b', '-', 'c']);
  });

  it('should handle single element array', () => {
    expect(intersperse([1], 0)).toEqual([1]);
    expect(intersperse(['a'], '-')).toEqual(['a']);
  });

  it('should handle empty array', () => {
    expect(intersperse([], 0)).toEqual([]);
    expect(intersperse([], 'separator')).toEqual([]);
  });

  it('should handle two element array', () => {
    expect(intersperse([1, 2], 0)).toEqual([1, 0, 2]);
    expect(intersperse(['first', 'last'], 'middle')).toEqual(['first', 'middle', 'last']);
  });

  it('should work with different types', () => {
    expect(intersperse([true, false, true], null)).toEqual([true, null, false, null, true]);
    expect(intersperse([{ a: 1 }, { b: 2 }], { sep: true } as any)).toEqual([
      { a: 1 },
      { sep: true } as any,
      { b: 2 }
    ]);
  });

  it('should maintain immutability', () => {
    const original = [1, 2, 3];
    const result = intersperse(original, 0);
    expect(result).not.toBe(original);
    expect(original).toEqual([1, 2, 3]);
  });

  it('should throw ValidationError for non-array input', () => {
    expect(() => intersperse('not array' as any, 0)).toThrow(ValidationError);
    expect(() => intersperse(null as any, 0)).toThrow(ValidationError);
    expect(() => intersperse(undefined as any, 0)).toThrow(ValidationError);
    expect(() => intersperse(123 as any, 0)).toThrow(ValidationError);
  });

  it('should handle undefined as separator', () => {
    expect(intersperse([1, 2, 3], undefined)).toEqual([1, undefined, 2, undefined, 3]);
  });

  it('should handle arrays with mixed types', () => {
    const mixed = [1, 'two', true, null];
    expect(intersperse(mixed, '|')).toEqual([1, '|', 'two', '|', true, '|', null]);
  });

  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => i);
    const result = intersperse(largeArray, -1);
    expect(result).toHaveLength(1999); // 1000 elements + 999 separators
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(-1);
    expect(result[result.length - 1]).toBe(999);
  });
});