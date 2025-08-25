import { withoutAll } from '../../core/array/without-all';
import { ValidationError } from '../../utils/errors';

describe('withoutAll', () => {
  // Normal cases
  it('should remove all specified values from array', () => {
    expect(withoutAll([1, 2, 3, 4, 5], [2, 4])).toEqual([1, 3, 5]);
    expect(withoutAll(['a', 'b', 'c', 'd'], ['b', 'd'])).toEqual(['a', 'c']);
  });

  it('should remove multiple occurrences of specified values', () => {
    expect(withoutAll([1, 2, 2, 3, 4, 4, 5], [2, 4])).toEqual([1, 3, 5]);
    expect(withoutAll(['a', 'b', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
  });

  it('should work with mixed data types', () => {
    const mixed = [1, 'hello', true, null, undefined, 42];
    expect(withoutAll(mixed, [1, true, null])).toEqual(['hello', undefined, 42]);
  });

  it('should work with object arrays', () => {
    const obj1 = { id: 1, name: 'first' };
    const obj2 = { id: 2, name: 'second' };
    const obj3 = { id: 3, name: 'third' };
    const objects = [obj1, obj2, obj3, obj1]; // obj1 appears twice
    
    expect(withoutAll(objects, [obj1, obj3])).toEqual([obj2]);
  });

  it('should work with string arrays', () => {
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    expect(withoutAll(words, ['banana', 'date'])).toEqual(['apple', 'cherry', 'elderberry']);
  });

  it('should work with boolean arrays', () => {
    const bools = [true, false, true, false, true];
    expect(withoutAll(bools, [false])).toEqual([true, true, true]);
  });

  it('should maintain original order of remaining elements', () => {
    expect(withoutAll([5, 1, 3, 2, 4], [2, 5])).toEqual([1, 3, 4]);
  });

  it('should remove values that appear multiple times in values array', () => {
    expect(withoutAll([1, 2, 3, 4, 5], [2, 2, 4, 4])).toEqual([1, 3, 5]);
  });

  // Edge cases
  it('should handle empty array', () => {
    expect(withoutAll([], [1, 2, 3])).toEqual([]);
  });

  it('should handle empty values array', () => {
    expect(withoutAll([1, 2, 3, 4, 5], [])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle both arrays empty', () => {
    expect(withoutAll([], [])).toEqual([]);
  });

  it('should handle single element array', () => {
    expect(withoutAll([5], [5])).toEqual([]);
    expect(withoutAll([5], [3])).toEqual([5]);
  });

  it('should handle single value to remove', () => {
    expect(withoutAll([1, 2, 3, 4, 5], [3])).toEqual([1, 2, 4, 5]);
  });

  it('should return copy when no values to remove are found', () => {
    const original = [1, 2, 3, 4, 5];
    const result = withoutAll(original, [6, 7, 8]);
    
    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(original); // Should be a copy
  });

  it('should return empty array when all elements are removed', () => {
    expect(withoutAll([1, 2, 3], [1, 2, 3])).toEqual([]);
  });

  it('should handle duplicate values in original array', () => {
    expect(withoutAll([1, 1, 2, 2, 3, 3], [1, 3])).toEqual([2, 2]);
  });

  it('should handle arrays with all same values', () => {
    expect(withoutAll([5, 5, 5, 5], [5])).toEqual([]);
    expect(withoutAll([5, 5, 5, 5], [3])).toEqual([5, 5, 5, 5]);
  });

  // Boundary testing
  it('should handle arrays with null and undefined values', () => {
    const withNulls = [1, null, 2, undefined, 3, null];
    expect(withoutAll(withNulls, [null, undefined])).toEqual([1, 2, 3]);
  });

  it('should distinguish between null and undefined', () => {
    const array = [null, undefined, null, undefined];
    expect(withoutAll(array, [null])).toEqual([undefined, undefined]);
    expect(withoutAll(array, [undefined])).toEqual([null, null]);
  });

  it('should work with zero values', () => {
    const withZeros = [0, 1, 0, 2, 0, 3];
    expect(withoutAll(withZeros, [0])).toEqual([1, 2, 3]);
  });

  it('should handle negative numbers', () => {
    const negatives = [-5, -3, -1, 1, 3, 5];
    expect(withoutAll(negatives, [-3, 1])).toEqual([-5, -1, 3, 5]);
  });

  it('should handle floating point numbers', () => {
    const floats = [1.1, 2.2, 3.3, 4.4, 5.5];
    expect(withoutAll(floats, [2.2, 4.4])).toEqual([1.1, 3.3, 5.5]);
  });

  it('should handle very large numbers', () => {
    const bigNumbers = [Number.MAX_SAFE_INTEGER, 1, 2, Number.MAX_SAFE_INTEGER];
    expect(withoutAll(bigNumbers, [Number.MAX_SAFE_INTEGER])).toEqual([1, 2]);
  });

  it('should handle very small numbers', () => {
    const smallNumbers = [Number.MIN_VALUE, 0, Number.MIN_VALUE, 1];
    expect(withoutAll(smallNumbers, [Number.MIN_VALUE])).toEqual([0, 1]);
  });

  it('should handle infinity values', () => {
    const withInfinity = [1, Infinity, 2, -Infinity, 3];
    expect(withoutAll(withInfinity, [Infinity, -Infinity])).toEqual([1, 2, 3]);
  });

  it('should handle NaN values', () => {
    const withNaN = [1, NaN, 2, NaN, 3];
    expect(withoutAll(withNaN, [NaN])).toEqual([1, 2, 3]);
  });

  // Error cases
  it('should throw ValidationError for non-array first argument', () => {
    expect(() => withoutAll('not array' as any, [1, 2])).toThrow(ValidationError);
    expect(() => withoutAll(null as any, [1, 2])).toThrow(ValidationError);
    expect(() => withoutAll(undefined as any, [1, 2])).toThrow(ValidationError);
    expect(() => withoutAll(42 as any, [1, 2])).toThrow(ValidationError);
    expect(() => withoutAll({} as any, [1, 2])).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-array values argument', () => {
    expect(() => withoutAll([1, 2, 3], 'not array' as any)).toThrow(ValidationError);
    expect(() => withoutAll([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => withoutAll([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => withoutAll([1, 2, 3], 42 as any)).toThrow(ValidationError);
    expect(() => withoutAll([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 100000 }, (_, i) => i);
    const valuesToRemove = Array.from({ length: 1000 }, (_, i) => i * 10);
    
    const start = performance.now();
    const result = withoutAll(largeArray, valuesToRemove);
    const end = performance.now();
    
    expect(result).toHaveLength(99000); // Should remove 1000 values
    expect(result.includes(0)).toBe(false); // 0 should be removed
    expect(result.includes(10)).toBe(false); // 10 should be removed
    expect(result.includes(1)).toBe(true); // 1 should remain
    expect(result.includes(11)).toBe(true); // 11 should remain
    expect(end - start).toBeLessThan(100); // Should complete quickly
  });

  it('should be efficient with many values to remove', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    const valuesToRemove = Array.from({ length: 500 }, (_, i) => i * 2); // Remove even numbers
    
    const start = performance.now();
    const result = withoutAll(array, valuesToRemove);
    const end = performance.now();
    
    expect(result).toHaveLength(500); // Should have 500 odd numbers
    expect(result[0]).toBe(1); // First odd number
    expect(result[1]).toBe(3); // Second odd number
    expect(end - start).toBeLessThan(50);
  });

  it('should maintain performance with duplicate removal values', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i % 10);
    const duplicateValues = Array.from({ length: 100 }, () => 5); // Remove all 5s
    
    const start = performance.now();
    const result = withoutAll(array, duplicateValues);
    const end = performance.now();
    
    expect(result.includes(5)).toBe(false);
    expect(result.length).toBe(900); // Should remove all instances of 5
    expect(end - start).toBeLessThan(30);
  });

  it('should be efficient when no elements are removed', () => {
    const array = Array.from({ length: 10000 }, (_, i) => i);
    const nonExistentValues = [-1, -2, -3, 20000, 30000];
    
    const start = performance.now();
    const result = withoutAll(array, nonExistentValues);
    const end = performance.now();
    
    expect(result).toHaveLength(10000);
    expect(result[0]).toBe(0);
    expect(result[9999]).toBe(9999);
    expect(end - start).toBeLessThan(20);
  });

  // Complex scenarios
  it('should work with nested arrays', () => {
    const arr1 = [1, 2];
    const arr2 = [3, 4];
    const arr3 = [5, 6];
    const nested = [arr1, arr2, arr3, arr1]; // arr1 appears twice
    
    const result = withoutAll(nested, [arr1, arr3]);
    
    expect(result).toEqual([arr2]);
    expect(result[0]).toBe(arr2); // Reference equality maintained
  });

  it('should work with date objects', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-06-15');
    const date3 = new Date('2023-12-31');
    const dates = [date1, date2, date3, date1];
    
    const result = withoutAll(dates, [date1]);
    
    expect(result).toEqual([date2, date3]);
    expect(result.length).toBe(2);
  });

  it('should work with functions as array elements', () => {
    const fn1 = () => 1;
    const fn2 = () => 2;
    const fn3 = () => 3;
    const functions = [fn1, fn2, fn3, fn1];
    
    const result = withoutAll(functions, [fn1, fn3]);
    
    expect(result).toEqual([fn2]);
    expect(result[0]).toBe(fn2);
  });

  it('should preserve reference equality for remaining elements', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const objects = [obj1, obj2, obj3];
    
    const result = withoutAll(objects, [obj2]);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(obj1); // Same reference
    expect(result[1]).toBe(obj3); // Same reference
  });

  it('should handle symbol values', () => {
    const sym1 = Symbol('test1');
    const sym2 = Symbol('test2');
    const sym3 = Symbol('test3');
    const symbols = [sym1, sym2, sym3, sym1];
    
    const result = withoutAll(symbols, [sym1]);
    
    expect(result).toEqual([sym2, sym3]);
  });

  it('should work with regular expressions', () => {
    const regex1 = /test1/g;
    const regex2 = /test2/g;
    const regex3 = /test3/g;
    const regexes = [regex1, regex2, regex3];
    
    const result = withoutAll(regexes, [regex2]);
    
    expect(result).toEqual([regex1, regex3]);
  });

  it('should handle deeply nested object removal', () => {
    const deepObj1 = { a: { b: { c: 1 } } };
    const deepObj2 = { a: { b: { c: 2 } } };
    const deepObj3 = { a: { b: { c: 3 } } };
    const deepObjects = [deepObj1, deepObj2, deepObj3];
    
    const result = withoutAll(deepObjects, [deepObj2]);
    
    expect(result).toEqual([deepObj1, deepObj3]);
  });

  it('should work with array-like objects converted to arrays', () => {
    const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
    const realArray = Array.from(arrayLike as any);
    
    const result = withoutAll(realArray, ['b']);
    
    expect(result).toEqual(['a', 'c']);
  });

  it('should handle sparse arrays', () => {
    const sparse = [1, , 3, , 5]; // Array with holes
    const result = withoutAll(sparse, [undefined]);
    
    // Note: sparse array holes are treated as undefined
    expect(result).toEqual([1, 3, 5]);
  });

  it('should maintain original array immutability', () => {
    const original = [1, 2, 3, 4, 5];
    const result = withoutAll(original, [2, 4]);
    
    expect(original).toEqual([1, 2, 3, 4, 5]); // Original unchanged
    expect(result).toEqual([1, 3, 5]);
    
    // Modifying result should not affect original
    result.push(999);
    expect(original).toHaveLength(5);
  });

  it('should work with class instances', () => {
    class TestClass {
      constructor(public value: number) {}
    }
    
    const instance1 = new TestClass(1);
    const instance2 = new TestClass(2);
    const instance3 = new TestClass(3);
    const instances = [instance1, instance2, instance3];
    
    const result = withoutAll(instances, [instance2]);
    
    expect(result).toEqual([instance1, instance3]);
    expect(result[0]).toBe(instance1);
    expect(result[1]).toBe(instance3);
  });

  it('should handle complex filtering with multiple data types', () => {
    const complex = [
      1, 'string', true, null, undefined, 
      { obj: 'test' }, [1, 2, 3], () => 'function',
      new Date(), /regex/
    ];
    
    const toRemove = [1, true, null, { obj: 'test' }];
    const result = withoutAll(complex, toRemove);
    
    // Should remove primitive values but keep object references that don't match
    expect(result.includes(1)).toBe(false);
    expect(result.includes(true)).toBe(false);
    expect(result.includes(null)).toBe(false);
    expect(result.includes('string')).toBe(true);
    expect(result.includes(undefined)).toBe(true);
    // Object should remain since it's a different reference
    expect(result.some(item => typeof item === 'object' && item !== null && 'obj' in item)).toBe(true);
  });
});