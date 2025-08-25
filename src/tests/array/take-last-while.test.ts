import { takeLastWhile } from '../../core/array/take-last-while';
import { ValidationError } from '../../utils/errors';

describe('takeLastWhile', () => {
  // Normal cases
  it('should take elements from end while predicate is true', () => {
    const result = takeLastWhile([1, 2, 3, 4, 5], x => x > 2);
    expect(result).toEqual([3, 4, 5]);
  });

  it('should take elements from end based on condition', () => {
    const result = takeLastWhile([1, 2, 3, 2, 1], x => x < 3);
    expect(result).toEqual([2, 1]);
  });

  it('should work with string arrays', () => {
    const words = ['apple', 'banana', 'cherry', 'cat'];
    const result = takeLastWhile(words, word => word.length <= 6);
    expect(result).toEqual(['apple', 'banana', 'cherry', 'cat']); // All words are <= 6 chars
  });

  it('should work with object arrays', () => {
    const items = [
      { id: 1, active: true },
      { id: 2, active: true },
      { id: 3, active: false },
      { id: 4, active: false }
    ];
    const result = takeLastWhile(items, item => !item.active);
    expect(result).toEqual([
      { id: 3, active: false },
      { id: 4, active: false }
    ]);
  });

  it('should work with boolean conditions', () => {
    const booleans = [false, true, true, false, false];
    const result = takeLastWhile(booleans, x => !x);
    expect(result).toEqual([false, false]);
  });

  it('should work with numeric conditions', () => {
    const numbers = [10, 8, 6, 4, 2, 1, 3, 5];
    const result = takeLastWhile(numbers, x => x % 2 === 1);
    expect(result).toEqual([1, 3, 5]);
  });

  it('should work with mixed data types', () => {
    const mixed = [1, 'hello', true, null, undefined, 0];
    const result = takeLastWhile(mixed, x => !x); // Take falsy values from end
    expect(result).toEqual([null, undefined, 0]);
  });

  // Edge cases
  it('should handle empty array', () => {
    const result = takeLastWhile([], () => true);
    expect(result).toEqual([]);
  });

  it('should handle single element array - take', () => {
    const result = takeLastWhile([5], x => x > 3);
    expect(result).toEqual([5]);
  });

  it('should handle single element array - do not take', () => {
    const result = takeLastWhile([1], x => x > 3);
    expect(result).toEqual([]);
  });

  it('should return full array when all elements match predicate', () => {
    const result = takeLastWhile([1, 2, 3, 4, 5], () => true);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return empty array when no elements match predicate', () => {
    const result = takeLastWhile([1, 2, 3, 4, 5], () => false);
    expect(result).toEqual([]);
  });

  it('should return empty array when first element from end fails predicate', () => {
    const result = takeLastWhile([1, 2, 3, 4, 5], x => x < 5);
    expect(result).toEqual([]);
  });

  it('should handle complex predicate conditions', () => {
    const numbers = [10, 8, 6, 4, 2, 1, 3, 5];
    const result = takeLastWhile(numbers, x => x % 2 === 1);
    expect(result).toEqual([1, 3, 5]);
  });

  it('should handle arrays with duplicate values', () => {
    const duplicates = [1, 2, 2, 3, 3, 3];
    const result = takeLastWhile(duplicates, x => x === 3);
    expect(result).toEqual([3, 3, 3]);
  });

  it('should provide correct parameters to predicate function', () => {
    const items = ['a', 'b', 'c', 'd'];
    const mockPredicate = jest.fn((_value, index, _array) => index >= 2);
    
    takeLastWhile(items, mockPredicate);
    
    // Should be called from end to beginning until predicate fails
    expect(mockPredicate).toHaveBeenNthCalledWith(1, 'd', 3, items);
    expect(mockPredicate).toHaveBeenNthCalledWith(2, 'c', 2, items);
    expect(mockPredicate).toHaveBeenNthCalledWith(3, 'b', 1, items);
    expect(mockPredicate).not.toHaveBeenCalledWith('a', 0, items);
  });

  it('should stop taking when predicate returns false', () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const mockPredicate = jest.fn(x => x > 5);
    
    const result = takeLastWhile(numbers, mockPredicate);
    
    expect(result).toEqual([6, 7, 8]);
    expect(mockPredicate).toHaveBeenCalledTimes(4); // 8, 7, 6, 5 - stops at 5
  });

  it('should take all elements when predicate is always true', () => {
    const numbers = [1, 2, 3, 4, 5];
    const mockPredicate = jest.fn(() => true);
    
    const result = takeLastWhile(numbers, mockPredicate);
    
    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(mockPredicate).toHaveBeenCalledTimes(5);
  });

  // Boundary testing
  it('should handle array with null and undefined values', () => {
    const withNulls = [1, 2, null, undefined, null];
    const result = takeLastWhile(withNulls, x => x == null);
    expect(result).toEqual([null, undefined, null]);
  });

  it('should work with negative numbers', () => {
    const negatives = [-5, -3, -1, 1, 3, 5];
    const result = takeLastWhile(negatives, x => x > 0);
    expect(result).toEqual([1, 3, 5]);
  });

  it('should work with floating point numbers', () => {
    const floats = [1.1, 2.2, 3.3, 4.4, 5.5];
    const result = takeLastWhile(floats, x => x > 3.0);
    expect(result).toEqual([3.3, 4.4, 5.5]);
  });

  it('should handle arrays with only one type of element', () => {
    const sameValue = [5, 5, 5, 5, 5];
    const result = takeLastWhile(sameValue, x => x === 5);
    expect(result).toEqual([5, 5, 5, 5, 5]);
  });

  it('should handle arrays with zeros', () => {
    const withZeros = [1, 2, 0, 0, 0];
    const result = takeLastWhile(withZeros, x => x === 0);
    expect(result).toEqual([0, 0, 0]);
  });

  it('should work with very large numbers', () => {
    const bigNumbers = [1, 2, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    const result = takeLastWhile(bigNumbers, x => x === Number.MAX_SAFE_INTEGER);
    expect(result).toEqual([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);
  });

  it('should work with infinity values', () => {
    const withInfinity = [1, 2, Infinity, Infinity];
    const result = takeLastWhile(withInfinity, x => x === Infinity);
    expect(result).toEqual([Infinity, Infinity]);
  });

  it('should handle NaN values', () => {
    const withNaN = [1, 2, NaN, NaN];
    const result = takeLastWhile(withNaN, x => Number.isNaN(x));
    expect(result).toEqual([NaN, NaN]);
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => takeLastWhile('not array' as any, () => true)).toThrow(ValidationError);
    expect(() => takeLastWhile(null as any, () => true)).toThrow(ValidationError);
    expect(() => takeLastWhile(undefined as any, () => true)).toThrow(ValidationError);
    expect(() => takeLastWhile(42 as any, () => true)).toThrow(ValidationError);
    expect(() => takeLastWhile({} as any, () => true)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function predicate', () => {
    expect(() => takeLastWhile([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => takeLastWhile([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => takeLastWhile([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => takeLastWhile([1, 2, 3], 42 as any)).toThrow(ValidationError);
    expect(() => takeLastWhile([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 100000 }, (_, i) => i);
    
    const start = performance.now();
    const result = takeLastWhile(largeArray, x => x > 50000); // Take about half
    const end = performance.now();
    
    expect(result).toHaveLength(49999); // 50001 to 99999 inclusive
    expect(result[0]).toBe(50001);
    expect(result[result.length - 1]).toBe(99999);
    expect(end - start).toBeLessThan(50); // Should complete quickly
  });

  it('should be efficient when taking all elements', () => {
    const array = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const result = takeLastWhile(array, () => true);
    const end = performance.now();
    
    expect(result).toEqual(array);
    expect(result).toHaveLength(10000);
    expect(end - start).toBeLessThan(20);
  });

  it('should be efficient when taking no elements', () => {
    const array = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const result = takeLastWhile(array, () => false);
    const end = performance.now();
    
    expect(result).toEqual([]);
    expect(end - start).toBeLessThan(10);
  });

  it('should be efficient with early termination', () => {
    const array = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const result = takeLastWhile(array, x => x > 9990); // Only last few elements
    const end = performance.now();
    
    expect(result).toEqual([9991, 9992, 9993, 9994, 9995, 9996, 9997, 9998, 9999]);
    expect(end - start).toBeLessThan(10);
  });

  // Complex scenarios
  it('should work with nested arrays', () => {
    const nested = [[1], [2, 3], [4, 5, 6], [7], [8, 9]];
    const result = takeLastWhile(nested, arr => arr.length <= 2);
    expect(result).toEqual([[7], [8, 9]]);
  });

  it('should work with date objects', () => {
    const dates = [
      new Date('2023-01-01'),
      new Date('2023-06-15'),
      new Date('2023-12-31'),
      new Date('2024-03-15'),
      new Date('2024-06-01')
    ];
    const result = takeLastWhile(dates, date => date.getFullYear() === 2024);
    expect(result).toHaveLength(2);
    expect(result[0]!.getFullYear()).toBe(2024);
    expect(result[1]!.getFullYear()).toBe(2024);
  });

  it('should maintain reference equality for taken elements', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const objects = [obj1, obj2, obj3];
    
    const result = takeLastWhile(objects, obj => obj.id > 1);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(obj2); // Same reference
    expect(result[1]).toBe(obj3); // Same reference
  });

  it('should work with functions as array elements', () => {
    const fn1 = () => 1;
    const fn2 = () => 2;
    const fn3 = () => 3;
    const functions = [fn1, fn2, fn3];
    
    const result = takeLastWhile(functions, fn => fn() > 1);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(fn2);
    expect(result[1]).toBe(fn3);
  });

  it('should handle complex object comparisons', () => {
    const people = [
      { name: 'Alice', age: 25, city: 'NYC' },
      { name: 'Bob', age: 30, city: 'LA' },
      { name: 'Charlie', age: 35, city: 'NYC' },
      { name: 'Dave', age: 40, city: 'NYC' }
    ];
    
    const result = takeLastWhile(people, person => person.city === 'NYC');
    
    expect(result).toEqual([
      { name: 'Charlie', age: 35, city: 'NYC' },
      { name: 'Dave', age: 40, city: 'NYC' }
    ]);
  });

  it('should work with index-based conditions', () => {
    const numbers = [10, 20, 30, 40, 50];
    const result = takeLastWhile(numbers, (_value, index) => index >= 2);
    
    expect(result).toEqual([30, 40, 50]);
  });

  it('should work with array-based conditions', () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = takeLastWhile(numbers, (value, _index, array) => 
      value > array.length / 2
    );
    
    expect(result).toEqual([3, 4, 5]);
  });

  it('should handle sparse arrays', () => {
    const sparse = [1, , 3, , 5]; // Array with holes
    const result = takeLastWhile(sparse, x => x === undefined || x > 2);
    
    expect(result).toEqual([undefined, 3, undefined, 5]); // Takes from end while condition is met
  });

  it('should work with recursive conditions', () => {
    interface TreeNode {
      value: number;
      children?: TreeNode[];
    }
    
    const nodes: TreeNode[] = [
      { value: 1, children: [] },
      { value: 2, children: [{ value: 3 }] },
      { value: 4, children: [{ value: 5 }, { value: 6 }] },
      { value: 7, children: [] }
    ];
    
    const result = takeLastWhile(nodes, node => !node.children || node.children.length === 0);
    
    expect(result).toEqual([{ value: 7, children: [] }]);
  });

  it('should preserve original array structure', () => {
    const original = [1, 2, 3, 4, 5];
    const result = takeLastWhile(original, x => x > 3);
    
    expect(original).toEqual([1, 2, 3, 4, 5]); // Original unchanged
    expect(result).toEqual([4, 5]);
    
    // Modifying result should not affect original
    result[0] = 999;
    expect(original[3]).toBe(4);
  });
});