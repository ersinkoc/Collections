import { dropLastWhile } from '../../core/array/drop-last-while';
import { ValidationError } from '../../utils/errors';

describe('dropLastWhile', () => {
  // Normal cases
  it('should drop elements from end while predicate is true', () => {
    const result = dropLastWhile([1, 2, 3, 4, 5], x => x > 3);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should drop elements from end based on condition', () => {
    const result = dropLastWhile([1, 2, 3, 2, 1], x => x < 3);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should work with string arrays', () => {
    const words = ['apple', 'banana', 'cherry', 'cat'];
    const result = dropLastWhile(words, word => word.length > 4);
    // From end: 'cat'(3) -> 3 > 4 is false, so we stop dropping
    // Result: ['apple', 'banana', 'cherry', 'cat']
    expect(result).toEqual(['apple', 'banana', 'cherry', 'cat']);
  });

  it('should work with object arrays', () => {
    const items = [
      { id: 1, active: true },
      { id: 2, active: true },
      { id: 3, active: false },
      { id: 4, active: false }
    ];
    const result = dropLastWhile(items, item => !item.active);
    expect(result).toEqual([
      { id: 1, active: true },
      { id: 2, active: true }
    ]);
  });

  // Edge cases
  it('should handle empty array', () => {
    const result = dropLastWhile([], () => true);
    expect(result).toEqual([]);
  });

  it('should handle single element array - drop', () => {
    const result = dropLastWhile([5], x => x > 3);
    expect(result).toEqual([]);
  });

  it('should handle single element array - keep', () => {
    const result = dropLastWhile([1], x => x > 3);
    expect(result).toEqual([1]);
  });

  it('should return empty array when all elements match predicate', () => {
    const result = dropLastWhile([1, 2, 3, 4, 5], () => true);
    expect(result).toEqual([]);
  });

  it('should return full array when no elements match predicate', () => {
    const result = dropLastWhile([1, 2, 3, 4, 5], () => false);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return original array when first element from end fails predicate', () => {
    const result = dropLastWhile([1, 2, 3, 4, 5], x => x < 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle complex predicate conditions', () => {
    const numbers = [10, 8, 6, 4, 2, 1, 3, 5];
    const result = dropLastWhile(numbers, (x, index) => x % 2 === 1 || index > 5);
    expect(result).toEqual([10, 8, 6, 4, 2]);
  });

  it('should work with mixed data types', () => {
    const mixed = [1, 'hello', true, null, undefined, 0];
    const result = dropLastWhile(mixed, x => !x); // Drop falsy values
    expect(result).toEqual([1, 'hello', true]);
  });

  it('should handle arrays with duplicate values', () => {
    const duplicates = [1, 2, 2, 3, 3, 3];
    const result = dropLastWhile(duplicates, x => x === 3);
    expect(result).toEqual([1, 2, 2]);
  });

  it('should provide correct parameters to predicate function', () => {
    const items = ['a', 'b', 'c', 'd'];
    const mockPredicate = jest.fn((_value, index, _array) => index >= 2);
    
    dropLastWhile(items, mockPredicate);
    
    // Should be called from end to beginning until predicate fails
    expect(mockPredicate).toHaveBeenNthCalledWith(1, 'd', 3, items);
    expect(mockPredicate).toHaveBeenNthCalledWith(2, 'c', 2, items);
    expect(mockPredicate).toHaveBeenNthCalledWith(3, 'b', 1, items);
    expect(mockPredicate).not.toHaveBeenCalledWith('a', 0, items);
  });

  it('should stop dropping when predicate returns false', () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const mockPredicate = jest.fn(x => x > 5);
    
    const result = dropLastWhile(numbers, mockPredicate);
    
    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(mockPredicate).toHaveBeenCalledTimes(4); // 8, 7, 6, 5 - stops at 5
  });

  // Boundary testing
  it('should handle array with null and undefined values', () => {
    const withNulls = [1, 2, null, undefined, null];
    const result = dropLastWhile(withNulls, x => x == null);
    expect(result).toEqual([1, 2]);
  });

  it('should work with negative numbers', () => {
    const negatives = [-5, -3, -1, 1, 3, 5];
    const result = dropLastWhile(negatives, x => x > 0);
    expect(result).toEqual([-5, -3, -1]);
  });

  it('should work with boolean arrays', () => {
    const bools = [true, false, true, false, false];
    const result = dropLastWhile(bools, x => !x);
    expect(result).toEqual([true, false, true]);
  });

  it('should handle array with only one type of element', () => {
    const sameValue = [5, 5, 5, 5, 5];
    const result = dropLastWhile(sameValue, x => x === 5);
    expect(result).toEqual([]);
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => dropLastWhile('not array' as any, () => true)).toThrow(ValidationError);
    expect(() => dropLastWhile(null as any, () => true)).toThrow(ValidationError);
    expect(() => dropLastWhile(undefined as any, () => true)).toThrow(ValidationError);
    expect(() => dropLastWhile(42 as any, () => true)).toThrow(ValidationError);
    expect(() => dropLastWhile({} as any, () => true)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function predicate', () => {
    expect(() => dropLastWhile([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => dropLastWhile([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => dropLastWhile([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => dropLastWhile([1, 2, 3], 42 as any)).toThrow(ValidationError);
    expect(() => dropLastWhile([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const result = dropLastWhile(largeArray, x => x > 5000); // Drop about half
    const end = performance.now();
    
    expect(result).toHaveLength(5001); // 0 to 5000 inclusive
    expect(result[result.length - 1]).toBe(5000);
    expect(end - start).toBeLessThan(50); // Should complete quickly
  });

  it('should be efficient when dropping all elements', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    
    const start = performance.now();
    const result = dropLastWhile(array, () => true);
    const end = performance.now();
    
    expect(result).toEqual([]);
    expect(end - start).toBeLessThan(10);
  });

  it('should be efficient when dropping no elements', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    
    const start = performance.now();
    const result = dropLastWhile(array, () => false);
    const end = performance.now();
    
    expect(result).toEqual(array);
    expect(result).toHaveLength(1000);
    expect(end - start).toBeLessThan(10);
  });

  // Complex scenarios
  it('should work with nested arrays', () => {
    const nested = [[1], [2, 3], [4, 5, 6], [7], [8, 9]];
    const result = dropLastWhile(nested, arr => arr.length <= 2);
    expect(result).toEqual([[1], [2, 3], [4, 5, 6]]);
  });

  it('should work with date objects', () => {
    const dates = [
      new Date('2023-01-01'),
      new Date('2023-06-15'),
      new Date('2023-12-31'),
      new Date('2024-03-15'),
      new Date('2024-06-01')
    ];
    const result = dropLastWhile(dates, date => date.getFullYear() === 2024);
    expect(result).toHaveLength(3);
    expect(result[2]!.getFullYear()).toBe(2023);
  });

  it('should maintain reference equality for non-dropped elements', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const objects = [obj1, obj2, obj3];
    
    const result = dropLastWhile(objects, obj => obj.id > 1);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(obj1); // Same reference
  });
});