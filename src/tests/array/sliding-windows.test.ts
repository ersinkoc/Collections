import { slidingWindows } from '../../core/array/sliding-windows';
import { ValidationError, RangeError } from '../../utils/errors';

describe('slidingWindows', () => {
  // Normal cases
  it('should create sliding windows with default step', () => {
    expect(slidingWindows([1, 2, 3, 4, 5], 3)).toEqual([
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]);
  });

  it('should create sliding windows with custom step', () => {
    expect(slidingWindows([1, 2, 3, 4, 5], 2, 2)).toEqual([
      [1, 2],
      [3, 4]
    ]);
  });

  it('should create sliding windows with step greater than window size', () => {
    expect(slidingWindows([1, 2, 3, 4, 5, 6, 7, 8], 2, 3)).toEqual([
      [1, 2],
      [4, 5],
      [7, 8]
    ]);
  });

  it('should work with string arrays', () => {
    const words = ['hello', 'world', 'test', 'array'];
    expect(slidingWindows(words, 2)).toEqual([
      ['hello', 'world'],
      ['world', 'test'],
      ['test', 'array']
    ]);
  });

  it('should work with object arrays', () => {
    const items = [
      { id: 1, name: 'first' },
      { id: 2, name: 'second' },
      { id: 3, name: 'third' },
      { id: 4, name: 'fourth' }
    ];
    expect(slidingWindows(items, 2, 2)).toEqual([
      [{ id: 1, name: 'first' }, { id: 2, name: 'second' }],
      [{ id: 3, name: 'third' }, { id: 4, name: 'fourth' }]
    ]);
  });

  it('should work with mixed data types', () => {
    const mixed = [1, 'hello', true, null, undefined];
    expect(slidingWindows(mixed, 3)).toEqual([
      [1, 'hello', true],
      ['hello', true, null],
      [true, null, undefined]
    ]);
  });

  it('should create single window when step equals array length', () => {
    expect(slidingWindows([1, 2, 3, 4], 2, 4)).toEqual([
      [1, 2]
    ]);
  });

  // Edge cases
  it('should handle empty array', () => {
    expect(slidingWindows([], 3)).toEqual([]);
  });

  it('should handle single element array', () => {
    expect(slidingWindows([1], 1)).toEqual([[1]]);
  });

  it('should return empty array when window size is larger than array', () => {
    expect(slidingWindows([1, 2, 3], 5)).toEqual([]);
  });

  it('should handle window size equal to array length', () => {
    expect(slidingWindows([1, 2, 3, 4], 4)).toEqual([[1, 2, 3, 4]]);
  });

  it('should handle window size of 1', () => {
    expect(slidingWindows([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it('should handle step of 1 (default)', () => {
    expect(slidingWindows([1, 2, 3, 4], 2, 1)).toEqual([
      [1, 2],
      [2, 3],
      [3, 4]
    ]);
  });

  it('should handle large step that skips elements', () => {
    expect(slidingWindows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, 4)).toEqual([
      [1, 2, 3],
      [5, 6, 7]
      // [9, 10] would be incomplete window, so it's not included
    ]);
  });

  it('should handle arrays with duplicate values', () => {
    expect(slidingWindows([1, 1, 2, 2, 3, 3], 2)).toEqual([
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3]
    ]);
  });

  it('should maintain reference equality for object elements', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const objects = [obj1, obj2, obj3];
    
    const result = slidingWindows(objects, 2);
    
    expect(result[0]![0]).toBe(obj1);
    expect(result[0]![1]).toBe(obj2);
    expect(result[1]![0]).toBe(obj2);
    expect(result[1]![1]).toBe(obj3);
  });

  // Boundary testing
  it('should handle arrays with null and undefined values', () => {
    const withNulls = [1, null, undefined, 2, null];
    expect(slidingWindows(withNulls, 3)).toEqual([
      [1, null, undefined],
      [null, undefined, 2],
      [undefined, 2, null]
    ]);
  });

  it('should work with boolean arrays', () => {
    const bools = [true, false, true, false];
    expect(slidingWindows(bools, 2, 2)).toEqual([
      [true, false],
      [true, false]
    ]);
  });

  it('should work with nested arrays', () => {
    const nested = [[1], [2, 3], [4, 5, 6], [7]];
    expect(slidingWindows(nested, 2)).toEqual([
      [[1], [2, 3]],
      [[2, 3], [4, 5, 6]],
      [[4, 5, 6], [7]]
    ]);
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => slidingWindows('not array' as any, 2)).toThrow(ValidationError);
    expect(() => slidingWindows(null as any, 2)).toThrow(ValidationError);
    expect(() => slidingWindows(undefined as any, 2)).toThrow(ValidationError);
    expect(() => slidingWindows(42 as any, 2)).toThrow(ValidationError);
    expect(() => slidingWindows({} as any, 2)).toThrow(ValidationError);
  });

  it('should throw RangeError for non-positive window size', () => {
    expect(() => slidingWindows([1, 2, 3], 0)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], -1)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], -5)).toThrow(RangeError);
  });

  it('should throw RangeError for non-integer window size', () => {
    expect(() => slidingWindows([1, 2, 3], 2.5)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], 1.1)).toThrow(RangeError);
  });

  it('should throw RangeError for non-positive step', () => {
    expect(() => slidingWindows([1, 2, 3], 2, 0)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], 2, -1)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], 2, -5)).toThrow(RangeError);
  });

  it('should throw RangeError for non-integer step', () => {
    expect(() => slidingWindows([1, 2, 3], 2, 1.5)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], 2, 2.1)).toThrow(RangeError);
  });

  it('should throw RangeError for non-numeric size and step', () => {
    expect(() => slidingWindows([1, 2, 3], 'invalid' as any)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], 2, 'invalid' as any)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], null as any)).toThrow(RangeError);
    expect(() => slidingWindows([1, 2, 3], 2, null as any)).toThrow(RangeError);
  });

  // Performance tests
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const result = slidingWindows(largeArray, 100, 50);
    const end = performance.now();
    
    expect(result).toHaveLength(199); // (10000 - 100) / 50 + 1 = 199
    expect(result[0]).toHaveLength(100);
    expect(result[0]![0]).toBe(0);
    expect(result[0]![99]).toBe(99);
    expect(result[1]![0]).toBe(50);
    expect(end - start).toBeLessThan(100); // Should complete quickly
  });

  it('should be efficient with small windows on large arrays', () => {
    const largeArray = Array.from({ length: 5000 }, (_, i) => i);
    
    const start = performance.now();
    const result = slidingWindows(largeArray, 2);
    const end = performance.now();
    
    expect(result).toHaveLength(4999); // 5000 - 2 + 1
    expect(result[0]).toEqual([0, 1]);
    expect(result[result.length - 1]).toEqual([4998, 4999]);
    expect(end - start).toBeLessThan(50);
  });

  it('should be efficient with large steps', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    
    const start = performance.now();
    const result = slidingWindows(array, 10, 100);
    const end = performance.now();
    
    expect(result).toHaveLength(10); // Should have 10 windows
    expect(result[0]).toHaveLength(10);
    expect(result[0]![0]).toBe(0);
    expect(result[1]![0]).toBe(100);
    expect(end - start).toBeLessThan(20);
  });

  it('should handle empty result efficiently', () => {
    const array = [1, 2, 3];
    
    const start = performance.now();
    const result = slidingWindows(array, 10); // Window larger than array
    const end = performance.now();
    
    expect(result).toEqual([]);
    expect(end - start).toBeLessThan(5);
  });

  // Complex scenarios
  it('should work with date objects', () => {
    const dates = [
      new Date('2023-01-01'),
      new Date('2023-06-15'),
      new Date('2023-12-31'),
      new Date('2024-03-15')
    ];
    
    const result = slidingWindows(dates, 2);
    
    expect(result).toHaveLength(3);
    expect(result[0]![0]).toBe(dates[0]);
    expect(result[0]![1]).toBe(dates[1]);
    expect(result[2]![0]).toBe(dates[2]);
    expect(result[2]![1]).toBe(dates[3]);
  });

  it('should work with functions as array elements', () => {
    const fn1 = () => 1;
    const fn2 = () => 2;
    const fn3 = () => 3;
    const functions = [fn1, fn2, fn3];
    
    const result = slidingWindows(functions, 2);
    
    expect(result).toHaveLength(2);
    expect(result[0]![0]).toBe(fn1);
    expect(result[0]![1]).toBe(fn2);
    expect(result[1]![0]).toBe(fn2);
    expect(result[1]![1]).toBe(fn3);
  });

  it('should create independent window arrays', () => {
    const array = [1, 2, 3, 4];
    const result = slidingWindows(array, 2);
    
    // Modifying one window should not affect others
    result[0]![0] = 999;
    expect(result[1]![0]).toBe(2); // Should remain unchanged
    expect(array[0]).toBe(1); // Original array should remain unchanged
  });

  it('should handle maximum safe integer values', () => {
    const bigNumbers = [Number.MAX_SAFE_INTEGER - 2, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER];
    const result = slidingWindows(bigNumbers, 2);
    
    expect(result).toEqual([
      [Number.MAX_SAFE_INTEGER - 2, Number.MAX_SAFE_INTEGER - 1],
      [Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER]
    ]);
  });
});