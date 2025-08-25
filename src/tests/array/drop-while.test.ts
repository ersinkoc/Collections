import { dropWhile } from '../../core/array/drop-while';
import { ValidationError } from '../../utils/errors';

describe('dropWhile', () => {
  // Normal cases
  it('should drop elements from beginning while predicate is true', () => {
    const result = dropWhile([1, 2, 3, 4, 5], x => x < 3);
    expect(result).toEqual([3, 4, 5]);
  });

  it('should drop elements from beginning based on condition', () => {
    const result = dropWhile([1, 2, 3, 2, 1], x => x < 3);
    expect(result).toEqual([3, 2, 1]);
  });

  it('should work with string arrays', () => {
    const words = ['apple', 'apricot', 'banana', 'cherry'];
    const result = dropWhile(words, word => word.startsWith('a'));
    expect(result).toEqual(['banana', 'cherry']);
  });

  it('should work with object arrays', () => {
    const items = [
      { id: 1, active: false },
      { id: 2, active: false },
      { id: 3, active: true },
      { id: 4, active: false }
    ];
    const result = dropWhile(items, item => !item.active);
    expect(result).toEqual([
      { id: 3, active: true },
      { id: 4, active: false }
    ]);
  });

  // Edge cases
  it('should handle empty array', () => {
    const result = dropWhile([], () => true);
    expect(result).toEqual([]);
  });

  it('should handle single element array - drop', () => {
    const result = dropWhile([1], x => x < 3);
    expect(result).toEqual([]);
  });

  it('should handle single element array - keep', () => {
    const result = dropWhile([5], x => x < 3);
    expect(result).toEqual([5]);
  });

  it('should return empty array when all elements match predicate', () => {
    const result = dropWhile([1, 2, 3, 4, 5], () => true);
    expect(result).toEqual([]);
  });

  it('should return full array when no elements match predicate', () => {
    const result = dropWhile([1, 2, 3, 4, 5], () => false);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return original array when first element fails predicate', () => {
    const result = dropWhile([5, 1, 2, 3, 4], x => x < 5);
    expect(result).toEqual([5, 1, 2, 3, 4]);
  });

  it('should handle complex predicate conditions', () => {
    const numbers = [2, 4, 6, 8, 1, 3, 5, 7];
    const result = dropWhile(numbers, (x, index) => x % 2 === 0 && index < 5);
    expect(result).toEqual([1, 3, 5, 7]);
  });

  it('should work with mixed data types', () => {
    const mixed = [null, undefined, 0, '', false, 1, 'hello'];
    const result = dropWhile(mixed, x => !x); // Drop falsy values
    expect(result).toEqual([1, 'hello']);
  });

  it('should handle arrays with duplicate values', () => {
    const duplicates = [1, 1, 1, 2, 3, 3];
    const result = dropWhile(duplicates, x => x === 1);
    expect(result).toEqual([2, 3, 3]);
  });

  it('should provide correct parameters to predicate function', () => {
    const items = ['a', 'b', 'c', 'd'];
    const mockPredicate = jest.fn((_value, index, _array) => index < 2);
    
    dropWhile(items, mockPredicate);
    
    // Should be called from beginning until predicate fails
    expect(mockPredicate).toHaveBeenNthCalledWith(1, 'a', 0, items);
    expect(mockPredicate).toHaveBeenNthCalledWith(2, 'b', 1, items);
    expect(mockPredicate).toHaveBeenNthCalledWith(3, 'c', 2, items);
    expect(mockPredicate).not.toHaveBeenCalledWith('d', 3, items);
  });

  it('should stop dropping when predicate returns false', () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const mockPredicate = jest.fn(x => x < 4);
    
    const result = dropWhile(numbers, mockPredicate);
    
    expect(result).toEqual([4, 5, 6, 7, 8]);
    expect(mockPredicate).toHaveBeenCalledTimes(4); // 1, 2, 3, 4 - stops at 4
  });

  // Boundary testing
  it('should handle array with null and undefined values', () => {
    const withNulls = [null, undefined, null, 1, 2];
    const result = dropWhile(withNulls, x => x == null);
    expect(result).toEqual([1, 2]);
  });

  it('should work with negative numbers', () => {
    const negatives = [-5, -3, -1, 1, 3, 5];
    const result = dropWhile(negatives, x => x < 0);
    expect(result).toEqual([1, 3, 5]);
  });

  it('should work with boolean arrays', () => {
    const bools = [false, false, true, false, true];
    const result = dropWhile(bools, x => !x);
    expect(result).toEqual([true, false, true]);
  });

  it('should handle array with only one type of element', () => {
    const sameValue = [5, 5, 5, 5, 5];
    const result = dropWhile(sameValue, x => x === 5);
    expect(result).toEqual([]);
  });

  // Advanced scenarios
  it('should work with predicate using index parameter', () => {
    const numbers = [10, 20, 30, 40, 50];
    const result = dropWhile(numbers, (_value, index) => index < 3);
    expect(result).toEqual([40, 50]);
  });

  it('should work with predicate using array parameter', () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = dropWhile(numbers, (value, _index, array) => 
      value < array.length / 2
    );
    expect(result).toEqual([3, 4, 5]);
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => dropWhile('not array' as any, () => true)).toThrow(ValidationError);
    expect(() => dropWhile(null as any, () => true)).toThrow(ValidationError);
    expect(() => dropWhile(undefined as any, () => true)).toThrow(ValidationError);
    expect(() => dropWhile(42 as any, () => true)).toThrow(ValidationError);
    expect(() => dropWhile({} as any, () => true)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function predicate', () => {
    expect(() => dropWhile([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => dropWhile([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => dropWhile([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => dropWhile([1, 2, 3], 42 as any)).toThrow(ValidationError);
    expect(() => dropWhile([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const result = dropWhile(largeArray, x => x < 5000); // Drop first half
    const end = performance.now();
    
    expect(result).toHaveLength(5000); // 5000 to 9999 inclusive
    expect(result[0]).toBe(5000);
    expect(end - start).toBeLessThan(50); // Should complete quickly
  });

  it('should be efficient when dropping all elements', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    
    const start = performance.now();
    const result = dropWhile(array, () => true);
    const end = performance.now();
    
    expect(result).toEqual([]);
    expect(end - start).toBeLessThan(10);
  });

  it('should be efficient when dropping no elements', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    
    const start = performance.now();
    const result = dropWhile(array, () => false);
    const end = performance.now();
    
    expect(result).toEqual(array);
    expect(result).toHaveLength(1000);
    expect(end - start).toBeLessThan(10);
  });

  // Complex scenarios
  it('should work with nested arrays', () => {
    const nested = [[1], [2, 3], [4, 5, 6], [7], [8, 9]];
    const result = dropWhile(nested, arr => arr.length <= 2);
    expect(result).toEqual([[4, 5, 6], [7], [8, 9]]);
  });

  it('should work with date objects', () => {
    const dates = [
      new Date('2023-01-01'),
      new Date('2023-06-15'),
      new Date('2023-12-31'),
      new Date('2024-03-15'),
      new Date('2024-06-01')
    ];
    const result = dropWhile(dates, date => date.getFullYear() === 2023);
    expect(result).toHaveLength(2);
    expect(result[0]!.getFullYear()).toBe(2024);
  });

  it('should maintain reference equality for non-dropped elements', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const objects = [obj1, obj2, obj3];
    
    const result = dropWhile(objects, obj => obj.id < 2);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(obj2); // Same reference
    expect(result[1]).toBe(obj3); // Same reference
  });

  it('should handle arrays with function elements', () => {
    const fn1 = () => 1;
    const fn2 = () => 2;
    const fn3 = () => 3;
    const functions = [fn1, fn2, fn3];
    
    const result = dropWhile(functions, fn => fn() < 3);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(fn3);
    expect(result[0]!()).toBe(3);
  });

  it('should work with sparse arrays', () => {
    const sparse = [1, , 3, , 5]; // Array with holes
    const result = dropWhile(sparse, x => x === undefined || x < 3);
    
    expect(result).toHaveLength(3); // [3, undefined, 5]
    expect(result[0]).toBe(3);
    expect(result[2]).toBe(5);
  });
});