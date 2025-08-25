import { difference } from '../../core/array/difference';
import { ValidationError } from '../../utils/errors';

describe('difference', () => {
  it('should return difference of two arrays', () => {
    expect(difference([1, 2, 3, 4], [2, 3])).toEqual([1, 4]);
    expect(difference(['a', 'b', 'c', 'd'], ['b', 'd'])).toEqual(['a', 'c']);
  });

  it('should return difference with multiple exclude arrays', () => {
    expect(difference([1, 2, 3, 4, 5], [2], [4], [5])).toEqual([1, 3]);
    expect(difference(['a', 'b', 'c'], ['a'], ['c'])).toEqual(['b']);
  });

  it('should remove duplicates from result', () => {
    expect(difference([1, 2, 2, 3, 3], [2])).toEqual([1, 3]);
    expect(difference(['a', 'a', 'b', 'b'], ['a'])).toEqual(['b']);
  });

  it('should handle empty arrays', () => {
    expect(difference([], [1, 2, 3])).toEqual([]);
    expect(difference([1, 2, 3], [])).toEqual([1, 2, 3]);
    expect(difference([1, 2, 3], [], [])).toEqual([1, 2, 3]);
  });

  it('should handle no exclusions', () => {
    expect(difference([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('should handle case where all elements are excluded', () => {
    expect(difference([1, 2, 3], [1, 2, 3])).toEqual([]);
    expect(difference([1, 2], [1], [2])).toEqual([]);
  });

  it('should handle case where no elements are excluded', () => {
    expect(difference([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3]);
  });

  it('should preserve order from first array', () => {
    expect(difference([3, 1, 4, 2], [1, 3])).toEqual([4, 2]);
  });

  it('should work with mixed types', () => {
    expect(difference([1, 'a', true, null], [1, true])).toEqual(['a', null]);
  });

  it('should throw ValidationError for non-array first argument', () => {
    expect(() => difference('not array' as any, [1, 2])).toThrow(ValidationError);
    expect(() => difference(null as any, [1, 2])).toThrow(ValidationError);
    expect(() => difference(undefined as any, [1, 2])).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-array exclusion arguments', () => {
    expect(() => difference([1, 2, 3], 'not array' as any)).toThrow(ValidationError);
    expect(() => difference([1, 2, 3], [1], 'not array' as any)).toThrow(ValidationError);
    expect(() => difference([1, 2, 3], [1], null as any)).toThrow(ValidationError);
  });

  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    const excludeArray = Array.from({ length: 5000 }, (_, i) => i * 2);
    const result = difference(largeArray, excludeArray);
    
    expect(result).toHaveLength(5000); // Should exclude 5000 even numbers (0, 2, 4, ..., 9998)
    expect(result[0]).toBe(1); // First odd number
    expect(result.includes(0)).toBe(false); // 0 should be excluded
    expect(result.includes(2)).toBe(false); // 2 should be excluded
    expect(result.includes(1)).toBe(true); // 1 should be included
    expect(result.includes(3)).toBe(true); // 3 should be included (odd)
  });

  it('should maintain performance with multiple exclusion arrays', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const exclude1 = [1, 3, 5];
    const exclude2 = [2, 4];
    const exclude3 = [7, 9];
    
    const result = difference(array, exclude1, exclude2, exclude3);
    expect(result).toEqual([6, 8, 10]);
  });
});